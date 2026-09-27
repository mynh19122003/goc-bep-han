'use client';

import React from 'react';

interface GamePanelProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'wood' | 'cream' | 'dark';
  className?: string;
}

export const GamePanel: React.FC<GamePanelProps> = ({
  title,
  subtitle,
  icon,
  headerRight,
  children,
  variant = 'cream',
  className = '',
}) => {
  const panelStyles = {
    cream: 'bg-[#FFFDF9]/95 border-[#E8DCCF] text-stone-800 shadow-cozy',
    wood: 'bg-gradient-to-b from-[#451A03] to-[#2F1E15] border-[#8C5B3F] text-amber-100 shadow-cozy-lg',
    dark: 'bg-stone-900/95 border-stone-800 text-stone-100 shadow-2xl',
  };

  return (
    <div
      className={`rounded-3xl border-3 p-3 sm:p-4 flex flex-col justify-between font-baloo select-none ${panelStyles[variant]} ${className}`}
    >
      {(title || headerRight) && (
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-200/50">
          <div className="flex items-center gap-2">
            {icon && <span className="text-xl sm:text-2xl">{icon}</span>}
            <div>
              {title && (
                <h3 className="font-black text-sm sm:text-base leading-tight tracking-wide">
                  {title}
                </h3>
              )}
              {subtitle && (
                <span className="text-[10px] text-stone-500 font-semibold block">
                  {subtitle}
                </span>
              )}
            </div>
          </div>
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}

      <div className="flex-1 overflow-hidden flex flex-col">{children}</div>
    </div>
  );
};
