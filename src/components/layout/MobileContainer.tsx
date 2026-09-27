'use client';

import React from 'react';

interface MobileContainerProps {
  children: React.ReactNode;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({ children }) => {
  return (
    <div className="w-full min-h-screen bg-stone-900 flex justify-center items-center p-0 sm:p-4 select-none">
      {/* 9:16 Aspect Ratio Phone Frame on Desktop / Full Screen on Mobile */}
      <div className="w-full max-w-[440px] h-[100dvh] sm:h-[900px] sm:max-h-[95vh] bg-kitchen-pattern text-stone-900 flex flex-col justify-between relative shadow-2xl sm:rounded-[40px] sm:border-[8px] sm:border-stone-800 overflow-hidden">
        {/* Subtle Phone Notch / Speaker Bar on Desktop */}
        <div className="hidden sm:block absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-stone-800 rounded-full z-50 shadow-inner" />

        {/* Content Body */}
        <div className="w-full h-full flex flex-col overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
};
