package com.curiyoapp.camerarecorderplugin;

import android.app.FragmentManager;
import android.app.FragmentTransaction;
import android.graphics.Point;
import android.graphics.PointF;
import android.os.Build;
import android.util.Size;
import android.util.SizeF;
import android.widget.FrameLayout;
import android.widget.Toast;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.HashMap;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class CameraRecorder extends CordovaPlugin implements CameraFragment.CameraPreviewListener {

    private static final String TAG = CameraRecorder.class.getSimpleName();

    private static final String CONTAINER_ID_RESOURCE_NAME = "com_curiyoapp_camerarecorderplugin_values_container";

    private final ExecutorService threadPool = Executors.newCachedThreadPool();
    private final Object fragmentLock = new Object();

    private CameraFragment fragment;
    private CallbackContext recordingStartedCallbackContext;
    private CallbackContext recordingTimestampCallbackContext;
    private CallbackContext recordingStoppedCallbackContext;

    private boolean keepLastSession = false;
    private boolean useAutoFocus = true;
    private Point outputResolution = new Point(0, 0);

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        synchronized (fragmentLock) {
            if ("setOnRecordingStartedHandler".equals(action)) {
                setOnRecordingStartedHandler(args, callbackContext);
            } else if ("setOnRecordingTimestampHandler".equals(action)) {
                setOnRecordingTimestampHandler(args, callbackContext);
            } else if ("setOnRecordingStoppedHandler".equals(action)) {
                setOnRecordingStoppedHandler(args, callbackContext);
            } else if ("startCamera".equals(action)) {
                startCamera(args, callbackContext);
            } else if ("stopCamera".equals(action)) {
                stopCamera(args, callbackContext);
            } else if ("setRecording".equals(action)) {
                setRecording(args, callbackContext);
            } else if ("isRecording".equals(action)) {
                isRecording(args, callbackContext);
            } else if ("getTracksInfo".equals(action)) {
                getTracksInfo(args, callbackContext);
            } else if ("removeLastTrack".equals(action)) {
                removeLastTrack(args, callbackContext);
            } else if ("joinAllTracks".equals(action)) {
                joinAllTracks(args, callbackContext);
            } else if ("setOutputResolution".equals(action)) {
                setOutputResolution(args, callbackContext);
            } else if ("setKeepLastSession".equals(action)) {
                setKeepLastSession(args, callbackContext);
            } else if ("setUseAutoFocus".equals(action)) {
                setUseAutoFocus(args, callbackContext);
            } else if ("getCameraInfo".equals(action)) {
                getCameraInfo(args, callbackContext);
            } else {
                return false;
            }
            return true;
        }
    }

    private void setOutputResolution(final JSONArray args, CallbackContext callbackContext) throws JSONException {
        outputResolution = new Point((int) (args.getDouble(0) + 0.5), (int) (args.getDouble(1) + 0.5));
    }

    private void setKeepLastSession(final JSONArray args, CallbackContext callbackContext) throws JSONException {
        keepLastSession = args.getBoolean(0);
    }

    private void setUseAutoFocus(final JSONArray args, CallbackContext callbackContext) throws JSONException {
        useAutoFocus = args.getBoolean(0);
    }

    private void getCameraInfo(final JSONArray args, CallbackContext callbackContext) throws JSONException {
        try {
            CameraUtils.Info info = CameraUtils.getInfo();
            HashMap<String, Object> map = new HashMap<String, Object>();
            map.put("hasCamera", info.defaultCameraId != null);
            map.put("hasFrontCamera", info.frontCameraId != null);
            map.put("canRecord", Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2);
            JSONObject obj = new JSONObject(map);
            callbackContext.success(obj);
        } catch (Throwable t) {
            callbackContext.success(new JSONObject());
        }
    }

    private void setRecording(final JSONArray args, CallbackContext callbackContext) {
        if (fragment == null) {
            cordova.getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(cordova.getActivity(), "Camera is off", Toast.LENGTH_SHORT).show();
                }
            });
            return;
        }

        final boolean rec;
        try {
            rec = args.getBoolean(0);
        } catch (JSONException e) {
            e.printStackTrace();
            return;
        }

        cordova.getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                fragment.setRecording(rec);
            }
        });
    }

    private void isRecording(final JSONArray args, CallbackContext callbackContext) {
        if (fragment == null) {
            callbackContext.success((String) null);
        } else {
            callbackContext.success(fragment.isRecording() ? "ok" : null);
        }
    }

    private void removeLastTrack(final JSONArray args, CallbackContext callbackContext) {
        if (fragment == null) {
            callbackContext.success((String) null);
        } else {
            callbackContext.success(fragment.removeLastTrack() ? "ok" : null);
        }
    }

    private void joinAllTracks(final JSONArray args, final CallbackContext callbackContext) {
        threadPool.execute(new Runnable() {
            @Override
            public void run() {
                final Callable<String> callable;
                synchronized (fragmentLock) {
                    if (fragment == null) {
                        callbackContext.success((String) null);
                        return;
                    } else {
                        callable = fragment.getJoinAllTracksAction();
                    }
                }

                String result;
                try {
                    result = callable.call();
                } catch (Exception e) {
                    e.printStackTrace();
                    result = null;
                }

                callbackContext.success(result);
            }
        });
    }

    private void getTracksInfo(final JSONArray args, CallbackContext callbackContext) {
        if (fragment == null) {
            callbackContext.success((String) null);
        } else {
            MultiMuxer.Info info = fragment.getTracksInfo();
            if (info == null) {
                callbackContext.success((String) null);
            } else {
                HashMap<String, Object> map = new HashMap<String, Object>();
                map.put("trackLengths", new JSONArray(info.trackLengths));
                map.put("fullTrackPath", info.fullTrackPath);
                callbackContext.success(new JSONObject(map));
            }
        }
    }

    private void startCamera(final JSONArray args, CallbackContext callbackContext) {
        if (fragment != null) {
            return;
        }

        fragment = new CameraFragment();
        fragment.setOutputResolution(outputResolution.x, outputResolution.y);
        fragment.setKeepLastSession(keepLastSession);
        fragment.setUseAutoFocus(useAutoFocus);
        fragment.setEventListener(this);

        cordova.getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                synchronized (fragmentLock) {
                    try {
                        int x = args.getInt(0);
                        int y = args.getInt(1);
                        int width = args.getInt(2);
                        int height = args.getInt(3);

                        fragment.setFrame(x, y, width, height);

                        final int containerViewId = cordova.getActivity().getResources().getIdentifier(CONTAINER_ID_RESOURCE_NAME, "id", cordova.getActivity().getPackageName());

                        FrameLayout containerView = (FrameLayout) cordova.getActivity().findViewById(containerViewId);
                        if (containerView == null) {
                            containerView = new FrameLayout(cordova.getActivity().getApplicationContext());
                            containerView.setId(containerViewId);

                            containerView.setClickable(false);

                            FrameLayout.LayoutParams containerLayoutParams = new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT);
                            cordova.getActivity().addContentView(containerView, containerLayoutParams);
                        }

                        containerView.bringToFront();

                        FragmentManager fragmentManager = cordova.getActivity().getFragmentManager();
                        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
                        fragmentTransaction.add(containerView.getId(), fragment);
                        fragmentTransaction.commit();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        });
    }

    private void stopCamera(final JSONArray args, CallbackContext callbackContext) {
        if (fragment == null) {
            return;
        }

        FragmentManager fragmentManager = cordova.getActivity().getFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.remove(fragment);
        fragmentTransaction.commit();
        fragment = null;
    }

    private void setOnRecordingStartedHandler(JSONArray args, CallbackContext callbackContext) {
        recordingStartedCallbackContext = callbackContext;
    }

    private void setOnRecordingStoppedHandler(JSONArray args, CallbackContext callbackContext) {
        recordingStoppedCallbackContext = callbackContext;
    }

    private void setOnRecordingTimestampHandler(JSONArray args, CallbackContext callbackContext) {
        recordingTimestampCallbackContext = callbackContext;
    }

    // Listener

    @Override
    public void onRecordingStarted() {
        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK);
        pluginResult.setKeepCallback(true);
        recordingStartedCallbackContext.sendPluginResult(pluginResult);
    }

    @Override
    public void onRecordingTimestamp(double trackTime, double totalTime) {
        JSONArray data = new JSONArray(Arrays.asList(trackTime, totalTime));

        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, data);
        pluginResult.setKeepCallback(true);
        recordingTimestampCallbackContext.sendPluginResult(pluginResult);
    }

    @Override
    public void onRecordingStopped(String path) {
        PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, path);
        pluginResult.setKeepCallback(true);
        recordingStoppedCallbackContext.sendPluginResult(pluginResult);
    }
}
