'use client';

import React from 'react';
import Image from 'next/image';
import { IngredientId, Ingredient } from '@/types/game';
import { GAME_ASSETS } from '@/game/assets/gameAssets';

interface ToppingSelectorProps {
  allowedToppings: IngredientId[];
  selectedToppings: IngredientId[];
  onAddTopping: (toppingId: IngredientId) => void;
  onRemoveTopping: (toppingId: IngredientId) => void;
  inventory: Record<string, Ingredient>;
  disabled?: boolean;
}

export const ToppingSelector: React.FC<ToppingSelectorProps> = ({
  allowedToppings,
  selectedToppings,
  onAddTopping,
  onRemoveTopping,
  inventory,
  disabled = false,
}) => {
  // Count how many of each topping are currently selected in this session
  const selectionCounts = selectedToppings.reduce<Record<string, number>>((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="w-full select-none font-baloo">
      {/* Header Label */}
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 relative shrink-0">
            <Image
              src={GAME_ASSETS.props.condiment_tray}
              alt="Khay topping"
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
          <span className="text-xs sm:text-sm font-black text-amber-200 uppercase tracking-wide">
            KHAY TOPPING TƯƠI NGON
          </span>
        </div>
        <span className="text-[11px] font-bold text-amber-300/80">
          Chạm để thêm vào món
        </span>
      </div>

      {/* Horizontal Scroll Topping Bar: Cards min 76-90px on mobile, 80-105px on desktop, flex: 0 0 auto */}
      <div className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-2 px-1 scrollbar-thin scrollbar-thumb-amber-600/40">
        {allowedToppings.map((toppingId) => {
          const item = inventory[toppingId];
          const stock = item ? item.stock : 0;
          const currentCount = selectionCounts[toppingId] || 0;
          const remainingStock = Math.max(0, stock - currentCount);
          const isOutOfStock = remainingStock <= 0;
          const isSelected = currentCount > 0;

          // Asset resolution
          const assetSrc =
            (GAME_ASSETS.toppings as Record<string, string>)[toppingId] ||
            (GAME_ASSETS.ingredients as Record<string, string>)[toppingId] ||
            GAME_ASSETS.ingredients.trung;

          const displayName = item ? item.vietnameseName : toppingId;

          return (
            <div
              key={toppingId}
              className="flex-shrink-0 flex flex-col items-center"
              style={{ flex: '0 0 auto' }}
            >
              <button
                type="button"
                disabled={disabled || isOutOfStock}
                onClick={() => onAddTopping(toppingId)}
                title={`${displayName} (Còn ${remainingStock})`}
                className={`relative w-[76px] sm:w-[92px] h-[96px] sm:h-[108px] rounded-2xl p-1.5 flex flex-col items-center justify-between border-2 transition-all duration-150 cursor-pointer shadow-md ${
                  isSelected
                    ? 'bg-amber-950/90 border-amber-400 shadow-amber-500/20 scale-[1.03]'
                    : 'bg-stone-900/90 hover:bg-stone-850 border-amber-600/50 hover:border-amber-400'
                } ${
                  isOutOfStock
                    ? 'opacity-40 grayscale cursor-not-allowed border-stone-700'
                    : 'active:scale-95'
                }`}
              >
                {/* Selected count badge in corner (does not block food view) */}
                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-stone-900 animate-bounce-slight z-10">
                    +{currentCount}
                  </span>
                )}

                {/* Topping Image Asset */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 relative flex items-center justify-center shrink-0 my-auto">
                  <Image
                    src={assetSrc}
                    alt={displayName}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain pointer-events-none drop-shadow-sm"
                    draggable={false}
                  />
                </div>

                {/* Topping Name with 2-line clamp to prevent ugly clipping */}
                <span className="text-[11px] font-black text-amber-100 text-center leading-tight line-clamp-2 max-w-full px-0.5">
                  {displayName}
                </span>

                {/* Stock Counter Pill at bottom */}
                <div className="w-full flex items-center justify-center mt-0.5">
                  <span
                    className={`text-[10px] font-black px-2 py-0.2 rounded-full border ${
                      isOutOfStock
                        ? 'bg-red-950 text-red-300 border-red-800'
                        : isSelected
                        ? 'bg-amber-400 text-stone-950 border-amber-300'
                        : 'bg-stone-950/80 text-amber-300 border-amber-600/40'
                    }`}
                  >
                    {isOutOfStock ? 'Hết' : `x${remainingStock}`}
                  </span>
                </div>
              </button>

              {/* Remove button if selected */}
              {isSelected && (
                <button
                  type="button"
                  onClick={() => onRemoveTopping(toppingId)}
                  className="mt-1 text-[10px] font-bold text-red-400 hover:text-red-300 underline active:scale-90 cursor-pointer"
                >
                  Bỏ bớt
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
