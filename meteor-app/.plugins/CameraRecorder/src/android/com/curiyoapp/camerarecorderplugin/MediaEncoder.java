package com.curiyoapp.camerarecorderplugin;
/*
 * Copyright (c) 2016 mUfoq
 *
 * Edited version of:
 * AudioVideoRecordingSample
 * https://github.com/saki4510t/AudioVideoRecordingSample
 * Sample project to cature audio and video from internal mic/camera and save as MPEG4 file.
 *
 * Copyright (c) 2014-2015 saki t_saki@serenegiant.com
 *
 * File name: MediaEncoder.java
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
*/

import java.io.IOException;
import java.nio.ByteBuffer;

import android.media.MediaCodec;
import android.media.MediaFormat;
import android.util.Log;

public abstract class MediaEncoder implements Runnable {
	private static final boolean DEBUG = false;    // TODO set false on release
	private static final String TAG = "MediaEncoder";

	protected static final int TIMEOUT_USEC = 10000;    // 10[msec]
	protected static final int MSG_FRAME_AVAILABLE = 1;
	protected static final int MSG_STOP_RECORDING = 9;

	public interface MediaEncoderListener {
		public void onPrepared(MediaEncoder encoder);

		public void onStopped(MediaEncoder encoder);
	}

	protected final Object mSync = new Object();
	/**
	 * Flag that indicate this encoder is capturing now.
	 */
	protected volatile boolean mIsCapturing;
	/**
	 * Flag that indicate the frame data will be available soon.
	 */
	private int mRequestDrain;
	/**
	 * Flag to request stop capturing
	 */
	protected volatile boolean mRequestStop;
	/**
	 * Flag that indicate encoder received EOS(End Of Stream)
	 */
	protected boolean mIsEOS;
	/**
	 * Flag the indicate the muxer is running
	 */
	protected boolean mMuxerStarted;
	/**
	 * Track Number
	 */
	protected int mTrackIndex;
	/**
	 * MediaCodec instance for encoding
	 */
	protected MediaCodec mMediaCodec;                // API >= 16(Android4.1.2)
	/**
	 * Weak refarence of MediaMuxerWarapper instance
	 */
	protected final MediaMuxerWrapper mMuxer;
	/**
	 * BufferInfo instance for dequeuing
	 */
	private MediaCodec.BufferInfo mBufferInfo;        // API >= 16(Android4.1.2)

	protected final MediaEncoderListener mListener;

	public MediaEncoder(final MediaMuxerWrapper muxer, final MediaEncoderListener listener) {
		if (listener == null) throw new NullPointerException("MediaEncoderListener is null");
		if (muxer == null) throw new NullPointerException("MediaMuxerWrapper is null");
		mMuxer = muxer;
		muxer.addEncoder(this);
		mListener = listener;
		synchronized (mSync) {
			// create BufferInfo here for effectiveness(to reduce GC)
			mBufferInfo = new MediaCodec.BufferInfo();
			// wait for starting thread
			new Thread(this, getClass().getSimpleName()).start();
			try {
				mSync.wait();
			} catch (final InterruptedException e) {
			}
		}
	}

	/**
	 * the method to indicate frame data is soon available or already available
	 *
	 * @return return true if encoder is ready to encod.
	 */
	public boolean frameAvailableSoon() {
//    	if (DEBUG) Log.v(TAG, "frameAvailableSoon");
		synchronized (mSync) {
			if (!mIsCapturing || mRequestStop) {
				return false;
			}
			mRequestDrain++;
			mSync.notifyAll();
		}
		return true;
	}

