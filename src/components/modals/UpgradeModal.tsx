'use client';

import React from 'react';
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
          {/* Close button */}
          <button
            type="button"
            onClick={() => setActiveModal('none')}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-100 border border-stone-700 transition-colors cursor-pointer"
          >
            <GameAssetIcon name="close" size={18} />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
              <GameAssetIcon name="upgrade" size={24} />
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
                    <span className="text-2xl p-2 bg-stone-800 rounded-xl shadow-inner border border-amber-500/30">
                      <GameAssetIcon name="upgrade" size={24} />
                    </span>
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
                      <span className="text-xs font-black text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-inner">
                        <GameAssetIcon name="complete" size={14} />
                        Tối Đa
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => buyUpgrade(upgrade.id)}
                        disabled={!canAfford}
                        className={`px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white active:scale-95 border border-amber-300'
                            : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                        }`}
                      >
                        <GameAssetIcon name="coin" size={14} />
                        <span>{upgrade.cost} Xu</span>
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
