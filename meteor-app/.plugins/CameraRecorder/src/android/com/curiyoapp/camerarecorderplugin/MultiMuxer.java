package com.curiyoapp.camerarecorderplugin;

import android.content.Context;
import android.os.Handler;
import android.util.Log;

import com.coremedia.iso.IsoFile;
import com.coremedia.iso.boxes.Container;
import com.googlecode.mp4parser.authoring.Movie;
import com.googlecode.mp4parser.authoring.Track;
import com.googlecode.mp4parser.authoring.builder.DefaultMp4Builder;
import com.googlecode.mp4parser.authoring.container.mp4.MovieCreator;
import com.googlecode.mp4parser.authoring.tracks.AppendTrack;

import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.channels.FileChannel;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class MultiMuxer {

    public static class Info {
        public final List<Double> trackLengths;
        public final String lastTrackPath;
        public final String fullTrackPath;

        protected Info(List<Double> trackLengths, String lastTrackPath, String fullTrackPath) {
            this.trackLengths = new ArrayList<Double>(trackLengths);
            this.lastTrackPath = lastTrackPath;
            this.fullTrackPath = fullTrackPath;
        }
    }

    private static final String TAG = MultiMuxer.class.getSimpleName();

    public interface MultiMuxerListener {
        public void onTimestamp(MultiMuxer muxer, double trackLength, double totalLength);

        public void onStarted(MultiMuxer muxer);

        public void onStopped(MultiMuxer muxer, String path);
    }

    private final Object lock = new Object();

    private MediaMuxerWrapper mMuxer;
    private CameraGLView cameraView;
    private final File workingDirectory;
    private final MultiMuxerListener listener;
    private final Handler handler;
    private final int outWidth, outHeight;

    private long lastUs = 0;
    private double timestampOffset = 0.0;
    private boolean isFullTrackValid = false;

    private ArrayList<Double> trackLengths = new ArrayList<Double>();

    public MultiMuxer(Context context, MultiMuxerListener listener, Handler handler, int width, int height, MultiMuxer multiMuxerForDataReuse) {
        this.listener = listener;
        this.handler = handler;
        this.outWidth = width;
        this.outHeight = height;

        workingDirectory = new File(context.getFilesDir(), "com.curiyoapp.camerarecorderplugin");

        if (multiMuxerForDataReuse != null) {
            Info info = multiMuxerForDataReuse.getInfo();

            trackLengths.addAll(info.trackLengths);
            isFullTrackValid = info.fullTrackPath != null;
        }
    }

    public void setCameraView(CameraGLView cameraView) {
        synchronized (lock) {
            this.cameraView = cameraView;
        }
    }

    public Info getInfo() {
        synchronized (lock) {
            return new Info(trackLengths,
                    getLastPath(),
                    isFullTrackValid ? getFullFile().getAbsolutePath() : null);
        }
    }

    public String getLastPath() {
        synchronized (lock) {
            if (trackLengths.size() <= 0) {
                return null;
            }

            return getPath(trackLengths.size() - 1);
        }
    }

    public boolean isRecording() {
        synchronized (lock) {
            return mMuxer != null;
        }
    }

    public boolean removeLastTrack() {
        synchronized (lock) {
            if (mMuxer != null) {
                Log.w(TAG, "Trying to remove track while muxer is running");
                return false;
            }

            if (trackLengths.size() <= 0) {
                Log.w(TAG, "Cannot remove track, because there are no tracks");
                return false;
            }

            int index = trackLengths.size() - 1;
            trackLengths.remove(index);
            isFullTrackValid = false;
            return getFile(index).delete();
        }
    }

    public String joinAllTracks() {
        synchronized (lock) {
            if (mMuxer != null) {
                Log.w(TAG, "Trying to join tracks while muxer is running");
                return null;
            }

            if (trackLengths.size() <= 0) {
                Log.w(TAG, "Cannot join tracks, because there are no tracks");
                return null;
            }

            isFullTrackValid = false;

            try {
                File file = getFullFile();
                String path = file.getAbsolutePath();
                file.delete();

                buildFullTrack();

                isFullTrackValid = true;
                return path;
            } catch (IOException e) {
                e.printStackTrace();
                return null;
            }
        }
    }

    public File getFullFile() {
        synchronized (lock) {
            return new File(workingDirectory, "file_full.mp4");
        }
    }

    private String getPath(int index) {
        return getFile(index).getAbsolutePath();
    }

    private File getFile(int index) {
        return new File(workingDirectory, "file_" + index + ".mp4");
    }

    public boolean resume() {
        synchronized (lock) {
            try {
                if (mMuxer != null) {
                    Log.w(TAG, "trying to resume running muxer");
                    return false;
                }

                if (!canRecordMore()) {
                    Log.w(TAG, "trying to resume full muxer");
                    return false;
                }

                if (trackLengths.size() == 0) {
                    clearWorkingDirectory();
                }

                lastUs = 0;
                timestampOffset = getTotalLength();
                isFullTrackValid = false;

                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        listener.onStarted(MultiMuxer.this);
                    }
                });

                final String path = getPath(trackLengths.size());
                final long duration = getMaxDurationUs();

                mMuxer = new MediaMuxerWrapper(muxerlistener, path, duration);
                new MediaVideoEncoder(mMuxer, mVideoEncoderListener, outWidth, outHeight);
                new MediaAudioEncoder(mMuxer, mVideoEncoderListener);
                mMuxer.prepare();
                mMuxer.startRecording();
                return true;
            } catch (final IOException e) {
                Log.e(TAG, "start", e);
                mMuxer.stopAligned();
                mMuxer = null;

                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        listener.onStopped(MultiMuxer.this, null);
                    }
                });
                return false;
            }
        }
    }

    public boolean pause() {
        synchronized (lock) {
            if (mMuxer != null) {
                mMuxer.stopAligned();
                return true;
            }
            return false;
        }
    }

    public boolean canRecordMore() {
        synchronized (lock) {
            return getMaxDurationUs() > 0;
        }
    }

    private void onTrackEnded(MediaMuxerWrapper muxer) {
        try {
            final String path = mMuxer.getOutputPath();
            IsoFile isoFile = new IsoFile(mMuxer.getOutputPath());
            long duration = isoFile.getMovieBox().getMovieHeaderBox().getDuration();
            long timescale = isoFile.getMovieBox().getMovieHeaderBox().getTimescale();
            double lengthInSeconds = (double) duration / timescale;
            isoFile.close();

            Log.i(TAG, String.format("Result: %s %s %s", duration, timescale, lengthInSeconds));

            synchronized (lock) {
                if (mMuxer == muxer) {
                    trackLengths.add(lengthInSeconds);
                    mMuxer = null;

                    final double trackTime = lengthInSeconds;
                    final double totalTime = timestampOffset + trackTime;
                    // send corrected time
                    handler.post(new Runnable() {
                        @Override
                        public void run() {
                            listener.onTimestamp(MultiMuxer.this, trackTime, totalTime);
                        }
                    });
                    handler.post(new Runnable() {
                        @Override
                        public void run() {
                            listener.onStopped(MultiMuxer.this, path);
                        }
                    });
                }
            }
        } catch (Throwable t) {
            t.printStackTrace();
        }
    }

    private void onTrackTimestamp(MediaMuxerWrapper muxer, long us) {
        synchronized (lock) {
            if (muxer != mMuxer) {
                return;
            }

            if ((us - lastUs) > (30 * 1000)) { // 30 ms delay at least
                final double trackTime = us / 1000000.0;
                final double totalTime = timestampOffset + trackTime;
                handler.post(new Runnable() {
                    @Override
                    public void run() {
                        listener.onTimestamp(MultiMuxer.this, trackTime, totalTime);
                    }
                });
            }
        }
    }

    private long getMaxDurationUs() {
        double left = 45.0 - getTotalLength();
        if (left < 0.5) {
            return 0;
        }

        return (long) (left * 1000 * 1000);
    }

    public double getTotalLength() {
        synchronized (lock) {
            double len = 0.0;
            for (Double d : trackLengths) {
                len += d;
            }
            return len;
        }
    }

    private boolean clearWorkingDirectory() {
        workingDirectory.mkdirs();
        return deleteFilesInDir(workingDirectory);
    }

    private static boolean deleteFilesInDir(File dir) {
        if (dir.isDirectory()) {
            String[] children = dir.list();
            for (String child : children) {
                boolean success = new File(dir, child).delete();
                if (!success) {
                    return false;
                }
            }
        }
        return true;
    }

    private void buildFullTrack() throws IOException {
        List<Movie> inMovies = new ArrayList<Movie>();

        for (int i = 0; i < trackLengths.size(); ++i) {
            String path = getPath(i);
            inMovies.add(MovieCreator.build(path));
        }

        List<Track> videoTracks = new LinkedList<Track>();
        List<Track> audioTracks = new LinkedList<Track>();

        for (Movie m : inMovies) {
            for (Track t : m.getTracks()) {
                if (t.getHandler().equals("soun")) {
                    audioTracks.add(t);
                }
                if (t.getHandler().equals("vide")) {
                    videoTracks.add(t);
                }
            }
        }

        Movie result = new Movie();

        if (audioTracks.size() > 0) {
            result.addTrack(new AppendTrack(audioTracks.toArray(new Track[audioTracks.size()])));
        }
        if (videoTracks.size() > 0) {
            result.addTrack(new AppendTrack(videoTracks.toArray(new Track[videoTracks.size()])));
        }

        Container out = new DefaultMp4Builder().build(result);

        FileChannel fc = null;
        try {
            fc = new RandomAccessFile(getFullFile(), "rw").getChannel();
            out.writeContainer(fc);
        } finally {
            if (fc != null) {
                try {
                    fc.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    private final MediaEncoder.MediaEncoderListener mVideoEncoderListener = new MediaEncoder.MediaEncoderListener() {
        @Override
        public void onPrepared(final MediaEncoder encoder) {
            synchronized (lock) {
                if (cameraView != null) {
                    if (encoder instanceof MediaVideoEncoder)
                        cameraView.setVideoEncoder((MediaVideoEncoder) encoder);
                }
            }
        }

        @Override
        public void onStopped(final MediaEncoder encoder) {
            synchronized (lock) {
                if (cameraView != null) {
                    if (encoder instanceof MediaVideoEncoder)
                        cameraView.setVideoEncoder(null);
                }
            }
        }
    };

    private final MediaMuxerWrapper.MuxerListener muxerlistener = new MediaMuxerWrapper.MuxerListener() {

        @Override
        public void onTimestamp(MediaMuxerWrapper muxer, long us) {
            onTrackTimestamp(muxer, us);
        }

        @Override
        public void onStopped(MediaMuxerWrapper muxer) {
            onTrackEnded(muxer);
        }
    };

}