	/**
	 * encoding loop on private thread
	 */
	@Override
	public void run() {
//		android.os.Process.setThreadPriority(android.os.Process.THREAD_PRIORITY_URGENT_AUDIO);
		synchronized (mSync) {
			mRequestStop = false;
			mRequestDrain = 0;
			mSync.notify();
		}

		boolean localRequestStop;
		boolean localRequestDrain;
		while (true) {
			synchronized (mSync) {
				localRequestStop = mRequestStop;
				localRequestDrain = (mRequestDrain > 0);
				if (localRequestDrain)
					mRequestDrain--;
			}
			if (localRequestStop) {
				drain();
				// request stop recording
				signalEndOfInputStream();
				// process output data again for EOS signale
				drain();
				// release all related objects
				release();
				break;
			}
			if (localRequestDrain) {
				drain();
			} else {
				synchronized (mSync) {
					try {
						mSync.wait();
					} catch (final InterruptedException e) {
						break;
					}
				}
			}
		} // end of while
		if (DEBUG) Log.d(TAG, "Encoder thread exiting");
		synchronized (mSync) {
			mRequestStop = true;
			mIsCapturing = false;
		}
	}

	/*
	* prepareing method for each sub class
    * this method should be implemented in sub class, so set this as abstract method
    * @throws IOException
    */
   /*package*/
	abstract void prepare() throws IOException;

	/*package*/ void startRecording() {
		if (DEBUG) Log.v(TAG, "startRecording");
		synchronized (mSync) {
			mIsCapturing = true;
			mRequestStop = false;
			mSync.notifyAll();
		}
	}

	/**
	 * the method to request stop encoding
	 */
	/*package*/ private void stopRecording() {
		if (DEBUG) Log.v(TAG, "stopRecording");
		synchronized (mSync) {
			if (!mIsCapturing || mRequestStop) {
				return;
			}
			mRequestStop = true;    // for rejecting newer frame
			mSync.notifyAll();
			// We can not know when the encoding and writing finish.
			// so we return immediately after request to avoid delay of caller thread
		}
	}

//********************************************************************************
//********************************************************************************

	/**
	 * Release all releated objects
	 */
	protected void release() {
		if (DEBUG) Log.d(TAG, "release:");
		try {
			mListener.onStopped(this);
		} catch (final Exception e) {
			Log.e(TAG, "failed onStopped", e);
		}
		mIsCapturing = false;
		if (mMediaCodec != null) {
			try {
				mMediaCodec.stop();
				mMediaCodec.release();
				mMediaCodec = null;
			} catch (final Exception e) {
				Log.e(TAG, "failed releasing MediaCodec", e);
			}
		}
		if (mMuxerStarted) {
			try {
				mMuxer.stop();
			} catch (final Exception e) {
				Log.e(TAG, "failed stopping muxer", e);
			}
		}
		mBufferInfo = null;
	}

	abstract protected void signalEndOfInputStream();

