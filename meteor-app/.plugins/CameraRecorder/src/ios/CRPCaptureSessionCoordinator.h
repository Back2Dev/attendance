#import <AVFoundation/AVFoundation.h>
#import <Foundation/Foundation.h>

@protocol CRPCaptureSessionCoordinatorDelegate;

@interface CRPCaptureSessionCoordinator : NSObject

- (void)setDelegate:(id<CRPCaptureSessionCoordinatorDelegate>)delegate callbackQueue:(dispatch_queue_t)delegateCallbackQueue;

- (AVCaptureVideoPreviewLayer *)previewLayer;

- (BOOL)addOutput:(AVCaptureOutput *)output toCaptureSession:(AVCaptureSession *)captureSession;

- (void)startRunning;
- (void)stopRunning;

- (void)startRecordingWithMaxDurationInSeconds:(Float64)maxDur atPath:(NSString *)path outputResolution:(CGSize)outputResolution;
- (void)stopRecording;

@end

@protocol CRPCaptureSessionCoordinatorDelegate <NSObject>

@required

- (void)coordinatorDidBeginRecording:(CRPCaptureSessionCoordinator *)coordinator;
- (void)coordinator:(CRPCaptureSessionCoordinator *)coordinator didFinishRecordingToOutputFileURL:(NSURL *)outputFileURL error:(NSError *)error;
- (void)coordinator:(CRPCaptureSessionCoordinator *)coordinator reachedTimestamp:(Float64)time;

@end