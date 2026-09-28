'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_ASSETS } from '@/game/assets/gameAssets';
import { CustomerSprite } from '@/components/ui/game/CustomerSprite';
import { GameButton } from '@/components/ui/game/GameButton';

export const BargainMiniGame: React.FC = () => {
  const { bargainSession, inventory, upgrades, stopBargain, cancelBargain } = useGameStore();
  const [sliderPos, setSliderPos] = useState(20);
  const [sliderDir, setSliderDir] = useState<1 | -1>(1);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<{ success: boolean; discount: number; banned: boolean } | null>(null);
  const requestRef = useRef<number | null>(null);

  const charmLevel = upgrades.find((upgrade) => upgrade.id === 'bargain_charm')?.level || 0;
  const bestZoneStart = Math.max(60, 80 - charmLevel * 10);

  useEffect(() => {
    if (!bargainSession) return;
    setSliderPos(20);
    setSliderDir(1);
    setIsFinished(false);
    setResult(null);
  }, [bargainSession?.ingredientId, bargainSession?.originalPrice]);

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
  const asset =
    (GAME_ASSETS.ingredients as Record<string, string>)[bargainSession.ingredientId] ||
    (GAME_ASSETS.toppings as Record<string, string>)[bargainSession.ingredientId];

  const stop = () => {
    if (isFinished) return;
    if (requestRef.current) cancelAnimationFrame(requestRef.current);

    setIsFinished(true);
    useGameStore.setState({
      bargainSession: { ...bargainSession, sliderPosition: sliderPos },
    });

    const outcome = stopBargain();
    setResult(outcome);

    if (outcome.success && outcome.discount >= 0.1) {
      confetti({ particleCount: 40, spread: 55, origin: { y: 0.65 } });
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm">
      <section className="w-full max-w-sm rounded-3xl border border-amber-500/30 bg-[#1a1411]/98 p-4 text-stone-100 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <CustomerSprite
            spriteSrc={GAME_ASSETS.customers.elderly.female}
            name="Bà chủ sạp"
            mood={result?.banned ? 'angry' : isFinished ? 'happy' : 'normal'}
            size="md"
          />
          <h2 className="mt-1 text-sm font-black uppercase text-amber-100">Mặc cả chợ sáng</h2>
          <p className="mt-0.5 text-[10px] font-bold text-stone-400">Dừng kim ở vùng tốt để nhận giảm giá</p>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-stone-700 bg-black/20 p-2.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-stone-700 bg-stone-900 p-1">
            {asset ? (
              <div className="relative h-9 w-9"><Image src={asset} alt={item?.vietnameseName || ''} fill sizes="36px" className="object-contain" /></div>
            ) : (
              <span className="text-center text-[8px] font-black text-red-300">Thiếu asset</span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-xs font-black text-amber-100">{item?.vietnameseName} ×{bargainSession.quantity}</h3>
            <p className="text-[10px] font-bold text-amber-300">Giá gốc {bargainSession.originalPrice} Xu</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex justify-between text-[8px] font-black">
            <span className="text-red-300">Trượt</span>
            <span className="text-amber-300">-5%</span>
            <span className="text-blue-300">-10%</span>
            <span className="text-emerald-300">-20%</span>
          </div>
          <div className="relative flex h-8 overflow-hidden rounded-full border border-stone-600 bg-stone-950">
            <div className="w-[25%] bg-red-700/80" />
            <div className="w-[25%] bg-amber-600/80" />
            <div className="bg-blue-700/80" style={{ width: `${bestZoneStart - 50}%` }} />
            <div className="bg-emerald-600" style={{ width: `${100 - bestZoneStart}%` }} />
            <div
              className="absolute inset-y-0 w-2 -translate-x-1/2 rounded-full border border-amber-950 bg-yellow-200 shadow"
              style={{ left: `${sliderPos}%` }}
            />
          </div>
        </div>

        {result && (
          <div className={`mt-3 rounded-2xl border p-3 text-center text-[11px] font-black ${
            result.banned
              ? 'border-red-500/40 bg-red-950/50 text-red-200'
              : 'border-emerald-500/30 bg-emerald-950/45 text-emerald-200'
          }`}>
            {result.banned
              ? 'Trả giá thất bại. Món hàng này bị khóa trong hôm nay.'
              : `Thành công: giảm ${Math.round(result.discount * 100)}%`}
          </div>
        )}

        <div className="mt-3">
          {!isFinished ? (
            <GameButton fullWidth tone="primary" onClick={stop}>Dừng để trả giá</GameButton>
          ) : (
            <GameButton fullWidth tone="neutral" onClick={cancelBargain}>Quay lại chợ</GameButton>
          )}
        </div>
      </section>
    </div>
  );
};
