'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_ASSETS } from '@/config/gameAssets';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';

export const TokbokkiStation: React.FC = () => {
  const {
    tokbokkiSession,
    dishes,
    startTokbokki,
    addTokbokkiSauceSpoon,
    setTokbokkiStirring,
    flipTokbokkiPan,
    finishTokbokki,
    discardTokbokki,
  } = useGameStore();

  const [selectedDish, setSelectedDish] = useState<'tokbokki' | 'cheese_tokbokki'>('tokbokki');

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 bg-stone-900/90 backdrop-blur-md rounded-3xl border-2 border-amber-600/50 shadow-xl overflow-hidden text-stone-100 select-none font-baloo">
      {/* Station Title */}
      <div className="flex items-center justify-between border-b border-amber-600/30 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 p-1 bg-stone-800 rounded-xl border border-amber-500/30 flex items-center justify-center">
            <GameAssetIcon name="pan" size={24} />
          </div>
          <div>
            <h3 className="font-black text-amber-200 text-xs sm:text-sm">
              Chảo Tokbokki Thủ Công
            </h3>
            <span className="text-[10px] text-amber-400 font-semibold block">
              Pha Sốt & Canh Nhiệt Độ Lửa
            </span>
          </div>
        </div>

        {/* Status pill */}
        <span
          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border shadow-inner ${
            tokbokkiSession.status === 'idle'
              ? 'bg-stone-800 border-stone-700 text-stone-400'
              : tokbokkiSession.status === 'sauce_ratio'
              ? 'bg-amber-950/80 border-amber-500 text-amber-300 animate-pulse'
              : tokbokkiSession.status === 'cooking_stir'
              ? 'bg-red-950/80 border-red-500 text-red-300 animate-pulse'
              : tokbokkiSession.status === 'perfect'
              ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
              : 'bg-stone-950 text-red-400 border-red-800'
          }`}
        >
          {tokbokkiSession.status === 'idle'
            ? 'Chảo Rảnh'
            : tokbokkiSession.status === 'sauce_ratio'
            ? 'Bước 1: Cân Sốt'
            : tokbokkiSession.status === 'cooking_stir'
            ? 'Bước 2: Giữ & Khuấy'
            : tokbokkiSession.status === 'perfect'
            ? 'Hoàn Hảo'
            : 'Đã Khét'}
        </span>
      </div>

      {/* Center Interactive Pan Area */}
      <div className="flex-1 my-2 flex flex-col items-center justify-center relative min-h-[140px]">
        {/* Cast Iron Skillet Visual using REAL ASSET */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <Image
            src={GAME_ASSETS.props.frying_pan}
            alt="Chảo Tokbokki"
            width={140}
            height={140}
            className="w-full h-full object-contain pointer-events-none drop-shadow-xl"
          />

          {tokbokkiSession.status !== 'idle' && (
            <div
              className={`absolute inset-4 rounded-full flex flex-col items-center justify-center p-2 text-center transition-all ${
                tokbokkiSession.status === 'burned'
                  ? 'bg-stone-950/90 text-stone-500'
                  : 'bg-gradient-to-tr from-red-600/90 via-orange-600/90 to-amber-500/90 shadow-inner'
              }`}
            >
              <div className="w-8 h-8 relative mb-0.5">
                <Image
                  src={GAME_ASSETS.dishes.tokbokki}
                  alt="Tokbokki"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain drop-shadow"
                />
              </div>
              <span className="text-[10px] text-white font-black block leading-tight">
                {dishes[tokbokkiSession.dishId || 'tokbokki']?.name}
              </span>
            </div>
          )}

          {tokbokkiSession.status === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-amber-200/60 text-xs">
              <span className="text-[11px] font-bold">Chảo Chưa Bật Lửa</span>
            </div>
          )}
        </div>

        {/* Heat Needle Meter during stir step */}
        {tokbokkiSession.status === 'cooking_stir' && (
          <div className="w-full max-w-[280px] mt-2">
            <div className="flex justify-between text-[10px] font-black text-amber-200 mb-0.5">
              <span>Sống bánh</span>
              <span className="text-emerald-400">VÙNG HOÀN HẢO (50-80)</span>
              <span className="text-red-400">Khét!</span>
            </div>
            <div className="w-full bg-stone-950 h-3 rounded-full overflow-hidden relative border border-stone-700 shadow-inner">
              {/* Green target zone */}
              <div className="absolute left-[50%] right-[20%] top-0 bottom-0 bg-emerald-500/40 border-x-2 border-emerald-400" />
              {/* Needle pointer */}
              <div
                className={`h-full transition-all duration-75 ${
                  tokbokkiSession.heatNeedle >= 50 && tokbokkiSession.heatNeedle <= 80
                    ? 'bg-emerald-400'
                    : tokbokkiSession.heatNeedle > 80
                    ? 'bg-red-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${tokbokkiSession.heatNeedle}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Thumb Controls */}
      <div className="space-y-1.5">
        {tokbokkiSession.status === 'idle' ? (
          <div>
            <div className="flex gap-1.5 mb-1.5">
              <button
                type="button"
                onClick={() => setSelectedDish('tokbokki')}
                className={`flex-1 py-1.5 px-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                  selectedDish === 'tokbokki'
                    ? 'bg-red-950/80 border-red-500 text-red-200 shadow-sm'
                    : 'bg-stone-800 border-stone-700 text-stone-400'
                }`}
              >
                Cay Ngọt (38 Xu)
              </button>
              {dishes.cheese_tokbokki?.isUnlocked && (
                <button
                  type="button"
                  onClick={() => setSelectedDish('cheese_tokbokki')}
                  className={`flex-1 py-1.5 px-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                    selectedDish === 'cheese_tokbokki'
                      ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-sm'
                      : 'bg-stone-800 border-stone-700 text-stone-400'
                  }`}
                >
                  Phô Mai (54 Xu)
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => startTokbokki(selectedDish)}
              className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-black text-xs rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 border border-amber-400/30 cursor-pointer"
            >
              <GameAssetIcon name="fire" size={18} />
              <span>Cho Bánh Gạo Vào Chảo</span>
            </button>
          </div>
        ) : tokbokkiSession.status === 'sauce_ratio' ? (
          <div>
            <div className="grid grid-cols-3 gap-1.5 mb-1.5">
              <button
                type="button"
                onClick={() => addTokbokkiSauceSpoon('gochujang')}
                className="py-1 px-1.5 bg-stone-950/80 hover:bg-stone-900 border border-red-500/50 rounded-xl text-center active:scale-95 cursor-pointer shadow-sm flex flex-col items-center"
              >
                <div className="w-5 h-5 relative mb-0.5">
                  <Image
                    src={GAME_ASSETS.ingredients.tuong_ot_gochujang}
                    alt="Tương ớt"
                    width={20}
                    height={20}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs font-bold text-red-400 block">Tương ớt</span>
                <span className="text-[10px] font-black text-red-300">
                  +{tokbokkiSession.gochujangSpoons}
                </span>
              </button>

              <button
                type="button"
                onClick={() => addTokbokkiSauceSpoon('soySauce')}
                className="py-1 px-1.5 bg-stone-950/80 hover:bg-stone-900 border border-amber-500/50 rounded-xl text-center active:scale-95 cursor-pointer shadow-sm flex flex-col items-center"
              >
                <div className="w-5 h-5 relative mb-0.5">
                  <Image
                    src={GAME_ASSETS.ingredients.nuoc_tuong}
                    alt="Nước tương"
                    width={20}
                    height={20}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs font-bold text-amber-400 block">Nước tương</span>
                <span className="text-[10px] font-black text-amber-300">
                  +{tokbokkiSession.soySauceSpoons}
                </span>
              </button>

              <button
                type="button"
                onClick={() => addTokbokkiSauceSpoon('sugar')}
                className="py-1 px-1.5 bg-stone-950/80 hover:bg-stone-900 border border-pink-500/50 rounded-xl text-center active:scale-95 cursor-pointer shadow-sm flex flex-col items-center"
              >
                <div className="w-5 h-5 relative mb-0.5">
                  <Image
                    src={GAME_ASSETS.ingredients.duong}
                    alt="Đường"
                    width={20}
                    height={20}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs font-bold text-pink-400 block">Đường</span>
                <span className="text-[10px] font-black text-pink-300">
                  +{tokbokkiSession.sugarSpoons}
                </span>
              </button>
            </div>

            {/* Hold to Stir Button */}
            <button
              type="button"
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                setTokbokkiStirring(true);
              }}
              onPointerUp={(event) => {
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }
                setTokbokkiStirring(false);
              }}
              onPointerCancel={() => setTokbokkiStirring(false)}
              onPointerLeave={() => setTokbokkiStirring(false)}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 active:scale-95 text-white font-black text-xs rounded-2xl shadow-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer touch-none border border-amber-300/40"
            >
              <GameAssetIcon name="fire" size={18} />
              <span>CHẠM GIỮ ĐỂ BẬT LỬA & KHUẤY CHẢO</span>
            </button>
          </div>
        ) : tokbokkiSession.status === 'cooking_stir' ? (
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={flipTokbokkiPan}
                className="py-3 font-black text-xs rounded-2xl shadow-xl active:scale-95 bg-orange-700 hover:bg-orange-600 text-white border border-amber-300/30 cursor-pointer"
              >
                LẬT CHẢO ({tokbokkiSession.flipCount}/2)
              </button>
            <button
              type="button"
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                setTokbokkiStirring(true);
              }}
              onPointerUp={(event) => {
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }
                setTokbokkiStirring(false);
              }}
              onPointerCancel={() => setTokbokkiStirring(false)}
              onPointerLeave={() => setTokbokkiStirring(false)}
              className={`flex-1 py-3 font-black text-xs rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 touch-none cursor-pointer border border-amber-300/30 ${
                tokbokkiSession.isStirring
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              <span>{tokbokkiSession.isStirring ? 'ĐANG KHUẤY MẠNH' : 'CHẠM GIỮ ĐỂ KHUẤY'}</span>
            </button>
            </div>
            <button
              type="button"
              onClick={discardTokbokki}
              className="p-2.5 rounded-2xl border border-stone-700 bg-stone-800 text-stone-400 hover:text-red-400 cursor-pointer"
              title="Hủy mẻ này"
            >
              <GameAssetIcon name="close" size={16} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={finishTokbokki}
              className={`flex-1 py-2.5 rounded-2xl font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-400/40 ${
                tokbokkiSession.status === 'perfect'
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white'
                  : 'bg-stone-800 text-stone-200'
              }`}
            >
              <GameAssetIcon name="complete" size={18} />
              <span>Gắp Ra Đĩa Để Phục Vụ</span>
            </button>
            <button
              type="button"
              onClick={discardTokbokki}
              className="p-2.5 rounded-2xl border border-stone-700 bg-stone-800 text-stone-400 hover:text-red-400 cursor-pointer"
              title="Hủy mẻ này"
            >
              <GameAssetIcon name="close" size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
