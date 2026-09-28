'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_ASSETS } from '@/config/gameAssets';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';
import { PHASE3_UI_ASSETS } from '@/game/assets/phase3UiAssets';

export const RamyeonStation: React.FC = () => {
  const {
    ramyeonSession,
    dishes,
    startRamyeon,
    pourRamyeonWater,
    addRamyeonContents,
    tapEggCrack,
    finishRamyeon,
    discardRamyeon,
  } = useGameStore();

  const [selectedDish, setSelectedDish] = useState<'ramyeon' | 'cheese_ramyeon'>('ramyeon');

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 bg-stone-900/90 backdrop-blur-md rounded-3xl border-2 border-amber-600/50 shadow-xl overflow-hidden text-stone-100 select-none font-baloo">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-600/30 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 p-1 bg-stone-800 rounded-xl border border-amber-500/30 flex items-center justify-center">
            <GameAssetIcon name="pot" size={24} />
          </div>
          <div>
            <h3 className="font-black text-amber-200 text-xs sm:text-sm">
              Nồi Nhôm Vàng Ramyeon
            </h3>
            <span className="text-[10px] text-amber-400 font-semibold block">
              Đong Nước • Thả Mì • Đập Trứng
            </span>
          </div>
        </div>

        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full border shadow-inner bg-amber-950/80 border-amber-500/50 text-amber-300">
          {ramyeonSession.step === 'idle'
            ? 'Nồi Rảnh'
            : ramyeonSession.step === 'pouring_water'
            ? `Nước (${ramyeonSession.waterLevel}%)`
            : ramyeonSession.step === 'adding_contents'
            ? 'Thả Mì & Súp'
            : ramyeonSession.step === 'egg_crack_rhythm'
            ? `Gõ Trứng (${ramyeonSession.eggCrackTaps}/2)`
            : ramyeonSession.step === 'boiling'
            ? `Đang Sôi (${Math.ceil(ramyeonSession.boilProgress)}%)`
            : 'Mì Chín Tới'}
        </span>
      </div>

      {/* Visual Golden Pot Area using REAL ASSET */}
      <div className="flex-1 my-2 flex flex-col items-center justify-center relative min-h-[140px] bg-amber-950/30 rounded-2xl border-2 border-amber-600/40 shadow-inner overflow-hidden p-2">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <Image
            src={GAME_ASSETS.props.cooking_pot}
            alt="Nồi Ramyeon"
            width={140}
            height={140}
            className="w-full h-full object-contain pointer-events-none drop-shadow-xl"
          />

          {ramyeonSession.step === 'idle' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-amber-200/60 text-xs">
              <span className="text-[11px] font-bold">Nồi Nhôm Trống</span>
            </div>
          ) : (
            <div className="absolute inset-5 rounded-full flex flex-col items-center justify-center p-2 text-center bg-gradient-to-t from-red-600/90 via-orange-500/90 to-amber-400/90 shadow-inner overflow-hidden">
              <div className="w-8 h-8 relative mb-0.5">
                <Image
                  src={GAME_ASSETS.dishes.ramyeon}
                  alt="Ramyeon"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain drop-shadow"
                />
              </div>
              <span className="text-[10px] text-white font-black block leading-tight">
                {dishes[ramyeonSession.dishId || 'ramyeon']?.name}
              </span>
            </div>
          )}
        </div>

        {/* Water line progress during pouring step */}
        {ramyeonSession.step === 'pouring_water' && (
          <div className="w-full max-w-[260px] mt-2">
            <div className="flex justify-between text-[10px] font-black text-amber-200 mb-0.5">
              <span>Thiếu nước</span>
              <span className="text-blue-400">Mực Nước Chuẩn (75%)</span>
              <span>Đầy tràn</span>
            </div>
            <div className="w-full bg-stone-950 h-3 rounded-full overflow-hidden relative border border-stone-700 shadow-inner">
              <div className="absolute left-[70%] right-[20%] top-0 bottom-0 bg-blue-400/40 border-x-2 border-blue-400" />
              <div
                className="h-full bg-blue-500 transition-all duration-100"
                style={{ width: `${ramyeonSession.waterLevel}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls */}
      <div className="space-y-1.5">
        {ramyeonSession.step === 'idle' ? (
          <div>
            <div className="flex gap-1.5 mb-1.5">
              <button
                type="button"
                onClick={() => setSelectedDish('ramyeon')}
                className={`flex-1 py-1.5 px-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                  selectedDish === 'ramyeon'
                    ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-sm'
                    : 'bg-stone-800 border-stone-700 text-stone-400'
                }`}
              >
                Kim Chi Nóng (46 Xu)
              </button>
              {dishes.cheese_ramyeon?.isUnlocked && (
                <button
                  type="button"
                  onClick={() => setSelectedDish('cheese_ramyeon')}
                  className={`flex-1 py-1.5 px-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                    selectedDish === 'cheese_ramyeon'
                      ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-sm'
                      : 'bg-stone-800 border-stone-700 text-stone-400'
                  }`}
                >
                  Phô Mai Béo (58 Xu)
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => startRamyeon(selectedDish)}
              className="w-full flex items-center justify-center cursor-pointer active:scale-95 transition-all drop-shadow-md py-1"
              title="Bắt đầu nấu Ramyeon"
            >
              <Image
                src={PHASE3_UI_ASSETS.btn_cook_nau.src}
                alt="Nấu Ramyeon"
                width={PHASE3_UI_ASSETS.btn_cook_nau.width}
                height={PHASE3_UI_ASSETS.btn_cook_nau.height}
                className="h-10 w-auto object-contain pointer-events-none"
              />
            </button>
          </div>
        ) : ramyeonSession.step === 'pouring_water' ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => pourRamyeonWater(25)}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs rounded-2xl shadow-xl active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border border-blue-400/40"
            >
              <GameAssetIcon name="ladle" size={18} />
              <span>Đổ Nước Dashi Vào Nồi (+25%)</span>
            </button>
            <button
              type="button"
              onClick={discardRamyeon}
              className="p-2 rounded-2xl border border-stone-700 bg-stone-800/80 hover:bg-stone-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
              title="Hủy mẻ này"
            >
              <Image
                src={PHASE3_UI_ASSETS.ui_cancel_huy.src}
                alt="Hủy"
                width={PHASE3_UI_ASSETS.ui_cancel_huy.width}
                height={PHASE3_UI_ASSETS.ui_cancel_huy.height}
                className="h-6 w-auto object-contain pointer-events-none"
              />
            </button>
          </div>
        ) : ramyeonSession.step === 'adding_contents' ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addRamyeonContents}
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs rounded-2xl shadow-xl active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border border-amber-300/40"
            >
              <div className="w-5 h-5 relative">
                <Image
                  src={GAME_ASSETS.ingredients.mi_ramyeon}
                  alt="Mì Shin"
                  width={20}
                  height={20}
                  className="w-full h-full object-contain"
                />
              </div>
              <span>Thả Vắt Mì & Gói Súp Cay</span>
            </button>
            <button
              type="button"
              onClick={discardRamyeon}
              className="p-2 rounded-2xl border border-stone-700 bg-stone-800/80 hover:bg-stone-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
              title="Hủy mẻ này"
            >
              <Image
                src={PHASE3_UI_ASSETS.ui_cancel_huy.src}
                alt="Hủy"
                width={PHASE3_UI_ASSETS.ui_cancel_huy.width}
                height={PHASE3_UI_ASSETS.ui_cancel_huy.height}
                className="h-6 w-auto object-contain pointer-events-none"
              />
            </button>
          </div>
        ) : ramyeonSession.step === 'egg_crack_rhythm' ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={tapEggCrack}
              className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-stone-950 font-black text-xs rounded-2xl shadow-xl active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border border-yellow-300"
            >
              <div className="w-5 h-5 relative">
                <Image
                  src={GAME_ASSETS.ingredients.trung}
                  alt="Trứng gà"
                  width={20}
                  height={20}
                  className="w-full h-full object-contain"
                />
              </div>
              <span>Gõ Nhịp Đập Vỏ Trứng ({ramyeonSession.eggCrackTaps}/2)</span>
            </button>
            <button
              type="button"
              onClick={discardRamyeon}
              className="p-2 rounded-2xl border border-stone-700 bg-stone-800/80 hover:bg-stone-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
              title="Hủy mẻ này"
            >
              <Image
                src={PHASE3_UI_ASSETS.ui_cancel_huy.src}
                alt="Hủy"
                width={PHASE3_UI_ASSETS.ui_cancel_huy.width}
                height={PHASE3_UI_ASSETS.ui_cancel_huy.height}
                className="h-6 w-auto object-contain pointer-events-none"
              />
            </button>
          </div>
        ) : ramyeonSession.step === 'boiling' ? (
          <div className="w-full py-3 bg-amber-950/80 text-amber-200 font-black text-xs rounded-2xl text-center border-2 border-amber-500/50 animate-pulse shadow-md flex items-center justify-center gap-2">
            <GameAssetIcon name="fire" size={16} />
            <span>Nồi mì đang sôi sục... Chờ sợi mì nở chín tới!</span>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={finishRamyeon}
              className="flex-1 flex items-center justify-center cursor-pointer active:scale-95 transition-all drop-shadow-md py-1"
              title="Múc ra bát sẵn sàng giao"
            >
              <Image
                src={PHASE3_UI_ASSETS.btn_complete_hoan_tat.src}
                alt="Hoàn Tất"
                width={PHASE3_UI_ASSETS.btn_complete_hoan_tat.width}
                height={PHASE3_UI_ASSETS.btn_complete_hoan_tat.height}
                className="h-10 w-auto object-contain pointer-events-none"
              />
            </button>
            <button
              type="button"
              onClick={discardRamyeon}
              className="p-2 rounded-2xl border border-stone-700 bg-stone-800/80 hover:bg-stone-700 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
              title="Hủy mẻ này"
            >
              <Image
                src={PHASE3_UI_ASSETS.ui_cancel_huy.src}
                alt="Hủy"
                width={PHASE3_UI_ASSETS.ui_cancel_huy.width}
                height={PHASE3_UI_ASSETS.ui_cancel_huy.height}
                className="h-6 w-auto object-contain pointer-events-none"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
