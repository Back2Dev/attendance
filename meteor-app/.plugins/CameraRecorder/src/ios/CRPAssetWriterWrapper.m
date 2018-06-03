#import "CRPAssetWriterWrapper.h"

static const int CannotSetupInputErrorCode = 1;
static const int CancelledErrorCode = 2;

typedef NS_ENUM (NSInteger, WriterState) {
	WriterStateIdle = 0,
	WriterStatePreparingToRecord,
	WriterStateRecording,
	WriterStateFinishingRecordingReceiveLastFrames,
	WriterStateFinishingRecording,
	WriterStateFinished,
	WriterStateFailed
};

@interface CRPAssetWriterWrapper () {
	__weak id<CRPAssetWriterWrapperDelegate> _delegate;

	Float64 _maxDurationSeconds;
	Float64 _lastDurationReported;
	bool _haveStartedSession;
	CMTime _videoStartTime;
	CMTime _lastVideoTime;

	bool _preparationCancelled;

	CGSize _outputResolution;

	WriterState _state;

	dispatch_queue_t _writingQueue;
	dispatch_queue_t _delegateCallbackQueue;

	NSURL *_URL;

	AVAssetWriter *_assetWriter;

	CMFormatDescriptionRef _audioTrackSourceFormatDescription;
	NSDictionary *_audioTrackSettings;
	AVAssetWriterInput *_audioInput;

	CMFormatDescriptionRef _videoTrackSourceFormatDescription;
	AVAssetWriterInput *_videoInput;
}

@end

@implementation CRPAssetWriterWrapper

- (instancetype)initWithURL:(NSURL *)URL maxDurationInSeconds:(Float64)maxDur {
	if (!URL) {
		return nil;
	}

	self = [super init];
	if (self) {
		@synchronized (self) {
			_maxDurationSeconds = maxDur;
			_haveStartedSession = false;
			_preparationCancelled = false;
			_lastDurationReported = 0.0;

			_URL = URL;

			_writingQueue = dispatch_queue_create ("com.curiyoapp.camerarecorderplugin.CRPAssetWriterWrapper.Writing", DISPATCH_QUEUE_SERIAL);
		}
	}
	return self;
}

- (void)addVideoTrackWithSourceFormatDescription:(CMFormatDescriptionRef)formatDescription outputResolution:(CGSize)outputResolution {
	if (formatDescription == NULL) {
		@throw [NSException exceptionWithName:NSInvalidArgumentException reason:@"NULL format description" userInfo:nil];
		return;
	}
	@synchronized (self) {
		if (_state != WriterStateIdle) {
			@throw [NSException exceptionWithName:NSInternalInconsistencyException reason:@"Cannot add tracks while not idle" userInfo:nil];
			return;
		}

		if (_videoTrackSourceFormatDescription) {
			@throw [NSException exceptionWithName:NSInternalInconsistencyException reason:@"Cannot add more than one video track" userInfo:nil];
			return;
		}

		_videoTrackSourceFormatDescription = (CMFormatDescriptionRef)CFRetain (formatDescription);
		_outputResolution = outputResolution;
	}
}

- (void)addAudioTrackWithSourceFormatDescription:(CMFormatDescriptionRef)formatDescription settings:(NSDictionary *)audioSettings {
	if (formatDescription == NULL) {
		@throw [NSException exceptionWithName:NSInvalidArgumentException reason:@"NULL format description" userInfo:nil];
		return;
	}

	@synchronized (self) {
		if (_state != WriterStateIdle) {
			@throw [NSException exceptionWithName:NSInternalInconsistencyException reason:@"Cannot add tracks while not idle" userInfo:nil];
			return;
		}

		if (_audioTrackSourceFormatDescription) {
			@throw [NSException exceptionWithName:NSInternalInconsistencyException reason:@"Cannot add more than one audio track" userInfo:nil];
			return;
		}

		_audioTrackSourceFormatDescription = (CMFormatDescriptionRef)CFRetain (formatDescription);
		_audioTrackSettings = [audioSettings copy];
	}
}

