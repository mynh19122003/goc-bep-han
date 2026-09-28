'use client';

import React from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_ASSETS } from '@/game/assets/gameAssets';
import { CloseButton } from '@/components/ui/game/CloseButton';
import { soundManager } from '@/utils/audio';

interface DishPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDish: (dishId: string) => void;
}

export const DishPicker: React.FC<DishPickerProps> = ({ isOpen, onClose, onSelectDish }) => {
  const { dishes } = useGameStore();

  if (!isOpen) return null;

  const dishList = Object.values(dishes);

  const choose = (dishId: string, unlocked: boolean) => {
    if (!unlocked) {
      soundManager.playError();
      return;
    }
    soundManager.playClick();
    onSelectDish(dishId);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end bg-black/70 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4">
        <button type="button" className="absolute inset-0" aria-label="Đóng chọn món" onClick={onClose} />

        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative z-10 flex h-[82dvh] w-full flex-col overflow-hidden rounded-t-3xl border-t border-amber-500/35 bg-[#1a1310]/98 text-stone-100 shadow-2xl sm:h-auto sm:max-h-[82vh] sm:max-w-[820px] sm:rounded-3xl sm:border"
        >
          <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-stone-600/70 sm:hidden" />

          <header className="flex items-center justify-between gap-2 border-b border-amber-500/20 px-3 py-3 sm:px-4">
            <div className="flex min-w-0 items-center gap-2">
              <span className="relative h-9 w-9 shrink-0">
                <Image src={GAME_ASSETS.navigation.menu} alt="" fill sizes="36px" className="object-contain" />
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-black uppercase text-amber-100">Nấu tự do</h3>
                <p className="truncate text-[10px] font-bold text-stone-400">Chọn một món đã mở khóa</p>
              </div>
            </div>
            <CloseButton onClick={onClose} />
          </header>

          <div className="game-scrollbar grid flex-1 grid-cols-2 gap-2 overflow-y-auto p-3 sm:grid-cols-3 sm:gap-3 sm:p-4 lg:grid-cols-4">
            {dishList.map((dish) => {
              const asset = (GAME_ASSETS.dishes as Record<string, string>)[dish.id];
              return (
                <button
                  key={dish.id}
                  type="button"
                  disabled={!dish.isUnlocked}
                  onClick={() => choose(dish.id, dish.isUnlocked)}
                  className={`relative flex min-h-[150px] flex-col items-center justify-between rounded-2xl border p-2.5 text-center transition ${
                    dish.isUnlocked
                      ? 'border-amber-500/25 bg-stone-900/70 hover:border-amber-300/55 hover:bg-stone-800/80 active:scale-95'
                      : 'cursor-not-allowed border-stone-800 bg-black/25 opacity-55'
                  }`}
                >
                  {!dish.isUnlocked && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-black/55">
                      <span className="rounded-full border border-stone-600 bg-stone-900 px-2 py-1 text-[9px] font-black text-stone-300">
                        Cần cấp {dish.unlockLevel}
                      </span>
                    </div>
                  )}

                  <div className="relative h-20 w-20 sm:h-24 sm:w-24">
                    {asset ? (
                      <Image src={asset} alt={dish.name} fill sizes="96px" className="object-contain drop-shadow" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-xl border border-red-900/40 text-[9px] font-black text-red-300">
                        Thiếu asset món
                      </div>
                    )}
                  </div>

                  <span className="mt-1 line-clamp-2 min-h-[30px] text-[11px] font-black leading-tight text-amber-100 sm:text-xs">
                    {dish.name}
                  </span>
                  <span className="mt-1 rounded-full border border-amber-500/20 bg-amber-950/40 px-2 py-0.5 text-[9px] font-black text-amber-300">
                    {dish.price} Xu
                  </span>
                </button>
              );
            })}
          </div>
        </motion.section>
      </div>
    </AnimatePresence>
  );
};
