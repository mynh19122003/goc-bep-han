'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GAME_ASSETS } from '@/game/assets/gameAssets';

interface OrderBubbleProps {
  dishName: string;
  dishId?: string;
  dishEmoji?: string;
  patiencePercent?: number;
  secondsRemaining?: number;
  className?: string;
  onServeClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  canServe?: boolean;
}

export const OrderBubble: React.FC<OrderBubbleProps> = ({
  dishName,
  dishId,
  patiencePercent = 100,
  secondsRemaining,
  className = '',
  onServeClick,
  canServe = false,
}) => {
  const dishAsset = dishId
    ? (GAME_ASSETS.dishes as Record<string, string>)[dishId] || null
    : null;

  return (
    <motion.div
      initial={{ scale: 0.94, opacity: 0, y: 4 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      className={`relative flex min-h-[54px] flex-col justify-between rounded-2xl border border-amber-400/70 bg-[#fffaf1] p-2 text-stone-900 shadow-lg ${className}`}
    >
      <span className="absolute -bottom-1.5 left-7 h-3 w-3 rotate-45 border-b border-r border-amber-400/70 bg-[#fffaf1]" />

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100/80">
          {dishAsset ? (
            <div className="relative h-7 w-7">
              <Image src={dishAsset} alt={dishName} fill sizes="28px" className="object-contain" />
            </div>
          ) : (
            <div className="relative h-7 w-7 opacity-60">
              <Image src={GAME_ASSETS.cooking.bowl} alt="" fill sizes="28px" className="object-contain" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <span className="block truncate text-[11px] font-black leading-tight sm:text-xs">{dishName}</span>
          {secondsRemaining !== undefined && (
            <span className="mt-0.5 block text-[9px] font-black text-amber-800">
              Còn {Math.ceil(secondsRemaining)}s
            </span>
          )}
        </div>
      </div>

      {patiencePercent !== undefined && (
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-stone-200">
          <div
            className={`h-full rounded-full transition-all duration-200 ${
              patiencePercent < 30
                ? 'bg-red-500'
                : patiencePercent < 60
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${patiencePercent}%` }}
          />
        </div>
      )}

      {onServeClick && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onServeClick(event);
          }}
          disabled={!canServe}
          className={`mt-1.5 min-h-[30px] w-full rounded-lg text-[9px] font-black transition active:scale-95 ${
            canServe
              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
              : 'cursor-not-allowed bg-stone-200 text-stone-400'
          }`}
        >
          {canServe ? 'Giao món' : 'Chưa nấu xong'}
        </button>
      )}
    </motion.div>
  );
};
