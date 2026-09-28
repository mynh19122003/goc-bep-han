'use client';

import React from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_ASSETS } from '@/game/assets/gameAssets';
import { GameModal } from '@/components/ui/game/GameModal';
import { GameButton } from '@/components/ui/game/GameButton';

export const DayEndModal: React.FC = () => {
  const { activeModal, dailyReport, advanceToNextDay } = useGameStore();

  if (activeModal !== 'day_end' || !dailyReport) return null;

  const nextDay = () => {
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    advanceToNextDay();
  };

  return (
    <GameModal
      title={`Tổng kết ngày ${dailyReport.day}`}
      subtitle="Kết quả vận hành quán hôm nay"
      onClose={() => {}}
      showClose={false}
      maxWidth="max-w-md"
      icon={<span className="relative h-10 w-10"><Image src={GAME_ASSETS.props.red_lantern} alt="" fill sizes="40px" className="object-contain" /></span>}
    >
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl border border-amber-500/20 bg-amber-950/25 p-3">
          <span className="text-[9px] font-black uppercase text-amber-300">Doanh thu</span>
          <strong className="mt-1 block text-lg font-black text-amber-100">+{dailyReport.revenue} Xu</strong>
          <span className="text-[9px] text-stone-500">Tip {dailyReport.tipsEarned} Xu</span>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-3">
          <span className="text-[9px] font-black uppercase text-emerald-300">Phục vụ</span>
          <strong className="mt-1 block text-lg font-black text-emerald-100">{dailyReport.customersServed}</strong>
          <span className="text-[9px] text-red-300">Bỏ về {dailyReport.customersLost}</span>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-stone-700 bg-stone-900/60 p-3 text-[10px] leading-relaxed text-stone-400">
        Độ tươi nguyên liệu giảm sau mỗi ngày. Kiểm tra kho và nhập bổ sung trước khi mở quán ngày tiếp theo.
      </div>

      <GameButton fullWidth className="mt-3" onClick={nextDay}>
        Bắt đầu ngày tiếp theo
      </GameButton>
    </GameModal>
  );
};
