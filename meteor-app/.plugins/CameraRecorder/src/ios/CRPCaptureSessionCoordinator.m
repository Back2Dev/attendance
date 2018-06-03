#import "CRPCaptureSessionCoordinator.h"

#import "CRPAssetWriterWrapper.h"
#import <MobileCoreServices/MobileCoreServices.h>

typedef NS_ENUM (NSInteger, RecordingState) {
	RecordingStateStopped = 0,
	RecordingStatePreparing,
	RecordingStateRecording
};

@interface CRPCaptureSessionCoordinator () <AVCaptureVideoDataOutputSampleBufferDelegate, AVCaptureAudioDataOutputSampleBufferDelegate, CRPAssetWriterWrapperDelegate> {
	__weak id<CRPCaptureSessionCoordinatorDelegate> _delegate;

	AVCaptureSession *_captureSession;
	AVCaptureDevice *_cameraDevice;
	dispatch_queue_t _delegateCallbackQueue;

	RecordingState _recordingState;

	dispatch_queue_t _sessionQueue;
	AVCaptureVideoPreviewLayer *_previewLayer;

	dispatch_queue_t _videoDataOutputQueue;
	dispatch_queue_t _audioDataOutputQueue;

	AVCaptureVideoDataOutput *_videoDataOutput;
	AVCaptureAudioDataOutput *_audioDataOutput;

	AVCaptureConnection *_audioConnection;
	AVCaptureConnection *_videoConnection;

	AVAssetWriter *_assetWriter;

	NSURL *_recordingURL;
}

@property (nonatomic, retain) __attribute__ ((NSObject)) CMFormatDescriptionRef outputVideoFormatDescription;
@property (nonatomic, retain) __attribute__ ((NSObject)) CMFormatDescriptionRef outputAudioFormatDescription;
@property (nonatomic, retain) CRPAssetWriterWrapper *assetWriterWrapper;

@end

@implementation CRPCaptureSessionCoordinator

- (instancetype)init {
	self = [super init];
	if (self) {
		@synchronized (self) {
			_sessionQueue = dispatch_queue_create ("com.curiyoapp.camerarecorderplugin.CameraSession", DISPATCH_QUEUE_SERIAL);
			_captureSession = [self setupCaptureSession];

			_recordingState = RecordingStateStopped;
			_videoDataOutputQueue = dispatch_queue_create ("com.curiyoapp.camerarecorderplugin.VideoData", DISPATCH_QUEUE_SERIAL);
			dispatch_set_target_queue (_videoDataOutputQueue, dispatch_get_global_queue (DISPATCH_QUEUE_PRIORITY_HIGH, 0));
			_audioDataOutputQueue = dispatch_queue_create ("com.curiyoapp.camerarecorderplugin.AudioData", DISPATCH_QUEUE_SERIAL);
			[self addDataOutputsToCaptureSession:_captureSession];
		}
	}
	return self;
}

- (void)setDelegate:(id<CRPCaptureSessionCoordinatorDelegate>)delegate callbackQueue:(dispatch_queue_t)delegateCallbackQueue {
	if (delegate && (delegateCallbackQueue == NULL)) {
		@throw [NSException exceptionWithName:NSInvalidArgumentException reason:@"delegateCallbackQueue cannot be null" userInfo:nil];
	}
	@synchronized (self) {
		_delegate = delegate;
		if (delegateCallbackQueue != _delegateCallbackQueue) {
			_delegateCallbackQueue = delegateCallbackQueue;
		}
	}
}

// SESSION

- (AVCaptureVideoPreviewLayer *)previewLayer {
	if (!_previewLayer && _captureSession) {
		_previewLayer = [AVCaptureVideoPreviewLayer layerWithSession:_captureSession];
		_previewLayer.videoGravity = AVLayerVideoGravityResizeAspectFill;
	}
	return _previewLayer;
}

- (BOOL)addOutput:(AVCaptureOutput *)output toCaptureSession:(AVCaptureSession *)captureSession {
	if ([captureSession canAddOutput:output]) {
		[captureSession addOutput:output];
		return YES;
	} else {
		NSLog (@"Failed to add output: %@", [output description]);
	}
	return NO;
}

