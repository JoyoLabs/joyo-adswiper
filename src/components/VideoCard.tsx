'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Ad } from '@/types/ad';

interface VideoCardProps {
  ad: Ad;
  onSwipe: (direction: 'left' | 'right') => void;
  isActive: boolean;
}

export default function VideoCard({ ad, onSwipe, isActive }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50; // Reduced from 100 to 50 for easier swiping
    if (info.offset.x > threshold) {
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      onSwipe('left');
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const getPerformanceStatus = () => {
    const firstSeen = new Date(ad.firstSeen);
    const lastSeen = new Date(ad.lastSeen);
    const now = new Date();
    
    const daysSinceFirstSeen = Math.floor((now.getTime() - firstSeen.getTime()) / (1000 * 60 * 60 * 24));
    const daysBetweenFirstAndLast = Math.floor((lastSeen.getTime() - firstSeen.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceFirstSeen <= 7) {
      return { text: 'New Test Video', color: 'bg-orange-500' };
    } else if (daysBetweenFirstAndLast <= 30) {
      return { text: 'Performing Well', color: 'bg-green-500' };
    } else {
      return { text: 'Top Performing', color: 'bg-yellow-500' };
    }
  };

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <motion.div
      className="absolute inset-0 bg-white rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing w-full h-full flex flex-col"
      style={{ x, rotate, opacity }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.3}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02 }}
    >
      {/* Performance Status Bar - At the very top of the card */}
      <div className={`${getPerformanceStatus().color} text-white text-center py-2 px-4 font-bold text-sm z-10`}>
        {getPerformanceStatus().text}
      </div>
      
      {/* Video Section - Fixed height to leave room for content and buttons */}
      <div className="relative h-3/5 bg-black">

        {ad.videoUrl ? (
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            loop
            muted={isMuted}
            playsInline
          >
            <source src={ad.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-center p-8">
            <div>
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400 text-sm">No video available</p>
            </div>
          </div>
        )}
        
        {/* Play/Pause Overlay - Only show when video is available */}
        {ad.videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all duration-200">
            <button
              onClick={handlePlayPause}
              className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200"
            >
              {isPlaying ? (
                <div className="flex space-x-1">
                  <div className="w-2 h-8 bg-gray-700"></div>
                  <div className="w-2 h-8 bg-gray-700"></div>
                </div>
              ) : (
                <div className="w-0 h-0 border-l-[12px] border-l-gray-700 border-y-[8px] border-y-transparent ml-1"></div>
              )}
            </button>
          </div>
        )}

        {/* Audio Control Button */}
        {ad.videoUrl && (
          <button
            onClick={handleMuteToggle}
            className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all duration-200 z-20"
          >
            {isMuted ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        )}

        {/* Swipe Indicators - Positioned in video area */}
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold opacity-0"
             style={{ opacity: x.get() < -30 ? 1 : 0 }}>
          PASS
        </div>
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold opacity-0"
             style={{ opacity: x.get() > 30 ? 1 : 0 }}>
          LIKE
        </div>
      </div>

      {/* Content Section - Text only */}
      <div className="h-1/5 p-3 sm:p-4 flex flex-col justify-center">
        <div className="text-center">
          <h2 className="text-sm sm:text-lg font-bold text-gray-800 mb-1">{ad.pageName}</h2>
          <h3 className="text-xs sm:text-base font-semibold text-gray-700 mb-2">{ad.title}</h3>
          <p className="text-gray-600 text-xs line-clamp-2 mb-2">{ad.body}</p>
          
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div>
              <span className="font-semibold">First:</span> {formatDate(ad.firstSeen)}
            </div>
            <div>
              <span className="font-semibold">Last:</span> {formatDate(ad.lastSeen)}
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Action Buttons Section */}
      <div className="h-16 bg-gray-50 flex items-center justify-center space-x-6 px-4 rounded-b-2xl">
        <button
          onClick={() => onSwipe('left')}
          className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-red-600 transition-all duration-200 hover:scale-110 border-2 border-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <button
          onClick={() => onSwipe('right')}
          className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-green-600 transition-all duration-200 hover:scale-110 border-2 border-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
