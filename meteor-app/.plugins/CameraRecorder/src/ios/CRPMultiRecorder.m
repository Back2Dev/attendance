#import "CRPMultiRecorder.h"

#import "CRPCaptureSessionCoordinator.h"
#import <UIKit/UIKit.h>

@implementation CRPMultiRecorderInfo {
	NSArray *_trackLengths;
	NSString *_lastTrackPath;
	NSString *_fullTrackPath;
}

- (instancetype)initWithTrackLengths:(NSArray *)trackLengths
					   lastTrackPath:(NSString *)lastTrackPath
					   fullTrackPath:(NSString *)fullTrackPath {
	self = [super init];
	if (self) {
		_trackLengths = [NSArray arrayWithArray:trackLengths];
		_lastTrackPath = lastTrackPath;
		_fullTrackPath = fullTrackPath;
	}
	return self;
}

- (NSArray *)trackLengths {
	return _trackLengths;
}

- (NSString *)lastTrackPath {
	return _lastTrackPath;
}

- (NSString *)fullTrackPath {
	return _fullTrackPath;
}

@end

@interface CRPMultiRecorder () <CRPCaptureSessionCoordinatorDelegate> {
	__weak id<CRPMultiRecorderDelegate> _delegate;

	CRPCaptureSessionCoordinator *_captureSessionCoordinator;
	bool _recording, _isFullTrackValid;

	Float64 _lastTrackTime;

	NSString *_workingDirectoryPath;
	NSMutableArray *_trackLengths;

	bool _joining;

	CGSize _outputResolution;
}
@end

@implementation CRPMultiRecorder

- (instancetype)initWithSession:(CRPMultiRecorder *)previousRecorder {
	self = [super init];
	if (self) {
		@synchronized (self) {
			_workingDirectoryPath = [[CRPMultiRecorder documentsDirectory] stringByAppendingPathComponent:@"com.curiyoapp.camerarecorderplugin/"];

			_joining = false;
			_recording = false;
			_isFullTrackValid = false;

			_trackLengths = [NSMutableArray new];

			if (previousRecorder != nil) {
				CRPMultiRecorderInfo *info = [previousRecorder getInfo];

				[_trackLengths addObjectsFromArray:[info trackLengths]];
				_isFullTrackValid = [info fullTrackPath] != nil;
			}

			_captureSessionCoordinator = [CRPCaptureSessionCoordinator new];
			[_captureSessionCoordinator setDelegate:self callbackQueue:dispatch_get_main_queue ()];
		}
	}
	return self;
}

- (void)dealloc {
	[self close];
}

- (void)setDelegate:(id<CRPMultiRecorderDelegate>)delegate {
	@synchronized (self) {
		_delegate = delegate;
	}
}

- (AVCaptureVideoPreviewLayer *)previewLayer {
	@synchronized (self) {
		return [_captureSessionCoordinator previewLayer];
	}
}

- (void)open {
	@synchronized (self) {
		[_captureSessionCoordinator startRunning];
	}
}

- (void)close {
	@synchronized (self) {
		[_captureSessionCoordinator stopRunning];
	}
}

- (bool)resume {
	@synchronized (self) {
		@try {
			if (_joining) {
				NSLog (@"trying to resume joining muxer");
				return false;
			}

			if (_recording) {
				NSLog (@"trying to resume running muxer");
				return false;
			}

			if (![self canRecordMore]) {
				NSLog (@"trying to resume full muxer");
				return false;
			}

			_isFullTrackValid = false;

			if ([_trackLengths count] == 0) {
				[self clearWorkingDirectory];
			}

			NSString *path = [self getPath:_trackLengths.count];
			Float64 duration = [self getMaxDuration];

			[UIApplication sharedApplication].idleTimerDisabled = YES;
			[_captureSessionCoordinator startRecordingWithMaxDurationInSeconds:duration atPath:path outputResolution:_outputResolution];

			_recording = true;
			return true;
		}
		@catch (NSException *exception) {
			[UIApplication sharedApplication].idleTimerDisabled = NO;
			_recording = false;
			return false;
		}
	}
}

- (void)pause {
	@synchronized (self) {
		[_captureSessionCoordinator stopRecording];
	}
}

- (bool)isRecording {
	@synchronized (self) {
		return _recording;
	}
}

