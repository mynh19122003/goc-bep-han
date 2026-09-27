'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';

export const SettingsModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    sfxEnabled,
    bgmEnabled,
    toggleSfx,
    toggleBgm,
    resetGameData,
  } = useGameStore();

  if (activeModal !== 'settings') return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none font-baloo">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="bg-stone-900 rounded-3xl max-w-md w-full p-4 sm:p-5 shadow-2xl border-4 border-amber-600/60 relative flex flex-col text-stone-100"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setActiveModal('none')}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-100 border border-stone-700 transition-colors cursor-pointer"
          >
            <GameAssetIcon name="close" size={18} />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
              <GameAssetIcon name="settings" size={24} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-200 tracking-wide uppercase">
                CÀI ĐẶT TRÒ CHƠI
              </h2>
              <p className="text-[11px] text-amber-300/80 font-bold">
                Góc Bếp Hàn • Quản Lý Quán Ăn Chibi
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Audio Settings Panel */}
            <div className="bg-stone-950/70 rounded-2xl p-3 border-2 border-stone-800 space-y-2.5">
              <h4 className="font-extrabold text-[11px] text-amber-300 uppercase tracking-wider">
                Âm Thanh & Hiệu Ứng
              </h4>

              {/* SFX Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-stone-800 flex items-center justify-center">
                    <GameAssetIcon name="sound" size={16} />
                  </div>
                  <span className="text-xs font-bold text-stone-200">Hiệu ứng âm thanh (SFX)</span>
                </div>
                <button
                  type="button"
                  onClick={toggleSfx}
                  className={`px-3 py-1 rounded-xl font-black text-xs border transition-all cursor-pointer ${
                    sfxEnabled
                      ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300 shadow-sm'
                      : 'bg-stone-800 border-stone-700 text-stone-500'
                  }`}
                >
                  {sfxEnabled ? 'Đang Bật' : 'Đang Tắt'}
                </button>
              </div>

              {/* BGM Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-stone-800 flex items-center justify-center">
                    <GameAssetIcon name="sound" size={16} />
                  </div>
                  <span className="text-xs font-bold text-stone-200">Nhạc nền quán ăn (BGM)</span>
                </div>
                <button
                  type="button"
                  onClick={toggleBgm}
                  className={`px-3 py-1 rounded-xl font-black text-xs border transition-all cursor-pointer ${
                    bgmEnabled
                      ? 'bg-amber-600/30 border-amber-400 text-amber-300 shadow-sm'
                      : 'bg-stone-800 border-stone-700 text-stone-500'
                  }`}
                >
                  {bgmEnabled ? 'Đang Bật' : 'Đang Tắt'}
                </button>
              </div>
            </div>

            {/* Quick Gameplay Tips */}
            <div className="bg-amber-950/40 rounded-2xl p-3 border-2 border-amber-600/40 text-xs text-stone-200 space-y-1">
              <h4 className="font-black text-amber-300 flex items-center gap-1.5 mb-1">
                <GameAssetIcon name="recipe" size={16} />
                <span>Mẹo Quản Lý Quán Đạt Chuẩn 5 Sao:</span>
              </h4>
              <p className="text-[11px] leading-relaxed text-amber-100/90">
                • Bấm <strong className="text-amber-300">Mở Cửa</strong> để đón khách. Chú ý thanh kiên nhẫn để giao món kịp thời!
              </p>
              <p className="text-[11px] leading-relaxed text-amber-100/90">
                • Canh lửa vạch xanh (Perfect) khi xào Tokbokki & Ramyeon để nhận tiền tip tối đa.
              </p>
              <p className="text-[11px] leading-relaxed text-amber-100/90">
                • Ghé <strong className="text-amber-300">Chợ Sớm</strong> canh tin tức thời tiết để gom nguyên liệu giá hời.
              </p>
            </div>

            {/* Reset Game Data */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Bạn có chắc muốn xóa tiến trình và chơi lại từ đầu?')) {
                    resetGameData();
                  }
                }}
                className="w-full py-2.5 rounded-xl border border-red-500/50 bg-red-950/40 hover:bg-red-900/60 text-red-300 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <GameAssetIcon name="back" size={14} />
                <span>Đặt Lại Trò Chơi (Reset Dữ Liệu)</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
