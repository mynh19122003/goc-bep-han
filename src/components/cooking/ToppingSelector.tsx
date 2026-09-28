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
  const counts = selectedToppings.reduce<Record<string, number>>((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

  return (
    <section className="w-full">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="relative h-5 w-5">
            <Image src={GAME_ASSETS.props.condiment_tray} alt="" fill sizes="20px" className="object-contain" />
          </span>
          <h3 className="text-[10px] font-black uppercase tracking-wider text-amber-200 sm:text-[11px]">
            Topping
          </h3>
        </div>
        <span className="text-[9px] font-bold text-stone-500">Chạm để thêm • bấm − để bớt</span>
      </div>

      <div className="game-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-2">
        {allowedToppings.map((id) => {
          const item = inventory[id];
          const selected = counts[id] || 0;
          const remaining = Math.max(0, (item?.stock || 0) - selected);
          const unavailable = remaining <= 0;
          const asset =
            (GAME_ASSETS.toppings as Record<string, string>)[id] ||
            (GAME_ASSETS.ingredients as Record<string, string>)[id];

          return (
            <div key={id} className="relative w-[78px] shrink-0 snap-start sm:w-[90px]">
              <button
                type="button"
                disabled={disabled || unavailable}
                onClick={() => onAddTopping(id)}
                className={`relative flex h-[92px] w-full flex-col items-center justify-between rounded-2xl border p-1.5 transition active:scale-95 sm:h-[100px] ${
                  selected > 0
                    ? 'border-amber-300/55 bg-amber-950/65'
                    : 'border-stone-700 bg-stone-900/70 hover:border-amber-500/35'
                } ${unavailable ? 'cursor-not-allowed opacity-40 grayscale' : ''}`}
              >
                {selected > 0 && (
                  <span className="absolute right-1 top-1 min-w-[18px] rounded-full bg-red-600 px-1 text-[9px] font-black leading-[18px] text-white">
                    {selected}
                  </span>
                )}

                <div className="flex h-10 w-10 items-center justify-center sm:h-11 sm:w-11">
                  {asset ? (
                    <div className="relative h-9 w-9 sm:h-10 sm:w-10">
                      <Image src={asset} alt={item?.vietnameseName || id} fill sizes="40px" className="object-contain drop-shadow" />
                    </div>
                  ) : (
                    <span className="text-center text-[8px] font-black leading-tight text-red-300">Thiếu asset</span>
                  )}
                </div>

                <span className="line-clamp-2 min-h-[22px] max-w-full text-center text-[9px] font-black leading-tight text-amber-100 sm:text-[10px]">
                  {item?.vietnameseName || id}
                </span>

                <span className={`rounded-full border px-2 py-0.5 text-[9px] font-black ${
                  unavailable
                    ? 'border-red-900/40 bg-red-950/40 text-red-300'
                    : 'border-stone-700 bg-black/25 text-stone-300'
                }`}>
                  {unavailable ? 'Hết' : `x${remaining}`}
                </span>
              </button>

              {selected > 0 && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onRemoveTopping(id);
                  }}
                  className="absolute -left-1 -top-1 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-red-300/40 bg-red-700 text-[11px] font-black text-white shadow transition active:scale-90"
                  aria-label={`Bớt ${item?.vietnameseName || id}`}
                >
                  −
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
