#import "CRPCameraViewController.h"

static CRPMultiRecorder *_lastMultiRecorder = nil;

static NSObject *_getSessionLock () {
	static NSObject *sessionLock = nil;
	static dispatch_once_t onceToken;
	dispatch_once (&onceToken, ^{
		sessionLock = [[NSObject alloc] init];
	});
	return sessionLock;
}

@interface CRPCameraViewController () <CRPMultiRecorderDelegate> {
	__weak id<CRPMultiRecorderDelegate> _delegate;

	CRPMultiRecorder *_multiRecorder;
	bool _keepLastSession;
	CGSize _outputResolution;
}

@end

@implementation CRPCameraViewController

- (void)setDelegate:(id<CRPMultiRecorderDelegate>)delegate {
	_delegate = delegate;
}

- (void)setKeepLastSession:(bool)keep {
	@synchronized (_getSessionLock ()) {
		_keepLastSession = keep;
	}
}

- (void)setOutputResolution:(CGSize)res {
	_outputResolution = res;
}

- (void)viewDidLoad {
	[super viewDidLoad];
	[self askForPermissions];
}

- (void)viewWillAppear:(BOOL)animated {
	[super viewWillAppear:animated];

	@synchronized (_getSessionLock ()) {
		if (_multiRecorder == nil) {
			_multiRecorder = [[CRPMultiRecorder alloc] initWithSession:(_keepLastSession ? _lastMultiRecorder : nil)];
			[_multiRecorder setDelegate:self];
			[_multiRecorder setOutputResolution:_outputResolution];

			AVCaptureVideoPreviewLayer *previewLayer = [_multiRecorder previewLayer];
			previewLayer.frame = self.view.bounds;
			[self.view.layer insertSublayer:previewLayer atIndex:0];
		}

		_lastMultiRecorder = _multiRecorder;
	}
	[_multiRecorder open];

	[[NSNotificationCenter defaultCenter] addObserver:self
											 selector:@selector (applicationDidBecomeActive:)
												 name:UIApplicationDidBecomeActiveNotification
											   object:nil];

	[[NSNotificationCenter defaultCenter] addObserver:self
											 selector:@selector (applicationWillResignActive:)
												 name:UIApplicationWillResignActiveNotification
											   object:nil];
}

- (void)viewWillDisappear:(BOOL)animated {
	[super viewWillDisappear:animated];
	[[NSNotificationCenter defaultCenter] removeObserver:self];
	[_multiRecorder close];
}

- (void)setRecording:(bool)r {
	if (r) {
		[_multiRecorder resume];
	} else {
		[_multiRecorder pause];
	}
}

- (bool)isRecording {
	return [_multiRecorder isRecording];
}

- (bool)removeLastTrack {
	return [_multiRecorder removeLastTrack];
}

- (CRPMultiRecorderInfo *)getInfo {
	@synchronized (_getSessionLock ()) {
		if (_multiRecorder == nil) {
			if (_lastMultiRecorder != nil && _keepLastSession) {
				return [_lastMultiRecorder getInfo];
			}
			return nil;
		}

		return [_multiRecorder getInfo];
	}
}

- (bool)joinAllTracksWithCallback:(void (^) (NSURL *))callback {
	return [_multiRecorder joinAllTracksWithCallback:callback];
}

#pragma mark - application events

- (void)applicationDidBecomeActive:(NSNotification *)notification {
	[_multiRecorder open];
}

- (void)applicationWillResignActive:(NSNotification *)notification {
	[_multiRecorder close];
}

#pragma mark - listeners

- (void)recorderStarted:(CRPMultiRecorder *)recorder {
	[_delegate recorderStarted:recorder];
}

- (void)recorderStopped:(CRPMultiRecorder *)recorder withResult:(NSURL *)result {
	[_delegate recorderStopped:recorder withResult:result];
}

- (void)recorder:(CRPMultiRecorder *)recorder trackLength:(Float64)trackLength totalLength:(Float64)totalLength {
	[_delegate recorder:recorder trackLength:trackLength totalLength:totalLength];
}

#pragma mark - misc

- (BOOL)shouldAutorotate {
	return NO;
}

- (void)askForPermissions {
	[AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted){
	}];
	[AVCaptureDevice requestAccessForMediaType:AVMediaTypeAudio completionHandler:^(BOOL granted){
	}];
}

@end
