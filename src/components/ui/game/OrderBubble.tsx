'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';
import { GAME_ASSETS } from '@/config/gameAssets';

interface OrderBubbleProps {
  dishName: string;
  dishId?: string;
  dishEmoji?: string;
  patiencePercent?: number;
  secondsRemaining?: number;
  className?: string;
  onServeClick?: () => void;
  canServe?: boolean;
}

export const OrderBubble: React.FC<OrderBubbleProps> = ({
  dishName,
  dishId,
  dishEmoji,
  patiencePercent = 100,
  secondsRemaining,
  className = '',
  onServeClick,
  canServe = false,
}) => {
  // Resolve real dish asset strictly, falling back to name keywords before any generic icon
  const getDishAsset = (): string | null => {
    const dishes = GAME_ASSETS.dishes as Record<string, string>;
    if (dishId && dishes[dishId]) return dishes[dishId];
    const lower = dishName.toLowerCase();
    if (lower.includes('tokbokki')) return dishes.tokbokki;
    if (lower.includes('ramyeon') || lower.includes('mì')) return dishes.spicy_ramyeon || dishes.ramyeon;
    if (lower.includes('kimbap')) return dishes.kimbap;
    if (lower.includes('canh') || lower.includes('kimchi')) return dishes.canh_kimchi;
    if (lower.includes('bibimbap') || lower.includes('cơm trộn')) return dishes.bibimbap;
    if (lower.includes('gà rán')) return dishes.ga_ran_han_quoc;
    if (lower.includes('phô mai que')) return dishes.pho_mai_que;
    if (lower.includes('mandu')) return dishes.mandu;
    if (lower.includes('bánh xèo')) return dishes.banh_xeo_han;
    if (lower.includes('cơm nắm')) return dishes.com_nam;
    if (lower.includes('trà đào')) return dishes.tra_dao;
    return dishes.ramyeon;
  };

  const dishAsset = getDishAsset();

  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`relative bg-[#FFFDF8] border-2 border-amber-400 rounded-2xl p-2 shadow-cozy flex flex-col justify-between select-none font-baloo ${className}`}
    >
      {/* Speech bubble beak / arrow pointing down */}
      <div className="absolute -bottom-2 left-6 w-3 h-3 bg-[#FFFDF8] border-r-2 border-b-2 border-amber-400 transform rotate-45" />

      {/* Dish Name & Icon */}
      <div className="flex items-center gap-1.5">
        <div className="w-6 h-6 relative shrink-0 flex items-center justify-center">
          {dishAsset ? (
            <Image
              src={dishAsset}
              alt={dishName}
              width={24}
              height={24}
              className="w-full h-full object-contain pointer-events-none drop-shadow-xs"
            />
          ) : (
            <GameAssetIcon name="bowl" size={20} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span className="font-black text-stone-900 text-xs truncate block leading-tight">
            {dishName}
          </span>
          {secondsRemaining !== undefined && (
            <span className="text-[10px] text-amber-800 font-bold block flex items-center gap-1">
              <GameAssetIcon name="clock" size={10} />
              <span>{Math.ceil(secondsRemaining)}s</span>
            </span>
          )}
        </div>
      </div>

      {/* Patience Progress Bar */}
      {patiencePercent !== undefined && (
        <div className="w-full bg-stone-200 h-1.5 rounded-full mt-1.5 overflow-hidden border border-stone-300">
          <div
            className={`h-full transition-all duration-200 ${
              patiencePercent < 30
                ? 'bg-red-500 animate-pulse'
                : patiencePercent < 60
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${patiencePercent}%` }}
          />
        </div>
      )}

      {/* Fast Serve Button */}
      {onServeClick && (
        <button
          type="button"
          onClick={onServeClick}
          disabled={!canServe}
          className={`w-full mt-1.5 py-1 rounded-xl font-black text-[11px] shadow-xs transition-all active:scale-95 ${
            canServe
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white cursor-pointer'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          {canServe ? 'Giao Món Này' : 'Đang chuẩn bị...'}
        </button>
      )}
    </motion.div>
  );
};
