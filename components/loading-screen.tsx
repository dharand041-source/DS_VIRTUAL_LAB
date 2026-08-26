'use client';

import React, { useEffect, useState } from 'react';
import LoadingLines from '@/components/ui/loading-lines';

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Show loading screen for 2.6s and smoothly fade out
    const timer = setTimeout(() => {
      setFade(true);
      const removeTimer = setTimeout(() => {
        setIsVisible(false);
      }, 500);
      return () => clearTimeout(removeTimer);
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#09090b] flex flex-col items-center justify-center transition-opacity duration-500 select-none ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center justify-center">
        <LoadingLines />
      </div>
    </div>
  );
}

export default LoadingScreen;