	/**
	 * drain encoded data and write them to muxer
	 */
	private void drain() {
		if (mMediaCodec == null) return;
		ByteBuffer[] encoderOutputBuffers = mMediaCodec.getOutputBuffers();
		int encoderStatus, count = 0;
//		final MediaMuxerWrapper muxer = mMuxer;
//		if (muxer == null) {
////        	throw new NullPointerException("muxer is unexpectedly null");
//			Log.w(TAG, "muxer is unexpectedly null");
//			return;
//		}
		LOOP:
		while (mIsCapturing) {
			// get encoded data with maximum timeout duration of TIMEOUT_USEC(=10[msec])
			encoderStatus = mMediaCodec.dequeueOutputBuffer(mBufferInfo, TIMEOUT_USEC);
			if (encoderStatus == MediaCodec.INFO_TRY_AGAIN_LATER) {
				// wait 5 counts(=TIMEOUT_USEC x 5 = 50msec) until data/EOS come
				if (!mIsEOS) {
					if (++count > 5)
						break LOOP;        // out of while
				}
			} else if (encoderStatus == MediaCodec.INFO_OUTPUT_BUFFERS_CHANGED) {
				if (DEBUG) Log.v(TAG, "INFO_OUTPUT_BUFFERS_CHANGED");
				// this shoud not come when encoding
				encoderOutputBuffers = mMediaCodec.getOutputBuffers();
			} else if (encoderStatus == MediaCodec.INFO_OUTPUT_FORMAT_CHANGED) {
				if (DEBUG) Log.v(TAG, "INFO_OUTPUT_FORMAT_CHANGED");
				// this status indicate the output format of codec is changed
				// this should come only once before actual encoded data
				// but this status never come on Android4.3 or less
				// and in that case, you should treat when MediaCodec.BUFFER_FLAG_CODEC_CONFIG come.
				if (mMuxerStarted) {    // second time request is error
					throw new RuntimeException("format changed twice");
				}
				// get output format from codec and pass them to muxer
				// getOutputFormat should be called after INFO_OUTPUT_FORMAT_CHANGED otherwise crash.
				final MediaFormat format = mMediaCodec.getOutputFormat(); // API >= 16
				mTrackIndex = mMuxer.addTrack(format);
				mMuxerStarted = true;
				if (!mMuxer.start()) {
					// we should wait until muxer is ready
					synchronized (mMuxer) {
						while (!mMuxer.isStarted())
							try {
								mMuxer.wait(100);
							} catch (final InterruptedException e) {
								break LOOP;
							}
					}
				}
			} else if (encoderStatus < 0) {
				// unexpected status
				if (DEBUG)
					Log.w(TAG, "drain:unexpected result from encoder#dequeueOutputBuffer: " + encoderStatus);
			} else {
				final ByteBuffer encodedData = encoderOutputBuffers[encoderStatus];
				if (encodedData == null) {
					// this never should come...may be a MediaCodec internal error
					throw new RuntimeException("encoderOutputBuffer " + encoderStatus + " was null");
				}
				if ((mBufferInfo.flags & MediaCodec.BUFFER_FLAG_CODEC_CONFIG) != 0) {
					// You shoud set output format to muxer here when you target Android4.3 or less
					// but MediaCodec#getOutputFormat can not call here(because INFO_OUTPUT_FORMAT_CHANGED don't come yet)
					// therefor we should expand and prepare output format from buffer data.
					// This sample is for API>=18(>=Android 4.3), just ignore this flag here
					if (DEBUG) Log.d(TAG, "drain:BUFFER_FLAG_CODEC_CONFIG");
					mBufferInfo.size = 0;
				}

				boolean shouldStop = false;

				if (mBufferInfo.size != 0) {
					// encoded data is ready, clear waiting counter
					count = 0;
					if (!mMuxerStarted) {
						// muxer is not ready...this will prrograming failure.
						throw new RuntimeException("drain:muxer hasn't started");
					}
					// write encoded data to muxer(need to adjust presentationTimeUs.
					long timestamp = mBufferInfo.presentationTimeUs = muxerTimer.getTimestamp();

					if (mMuxer.reportNewTime(this, timestamp)) {
						mMuxer.writeSampleData(mTrackIndex, encodedData, mBufferInfo);
					} else {
						shouldStop = true;
						stopRecording();
					}

					//prevOutputPTSUs = mBufferInfo.presentationTimeUs;

					//Log.i(TAG, this + "|||PTSU: " + stime + " | " + prevOutputPTSUs +" same="+(stime==prevOutputPTSUs));
				}
				// return buffer to encoder
				mMediaCodec.releaseOutputBuffer(encoderStatus, false);
				if (shouldStop || ((mBufferInfo.flags & MediaCodec.BUFFER_FLAG_END_OF_STREAM) != 0)) {
					// when EOS come.
					mIsCapturing = false;
					break;      // out of while
				}
			}
		}
	}

	protected class MicroTimer {
		private long startTime = 0;
		private boolean timeInited = false;

		public long getTimestamp() {
			if (!timeInited) {
				startTime = System.nanoTime();
				timeInited = true;
				return 0;
			}

			return (System.nanoTime() - startTime) / 1000;
		}
	}

	private MicroTimer muxerTimer = new MicroTimer();

}
