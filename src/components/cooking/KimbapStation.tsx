'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { IngredientId } from '@/types/game';
import { GAME_ASSETS } from '@/config/gameAssets';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';

export const KimbapStation: React.FC = () => {
  const {
    kimbapSession,
    dishes,
    inventory,
    startKimbap,
    tapKimbapIngredient,
    advanceKimbapRoll,
    sliceKimbap,
    finishKimbap,
    discardKimbap,
  } = useGameStore();

  const [selectedDish, setSelectedDish] = useState<'kimbap_classic' | 'kimbap_cheese'>('kimbap_classic');

  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const getIngredientMeta = (id: IngredientId) => {
    const asset =
      (GAME_ASSETS.ingredients as Record<string, string>)[id] ||
      (GAME_ASSETS.toppings as Record<string, string>)[id];
    return {
      name: inventory[id]?.vietnameseName || id,
      asset,
    };
  };

  const nextRequired =
    kimbapSession.step === 'ingredients'
      ? kimbapSession.requiredIngredientsQueue[kimbapSession.placedIngredients.length]
      : null;

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 bg-stone-900/90 backdrop-blur-md rounded-3xl border-2 border-emerald-600/50 shadow-xl overflow-hidden text-stone-100 select-none font-baloo">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-600/30 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 p-1 bg-stone-800 rounded-xl border border-emerald-500/30 flex items-center justify-center">
            <GameAssetIcon name="board" size={24} />
          </div>
          <div>
            <h3 className="font-black text-amber-200 text-xs sm:text-sm">
              Mành Tre Kimbap
            </h3>
            <span className="text-[10px] text-emerald-400 font-semibold block">
              Xếp Nhân • Vuốt Cuộn • Cắt Khoanh
            </span>
          </div>
        </div>

        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full border shadow-inner bg-emerald-950/80 border-emerald-500/50 text-emerald-300">
          {kimbapSession.step === 'idle'
            ? 'Mành Rảnh'
            : kimbapSession.step === 'ingredients'
            ? `Nhân (${kimbapSession.placedIngredients.length}/${kimbapSession.requiredIngredientsQueue.length})`
            : kimbapSession.step === 'rolling'
            ? `Cuộn (${kimbapSession.rollProgress}%)`
            : kimbapSession.step === 'slicing'
            ? `Cắt (${kimbapSession.slicesMade}/8)`
            : 'Hoàn Tất'}
        </span>
      </div>

      {/* Visual Bamboo Mat Area using REAL ASSET */}
      <div
        className="flex-1 my-2 flex flex-col items-center justify-center relative min-h-[140px] bg-amber-950/30 rounded-2xl border-2 border-amber-600/40 shadow-inner overflow-hidden p-2 touch-none"
        onPointerDown={(event) => {
          pointerStart.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          if (!pointerStart.current) return;
          const deltaX = event.clientX - pointerStart.current.x;
          const deltaY = pointerStart.current.y - event.clientY;
          pointerStart.current = null;

          if (kimbapSession.step === 'rolling' && deltaY >= 24) {
            advanceKimbapRoll(34);
          } else if (
            kimbapSession.step === 'slicing' &&
            Math.abs(deltaX) >= 24
          ) {
            sliceKimbap();
          }
        }}
        onPointerCancel={() => {
          pointerStart.current = null;
        }}
      >
        <div className="relative w-36 h-36 flex items-center justify-center">
          <Image
            src={GAME_ASSETS.props.cutting_board}
            alt="Thớt Kimbap"
            width={140}
            height={140}
            className="w-full h-full object-contain pointer-events-none drop-shadow-xl"
          />

          {kimbapSession.step === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-amber-300/70 text-xs">
              <span className="text-[11px] font-bold">Mành Tre Trống</span>
            </div>
          )}

          {kimbapSession.step === 'ingredients' && (
            <div className="absolute inset-4 bg-stone-950/90 border border-stone-700 rounded-xl p-2 flex flex-wrap items-center justify-center gap-1">
              {kimbapSession.placedIngredients.map((id, idx) => {
                const meta = getIngredientMeta(id);
                return (
                  <div key={idx} className="w-6 h-6 relative animate-bounce-slight">
                    {meta?.asset && (
                      <Image
                        src={meta.asset}
                        alt={meta.name}
                        width={24}
                        height={24}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {kimbapSession.step === 'rolling' && (
            <motion.div
              animate={{ scale: [0.95, 1, 0.95] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <div className="w-28 h-10 bg-stone-950/90 border-2 border-amber-500/50 rounded-full shadow-2xl flex items-center justify-center text-amber-200 font-black text-xs">
                Cuộn ({kimbapSession.rollProgress}%)
              </div>
            </motion.div>
          )}

          {kimbapSession.step === 'slicing' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black border transition-all ${
                      idx < kimbapSession.slicesMade
                        ? 'bg-amber-500 border-amber-300 text-stone-950 shadow-sm'
                        : 'bg-stone-950 border-dashed border-stone-700 text-stone-600'
                    }`}
                  >
                    {idx < kimbapSession.slicesMade ? '✓' : '|'}
                  </div>
                ))}
              </div>
            </div>
          )}

          {kimbapSession.step === 'ready' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 relative mb-1">
                <Image
                  src={GAME_ASSETS.dishes.kimbap}
                  alt="Kimbap"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain drop-shadow"
                />
              </div>
              <span className="text-[10px] font-black text-emerald-300">8 Khoanh Kimbap Xong!</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="space-y-1.5">
        {kimbapSession.step === 'idle' ? (
          <div>
            <div className="flex gap-1.5 mb-1.5">
              <button
                type="button"
                onClick={() => setSelectedDish('kimbap_classic')}
                className={`flex-1 py-1.5 px-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                  selectedDish === 'kimbap_classic'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-sm'
                    : 'bg-stone-800 border-stone-700 text-stone-400'
                }`}
              >
                Kimbap Truyền Thống (42 Xu)
              </button>
              {dishes.kimbap_cheese?.isUnlocked && (
                <button
                  type="button"
                  onClick={() => setSelectedDish('kimbap_cheese')}
                  className={`flex-1 py-1.5 px-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                    selectedDish === 'kimbap_cheese'
                      ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-sm'
                      : 'bg-stone-800 border-stone-700 text-stone-400'
                  }`}
                >
                  Phô Mai (52 Xu)
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => startKimbap(selectedDish)}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 border border-emerald-400/40 cursor-pointer"
            >
              <GameAssetIcon name="board" size={18} />
              <span>Trải Rong Biển Lên Mành</span>
            </button>
          </div>
        ) : kimbapSession.step === 'ingredients' ? (
          <div>
            <span className="text-[10px] text-stone-300 font-bold block mb-1">
              Chạm thêm tiếp theo: <strong className="text-emerald-400 font-black">{nextRequired ? getIngredientMeta(nextRequired).name : ''}</strong>
            </span>
            <div className="grid grid-cols-5 gap-1">
              {Array.from(new Set(kimbapSession.requiredIngredientsQueue)).map((id) => {
                const meta = getIngredientMeta(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => tapKimbapIngredient(id)}
                    className={`p-1.5 rounded-xl border text-center transition-all active:scale-95 cursor-pointer flex flex-col items-center justify-between ${
                      nextRequired === id
                        ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-md animate-bounce-slight'
                        : 'bg-stone-950 border-stone-800 text-stone-400 opacity-60'
                    }`}
                  >
                    <div className="w-5 h-5 relative mb-0.5">
                      {meta?.asset && (
                        <Image
                          src={meta.asset}
                          alt={meta.name}
                          width={20}
                          height={20}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <span className="text-[9px] font-bold block truncate">{meta?.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : kimbapSession.step === 'rolling' ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => advanceKimbapRoll(35)}
              className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-700 hover:to-emerald-700 text-white font-black text-xs rounded-2xl shadow-xl active:scale-95 flex items-center justify-center gap-1 cursor-pointer border border-amber-300/40"
            >
              <span>Vuốt Lên Hoặc Bấm Để Cuộn (+34%)</span>
            </button>
            <button
              type="button"
              onClick={discardKimbap}
              className="min-w-[52px] px-3 py-2.5 rounded-2xl border border-red-900/60 bg-stone-800 text-red-300 hover:bg-red-950/40 hover:text-red-200 cursor-pointer font-black text-[10px] tracking-wide"
              title="Hủy mẻ này"
            >
              HỦY
            </button>
          </div>
        ) : kimbapSession.step === 'slicing' ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={sliceKimbap}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-2xl shadow-xl active:scale-95 flex items-center justify-center gap-1 cursor-pointer border border-emerald-300/40"
            >
              <GameAssetIcon name="knife" size={18} />
              <span>Vuốt Ngang Hoặc Bấm Để Cắt ({kimbapSession.slicesMade}/8)</span>
            </button>
            <button
              type="button"
              onClick={discardKimbap}
              className="min-w-[52px] px-3 py-2.5 rounded-2xl border border-red-900/60 bg-stone-800 text-red-300 hover:bg-red-950/40 hover:text-red-200 cursor-pointer font-black text-[10px] tracking-wide"
              title="Hủy mẻ này"
            >
              HỦY
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={finishKimbap}
              className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black text-xs rounded-2xl shadow-xl active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-300/40"
            >
              <GameAssetIcon name="complete" size={18} />
              <span>Cho Ra Đĩa Sẵn Sàng Giao</span>
            </button>
            <button
              type="button"
              onClick={discardKimbap}
              className="min-w-[52px] px-3 py-2.5 rounded-2xl border border-red-900/60 bg-stone-800 text-red-300 hover:bg-red-950/40 hover:text-red-200 cursor-pointer font-black text-[10px] tracking-wide"
              title="Hủy mẻ này"
            >
              HỦY
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
