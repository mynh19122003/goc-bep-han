'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { DishCategory } from '@/types/game';
import { GAME_ASSETS } from '@/config/gameAssets';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';

export const MenuModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    dishes,
    coins,
    inventory,
    unlockDish,
  } = useGameStore();

  const [activeCategory, setActiveCategory] = useState<DishCategory>('main');

  if (activeModal !== 'menu') return null;

  const dishList = Object.values(dishes).filter((d) => d.category === activeCategory);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none font-baloo">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="bg-stone-900 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border-4 border-amber-600/60 relative flex flex-col max-h-[90vh] text-stone-100"
        >
          {/* Close button (Phase 3 PNG: ui_close_dong.png) */}
          <button
            type="button"
            onClick={() => setActiveModal('none')}
            title="Đóng thực đơn"
            className="absolute top-4 right-4 w-8 h-8 rounded-xl overflow-hidden cursor-pointer transition-transform active:scale-90 z-20"
          >
            <Image
              src="/assets/phase3-ui/ui_close_dong.png"
              alt="Đóng"
              width={32}
              height={32}
              className="w-full h-full object-contain pointer-events-none drop-shadow"
            />
          </button>

          {/* Modal Header (Phase 3 PNG: tab_menu_thuc_don.png) */}
          <div className="flex items-center gap-2.5 mb-4 pr-10">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 p-1 flex items-center justify-center shrink-0">
              <Image
                src="/assets/phase3-ui/tab_menu_thuc_don.png"
                alt="Thực đơn"
                width={40}
                height={40}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-200 tracking-wide uppercase">
                THỰC ĐƠN & MỞ KHÓA MÓN
              </h2>
              <p className="text-[11px] text-amber-300/80 font-bold">
                Khám phá công thức món Hàn & mở rộng menu quán
              </p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 mb-4 border-b border-stone-800 pb-2">
            {[
              { id: 'main', label: 'Món Nóng Bếp Hàn' },
              { id: 'drink', label: 'Đồ Uống Giải Khát' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id as DishCategory)}
                className={`py-1.5 px-4 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md border border-amber-300'
                    : 'bg-stone-800 hover:bg-stone-750 text-stone-400 border border-stone-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dish List */}
          <div className="overflow-y-auto space-y-3 pr-1 flex-1">
            {dishList.map((dish) => {
              const canUnlock = coins >= dish.unlockCost && !dish.isUnlocked;
              const dishAsset =
                (GAME_ASSETS.dishes as Record<string, string>)[dish.id] ||
                GAME_ASSETS.dishes.ramyeon;

              return (
                <div
                  key={dish.id}
                  className={`border-2 rounded-2xl p-3 sm:p-4 transition-all ${
                    dish.isUnlocked
                      ? 'bg-stone-950/70 border-amber-500/40 shadow-md'
                      : 'bg-stone-950/40 border-dashed border-stone-800 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Dish Icon & Title */}
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 p-1.5 bg-stone-800 rounded-2xl border border-amber-500/30 shadow-inner flex items-center justify-center shrink-0">
                        <Image
                          src={dishAsset}
                          alt={dish.name}
                          width={44}
                          height={44}
                          className="w-full h-full object-contain pointer-events-none drop-shadow"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-amber-100 text-sm sm:text-base">
                            {dish.name}
                          </h4>
                          <span className="text-[11px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-md">
                            {dish.koreanName}
                          </span>
                        </div>
                        <p className="text-xs text-stone-300 mt-0.5">{dish.description}</p>

                        <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
                          <span className="text-amber-400 flex items-center gap-1 font-black">
                            <GameAssetIcon name="coin" size={14} />
                            Giá bán: {dish.price} Xu
                          </span>
                          <span className="text-stone-600">|</span>
                          <span className="text-stone-400 flex items-center gap-1">
                            <GameAssetIcon name="clock" size={14} />
                            Nấu trong: {dish.prepTime}s
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Unlock Action or Status */}
                    <div className="shrink-0">
                      {dish.isUnlocked ? (
                        <div className="h-8 aspect-[375/199] relative flex items-center justify-center">
                          <Image
                            src="/assets/phase3-ui/status_perfect_hoan_hao.png"
                            alt="Đang Phục Vụ"
                            width={375}
                            height={199}
                            className="h-full w-auto object-contain pointer-events-none drop-shadow-sm"
                          />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => unlockDish(dish.id)}
                          disabled={!canUnlock}
                          title={`Mở khóa món ${dish.name} (${dish.unlockCost} Xu)`}
                          className={`h-8 sm:h-9 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            canUnlock
                              ? 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400 active:scale-95'
                              : 'bg-stone-800/80 border border-stone-700 opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <div className="h-6 w-auto aspect-[593/295] relative">
                            <Image
                              src={canUnlock ? '/assets/phase3-ui/btn_open_mo.png' : '/assets/phase3-ui/btn_lock_khoa.png'}
                              alt={canUnlock ? 'Mở Khóa' : 'Khóa'}
                              width={593}
                              height={295}
                              className="h-full w-auto object-contain pointer-events-none"
                            />
                          </div>
                          <span className="text-xs font-black text-amber-300">
                            {dish.unlockCost} Xu
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Required Ingredients */}
                  <div className="mt-3 pt-2.5 border-t border-stone-800 flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                      Nguyên liệu cần:
                    </span>
                    {Object.entries(dish.requiredIngredients).map(([ingId, qty]) => {
                      const ing = inventory[ingId];
                      const ingAsset =
                        (GAME_ASSETS.ingredients as Record<string, string>)[ingId] ||
                        (GAME_ASSETS.toppings as Record<string, string>)[ingId];

                      return (
                        <span
                          key={ingId}
                          className="inline-flex items-center gap-1 text-[11px] font-bold bg-stone-900 border border-stone-700 px-2 py-0.5 rounded-lg text-stone-200"
                        >
                          {ingAsset && (
                            <Image
                              src={ingAsset}
                              alt={ing?.vietnameseName || ingId}
                              width={14}
                              height={14}
                              className="w-3.5 h-3.5 object-contain"
                            />
                          )}
                          <span>{ing?.vietnameseName}</span>
                          <span className="text-amber-400 font-black">x{qty}</span>
                        </span>
                      );
                    })}
                  </div>

                  {/* Cooking Steps Guide */}
                  {dish.isUnlocked && dish.recipeSteps && (
                    <div className="mt-2.5 bg-amber-950/40 border border-amber-600/30 rounded-xl p-2.5 text-xs text-stone-200">
                      <span className="font-black text-amber-300 block mb-1">
                        Quy trình chế biến chuẩn:
                      </span>
                      <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-amber-100/80">
                        {dish.recipeSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
