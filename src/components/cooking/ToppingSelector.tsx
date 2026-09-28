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
        <span className="text-[9px] font-bold text-stone-500">Chạm để thêm • Bỏ bớt bên dưới</span>
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
            <div key={id} className="w-[82px] shrink-0 snap-start sm:w-[94px]">
              <button
                type="button"
                disabled={disabled || unavailable}
                onClick={() => onAddTopping(id)}
                className={`relative flex h-[104px] w-full flex-col items-center justify-between rounded-2xl border p-1.5 transition active:scale-95 ${
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

                <div className="flex h-12 w-12 items-center justify-center">
                  {asset ? (
                    <div className="relative h-11 w-11">
                      <Image src={asset} alt={item?.vietnameseName || id} fill sizes="44px" className="object-contain drop-shadow" />
                    </div>
                  ) : (
                    <span className="text-center text-[8px] font-black leading-tight text-red-300">Thiếu asset</span>
                  )}
                </div>

                <span className="line-clamp-2 min-h-[24px] max-w-full text-center text-[10px] font-black leading-tight text-amber-100">
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
                  onClick={() => onRemoveTopping(id)}
                  className="mt-1 w-full rounded-lg py-1 text-[9px] font-black text-red-300 transition hover:bg-red-950/30 active:scale-95"
                >
                  Bỏ bớt
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
