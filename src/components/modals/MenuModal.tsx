'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/stores/useGameStore';
import { DishCategory } from '@/types/game';
import { GAME_ASSETS } from '@/game/assets/gameAssets';
import { restaurantLevelFromReputation } from '@/core/gameCore';
import { GameModal } from '@/components/ui/game/GameModal';
import { GameButton } from '@/components/ui/game/GameButton';

export const MenuModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    dishes,
    coins,
    inventory,
    reputationPoints,
    unlockDish,
  } = useGameStore();

  const [activeCategory, setActiveCategory] = useState<DishCategory>('main');

  if (activeModal !== 'menu') return null;

  const level = restaurantLevelFromReputation(reputationPoints);
  const dishList = Object.values(dishes).filter((dish) => dish.category === activeCategory);

  return (
    <GameModal
      title="Thực đơn"
      subtitle="Mở khóa món và xem chi phí nguyên liệu"
      onClose={() => setActiveModal('none')}
      maxWidth="max-w-3xl"
      icon={<span className="relative h-9 w-9"><Image src={GAME_ASSETS.navigation.menu} alt="" fill sizes="36px" className="object-contain" /></span>}
    >
      <div className="mb-3 flex items-center gap-2">
        {[
          { id: 'main', label: 'Món ăn' },
          { id: 'drink', label: 'Đồ uống' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveCategory(tab.id as DishCategory)}
            className={`min-h-[40px] rounded-xl border px-4 text-[11px] font-black transition active:scale-95 ${
              activeCategory === tab.id
                ? 'border-amber-300/50 bg-amber-600/70 text-white'
                : 'border-stone-700 bg-stone-900 text-stone-400 hover:bg-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {dishList.map((dish) => {
          const asset = (GAME_ASSETS.dishes as Record<string, string>)[dish.id];
          const ingredientCost = Object.entries(dish.requiredIngredients).reduce(
            (sum, [ingredientId, qty]) => sum + (inventory[ingredientId]?.baseCost || 0) * (qty || 0),
            0
          );
          const margin = dish.price - ingredientCost;
          const meetsLevel = level >= dish.unlockLevel;
          const canUnlock = !dish.isUnlocked && meetsLevel && coins >= dish.unlockCost;

          return (
            <article
              key={dish.id}
              className={`rounded-2xl border p-3 ${
                dish.isUnlocked
                  ? 'border-amber-500/20 bg-stone-900/65'
                  : 'border-stone-700 bg-black/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-amber-500/15 bg-black/20 p-1">
                  {asset ? (
                    <div className="relative h-12 w-12">
                      <Image src={asset} alt={dish.name} fill sizes="48px" className="object-contain" />
                    </div>
                  ) : (
                    <span className="text-center text-[8px] font-black text-red-300">Thiếu asset</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="text-xs font-black text-amber-100 sm:text-sm">{dish.name}</h3>
                    {dish.koreanName && (
                      <span className="rounded-full border border-stone-700 bg-stone-950/60 px-2 py-0.5 text-[9px] font-bold text-stone-400">
                        {dish.koreanName}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[10px] leading-relaxed text-stone-400">{dish.description}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-black">
                    <span className="text-amber-300">Bán {dish.price} Xu</span>
                    <span className="text-stone-500">Chi phí {ingredientCost} Xu</span>
                    <span className={margin >= 0 ? 'text-emerald-300' : 'text-red-300'}>
                      Lãi {margin >= 0 ? '+' : ''}{margin} Xu
                    </span>
                    <span className="text-stone-400">{dish.prepTime}s</span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {Object.entries(dish.requiredIngredients).map(([id, qty]) => {
                      const item = inventory[id];
                      const ingredientAsset =
                        (GAME_ASSETS.ingredients as Record<string, string>)[id] ||
                        (GAME_ASSETS.toppings as Record<string, string>)[id];
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 rounded-lg border border-stone-700 bg-black/20 px-2 py-1 text-[9px] font-bold text-stone-300"
                        >
                          {ingredientAsset && (
                            <span className="relative h-4 w-4">
                              <Image src={ingredientAsset} alt="" fill sizes="16px" className="object-contain" />
                            </span>
                          )}
                          {item?.vietnameseName || id} ×{qty}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="shrink-0">
                  {dish.isUnlocked ? (
                    <span className="inline-flex min-h-[40px] items-center rounded-xl border border-emerald-500/20 bg-emerald-950/45 px-3 text-[10px] font-black text-emerald-300">
                      Đang bán
                    </span>
                  ) : (
                    <GameButton compact disabled={!canUnlock} onClick={() => unlockDish(dish.id)}>
                      {meetsLevel ? `${dish.unlockCost} Xu` : `Cấp ${dish.unlockLevel}`}
                    </GameButton>
                  )}
                </div>
              </div>

              {dish.isUnlocked && dish.recipeSteps?.length > 0 && (
                <details className="mt-2 rounded-xl border border-stone-800 bg-black/20 px-3 py-2">
                  <summary className="cursor-pointer text-[10px] font-black text-amber-300">Xem quy trình nấu</summary>
                  <ol className="mt-2 list-decimal space-y-1 pl-4 text-[10px] leading-relaxed text-stone-400">
                    {dish.recipeSteps.map((step, index) => <li key={index}>{step}</li>)}
                  </ol>
                </details>
              )}
            </article>
          );
        })}
      </div>
    </GameModal>
  );
};