- (void)startRunning {
	dispatch_sync (_sessionQueue, ^{
		[_captureSession startRunning];
	});
}

- (void)stopRunning {
	dispatch_sync (_sessionQueue, ^{
		[self stopRecording];
		[_captureSession stopRunning];
	});
}

#pragma mark - setup (private)

- (AVCaptureSession *)setupCaptureSession {
	AVCaptureSession *captureSession = [AVCaptureSession new];

	if (![self addDefaultCameraInputToCaptureSession:captureSession]) {
		NSLog (@"Failed to add camera input to capture session");
	}
	if (![self addDefaultMicInputToCaptureSession:captureSession]) {
		NSLog (@"Failed to add mic input to capture session");
	}

	return captureSession;
}

- (BOOL)addInput:(AVCaptureDeviceInput *)input toCaptureSession:(AVCaptureSession *)captureSession {
	if ([captureSession canAddInput:input]) {
		[captureSession addInput:input];
		return YES;
	} else {
		NSLog (@"Failed to add input: %@", [input description]);
	}
	return NO;
}

- (BOOL)addDefaultCameraInputToCaptureSession:(AVCaptureSession *)captureSession {
	NSError *error;

	AVCaptureDevice *cameraDevice;
	NSArray *devices = [AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo];
	for (AVCaptureDevice *device in devices) {
		if (device.position == AVCaptureDevicePositionFront) {
			cameraDevice = device;
			break;
		}
	}

	if (!cameraDevice) {
		// no front camera, add default
		cameraDevice = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
	}

	AVCaptureDeviceInput *cameraDeviceInput = [[AVCaptureDeviceInput alloc] initWithDevice:cameraDevice error:&error];

	if (error) {
		NSLog (@"Error while configuring camera input: %@", [error localizedDescription]);
		return NO;
	} else {
		BOOL success = [self addInput:cameraDeviceInput toCaptureSession:captureSession];
		_cameraDevice = cameraDeviceInput.device;
		return success;
	}
}

- (BOOL)addDefaultMicInputToCaptureSession:(AVCaptureSession *)captureSession {
	NSError *error;
	AVCaptureDeviceInput *micDeviceInput = [[AVCaptureDeviceInput alloc] initWithDevice:[AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeAudio] error:&error];
	if (error) {
		NSLog (@"Error while configuring mic input: %@", [error localizedDescription]);
		return NO;
	} else {
		BOOL success = [self addInput:micDeviceInput toCaptureSession:captureSession];
		return success;
	}
}

// RECORDING

#pragma mark - Recording

- (void)startRecordingWithMaxDurationInSeconds:(Float64)maxDur atPath:(NSString *)path outputResolution:(CGSize)outputResolution {
	@synchronized (self) {
		if (_recordingState != RecordingStateStopped) {
			NSLog (@"Already recording");
			return;
		}

		_recordingState = RecordingStatePreparing;
		dispatch_async (_delegateCallbackQueue, ^{
			@autoreleasepool {
				[_delegate coordinatorDidBeginRecording:self];
			}
		});

		_recordingURL = [NSURL fileURLWithPath:path];

		self.assetWriterWrapper = [[CRPAssetWriterWrapper alloc] initWithURL:_recordingURL maxDurationInSeconds:maxDur];
		if (self.outputAudioFormatDescription != nil) {
			[_assetWriterWrapper addAudioTrackWithSourceFormatDescription:self.outputAudioFormatDescription settings:[_audioDataOutput recommendedAudioSettingsForAssetWriterWithOutputFileType:AVFileTypeMPEG4]];
		}
		[_assetWriterWrapper addVideoTrackWithSourceFormatDescription:self.outputVideoFormatDescription outputResolution:outputResolution];

		dispatch_queue_t callbackQueue = dispatch_queue_create ("com.curiyoapp.camerarecorderplugin.WriterCallback", DISPATCH_QUEUE_SERIAL);
		[_assetWriterWrapper setDelegate:self callbackQueue:callbackQueue];
		[_assetWriterWrapper prepareToRecord];
	}
}

- (void)stopRecording {
	@synchronized (self) {
		if (_recordingState == RecordingStateStopped) {
			return;
		}
		[self.assetWriterWrapper finishRecording];
	}
}

#pragma mark - Private methods

