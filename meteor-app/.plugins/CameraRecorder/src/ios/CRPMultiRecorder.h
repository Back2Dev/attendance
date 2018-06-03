#import <AVFoundation/AVFoundation.h>
#import <Foundation/Foundation.h>

@interface CRPMultiRecorderInfo : NSObject

- (NSArray *)trackLengths;
- (NSString *)lastTrackPath;
- (NSString *)fullTrackPath;

@end

@protocol CRPMultiRecorderDelegate;

@interface CRPMultiRecorder : NSObject

- (instancetype)initWithSession:(CRPMultiRecorder *)previousRecorder;

- (void)setDelegate:(id<CRPMultiRecorderDelegate>)delegate;
- (AVCaptureVideoPreviewLayer *)previewLayer;

- (void)open;
- (void)close;

- (bool)resume;
- (void)pause;

- (bool)isRecording;
- (bool)removeLastTrack;

- (CRPMultiRecorderInfo *)getInfo;
- (bool)joinAllTracksWithCallback:(void (^) (NSURL *))callback;

- (void)setOutputResolution:(CGSize)res;

@end

@protocol CRPMultiRecorderDelegate <NSObject>

- (void)recorderStarted:(CRPMultiRecorder *)recorder;
- (void)recorderStopped:(CRPMultiRecorder *)recorder withResult:(NSURL *)result;
- (void)recorder:(CRPMultiRecorder *)recorder trackLength:(Float64)trackLength totalLength:(Float64)totalLength;

@end