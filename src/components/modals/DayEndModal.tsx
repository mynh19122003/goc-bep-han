'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';
import { PHASE3_UI_ASSETS } from '@/game/assets/phase3UiAssets';
import confetti from 'canvas-confetti';

export const DayEndModal: React.FC = () => {
  const { activeModal, dailyReport, advanceToNextDay } = useGameStore();

  if (activeModal !== 'day_end' || !dailyReport) return null;

  const handleNextDay = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
    advanceToNextDay();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none font-baloo">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          className="bg-stone-900 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border-4 border-amber-600/60 relative text-center text-stone-100"
        >
          {/* Header Graphic */}
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-red-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl mb-3 border border-amber-300">
            <GameAssetIcon name="lantern" size={32} />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-amber-200 tracking-wide uppercase">
            TỔNG KẾT NGÀY {dailyReport.day}
          </h2>
          <p className="text-xs text-amber-300/80 mt-0.5 font-bold">
            Quán đã kết thúc một ngày buôn bán tấp nập!
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-2.5 my-4 text-left">
            {/* Revenue */}
            <div className="bg-stone-950/80 border-2 border-amber-500/40 rounded-2xl p-3 shadow-inner">
              <span className="text-[11px] font-black text-amber-400 flex items-center gap-1">
                <GameAssetIcon name="coin" size={14} />
                Doanh thu:
              </span>
              <span className="text-lg font-black text-amber-100 block mt-0.5">
                +{dailyReport.revenue} Xu
              </span>
              <span className="text-[10px] text-stone-400">
                (Đã gồm {dailyReport.tipsEarned} Xu tip)
              </span>
            </div>

            {/* Customers */}
            <div className="bg-stone-950/80 border-2 border-emerald-500/40 rounded-2xl p-3 shadow-inner">
              <span className="text-[11px] font-black text-emerald-400 flex items-center gap-1">
                <GameAssetIcon name="bowl" size={14} />
                Thực khách:
              </span>
              <span className="text-lg font-black text-emerald-200 block mt-0.5">
                {dailyReport.customersServed} người
              </span>
              <span className="text-[10px] text-red-400 font-bold">
                {dailyReport.customersLost > 0 ? `Bỏ về: ${dailyReport.customersLost}` : 'Không ai bỏ về!'}
              </span>
            </div>
          </div>

          {/* Tips notification */}
          <div className="bg-amber-950/40 border-2 border-amber-600/30 rounded-2xl p-3 mb-4 text-xs text-amber-100/90 text-left flex items-center gap-2">
            <GameAssetIcon name="star" size={16} />
            <span>
              Nguyên liệu tươi trong kho đã giảm độ tươi theo chu kỳ ngày. Nhớ ghé Chợ Sớm nhập thêm nhé!
            </span>
          </div>

          {/* Advance button */}
          <button
            type="button"
            onClick={handleNextDay}
            className="w-full flex items-center justify-center cursor-pointer active:scale-95 transition-all drop-shadow-xl mt-2"
            title="Bắt đầu ngày tiếp theo"
          >
            <Image
              src={PHASE3_UI_ASSETS.btn_start_bat_dau.src}
              alt="Bắt Đầu Ngày Tiếp Theo"
              width={PHASE3_UI_ASSETS.btn_start_bat_dau.width}
              height={PHASE3_UI_ASSETS.btn_start_bat_dau.height}
              className="h-12 w-auto object-contain pointer-events-none"
            />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