- (void)setDelegate:(id<CRPAssetWriterWrapperDelegate>)delegate callbackQueue:(dispatch_queue_t)delegateCallbackQueue {
	if (delegate && (delegateCallbackQueue == NULL)) {
		@throw [NSException exceptionWithName:NSInvalidArgumentException reason:@"delegateCallbackQueue cannot be NULL" userInfo:nil];
	}

	@synchronized (self) {
		_delegate = delegate;
		if (delegateCallbackQueue != _delegateCallbackQueue) {
			_delegateCallbackQueue = delegateCallbackQueue;
		}
	}
}

- (void)prepareToRecord {
	@synchronized (self) {
		if (_state != WriterStateIdle) {
			NSLog (@"Already prepared - ignored");
			return;
		}
		[self unsync_transitionToState:WriterStatePreparingToRecord error:nil];
	}

	dispatch_async (_writingQueue, ^{
		@autoreleasepool {
			NSError *error = nil;

			[[NSFileManager defaultManager] removeItemAtURL:_URL error:NULL];
			_assetWriter = [[AVAssetWriter alloc] initWithURL:_URL fileType:AVFileTypeMPEG4 error:&error];

			if (!error && _videoTrackSourceFormatDescription) {
				[self setupAssetWriterVideoInputWithSourceFormatDescription:_videoTrackSourceFormatDescription
																	  error:&error];
			}
			if (!error && _audioTrackSourceFormatDescription) {
				[self setupAssetWriterAudioInputWithSourceFormatDescription:_audioTrackSourceFormatDescription
																   settings:_audioTrackSettings
																	  error:&error];
			}
			if (!error) {
				BOOL success = [_assetWriter startWriting];
				if (!success) {
					error = _assetWriter.error;
				}
			}

			@synchronized (self) {
				if (error) {
					[self unsync_transitionToState:WriterStateFailed error:error];
				} else {
					[self unsync_transitionToState:WriterStateRecording error:nil];
					if (_preparationCancelled) {
						[self finishRecording];
					}
				}
			}
		}
	});
}

- (void)finishRecording {
	@synchronized (self) {
		bool shouldFinishRecording = false;
		switch (_state) {
		case WriterStateIdle:
		case WriterStateFinishingRecordingReceiveLastFrames:
		case WriterStateFinishingRecording:
		case WriterStateFinished:
		case WriterStateFailed:
			NSLog (@"Not recording, nothing to do");
			break;

		case WriterStatePreparingToRecord:
			_preparationCancelled = true;
			break;

		case WriterStateRecording:
			shouldFinishRecording = true;
			break;
		}

		if (shouldFinishRecording) {
			[self unsync_transitionToState:WriterStateFinishingRecordingReceiveLastFrames error:nil];
		} else {
			return;
		}
	}

	dispatch_async (_writingQueue, ^{
		@autoreleasepool {
			@synchronized (self) {
				if (_state != WriterStateFinishingRecordingReceiveLastFrames) {
					return;
				}

				[self unsync_transitionToState:WriterStateFinishingRecording error:nil];

				if (_haveStartedSession) {
					Float64 lastTimeInSeconds = CMTimeGetSeconds (CMTimeSubtract (_lastVideoTime, _videoStartTime));
					CMTime maxEndTime = CMTimeMakeWithSeconds (CMTimeGetSeconds (_videoStartTime) + _maxDurationSeconds, _videoStartTime.timescale);

					if (lastTimeInSeconds < _maxDurationSeconds) {
						[_assetWriter endSessionAtSourceTime:_lastVideoTime];
					} else {
						[_assetWriter endSessionAtSourceTime:maxEndTime];
					}

					[_assetWriter finishWritingWithCompletionHandler:^{
						@synchronized (self) {
							NSError *error = _assetWriter.error;
							if (error) {
								[self unsync_transitionToState:WriterStateFailed error:error];
							} else {
								[self unsync_transitionToState:WriterStateFinished error:nil];
							}
						}
					}];
				} else {
					[_assetWriter cancelWriting];
					NSError *error = [NSError errorWithDomain:@"com.curiyoapp.camerarecorderplugin.Error"
														 code:CancelledErrorCode
													 userInfo:@{ NSLocalizedDescriptionKey: @"Video has no frames" }];

					[self unsync_transitionToState:WriterStateFailed error:error];
				}
			}
		}
	});
}

