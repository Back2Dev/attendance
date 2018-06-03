#import "CRPCameraRecorder.h"
#import "CRPCameraViewController.h"
#import "CRPUtils.h"

@interface CRPCameraRecorder () <CRPMultiRecorderDelegate> {
	CRPCameraViewController *_cameraViewController;

	NSString *_recordingStartedCallbackContext;
	NSString *_recordingTimestampCallbackContext;
	NSString *_recordingStoppedCallbackContext;

	bool _keepLastSession;
	bool _useAutoFocus;
	CGSize _outputResolution;
}
@end

@implementation CRPCameraRecorder

- (void)pluginInitialize {
	_keepLastSession = false;
	_useAutoFocus = true;
	_outputResolution = CGSizeMake (480, 480);
}

- (void)startCamera:(CDVInvokedUrlCommand *)command {

	if (command.arguments.count < 4) {
		NSLog (@"startCamera: invalid number of arguments");
		return;
	}

	if (_cameraViewController != nil) {
		NSLog (@"Camera already running");
		return;
	}

	_cameraViewController = [[CRPCameraViewController alloc] init];
	[_cameraViewController setKeepLastSession:_keepLastSession];
	[_cameraViewController setOutputResolution:_outputResolution];

	CGFloat scale = [UIScreen mainScreen].scale;

	CGFloat x = (CGFloat) ([command.arguments[0] floatValue] / scale) + self.webView.frame.origin.x;
	CGFloat y = (CGFloat) ([command.arguments[1] floatValue] / scale) + self.webView.frame.origin.y;
	CGFloat width = (CGFloat) ([command.arguments[2] floatValue] / scale);
	CGFloat height = (CGFloat) ([command.arguments[3] floatValue] / scale);

	_cameraViewController.view.frame = CGRectMake (x, y, width, height);
	_cameraViewController.delegate = self;

	[self.viewController addChildViewController:_cameraViewController];
	[self.viewController.view addSubview:_cameraViewController.view];

	CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)stopCamera:(CDVInvokedUrlCommand *)command {
	if (_cameraViewController == nil) {
		NSLog (@"Camera is not running, nothing to stop");
		return;
	}

	[_cameraViewController.view removeFromSuperview];
	[_cameraViewController removeFromParentViewController];
	_cameraViewController = nil;
}

- (void)setRecording:(CDVInvokedUrlCommand *)command {
	if (_cameraViewController == nil) {
		NSLog (@"Camera is not running, cannot record");
		return;
	}

	if ([command.arguments count] < 1) {
		NSLog (@"setRecording: invalid number of arguments");
		return;
	}

	bool rec = [command.arguments[0] boolValue];
	[_cameraViewController setRecording:rec];
}

- (void)isRecording:(CDVInvokedUrlCommand *)command {
	NSString *msg = nil;
	if (_cameraViewController != nil) {
		msg = [_cameraViewController isRecording] ? @"ok" : nil;
	}

	CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:msg];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)removeLastTrack:(CDVInvokedUrlCommand *)command {
	NSString *msg = nil;
	if (_cameraViewController != nil) {
		msg = [_cameraViewController removeLastTrack] ? @"ok" : nil;
	}

	CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:msg];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)joinAllTracks:(CDVInvokedUrlCommand *)command {
	CRPCameraViewController *retainedController = _cameraViewController;
	dispatch_async (dispatch_get_global_queue (DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void) {
		@autoreleasepool {
			[self background_joinAllTracks:command withViewController:retainedController];
		}
	});
}

- (void)background_joinAllTracks:(CDVInvokedUrlCommand *)command withViewController:(CRPCameraViewController *)retainedController {
	bool performed = [retainedController joinAllTracksWithCallback:^(NSURL *url) {
		[self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[url path]] callbackId:command.callbackId];
	}];

	if (!performed) {
		[self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:nil] callbackId:command.callbackId];
		return;
	}
}

- (void)getTracksInfo:(CDVInvokedUrlCommand *)command {
	CRPMultiRecorderInfo *info = [_cameraViewController getInfo];

	NSMutableDictionary *dict = nil;
	if (info != nil) {
		dict = [[NSMutableDictionary alloc] init];

		NSObject *obj = [info trackLengths];
		[dict setObject:(obj ? obj : [NSNull null]) forKey:@"trackLengths"];
		obj = [info fullTrackPath];
		[dict setObject:(obj ? obj : [NSNull null]) forKey:@"fullTrackPath"];
	}

	CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:dict];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)getCameraInfo:(CDVInvokedUrlCommand *)command {
	NSDictionary *params = @{
		@"hasCamera": [NSNumber numberWithBool:[CRPUtils deviceHasCamera]],
		@"hasFrontCamera": [NSNumber numberWithBool:[CRPUtils deviceHasFrontCamera]],
		@"canRecord": [NSNumber numberWithBool:true],
	};

	CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:params];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)setKeepLastSession:(CDVInvokedUrlCommand *)command {
	_keepLastSession = [command.arguments[0] boolValue];
}

- (void)setUseAutoFocus:(CDVInvokedUrlCommand *)command {
	_useAutoFocus = [command.arguments[0] boolValue];
}

- (void)setOutputResolution:(CDVInvokedUrlCommand *)command {
	_outputResolution = CGSizeMake ([command.arguments[0] floatValue], [command.arguments[1] floatValue]);
}

- (void)setOnRecordingStartedHandler:(CDVInvokedUrlCommand *)command {
	_recordingStartedCallbackContext = command.callbackId;
}

- (void)setOnRecordingStoppedHandler:(CDVInvokedUrlCommand *)command {
	_recordingStoppedCallbackContext = command.callbackId;
}

- (void)setOnRecordingTimestampHandler:(CDVInvokedUrlCommand *)command {
	_recordingTimestampCallbackContext = command.callbackId;
}

#pragma mark - listeners

- (void)recorderStarted:(CRPMultiRecorder *)recorder {
	CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[pluginResult setKeepCallbackAsBool:true];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:_recordingStartedCallbackContext];
}

- (void)recorderStopped:(CRPMultiRecorder *)recorder withResult:(NSURL *)result {
	CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[pluginResult setKeepCallbackAsBool:true];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:_recordingStoppedCallbackContext];
}

- (void)recorder:(CRPMultiRecorder *)recorder trackLength:(Float64)trackLength totalLength:(Float64)totalLength {
	NSArray *params = @[@(trackLength), @(totalLength)];
	CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:params];
	[pluginResult setKeepCallbackAsBool:true];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:_recordingTimestampCallbackContext];
}

@end
