package com.curiyoapp.camerarecorderplugin;

import android.app.Fragment;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.VideoView;

import java.util.concurrent.Callable;
import java.util.concurrent.atomic.AtomicBoolean;

public class CameraFragment extends Fragment {

    private static final String TAG = CameraFragment.class.getSimpleName();

    public interface CameraPreviewListener {
        public void onRecordingStarted();

        public void onRecordingTimestamp(double trackTime, double totalTime);

        public void onRecordingStopped(String path);
    }

    private static final Object sessionLock = new Object();
    private static MultiMuxer lastMultiMuxer;

    private boolean keepLastSession = false;
    private boolean useAutoFocus = true;

    private VideoView mVideoView;

    private CameraGLView mCameraView;

    private MultiMuxer multiMuxer;

    private int x, y, width, height;
    private int outputW, outputH;

    public void setFrame(int x, int y, int width, int height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    private CameraPreviewListener eventListener;

    public void setEventListener(CameraPreviewListener listener) {
        eventListener = listener;
    }

    @Override
    public View onCreateView(final LayoutInflater inflater, final ViewGroup container, final Bundle savedInstanceState) {
        FrameLayout root = new FrameLayout(getActivity());
        root.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        FrameLayout videoContainer = new FrameLayout(getActivity());
        root.addView(videoContainer);

        FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(width, height);
        layoutParams.setMargins(x, y, 0, 0);
        videoContainer.setLayoutParams(layoutParams);

        mVideoView = new VideoView(getActivity());
        mVideoView.setVisibility(View.INVISIBLE);

        mCameraView = new CameraGLView(getActivity());

        videoContainer.addView(mCameraView);
        videoContainer.addView(mVideoView);

        videoContainer.setEnabled(false);

        return root;
    }

    // do we need something like this?
//	public void playLastFragment() {
//		String path = multiMuxer.getLastPath();
//
//		if (path == null) {
//			return;
//		}
//
//		mCameraView.onPause();
//		mCameraView.setVisibility(View.INVISIBLE);
//
//		mVideoView.setVisibility(View.VISIBLE);
//
//		mVideoView.getCurrentPosition();
//		mVideoView.stopPlayback();
//		mVideoView.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
//			public void onPrepared(MediaPlayer mp) {
//				mp.setLooping(true);
//				mVideoView.start();
//			}
//		});
//		mVideoView.setVideoPath(path);
//	}

    public boolean setRecording(boolean rec) {
        MultiMuxer m = multiMuxer;
        if (m == null) {
            Log.w(TAG, "MultiMuxer is null");
            return false;
        }

        if (rec) {
            return m.resume();
        } else {
            return m.pause();
        }
    }

    public boolean isRecording() {
        synchronized (sessionLock) {
            return multiMuxer != null && multiMuxer.isRecording();
        }
    }

    public MultiMuxer.Info getTracksInfo() {
        synchronized (sessionLock) {
            if (multiMuxer == null) {
                if (lastMultiMuxer != null && keepLastSession) {
                    return lastMultiMuxer.getInfo();
                }
                return null;
            }
            return multiMuxer.getInfo();
        }
    }

    public boolean removeLastTrack() {
        synchronized (sessionLock) {
            return multiMuxer != null && multiMuxer.removeLastTrack();
        }
    }

    public Callable<String> getJoinAllTracksAction() {
        synchronized (sessionLock) {
            final MultiMuxer m = multiMuxer;
            return new Callable<String>() {
                @Override
                public String call() throws Exception {
                    if (m == null) {
                        return null;
                    }
                    return m.joinAllTracks();
                }
            };
        }
    }

    public void setOutputResolution(int w, int h) {
        synchronized (sessionLock) {
            outputW = w;
            outputH = h;
        }
    }

    public void setKeepLastSession(boolean keepLastSession) {
        synchronized (sessionLock) {
            this.keepLastSession = keepLastSession;
        }
    }

    public void setUseAutoFocus(boolean useAutoFocus) {
        synchronized (sessionLock) {
            this.useAutoFocus = useAutoFocus;
        }
    }

    @Override
    public void onResume() {
        super.onResume();

        synchronized (sessionLock) {
            if (multiMuxer == null) {
                multiMuxer = new MultiMuxer(getActivity().getApplicationContext(), multiMuxerListener, new Handler(),
                        outputW, outputH,
                        keepLastSession ? lastMultiMuxer : null);
            }

            lastMultiMuxer = multiMuxer;
        }

        multiMuxer.setCameraView(mCameraView);

        synchronized (sessionLock) {
            mCameraView.setUseAutoFocus(useAutoFocus);
        }

        mCameraView.onResume();
    }

    @Override
    public void onPause() {
        multiMuxer.pause();
        mCameraView.onPause();
        multiMuxer.setCameraView(null);
        super.onPause();
    }

    private final MultiMuxer.MultiMuxerListener multiMuxerListener = new MultiMuxer.MultiMuxerListener() {

        @Override
        public void onTimestamp(MultiMuxer muxer, double trackLength, double totalLength) {
            if (eventListener != null) {
                eventListener.onRecordingTimestamp(trackLength, totalLength);
            }
        }

        @Override
        public void onStarted(MultiMuxer muxer) {
            if (eventListener != null) {
                eventListener.onRecordingStarted();
            }
        }

        @Override
        public void onStopped(MultiMuxer muxer, String path) {
            if (eventListener != null) {
                eventListener.onRecordingStopped(path);
            }
        }
    };

}
