'use client';

import { Episode } from "@/lib/api";
import { useState, useRef, useEffect } from "react";

export default function VideoPlayer({ episode, videoId }: { episode: Episode; videoId: string }) {
  const [isVertical, setIsVertical] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveProgress = (currentTime: number) => {
    const progress = {
      videoId,
      episode: episode.chapterIndex,
      timestamp: currentTime,
    };
    localStorage.setItem("continueWatching", JSON.stringify(progress));
  };

  const goToNextEpisode = () => {
    // Save fullscreen state before navigation
    if (isFullscreen) {
      sessionStorage.setItem('wasFullscreen', 'true');
    }
    const nextEpisode = episode.chapterIndex + 1;
    window.location.href = `/watch/${videoId}/${nextEpisode}`;
  };

  const goToPreviousEpisode = () => {
    // Save fullscreen state before navigation
    if (isFullscreen) {
      sessionStorage.setItem('wasFullscreen', 'true');
    }
    const prevEpisode = episode.chapterIndex - 1;
    if (prevEpisode >= 0) {
      window.location.href = `/watch/${videoId}/${prevEpisode}`;
    }
  };

  const skip10Forward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const skip10Backward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleVideoClick = () => {
    togglePlayPause();
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const currentTime = video.currentTime;

    saveProgress(currentTime);
  };

  const toggleControls = () => {
    setShowControls(prev => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (!prev) {
        controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
      }
      return !prev;
    });
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      const ratio = video.videoWidth / video.videoHeight;
      setIsVertical(ratio < 1); // < 1 = vertical (9:16)
    };

    const handlePlay = () => {
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Restore fullscreen state if user was in fullscreen before navigation
    const wasFullscreen = sessionStorage.getItem('wasFullscreen');
    if (wasFullscreen === 'true' && containerRef.current) {
      sessionStorage.removeItem('wasFullscreen');
      // Wait for video to be ready before entering fullscreen
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.requestFullscreen().catch(err => {
            console.log('Fullscreen request failed:', err);
          });
        }
      }, 500);
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  if (!episode.url) {
    return (
      <div className="w-full aspect-video bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">Video Not Available</h3>
          <p className="text-gray-400">This episode is currently unavailable.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative w-full bg-black ${isFullscreen ? 'h-screen' : ''}`}
    >
      <div 
        className={`relative flex items-center justify-center ${isFullscreen ? 'h-full' : ''} w-full`}
        onClick={handleVideoClick}
      >
        <video
          ref={videoRef}
          controls={false}
          autoPlay
          playsInline
          className={`w-full ${isFullscreen ? 'h-full object-contain' : isVertical ? 'aspect-[9/16] object-contain' : 'aspect-video object-contain'} bg-black`}
          src={episode.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={goToNextEpisode}
        >
          Your browser does not support the video tag.
        </video>

        {/* Center Play/Pause Button */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/60 p-6 rounded-full backdrop-blur-sm">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}

        {/* Bottom Controls - Netflix Style Overlay */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
        <div className="max-w-md mx-auto space-y-4">
          {/* Skip Buttons Row */}
          <div className="flex items-center justify-center gap-8">
            <button
              onClick={skip10Backward}
              className="flex flex-col items-center text-white hover:scale-110 transition-transform"
              title="Skip 10s backward"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
              </svg>
              <span className="text-xs mt-1">10s</span>
            </button>

            <button
              onClick={togglePlayPause}
              className="bg-white/20 p-4 rounded-full hover:bg-white/30 transition-all"
            >
              {isPlaying ? (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            <button
              onClick={skip10Forward}
              className="flex flex-col items-center text-white hover:scale-110 transition-transform"
              title="Skip 10s forward"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
              </svg>
              <span className="text-xs mt-1">10s</span>
            </button>
          </div>

          {/* Episode Navigation & Fullscreen */}
          <div className="flex items-center justify-between text-white text-sm">
            <button
              onClick={goToPreviousEpisode}
              disabled={episode.chapterIndex === 0}
              className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:text-red-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="font-semibold">Episode {episode.chapterIndex + 1}</div>
                <div className="text-xs text-gray-400">{episode.chapterName}</div>
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                )}
              </button>
            </div>

            <button
              onClick={goToNextEpisode}
              className="flex items-center gap-2 hover:text-red-400 transition-colors"
            >
              Next
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
