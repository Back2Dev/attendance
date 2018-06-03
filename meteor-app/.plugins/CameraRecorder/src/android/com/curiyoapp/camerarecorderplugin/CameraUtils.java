package com.curiyoapp.camerarecorderplugin;

import android.hardware.Camera;
import android.util.Log;

import java.util.List;

public class CameraUtils {

	public static final class Info {
		public final Integer defaultCameraId;
		public final Integer frontCameraId;

		public Info(Integer defaultCameraId, Integer frontCameraId) {
			this.defaultCameraId = defaultCameraId;
			this.frontCameraId = frontCameraId;
		}
	}

	private static final String TAG = CameraUtils.class.getSimpleName();

	public static Info getInfo() {
		final int numberOfCameras = Camera.getNumberOfCameras();

		final Integer defaultCameraId = numberOfCameras > 0 ? 0 : null;
		Integer frontCameraId = null;

		Camera.CameraInfo cameraInfo = new Camera.CameraInfo();
		for (int i = 0; i < numberOfCameras; i++) {
			Camera.getCameraInfo(i, cameraInfo);
			if (cameraInfo.facing == Camera.CameraInfo.CAMERA_FACING_FRONT) {
				frontCameraId = i;
				break;
			}
		}

		return new Info(defaultCameraId, frontCameraId);
	}

	static int getFrontCameraIdOrZero() {
		Integer id = getInfo().frontCameraId;
		if (id == null) {
			Log.w(TAG, "no front camera, fallback to camera id 0");
			return 0;
		}
		return id;
	}

	static Camera.Size getOptimalPreviewSize(List<Camera.Size> sizes) {
		if (sizes == null) return null;

		Camera.Size optimalSize = null;
		int minDiff = Integer.MAX_VALUE;

		final int TARGET_LENGTH = 480;

		for (Camera.Size size : sizes) {
			final int min = Math.min(size.width, size.height);
			final int diff = Math.abs(TARGET_LENGTH - min);

			boolean isBetter = false;

			if (optimalSize == null || diff < minDiff) {
				isBetter = true;
			} else if (diff == minDiff) {
				final int max = Math.max(size.width, size.height);
				final int optimalMax = Math.max(optimalSize.width, optimalSize.height);

				if (max < optimalMax) {
					isBetter = true;
				}
			}

			if (isBetter) {
				minDiff = diff;
				optimalSize = size;
			}
		}

		if (optimalSize == null) {
			Log.d(TAG, "optimal preview size: null");
		} else {
			Log.d(TAG, "optimal preview size: w: " + optimalSize.width + " h: " + optimalSize.height);
		}
		return optimalSize;
	}
}
