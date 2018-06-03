#import "CRPUtils.h"

#import <AVFoundation/AVFoundation.h>

@implementation CRPUtils

+ (bool)deviceHasFrontCamera {
	for (AVCaptureDevice *device in [AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo]) {
		if (device.position == AVCaptureDevicePositionFront) {
			return YES;
		}
	}
	return NO;
}

+ (bool)deviceHasCamera {
	return [[AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo] count] > 0;
}

@end
