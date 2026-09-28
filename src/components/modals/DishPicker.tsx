'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_ASSETS } from '@/game/assets/gameAssets';
import { GameIconButton } from '@/components/ui/game/GameIconButton';
import { soundManager } from '@/utils/audio';

interface DishPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDish: (dishId: string) => void;
}

export const DishPicker: React.FC<DishPickerProps> = ({
  isOpen,
  onClose,
  onSelectDish,
}) => {
  const { dishes, coins } = useGameStore();

  if (!isOpen) return null;

  const dishList = Object.values(dishes);

  const handlePickDish = (dishId: string, isUnlocked: boolean) => {
    if (!isUnlocked) {
      soundManager.playError();
      return;
    }
    soundManager.playClick();
    onSelectDish(dishId);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-sm select-none font-baloo">
        {/* Backdrop click */}
        <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-[760px] bg-stone-900 border-2 border-amber-600/70 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-stone-100"
        >
          {/* Header */}
          <div className="shrink-0 p-3 sm:p-4 border-b border-amber-600/40 bg-stone-950/90 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-600/20 border border-amber-400/40 p-1 flex items-center justify-center shrink-0">
                <Image
                  src="/assets/phase3-ui/tab_menu_thuc_don.png"
                  alt="Thực đơn"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain pointer-events-none"
                />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-amber-200 uppercase tracking-wide leading-tight">
                  CHỌN MÓN NẤU TỰ DO
                </h3>
                <span className="text-[11px] text-amber-300/80 font-bold block leading-none">
                  Sáng tạo món ăn & bày biện topping theo sở thích
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              title="Đóng chọn món"
              className="w-8 h-8 rounded-xl overflow-hidden cursor-pointer transition-transform active:scale-90"
            >
              <Image
                src="/assets/phase3-ui/ui_close_dong.png"
                alt="Đóng"
                width={32}
                height={32}
                className="w-full h-full object-contain pointer-events-none drop-shadow"
              />
            </button>
          </div>

          {/* Dish Grid: 2 per row on mobile, 3-4 per row on desktop */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
            {dishList.map((dish) => {
              const dishAsset =
                (GAME_ASSETS.dishes as Record<string, string>)[dish.id] ||
                GAME_ASSETS.dishes.ramyeon;
              const isUnlocked = dish.isUnlocked;

              return (
                <button
                  key={dish.id}
                  type="button"
                  onClick={() => handlePickDish(dish.id, isUnlocked)}
                  className={`relative rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-between border-2 transition-all cursor-pointer text-center ${
                    isUnlocked
                      ? 'bg-stone-850 hover:bg-stone-800 border-amber-500/40 hover:border-amber-400 shadow-md hover:shadow-amber-500/20 active:scale-95'
                      : 'bg-stone-950/60 border-stone-800 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {/* Lock Overlay if not unlocked */}
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-stone-950/75 rounded-2xl flex flex-col items-center justify-center p-2 z-10 backdrop-blur-[1px]">
                      <div className="h-6 w-auto aspect-[563/255] relative mb-1">
                        <Image
                          src="/assets/phase3-ui/btn_lock_khoa.png"
                          alt="Khóa"
                          width={563}
                          height={255}
                          className="h-full w-auto object-contain pointer-events-none"
                        />
                      </div>
                      <span className="text-[10px] font-black text-amber-400">
                        Cấp {dish.unlockLevel}
                      </span>
                    </div>
                  )}

                  {/* Food Image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 relative my-1 flex items-center justify-center shrink-0">
                    <Image
                      src={dishAsset}
                      alt={dish.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain pointer-events-none drop-shadow-md"
                    />
                  </div>

                  {/* Dish Name */}
                  <span className="text-xs sm:text-sm font-black text-amber-100 line-clamp-2 leading-tight min-h-[32px] flex items-center justify-center">
                    {dish.name}
                  </span>

                  {/* Price Tag */}
                  <div className="mt-1 flex items-center justify-center gap-1 text-[11px] font-black text-amber-300 bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-600/40 w-full">
                    <span>{dish.price} Xu</span>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