- (void)appendSampleBuffer:(CMSampleBufferRef)sampleBuffer ofMediaType:(NSString *)mediaType {
	if (sampleBuffer == NULL) {
		@throw [NSException exceptionWithName:NSInvalidArgumentException reason:@"NULL sample buffer" userInfo:nil];
		return;
	}

	@synchronized (self) {
		if (_state < WriterStateRecording) {
			NSLog (@"Not ready to record yet");
			return;
		}
	}

	CFRetain (sampleBuffer);
	dispatch_async (_writingQueue, ^{
		@autoreleasepool {
			bool signalStop = false;
			AVAssetWriterInput *input = nil;

			@synchronized (self) {
				// states that were in queue before finishing are written
				if (_state > WriterStateFinishingRecordingReceiveLastFrames) {
					CFRelease (sampleBuffer);
					return;
				}

				if (mediaType == AVMediaTypeVideo) {
					CMTime buftime = CMSampleBufferGetPresentationTimeStamp (sampleBuffer);

					if (_haveStartedSession) {
						Float64 lastTime = CMTimeGetSeconds (CMTimeSubtract (_lastVideoTime, _videoStartTime));
						Float64 time = CMTimeGetSeconds (CMTimeSubtract (buftime, _videoStartTime));

						if (time > lastTime) {
							_lastVideoTime = buftime;
						}

						if (time > _maxDurationSeconds) {
							signalStop = true;
						}

						Float64 durationToReport = MIN (time, _maxDurationSeconds);
						if (durationToReport > _lastDurationReported) {
							_lastDurationReported = durationToReport;

							id<CRPAssetWriterWrapperDelegate> delegate = _delegate;
							dispatch_async (_delegateCallbackQueue, ^{
								@autoreleasepool {
									[delegate writerWrapper:self reachedTimestamp:durationToReport];
								}
							});
						}
					} else {
						[_assetWriter startSessionAtSourceTime:buftime];
						_videoStartTime = buftime;
						_lastVideoTime = buftime;
						_haveStartedSession = YES;
					}
				}

				input = (mediaType == AVMediaTypeVideo) ? _videoInput : _audioInput;
			}

			if (input.readyForMoreMediaData) {
				BOOL success = [input appendSampleBuffer:sampleBuffer];
				if (!success) {
					@synchronized (self) {
						NSError *error = _assetWriter.error;
						[self unsync_transitionToState:WriterStateFailed error:error];
					}
				}
			} else {
				NSLog (@"%@ input not ready for media data - ignore buffer", mediaType);
			}
			CFRelease (sampleBuffer);

			if (signalStop) {
				[self finishRecording];
			}
		}
	});
}

#pragma mark - Private methods

- (BOOL)setupAssetWriterAudioInputWithSourceFormatDescription:(CMFormatDescriptionRef)audioFormatDescription settings:(NSDictionary *)audioSettings error:(NSError **)errorOut {
	if (!audioSettings) {
		audioSettings = @{ AVFormatIDKey: @(kAudioFormatMPEG4AAC) };
	}

	if ([_assetWriter canApplyOutputSettings:audioSettings forMediaType:AVMediaTypeAudio]) {
		_audioInput = [[AVAssetWriterInput alloc] initWithMediaType:AVMediaTypeAudio outputSettings:audioSettings sourceFormatHint:audioFormatDescription];
		_audioInput.expectsMediaDataInRealTime = YES;

		if ([_assetWriter canAddInput:_audioInput]) {
			[_assetWriter addInput:_audioInput];
		} else {
			if (errorOut) {
				*errorOut = [self failedToSetupInputError];
			}
			return NO;
		}
	} else {
		if (errorOut) {
			*errorOut = [self failedToSetupInputError];
		}
		return NO;
	}

	return YES;
}

