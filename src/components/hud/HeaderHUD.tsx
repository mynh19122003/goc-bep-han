'use client';

import React from 'react';
import Image from 'next/image';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_ASSETS } from '@/game/assets/gameAssets';
import { GameIconButton } from '@/components/ui/game/GameIconButton';

interface HeaderHUDProps {
  onOpenDelivery?: () => void;
  onOpenSettings?: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  onOpenDelivery,
  onOpenSettings,
}) => {
  const {
    coins,
    day,
    dayTimeSeconds,
    isDayActive,
    isPaused,
    rating,
    deliveryQueue,
    sfxEnabled,
    startDay,
    pauseGame,
    resumeGame,
    toggleSfx,
    setActiveModal,
  } = useGameStore();

  const totalDaySeconds = 100;
  const progressPercent = Math.min(100, (dayTimeSeconds / totalDaySeconds) * 100);

  // Business clock: 10:00 to 22:00
  const currentHour = 10 + Math.floor((dayTimeSeconds / totalDaySeconds) * 12);
  const currentMinute = Math.floor(((dayTimeSeconds / totalDaySeconds) * 12 * 60) % 60);
  const timeFormatted = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

  return (
    <header className="w-full bg-stone-900/95 backdrop-blur-md border-b-2 border-amber-600/40 px-2 sm:px-4 py-2 shrink-0 z-40 shadow-lg text-stone-100 select-none font-baloo">
      <div className="flex items-center justify-between gap-1.5 sm:gap-3 max-w-[1720px] mx-auto">
        {/* Left: Brand & Day/Time */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-amber-600 text-white font-black px-2.5 py-1 rounded-2xl text-xs sm:text-sm shadow-md border border-red-400/30">
            <div className="w-6 h-6 sm:w-7 sm:h-7 relative shrink-0">
              <Image
                src={GAME_ASSETS.props.food_stall}
                alt="Logo"
                width={28}
                height={28}
                className="object-contain w-full h-full"
              />
            </div>
            <span className="tracking-wide hidden xs:inline">GÓC BẾP HÀN</span>
          </div>

          {/* Day & Business Time with Phase 3 Timer Asset */}
          <div className="flex items-center gap-1.5 bg-stone-950/80 border border-amber-500/30 text-amber-200 px-2.5 py-1 rounded-2xl font-black text-xs sm:text-sm shadow-inner">
            <div className="w-5 h-5 relative shrink-0">
              <Image
                src="/assets/phase3-ui/ui_timer_thoi_gian.png"
                alt="Thời gian"
                width={24}
                height={24}
                className="object-contain w-full h-full"
              />
            </div>
            <span className="text-amber-400">Ngày {day}</span>
            <span className="text-stone-600">|</span>
            <span className="font-mono text-stone-100">
              {isDayActive ? timeFormatted : '10:00'}
            </span>
          </div>
        </div>

        {/* Center: Currencies & Rating */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Coin Counter */}
          <div className="flex items-center gap-1.5 bg-amber-950/90 border border-amber-500/50 text-amber-200 font-black px-2.5 sm:px-3 py-1 rounded-2xl shadow-inner text-xs sm:text-sm">
            <div className="w-6 h-6 sm:w-7 sm:h-7 relative shrink-0">
              <Image
                src={GAME_ASSETS.hud.coin}
                alt="Tiền xu"
                width={28}
                height={28}
                className="object-contain w-full h-full"
              />
            </div>
            <span className="tracking-tight">{coins.toLocaleString()}</span>
          </div>

          {/* Rating Heart */}
          <button
            type="button"
            onClick={() => setActiveModal('reviews')}
            title="Đánh giá từ khách hàng"
            className="flex items-center gap-1.5 bg-amber-950/90 hover:bg-amber-900 border border-amber-500/50 text-amber-200 font-black px-2.5 sm:px-3 py-1 rounded-2xl cursor-pointer shadow-inner transition-transform active:scale-95 text-xs sm:text-sm"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 relative shrink-0">
              <Image
                src={GAME_ASSETS.hud.rating}
                alt="Đánh giá"
                width={28}
                height={28}
                className="object-contain w-full h-full"
              />
            </div>
            <span>{rating.toFixed(1)}</span>
          </button>
        </div>

        {/* Right: Sound, Day Action & Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound Toggle (Phase 3 PNG: ui_sfx_on / ui_sfx_off) */}
          <button
            type="button"
            onClick={toggleSfx}
            title={sfxEnabled ? 'Âm thanh: Đang bật' : 'Âm thanh: Đang tắt'}
            className="w-8 h-8 sm:w-9 sm:h-9 relative shrink-0 rounded-xl bg-stone-900/60 hover:bg-stone-900/90 border border-white/20 flex items-center justify-center cursor-pointer transition-all active:scale-95 p-1"
          >
            <Image
              src={sfxEnabled ? '/assets/phase3-ui/ui_sfx_on.png' : '/assets/phase3-ui/ui_sfx_off.png'}
              alt={sfxEnabled ? 'SFX Bật' : 'SFX Tắt'}
              width={28}
              height={28}
              className="w-full h-full object-contain pointer-events-none drop-shadow-sm"
            />
          </button>

          {/* Day Open/Pause Toggle */}
          {!isDayActive ? (
            <button
              type="button"
              onClick={startDay}
              title="Mở quán bắt đầu ngày"
              className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl bg-stone-900/60 hover:bg-stone-900/90 border border-emerald-400/50 flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-md"
            >
              <div className="h-6 w-auto aspect-[593/295] relative">
                <Image
                  src="/assets/phase3-ui/btn_open_mo.png"
                  alt="Mở quán"
                  width={593}
                  height={295}
                  className="h-full w-auto object-contain pointer-events-none"
                />
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={isPaused ? resumeGame : pauseGame}
              className="h-8 sm:h-9 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md active:scale-95 border border-amber-400/40 cursor-pointer transition-all flex items-center gap-1"
            >
              <span>{isPaused ? 'Tiếp tục' : 'Tạm dừng'}</span>
            </button>
          )}

          {/* Settings Modal Button (Phase 3 PNG: ui_settings_cai_dat.png) */}
          <button
            type="button"
            onClick={() => {
              if (onOpenSettings) onOpenSettings();
              else setActiveModal('settings');
            }}
            title="Cài đặt trò chơi"
            className="w-8 h-8 sm:w-9 sm:h-9 relative shrink-0 rounded-xl bg-stone-900/60 hover:bg-stone-900/90 border border-white/20 flex items-center justify-center cursor-pointer transition-all active:scale-95 p-1"
          >
            <Image
              src="/assets/phase3-ui/ui_settings_cai_dat.png"
              alt="Cài đặt"
              width={28}
              height={28}
              className="w-full h-full object-contain pointer-events-none drop-shadow-sm"
            />
          </button>
        </div>
      </div>

      {/* Day Progress Meter */}
      {isDayActive && (
        <div className="w-full bg-stone-950 h-1.5 rounded-full mt-1.5 overflow-hidden border border-stone-800 max-w-[1720px] mx-auto">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </header>
  );
};