- (void)addDataOutputsToCaptureSession:(AVCaptureSession *)captureSession {
	_videoDataOutput = [AVCaptureVideoDataOutput new];
	_videoDataOutput.videoSettings = nil;
	_videoDataOutput.alwaysDiscardsLateVideoFrames = NO;
	[_videoDataOutput setSampleBufferDelegate:self queue:_videoDataOutputQueue];

	_audioDataOutput = [AVCaptureAudioDataOutput new];
	[_audioDataOutput setSampleBufferDelegate:self queue:_audioDataOutputQueue];

	[self addOutput:_videoDataOutput toCaptureSession:_captureSession];
	_videoConnection = [_videoDataOutput connectionWithMediaType:AVMediaTypeVideo];
	_videoConnection.videoOrientation = AVCaptureVideoOrientationPortrait;

	[self addOutput:_audioDataOutput toCaptureSession:_captureSession];
	_audioConnection = [_audioDataOutput connectionWithMediaType:AVMediaTypeAudio];
}

#pragma mark - samples delegate methods

- (void)captureOutput:(AVCaptureOutput *)captureOutput didOutputSampleBuffer:(CMSampleBufferRef)sampleBuffer fromConnection:(AVCaptureConnection *)connection {
	CMFormatDescriptionRef formatDescription = CMSampleBufferGetFormatDescription (sampleBuffer);

	if (connection == _videoConnection) {
		if (self.outputVideoFormatDescription == nil) {
			self.outputVideoFormatDescription = formatDescription;
		} else {
			self.outputVideoFormatDescription = formatDescription;
			@synchronized (self) {
				if (_recordingState == RecordingStateRecording) {
					[_assetWriterWrapper appendSampleBuffer:sampleBuffer ofMediaType:AVMediaTypeVideo];
				}
			}
		}
	} else if (connection == _audioConnection) {
		self.outputAudioFormatDescription = formatDescription;
		@synchronized (self) {
			if (_recordingState == RecordingStateRecording) {
				[_assetWriterWrapper appendSampleBuffer:sampleBuffer ofMediaType:AVMediaTypeAudio];
			}
		}
	}
}

#pragma mark - asset writer methods

- (void)writerWrapperDidFinishPreparing:(CRPAssetWriterWrapper *)coordinator {
	@synchronized (self) {
		if (_recordingState != RecordingStatePreparing) {
			NSLog (@"Expected RecordingStatePreparing, preparation callback ignored.");
			return;
		}
		_recordingState = RecordingStateRecording;
	}
}

- (void)writerWrapper:(CRPAssetWriterWrapper *)recorder didFailWithError:(NSError *)error {
	@synchronized (self) {
		if (_recordingState == RecordingStateStopped) {
			NSLog (@"Expected not RecordingStateStopped, error callback ignored.");
			return;
		}

		self.assetWriterWrapper = nil;

		_recordingState = RecordingStateStopped;

		NSURL *url = _recordingURL;
		dispatch_async (_delegateCallbackQueue, ^{
			@autoreleasepool {
				[_delegate coordinator:self didFinishRecordingToOutputFileURL:url error:error];
			}
		});
	}
}

- (void)writerWrapperDidFinishRecording:(CRPAssetWriterWrapper *)coordinator {
	@synchronized (self) {
		if (_recordingState == RecordingStateStopped) {
			NSLog (@"Expected not RecordingStateStopped, finalization callback ignored.");
			return;
		}

		_recordingState = RecordingStateStopped;
		self.assetWriterWrapper = nil;

		NSURL *url = _recordingURL;
		dispatch_async (_delegateCallbackQueue, ^{
			@autoreleasepool {
				[_delegate coordinator:self didFinishRecordingToOutputFileURL:url error:nil];
			}
		});
	}
}

- (void)writerWrapper:(CRPAssetWriterWrapper *)coordinator reachedTimestamp:(Float64)time {
	@synchronized (self) {
		if (_recordingState != RecordingStateRecording || _assetWriterWrapper != coordinator) {
			return;
		}

		dispatch_async (_delegateCallbackQueue, ^{
			@autoreleasepool {
				[_delegate coordinator:self reachedTimestamp:time];
			}
		});
	}
}

@end