- (BOOL)setupAssetWriterVideoInputWithSourceFormatDescription:(CMFormatDescriptionRef)videoFormatDescription error:(NSError **)errorOut {
	NSDictionary *videoSettings = [self createVideoSettings];

	if ([_assetWriter canApplyOutputSettings:videoSettings forMediaType:AVMediaTypeVideo]) {
		_videoInput = [[AVAssetWriterInput alloc] initWithMediaType:AVMediaTypeVideo outputSettings:videoSettings sourceFormatHint:videoFormatDescription];
		_videoInput.expectsMediaDataInRealTime = YES;

		if ([_assetWriter canAddInput:_videoInput]) {
			[_assetWriter addInput:_videoInput];
		} else {
			if (errorOut) {
				*errorOut = [self failedToSetupInputError];
			}
			return NO;
		}
	} else {
		if (errorOut) {
			*errorOut = [self failedToSetupInputError];
		}
		return NO;
	}
	return YES;
}

- (NSDictionary *)createVideoSettings {
	int32_t width = (int32_t) (_outputResolution.width + 0.5);
	int32_t height = (int32_t) (_outputResolution.height + 0.5);

	int numPixels = width * height;
	int bitsPerSecond = numPixels * (30 * 0.25);

	NSDictionary *compressionProperties = @{ AVVideoAverageBitRateKey: @(bitsPerSecond),
											 AVVideoExpectedSourceFrameRateKey: @(30),
											 AVVideoMaxKeyFrameIntervalKey: @(30) };

	return @{ AVVideoCodecKey: AVVideoCodecH264,
			  AVVideoWidthKey: @(width),
			  AVVideoHeightKey: @(height),
			  AVVideoScalingModeKey: AVVideoScalingModeResizeAspectFill,
			  AVVideoCompressionPropertiesKey: compressionProperties };
}

- (void)unsync_transitionToState:(WriterState)newState error:(NSError *)error {
	bool shouldNotifyDelegate = false;

	if (newState != _state) {
		if ((newState == WriterStateFinished) || (newState == WriterStateFailed)) {
			shouldNotifyDelegate = true;

			dispatch_async (_writingQueue, ^{
				_assetWriter = nil;
				_videoInput = nil;
				_audioInput = nil;
				if (newState == WriterStateFailed) {
					[[NSFileManager defaultManager] removeItemAtURL:_URL error:nil];
				}
			});
		} else if (newState == WriterStateRecording) {
			shouldNotifyDelegate = true;
		}
		_state = newState;
	}

	if (shouldNotifyDelegate && _delegate) {
		dispatch_async (_delegateCallbackQueue, ^{

			@autoreleasepool {
				switch (newState) {
				case WriterStateRecording:
					[_delegate writerWrapperDidFinishPreparing:self];
					break;
				case WriterStateFinished:
					[_delegate writerWrapperDidFinishRecording:self];
					break;
				case WriterStateFailed:
					[_delegate writerWrapper:self didFailWithError:error];
					break;
				default:
					break;
				}
			}
		});
	}
}

- (NSError *)failedToSetupInputError {
	NSString *errorMsg = @"Recording cannot be started - failed to setup AssetWriter input";
	return [NSError errorWithDomain:@"com.curiyoapp.camerarecorderplugin.Error"
							   code:CannotSetupInputErrorCode
						   userInfo:@{ NSLocalizedDescriptionKey: errorMsg }];
}

@end