- (CRPMultiRecorderInfo *)getInfo {
	@synchronized (self) {
		return [[CRPMultiRecorderInfo alloc] initWithTrackLengths:_trackLengths
												   lastTrackPath:[self getLastPath]
												   fullTrackPath:_isFullTrackValid ? [self getFullFilePath] : nil];
	}
}

- (bool)removeLastTrack {
	@synchronized (self) {
		if (_joining) {
			NSLog (@"Trying to remove last track in joining muxer");
			return false;
		}

		if (_recording) {
			NSLog (@"Trying to remove last track in running muxer");
			return false;
		}

		if ([_trackLengths count] <= 0) {
			NSLog (@"Cannot remove track, because there are no tracks");
			return false;
		}

		int index = [_trackLengths count] - 1;
		[_trackLengths removeObjectAtIndex:index];
		_isFullTrackValid = false;

		return [[NSFileManager defaultManager] removeItemAtPath:[self getPath:index] error:nil];
	}
}

- (bool)joinAllTracksWithCallback:(void (^) (NSURL *))callback {
	@synchronized (self) {
		if (_joining) {
			NSLog (@"Trying to join tracks while already joining");
			return false;
		}

		if (_recording) {
			NSLog (@"Trying to join tracks while muxer is running");
			return false;
		}

		if (_trackLengths.count <= 0) {
			NSLog (@"Cannot join tracks, because there are no tracks");
			return false;
		}

		_isFullTrackValid = false;

		@try {
			NSString *path = [self getFullFilePath];
			[[NSFileManager defaultManager] removeItemAtPath:path error:nil];

			[self joinToURL:[NSURL fileURLWithPath:path] callback:callback];
			return true;
		}
		@catch (NSException *exception) {
			NSLog (@"Error: %@", [exception description]);
			return false;
		}
	}
}

- (void)setOutputResolution:(CGSize)res {
	@synchronized (self) {
		_outputResolution = res;
	}
}

#pragma mark - IDCaptureSessionCoordinatorDelegate methods

- (void)coordinatorDidBeginRecording:(CRPCaptureSessionCoordinator *)coordinator {
	@synchronized (self) {
		if (!_recording) {
			return;
		}

		_lastTrackTime = 0.0;
		[_delegate recorderStarted:self];
	}
}

- (void)coordinator:(CRPCaptureSessionCoordinator *)coordinator
didFinishRecordingToOutputFileURL:(NSURL *)outputFileURL
							error:(NSError *)error {
	// TODO change queue to background
	@synchronized (self) {
		if (!_recording) {
			return;
		}

		_recording = false;
		[UIApplication sharedApplication].idleTimerDisabled = NO;

		if (!error && [[NSFileManager defaultManager] fileExistsAtPath:[outputFileURL path]]) {
			AVAsset *videoAsset = (AVAsset *)[AVAsset assetWithURL:outputFileURL];
			AVAssetTrack *videoAssetTrack = [[videoAsset tracksWithMediaType:AVMediaTypeVideo] objectAtIndex:0];

			Float64 duration = CMTimeGetSeconds (videoAssetTrack.timeRange.duration);

			NSLog (@"Duration: %f", duration);

			videoAsset = nil;

			[_trackLengths addObject:[NSNumber numberWithDouble:((double)duration)]];
			Float64 totalTime = [self getTotalLength];

			[_delegate recorder:self trackLength:duration totalLength:totalTime];
			[_delegate recorderStopped:self withResult:outputFileURL];
		} else {
			[_delegate recorderStopped:self withResult:nil];
		}
	}
}

- (void)coordinator:(CRPCaptureSessionCoordinator *)coordinator reachedTimestamp:(Float64)time {
	@synchronized (self) {
		if (!_recording) {
			return;
		}

		if ((time - _lastTrackTime) < 0.03) {
			return; // limit to ~30 reports per second
		}
		_lastTrackTime = time;

		Float64 totalLength = time + [self getTotalLength];
		[_delegate recorder:self trackLength:time totalLength:totalLength];
	}
}

#pragma mark - utils

- (Float64)getMaxDuration {
	double left = 45.0 - [self getTotalLength];
	return left < 0.5 ? 0.0 : left;
}

