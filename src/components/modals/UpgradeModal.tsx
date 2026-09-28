'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';

export const UpgradeModal: React.FC = () => {
  const { activeModal, setActiveModal, upgrades, coins, buyUpgrade } = useGameStore();

  if (activeModal !== 'upgrades') return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none font-baloo">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="bg-stone-900 rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl border-4 border-amber-600/60 relative flex flex-col max-h-[90vh] text-stone-100"
        >
          {/* Close button (Phase 3 PNG: ui_close_dong.png) */}
          <button
            type="button"
            onClick={() => setActiveModal('none')}
            title="Đóng nâng cấp"
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

          {/* Modal Header */}
          <div className="flex items-center gap-2.5 mb-4 pr-10">
            <div className="w-12 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 p-1 flex items-center justify-center shrink-0">
              <Image
                src="/assets/phase3-ui/btn_upgrade_nang_cap.png"
                alt="Nâng cấp"
                width={589}
                height={279}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-200 tracking-wide uppercase">
                NÂNG CẤP TRANG THIẾT BỊ
              </h2>
              <p className="text-[11px] text-amber-300/80 font-bold">
                Tăng tốc độ chế biến & cải thiện trải nghiệm khách hàng
              </p>
            </div>
          </div>

          {/* Upgrades List */}
          <div className="overflow-y-auto space-y-3 pr-1 flex-1">
            {upgrades.map((upgrade) => {
              const isMax = upgrade.level >= upgrade.maxLevel;
              const canAfford = coins >= upgrade.cost && !isMax;

              return (
                <div
                  key={upgrade.id}
                  className="bg-stone-950/70 border-2 border-stone-800 hover:border-amber-600/50 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 transition-colors shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-10 p-1 bg-stone-800 rounded-xl shadow-inner border border-amber-500/30 flex items-center justify-center shrink-0">
                      <Image
                        src="/assets/phase3-ui/btn_upgrade_nang_cap.png"
                        alt="Nâng cấp"
                        width={589}
                        height={279}
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-amber-100 text-xs sm:text-sm">
                          {upgrade.name}
                        </h4>
                        <span className="text-[10px] font-black text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full">
                          Cấp {upgrade.level}/{upgrade.maxLevel}
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 mt-0.5">{upgrade.description}</p>
                      <span className="inline-block mt-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-md">
                        {upgrade.effectDescription}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isMax ? (
                      <div className="h-8 aspect-[375/199] relative flex items-center justify-center">
                        <Image
                          src="/assets/phase3-ui/status_perfect_hoan_hao.png"
                          alt="Tối đa"
                          width={375}
                          height={199}
                          className="h-full w-auto object-contain pointer-events-none drop-shadow-sm"
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => buyUpgrade(upgrade.id)}
                        disabled={!canAfford}
                        title={`Nâng cấp (${upgrade.cost} Xu)`}
                        className={`h-9 sm:h-10 px-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400 text-white active:scale-95'
                            : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <div className="h-6 w-auto aspect-[589/279] relative">
                          <Image
                            src="/assets/phase3-ui/btn_upgrade_nang_cap.png"
                            alt="Nâng cấp"
                            width={589}
                            height={279}
                            className="h-full w-auto object-contain pointer-events-none"
                          />
                        </div>
                        <span className="text-amber-300 font-black">{upgrade.cost} Xu</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
