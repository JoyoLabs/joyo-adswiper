'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoCard from './VideoCard';
import { Ad } from '@/types/ad';

interface AdSwiperProps {
  ads: Ad[];
}

export default function AdSwiper({ ads }: AdSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedAds, setSwipedAds] = useState<Set<string>>(new Set());
  const [scores, setScores] = useState<Map<string, number>>(new Map());

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentAd = ads[currentIndex];
    if (currentAd) {
      setSwipedAds(prev => new Set([...prev, currentAd.id]));
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleScore = (score: number) => {
    const currentAd = ads[currentIndex];
    if (currentAd) {
      setScores(prev => new Map([...prev, [currentAd.id, score]]));
      // Go to next video immediately
      handleSwipe('right');
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSwipedAds(new Set());
    setScores(new Map());
  };

  const currentAd = ads[currentIndex];
  const nextAd = ads[currentIndex + 1];
  const hasMoreAds = currentIndex < ads.length - 1;

  if (ads.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">No ads available</h2>
          <p className="text-gray-500">Check your Airtable configuration and try again.</p>
        </div>
      </div>
    );
  }

  if (currentIndex >= ads.length) {
    const averageScore = scores.size > 0 
      ? Array.from(scores.values()).reduce((sum, score) => sum + score, 0) / scores.size 
      : 0;

    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">All caught up!</h2>
          <p className="text-gray-500 mb-2">You've scored {scores.size} ads</p>
          {scores.size > 0 && (
            <p className="text-gray-500 mb-6">
              Average score: <span className="font-semibold text-primary-600">{averageScore.toFixed(1)}/10</span>
            </p>
          )}
          <button
            onClick={handleReset}
            className="bg-primary-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-600 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <AnimatePresence>
        {currentAd && (
          <motion.div
            key={currentAd.id}
            className="absolute inset-0"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <VideoCard
              ad={currentAd}
              onSwipe={handleSwipe}
              onScore={handleScore}
              isActive={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next card preview */}
      {nextAd && (
        <motion.div
          className="absolute inset-0 scale-95 opacity-50 -z-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 0.95, opacity: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          <VideoCard
            ad={nextAd}
            onSwipe={() => {}}
            onScore={() => {}}
            isActive={false}
          />
        </motion.div>
      )}


    </div>
  );
}
