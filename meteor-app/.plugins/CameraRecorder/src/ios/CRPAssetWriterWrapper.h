#import <AVFoundation/AVFoundation.h>
#import <CoreMedia/CoreMedia.h>
#import <Foundation/Foundation.h>

@protocol CRPAssetWriterWrapperDelegate;

@interface CRPAssetWriterWrapper : NSObject

- (instancetype)initWithURL:(NSURL *)URL maxDurationInSeconds:(Float64)maxDur;
- (void)addVideoTrackWithSourceFormatDescription:(CMFormatDescriptionRef)formatDescription outputResolution:(CGSize)outputResolution;
- (void)addAudioTrackWithSourceFormatDescription:(CMFormatDescriptionRef)formatDescription settings:(NSDictionary *)audioSettings;
- (void)setDelegate:(id<CRPAssetWriterWrapperDelegate>)delegate callbackQueue:(dispatch_queue_t)delegateCallbackQueue;

- (void)prepareToRecord;
- (void)appendSampleBuffer:(CMSampleBufferRef)sampleBuffer ofMediaType:(NSString *)mediaType;
- (void)finishRecording;

@end

@protocol CRPAssetWriterWrapperDelegate <NSObject>

- (void)writerWrapperDidFinishPreparing:(CRPAssetWriterWrapper *)coordinator;
- (void)writerWrapper:(CRPAssetWriterWrapper *)coordinator reachedTimestamp:(Float64)time;
- (void)writerWrapper:(CRPAssetWriterWrapper *)coordinator didFailWithError:(NSError *)error;
- (void)writerWrapperDidFinishRecording:(CRPAssetWriterWrapper *)coordinator;

@end
