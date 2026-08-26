'use client';

import React from "react";

export const LoadingLines: React.FC = () => {
  const letters = "Loading".split("");

  return (
    <div className="relative flex items-center justify-center h-[120px] w-auto m-8 font-sans text-[1.6em] font-semibold select-none text-white scale-[2]">
      {/* Animated letters */}
      {letters.map((letter, idx) => (
        <span
          key={idx}
          className="relative inline-block opacity-0 z-[2] animate-[letterAnim_4s_linear_infinite] text-white dark:text-white"
          style={{ animationDelay: `${0.1 + idx * 0.105}s` }}
        >
          {letter}
        </span>
      ))}

      {/* Loader background */}
      <div 
        className="absolute top-0 left-0 w-full h-full z-[1] bg-transparent"
        style={{
          maskImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 6px, black 7px, black 8px)',
          WebkitMaskImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 6px, black 7px, black 8px)'
        }}
      >
        <div 
          className="absolute top-0 left-0 w-full h-full animate-[transformAnim_2s_infinite_alternate_cubic-bezier(0.6,0.8,0.5,1),opacityAnim_4s_infinite]"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, #ff0 0%, transparent 50%), radial-gradient(circle at 45% 45%, #f00 0%, transparent 45%), radial-gradient(circle at 55% 55%, #0ff 0%, transparent 45%), radial-gradient(circle at 45% 55%, #0f0 0%, transparent 45%), radial-gradient(circle at 55% 45%, #00f 0%, transparent 45%)',
            maskImage: 'radial-gradient(circle at 50% 50%, transparent 0%, transparent 10%, black 25%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 0%, transparent 10%, black 25%)'
          }}
        />
      </div>

      <style>{`
        @keyframes transformAnim {
          0% {
            transform: translate(-55%);
          }
          100% {
            transform: translate(55%);
          }
        }

        @keyframes opacityAnim {
          0%,
          100% {
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          65% {
            opacity: 0;
          }
        }

        @keyframes letterAnim {
          0% {
            opacity: 0;
          }
          5% {
            opacity: 1;
            text-shadow: 0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.4);
            transform: scale(1.1) translateY(-2px);
          }
          20% {
            opacity: 0.2;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingLines;
