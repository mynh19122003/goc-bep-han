'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import confetti from 'canvas-confetti';
import { GAME_ASSETS } from '@/config/gameAssets';
import { CustomerSprite } from '@/components/ui/game/CustomerSprite';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';

export const BargainMiniGame: React.FC = () => {
  const { bargainSession, inventory, upgrades, stopBargain, cancelBargain } = useGameStore();

  const [sliderPos, setSliderPos] = useState(20);
  const [sliderDir, setSliderDir] = useState<1 | -1>(1);
  const [isFinished, setIsFinished] = useState(false);
  const [resultOutcome, setResultOutcome] = useState<{
    success: boolean;
    discount: number;
    banned: boolean;
  } | null>(null);

  const requestRef = useRef<number | null>(null);
  const charmLevel = upgrades.find((upgrade) => upgrade.id === 'bargain_charm')?.level || 0;
  const bestZoneStart = Math.max(60, 80 - charmLevel * 10);

  useEffect(() => {
    if (!bargainSession) return;
    setSliderPos(20);
    setSliderDir(1);
    setIsFinished(false);
    setResultOutcome(null);
  }, [bargainSession?.ingredientId, bargainSession?.originalPrice]);

  // Fast rhythm animation loop
  useEffect(() => {
    if (!bargainSession || isFinished) return;

    let pos = sliderPos;
    let dir = sliderDir;

    const animate = () => {
      pos += dir * 2.2;
      if (pos >= 98) {
        pos = 98;
        dir = -1;
      } else if (pos <= 2) {
        pos = 2;
        dir = 1;
      }
      setSliderPos(pos);
      setSliderDir(dir);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [bargainSession, isFinished, sliderDir]);

  if (!bargainSession) return null;

  const item = inventory[bargainSession.ingredientId];
  const itemAsset =
    (GAME_ASSETS.ingredients as Record<string, string>)[bargainSession.ingredientId] ||
    (GAME_ASSETS.toppings as Record<string, string>)[bargainSession.ingredientId] ||
    null;

  const handleStop = () => {
    if (isFinished) return;
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setIsFinished(true);

    // Save final pos to store and evaluate
    useGameStore.setState({
      bargainSession: {
        ...bargainSession,
        sliderPosition: sliderPos,
      },
    });

    const res = stopBargain();
    setResultOutcome(res);

    if (res.success && res.discount >= 0.1) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none font-baloo">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-stone-900 rounded-3xl max-w-sm w-full p-4 sm:p-5 shadow-2xl border-4 border-amber-600/60 relative flex flex-col text-center text-stone-100"
        >
          {/* Header Graphic with Real Elderly Female Chibi Sprite */}
          <div className="flex flex-col items-center justify-center mb-1">
            <CustomerSprite
              spriteSrc={GAME_ASSETS.customers.elderly.female}
              name="Bà bán rau Noryangjin"
              mood={resultOutcome?.banned ? 'angry' : isFinished ? 'happy' : 'normal'}
              size="md"
            />
          </div>

          <h3 className="font-black text-amber-200 text-base uppercase">
            MẶC CẢ VỚI BÀ CHỦ SẠP
          </h3>
          <p className="text-[11px] text-amber-300/80 mt-0.5 font-bold">
            Bấm dừng đúng thời điểm để nhận mức giảm giá hời!
          </p>

          {/* Item details */}
          <div className="bg-stone-950/80 rounded-2xl p-2.5 my-3 border-2 border-stone-800 text-left flex items-center gap-2.5 shadow-inner">
            <div className="w-12 h-12 p-1 bg-stone-800 rounded-xl shadow-sm border border-amber-500/30 flex items-center justify-center shrink-0">
              <Image
                src={itemAsset}
                alt={item?.vietnameseName || ''}
                width={36}
                height={36}
                className="w-full h-full object-contain pointer-events-none drop-shadow"
              />
            </div>
            <div>
              <h4 className="font-black text-amber-100 text-xs sm:text-sm">
                {item?.vietnameseName} (x{bargainSession.quantity})
              </h4>
              <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                <GameAssetIcon name="coin" size={14} />
                Giá gốc: {bargainSession.originalPrice} Xu
              </span>
            </div>
          </div>

          {/* Timing Slider Visual */}
          <div className="my-2">
            <div className="flex justify-between text-[10px] font-black mb-1">
              <span className="text-red-400">Bị Mắng</span>
              <span className="text-amber-400">Giảm 5%</span>
              <span className="text-blue-400">Giảm 10%</span>
              <span className="text-emerald-400">Giảm 20%</span>
            </div>

            {/* Slider track with colored target zones */}
            <div className="w-full h-8 bg-stone-950 rounded-full relative overflow-hidden border-2 border-stone-700 shadow-inner flex">
              {/* Red Zone: 0 to 25 */}
              <div className="w-[25%] h-full bg-red-600/80 flex items-center justify-center text-[10px] font-black text-white">
                Bị Mắng
              </div>
              {/* Amber Zone: 25 to 50 */}
              <div className="w-[25%] h-full bg-amber-500/80 flex items-center justify-center text-[10px] font-black text-white">
                -5%
              </div>
              {/* Blue Zone: 50 to best discount zone */}
              <div
                className="h-full bg-blue-600/80 flex items-center justify-center text-[10px] font-black text-white"
                style={{ width: `${bestZoneStart - 50}%` }}
              >
                -10%
              </div>
              {/* Emerald Zone expands with bargain_charm upgrade */}
              <div
                className="h-full bg-emerald-500 flex items-center justify-center text-[10px] font-black text-white animate-pulse"
                style={{ width: `${100 - bestZoneStart}%` }}
              >
                -20%
              </div>

              {/* Oscillating Needle Pointer */}
              <div
                className="absolute top-0 bottom-0 w-2.5 bg-yellow-300 border-2 border-amber-950 rounded-full shadow-lg transition-transform duration-75 -translate-x-1/2"
                style={{ left: `${sliderPos}%` }}
              />
            </div>
          </div>

          {/* Result outcome message */}
          {resultOutcome && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-3 rounded-2xl text-xs font-black my-2 border-2 ${
                resultOutcome.banned
                  ? 'bg-red-950/80 border-red-500 text-red-200 shadow-md'
                  : 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-md'
              }`}
            >
              {resultOutcome.banned ? (
                <span>
                  &quot;Trả giá kiểu đó hả cháu? Hôm nay bà không bán món này cho cháu nữa!&quot;
                </span>
              ) : (
                <span>
                  &quot;Được rồi, bà bớt cho cháu {Math.round(resultOutcome.discount * 100)}% đó nha!&quot;
                </span>
              )}
            </motion.div>
          )}

          {/* Action Button */}
          <div className="mt-3">
            {!isFinished ? (
              <button
                type="button"
                onClick={handleStop}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-black text-sm rounded-2xl shadow-xl active:scale-95 transition-all cursor-pointer border border-amber-300/40"
              >
                <span>BẤM DỪNG ĐỂ TRẢ GIÁ!</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={cancelBargain}
                className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-200 font-black text-xs rounded-2xl shadow-md transition-all active:scale-95 border border-stone-700 cursor-pointer"
              >
                Quay Lại Chợ
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
