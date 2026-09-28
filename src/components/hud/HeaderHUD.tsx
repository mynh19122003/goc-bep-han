'use client';

import React from 'react';
import Image from 'next/image';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_ASSETS } from '@/game/assets/gameAssets';
import { GameIconButton } from '@/components/ui/game/GameIconButton';
import { restaurantProgress } from '@/core/gameCore';

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
    reputationPoints,
    deliveryQueue,
    sfxEnabled,
    startDay,
    pauseGame,
    resumeGame,
    toggleSfx,
    setActiveModal,
  } = useGameStore();

  const totalDaySeconds = 100;
  const progression = restaurantProgress(reputationPoints);
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

          {/* Day & Business Time */}
          <div className="flex items-center gap-1.5 bg-stone-950/80 border border-amber-500/30 text-amber-200 px-2.5 py-1 rounded-2xl font-black text-xs sm:text-sm shadow-inner">
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

          {/* Restaurant Level / Reputation */}
          <div
            className="hidden md:flex min-w-[122px] flex-col gap-0.5 bg-stone-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-2xl shadow-inner"
            title={`Danh tiếng ${reputationPoints} • Cấp quán ${progression.level}`}
          >
            <div className="flex items-center justify-between gap-2 text-[10px] font-black">
              <span className="text-emerald-300">Cấp {progression.level}</span>
              <span className="text-stone-400">
                {progression.currentXp}/{progression.nextLevelXp}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-stone-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${progression.progressPercent}%` }}
              />
            </div>
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
          {/* Sound Toggle (28-32px icon) */}
          <GameIconButton
            asset={GAME_ASSETS.hud.sound}
            size="sm"
            variant="glass"
            active={sfxEnabled}
            onClick={toggleSfx}
            title={sfxEnabled ? 'Âm thanh: Đang bật' : 'Âm thanh: Đang tắt'}
            className={sfxEnabled ? 'opacity-100' : 'opacity-40 grayscale'}
          />

          {/* Day Open/Pause Toggle */}
          {!isDayActive ? (
            <button
              type="button"
              onClick={startDay}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:brightness-110 text-white font-black px-3 py-1.5 rounded-2xl text-xs sm:text-sm shadow-md active:scale-95 flex items-center gap-1.5 border border-emerald-400/40 cursor-pointer transition-all"
            >
              <div className="w-5 h-5 relative shrink-0">
                <Image
                  src={GAME_ASSETS.actions.start}
                  alt="Mở quán"
                  width={20}
                  height={20}
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="hidden sm:inline">Mở Quán</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={isPaused ? resumeGame : pauseGame}
              className="bg-amber-600 hover:bg-amber-700 text-white font-black px-3 py-1.5 rounded-2xl text-xs sm:text-sm shadow-md active:scale-95 border border-amber-400/40 cursor-pointer transition-all flex items-center gap-1"
            >
              <span>{isPaused ? 'Tiếp tục' : 'Tạm dừng'}</span>
            </button>
          )}

          {/* Settings Modal Button */}
          <GameIconButton
            asset={GAME_ASSETS.hud.settings}
            size="sm"
            variant="glass"
            onClick={() => {
              if (onOpenSettings) onOpenSettings();
              else setActiveModal('settings');
            }}
            title="Cài đặt trò chơi"
          />
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
