var exec = require('cordova/exec');

var PLUGIN_NAME = "CameraRecorder";

var CameraRecorder = function() {};

CameraRecorder.startCamera = function(rect) {
  exec(null, null, PLUGIN_NAME, "startCamera", [rect.x, rect.y, rect.width, rect.height]);
};

CameraRecorder.stopCamera = function() {
  exec(null, null, PLUGIN_NAME, "stopCamera", []);
};

CameraRecorder.setKeepLastSession = function(keep) {
  exec(null, null, PLUGIN_NAME, "setKeepLastSession", [!!keep]);
};

CameraRecorder.setOutputResolution = function(w, h) {
  w = w ? w : 0;
  h = h ? h : 0;
  exec(null, null, PLUGIN_NAME, "setOutputResolution", [w, h]);
};

// CameraRecorder.setUseAutoFocus = function(v) {
// 	exec(null, null, PLUGIN_NAME, "setUseAutoFocus", [!!v]);
// };

CameraRecorder.setRecording = function(rec) {
  exec(null, null, PLUGIN_NAME, "setRecording", [!!rec]);
};

CameraRecorder.isRecording = function(callback) {
  exec(function(result) {
    if (callback) {
      callback(!!result);
    }
  }, null, PLUGIN_NAME, "isRecording", []);
};

CameraRecorder.joinAllTracks = function(callback) {
  exec(function(path) {
    if (callback) {
      callback(path);
    }
  }, null, PLUGIN_NAME, "joinAllTracks", []);
};

CameraRecorder.removeLastTrack = function(callback) {
  exec(function(result) {
    if (callback) {
      callback(!!result);
    }
  }, null, PLUGIN_NAME, "removeLastTrack", []);
};

CameraRecorder.getCameraInfo = function(callback) {
  exec(function(info) {
    if (!callback) return;
    info.hasCamera = !!(info.hasCamera);
    info.hasFrontCamera = !!(info.hasFrontCamera);
    info.canRecord = !!(info.canRecord);
    callback(info);
  }, null, PLUGIN_NAME, "getCameraInfo", []);
};

CameraRecorder.getTracksInfo = function(callback) {
  exec(function(result) {
    if (callback) {
      callback(result ? result : null);
    }
  }, null, PLUGIN_NAME, "getTracksInfo", []);
};

CameraRecorder.setOnRecordingStartedHandler = function(handler) {
  exec(handler, handler, PLUGIN_NAME, "setOnRecordingStartedHandler", []);
};

CameraRecorder.setOnRecordingTimestampHandler = function(handler) {
  exec(handler, handler, PLUGIN_NAME, "setOnRecordingTimestampHandler", []);
};

CameraRecorder.setOnRecordingStoppedHandler = function(handler) {
  exec(handler, handler, PLUGIN_NAME, "setOnRecordingStoppedHandler", []);
};

module.exports = CameraRecorder;
