'use client';

import React from 'react';
import Image from 'next/image';
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
          {/* Close button (Phase 3 PNG: ui_close_dong.png) */}
          <button
            type="button"
            onClick={() => setActiveModal('none')}
            title="Đóng cài đặt"
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-xl overflow-hidden cursor-pointer transition-transform active:scale-90"
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
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 p-1 flex items-center justify-center shrink-0">
              <Image
                src="/assets/phase3-ui/ui_settings_cai_dat.png"
                alt="Cài đặt"
                width={36}
                height={36}
                className="w-full h-full object-contain pointer-events-none"
              />
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
                  <div className="w-7 h-7 rounded-xl bg-stone-800 flex items-center justify-center p-0.5">
                    <Image
                      src={sfxEnabled ? '/assets/phase3-ui/ui_sfx_on.png' : '/assets/phase3-ui/ui_sfx_off.png'}
                      alt="SFX"
                      width={24}
                      height={24}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-xs font-bold text-stone-200">Hiệu ứng âm thanh (SFX)</span>
                </div>
                <button
                  type="button"
                  onClick={toggleSfx}
                  title={sfxEnabled ? 'Tắt hiệu ứng âm thanh' : 'Bật hiệu ứng âm thanh'}
                  className="w-9 h-9 relative shrink-0 cursor-pointer active:scale-95 transition-transform"
                >
                  <Image
                    src={sfxEnabled ? '/assets/phase3-ui/ui_sfx_on.png' : '/assets/phase3-ui/ui_sfx_off.png'}
                    alt={sfxEnabled ? 'SFX Bật' : 'SFX Tắt'}
                    width={36}
                    height={36}
                    className="w-full h-full object-contain pointer-events-none drop-shadow-sm"
                  />
                </button>
              </div>

              {/* BGM Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-stone-800 flex items-center justify-center p-0.5">
                    <Image
                      src={bgmEnabled ? '/assets/phase3-ui/ui_bgm_on.png' : '/assets/phase3-ui/ui_bgm_off.png'}
                      alt="BGM"
                      width={24}
                      height={24}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-xs font-bold text-stone-200">Nhạc nền quán ăn (BGM)</span>
                </div>
                <button
                  type="button"
                  onClick={toggleBgm}
                  title={bgmEnabled ? 'Tắt nhạc nền' : 'Bật nhạc nền'}
                  className="w-9 h-9 relative shrink-0 cursor-pointer active:scale-95 transition-transform"
                >
                  <Image
                    src={bgmEnabled ? '/assets/phase3-ui/ui_bgm_on.png' : '/assets/phase3-ui/ui_bgm_off.png'}
                    alt={bgmEnabled ? 'BGM Bật' : 'BGM Tắt'}
                    width={36}
                    height={36}
                    className="w-full h-full object-contain pointer-events-none drop-shadow-sm"
                  />
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
                className="w-full py-2 px-3 rounded-2xl border border-red-500/50 bg-red-950/40 hover:bg-red-900/60 text-red-300 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <div className="w-5 h-5 relative shrink-0">
                  <Image
                    src="/assets/phase3-ui/ui_cancel_huy.png"
                    alt="Hủy"
                    width={20}
                    height={20}
                    className="object-contain w-full h-full"
                  />
                </div>
                <span>Đặt Lại Trò Chơi (Reset Dữ Liệu)</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