- (Float64)getTotalLength {
	@synchronized (self) {
		double len = 0.0;
		for (NSNumber *d in _trackLengths) {
			len += [d doubleValue];
		}
		return (Float64)len;
	}
}

- (bool)canRecordMore {
	@synchronized (self) {
		return [self getMaxDuration] > 0.1;
	}
}

- (bool)clearWorkingDirectory {
	[[NSFileManager defaultManager] createDirectoryAtPath:_workingDirectoryPath
							  withIntermediateDirectories:YES
											   attributes:nil
													error:nil];
	return [self clearDirectory:_workingDirectoryPath];
}

- (bool)clearDirectory:(NSString *)directoryPath {
	NSFileManager *fm = [NSFileManager defaultManager];
	NSError *error = nil;
	for (NSString *file in [fm contentsOfDirectoryAtPath:directoryPath error:&error]) {
		NSString *filePath = [directoryPath stringByAppendingPathComponent:file];
		BOOL success = [fm removeItemAtPath:filePath error:&error];
		if ((!success) || error) {
			return false;
		}
	}
	return true;
}

+ (NSString *)documentsDirectory {
	NSArray *paths = NSSearchPathForDirectoriesInDomains (NSDocumentDirectory, NSUserDomainMask, YES);
	return paths.firstObject;
}

- (NSString *)getFullFilePath {
	@synchronized (self) {
		return [_workingDirectoryPath stringByAppendingPathComponent:@"file_full.mp4"];
	}
}

- (NSString *)getLastPath {
	@synchronized (self) {
		if (_trackLengths.count <= 0) {
			return nil;
		}

		return [self getPath:(_trackLengths.count - 1)];
	}
}

- (NSString *)getPath:(NSInteger)index {
	@synchronized (self) {
		NSString *indexStr = [[NSNumber numberWithInteger:index] stringValue];
		NSString *filename = [NSString stringWithFormat:@"%@%@%@", @"file_", indexStr, @".mp4"];
		return [_workingDirectoryPath stringByAppendingPathComponent:filename];
	}
}

- (void)joinToURL:(NSURL *)url callback:(void (^) (NSURL *))callback {
	@synchronized (self) {
		[self unsync_joinToURL:url callback:callback];
	}
}

- (void)unsync_joinToURL:(NSURL *)url callback:(void (^) (NSURL *))callback {
	AVMutableComposition *composition = [[AVMutableComposition alloc] init];

	AVMutableCompositionTrack *composedVideoTrack = [composition addMutableTrackWithMediaType:AVMediaTypeVideo preferredTrackID:kCMPersistentTrackID_Invalid];
	AVMutableCompositionTrack *composedAudioTrack = [composition addMutableTrackWithMediaType:AVMediaTypeAudio preferredTrackID:kCMPersistentTrackID_Invalid];

	NSMutableArray *assets = [NSMutableArray new];
	for (int i = 0; i < _trackLengths.count; ++i) {
		NSString *path = [self getPath:i];
		[assets addObject:[[AVURLAsset alloc] initWithURL:[NSURL fileURLWithPath:path] options:nil]];
	}

	for (AVURLAsset *asset in assets) {
		[composedVideoTrack insertTimeRange:CMTimeRangeMake (kCMTimeZero, asset.duration)
									ofTrack:[[asset tracksWithMediaType:AVMediaTypeVideo] objectAtIndex:0]
									 atTime:kCMTimeInvalid
									  error:nil];

		[composedAudioTrack insertTimeRange:CMTimeRangeMake (kCMTimeZero, asset.duration)
									ofTrack:[[asset tracksWithMediaType:AVMediaTypeAudio] objectAtIndex:0]
									 atTime:kCMTimeInvalid
									  error:nil];
	}

	AVAssetExportSession *exporter = [[AVAssetExportSession alloc] initWithAsset:composition presetName:AVAssetExportPresetPassthrough];
	exporter.outputURL = url;
	exporter.outputFileType = AVFileTypeMPEG4;

	_joining = true;
	[exporter exportAsynchronouslyWithCompletionHandler:^{
		@autoreleasepool {
			NSURL *result = nil;

			@synchronized (self) {
				_joining = false;

				if ([exporter status] == AVAssetExportSessionStatusCompleted) {
					result = url;
					_isFullTrackValid = true;
				}
			}

			if (callback) {
				callback (result);
			}
		}
	}];
}

@end
