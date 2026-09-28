'use client';

import React from 'react';
import Image from 'next/image';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_ASSETS } from '@/game/assets/gameAssets';
import { restaurantProgress } from '@/core/gameCore';
import { GameButton } from '@/components/ui/game/GameButton';

interface HeaderHUDProps {
  onOpenDelivery?: () => void;
  onOpenSettings?: () => void;
  onOpenGuide?: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  onOpenDelivery,
  onOpenSettings,
  onOpenGuide,
}) => {
  const {
    coins,
    day,
    dayTimeSeconds,
    isDayActive,
    isPaused,
    rating,
    reputationPoints,
    sfxEnabled,
    startDay,
    pauseGame,
    resumeGame,
    toggleSfx,
    setActiveModal,
  } = useGameStore();

  const totalDaySeconds = 100;
  const progress = restaurantProgress(reputationPoints);
  const progressPercent = Math.min(100, (dayTimeSeconds / totalDaySeconds) * 100);

  const currentHour = 10 + Math.floor((dayTimeSeconds / totalDaySeconds) * 12);
  const currentMinute = Math.floor(((dayTimeSeconds / totalDaySeconds) * 12 * 60) % 60);
  const timeFormatted = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

  return (
    <header className="relative z-40 shrink-0 border-b border-amber-500/25 bg-[#17110f]/95 text-stone-100 shadow-lg">
      <div className="mx-auto flex min-h-[62px] max-w-[1500px] items-center gap-2 px-2 py-2 sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="flex h-10 shrink-0 items-center gap-2 rounded-2xl border border-red-400/25 bg-gradient-to-r from-red-700 to-orange-700 px-2.5 shadow">
            <span className="relative h-7 w-7 shrink-0">
              <Image src={GAME_ASSETS.props.food_stall} alt="Góc Bếp Hàn" fill sizes="28px" className="object-contain" />
            </span>
            <span className="hidden text-xs font-black tracking-wide sm:inline">GÓC BẾP HÀN</span>
          </div>

          <div className="flex min-w-0 items-center gap-1.5 rounded-2xl border border-amber-500/25 bg-black/35 px-2.5 py-1.5 text-[11px] font-black sm:text-xs">
            <span className="text-amber-300">Ngày {day}</span>
            <span className="text-stone-600">•</span>
            <span className="font-mono text-stone-100">{isDayActive ? timeFormatted : '10:00'}</span>
          </div>

          <div className="hidden min-w-[130px] flex-col gap-1 rounded-2xl border border-emerald-500/20 bg-black/30 px-2.5 py-1.5 lg:flex">
            <div className="flex items-center justify-between text-[10px] font-black">
              <span className="text-emerald-300">Cấp quán {progress.level}</span>
              <span className="text-stone-400">{progress.currentXp}/{progress.nextLevelXp}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-stone-800">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress.progressPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <div className="flex h-10 items-center gap-1.5 rounded-2xl border border-amber-500/30 bg-amber-950/70 px-2.5 text-xs font-black text-amber-200">
            <span className="relative h-6 w-6">
              <Image src={GAME_ASSETS.hud.coin} alt="Xu" fill sizes="24px" className="object-contain" />
            </span>
            <span>{coins.toLocaleString()}</span>
          </div>

          <button
            type="button"
            onClick={() => setActiveModal('reviews')}
            className="flex h-10 items-center gap-1.5 rounded-2xl border border-amber-500/30 bg-amber-950/70 px-2.5 text-xs font-black text-amber-200 transition hover:bg-amber-900 active:scale-95"
            title="Đánh giá khách hàng"
          >
            <span className="relative h-6 w-6">
              <Image src={GAME_ASSETS.hud.rating} alt="Đánh giá" fill sizes="24px" className="object-contain" />
            </span>
            <span>{rating.toFixed(1)}</span>
          </button>

          <button
            type="button"
            onClick={toggleSfx}
            className={`hidden h-10 min-w-[48px] rounded-xl border px-2 text-[10px] font-black transition active:scale-95 sm:block ${
              sfxEnabled
                ? 'border-emerald-500/35 bg-emerald-950/70 text-emerald-300'
                : 'border-stone-700 bg-stone-900 text-stone-500'
            }`}
          >
            SFX {sfxEnabled ? 'ON' : 'OFF'}
          </button>

          {!isDayActive ? (
            <GameButton compact tone="success" onClick={startDay} iconSrc={GAME_ASSETS.props.food_stall}>
              <span className="hidden sm:inline">Mở Quán</span>
              <span className="sm:hidden">Mở</span>
            </GameButton>
          ) : (
            <GameButton compact tone="neutral" onClick={isPaused ? resumeGame : pauseGame}>
              {isPaused ? 'Tiếp tục' : 'Tạm dừng'}
            </GameButton>
          )}

          <button
            type="button"
            onClick={onOpenGuide}
            className="h-10 min-w-[40px] rounded-xl border border-teal-500/25 bg-teal-950/35 px-2 text-[10px] font-black text-teal-200 transition hover:bg-teal-900/40 active:scale-95"
            title="Giới thiệu & hướng dẫn chơi"
          >
            <span className="sm:hidden">?</span><span className="hidden sm:inline">HDSD</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onOpenSettings) onOpenSettings();
              else setActiveModal('settings');
            }}
            className="h-10 min-w-[48px] rounded-xl border border-amber-500/25 bg-stone-900 px-2 text-[10px] font-black text-amber-200 transition hover:bg-stone-800 active:scale-95"
          >
            <span className="sm:hidden">Cài</span>
            <span className="hidden sm:inline">Cài đặt</span>
          </button>
        </div>
      </div>

      {isDayActive && (
        <div className="h-1 w-full bg-black/30">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </header>
  );
};
