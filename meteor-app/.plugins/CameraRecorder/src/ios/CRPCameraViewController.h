#import "CRPMultiRecorder.h"
#import <UIKit/UIKit.h>

@interface CRPCameraViewController : UIViewController

- (void)setDelegate:(id<CRPMultiRecorderDelegate>)delegate;
- (void)setKeepLastSession:(bool)keep;
- (void)setOutputResolution:(CGSize)res;

- (void)setRecording:(bool)r;
- (bool)isRecording;

- (bool)removeLastTrack;
- (CRPMultiRecorderInfo *)getInfo;

- (bool)joinAllTracksWithCallback:(void (^) (NSURL *))callback;

@end
