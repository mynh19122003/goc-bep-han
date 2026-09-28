'use client';

import React from 'react';
import Image from 'next/image';
import { GAME_ASSETS } from '@/game/assets/gameAssets';
import { useGameStore } from '@/stores/useGameStore';

export type GamePanelType = 'kitchen' | 'delivery' | 'menu' | 'inventory' | 'upgrade' | null;

interface GameActionDockProps {
  activePanel: GamePanelType;
  onSelectPanel: (panel: GamePanelType) => void;
  waitingDineInCount?: number;
  deliveryCount?: number;
}

const dockItems = [
  { key: null, label: 'Quán', asset: GAME_ASSETS.navigation.restaurant },
  { key: 'kitchen', label: 'Bếp', asset: GAME_ASSETS.navigation.kitchen },
  { key: 'delivery', label: 'Giao hàng', asset: GAME_ASSETS.navigation.delivery },
  { key: 'menu', label: 'Thực đơn', asset: GAME_ASSETS.navigation.menu },
  { key: 'inventory', label: 'Chợ', asset: GAME_ASSETS.navigation.inventory },
] as const;

export const GameActionDock: React.FC<GameActionDockProps> = ({
  activePanel,
  onSelectPanel,
  waitingDineInCount = 0,
  deliveryCount = 0,
}) => {
  const { tables, deliveryQueue } = useGameStore();
  const waiting = waitingDineInCount || tables.filter((t) => t.status === 'seated').length;
  const deliveries = deliveryCount || deliveryQueue.length;

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-2 pb-[max(.45rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto grid w-full max-w-[560px] grid-cols-5 gap-0.5 rounded-2xl border border-amber-500/25 bg-[#18120f]/96 p-1 shadow-2xl backdrop-blur-md sm:gap-1 sm:p-1.5">
        {dockItems.map((item) => {
          const selected = activePanel === item.key;
          const badge =
            item.key === 'kitchen' ? waiting : item.key === 'delivery' ? deliveries : 0;

          return (
            <button
              key={String(item.key)}
              type="button"
              onClick={() => onSelectPanel(selected && item.key !== null ? null : item.key)}
              className={`relative flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 transition active:scale-95 ${
                selected
                  ? 'bg-amber-500/18 text-amber-200 ring-1 ring-amber-400/45'
                  : 'text-stone-300 hover:bg-white/5'
              }`}
            >
              <span className="relative h-6 w-6 sm:h-8 sm:w-8">
                <Image src={item.asset} alt="" fill sizes="32px" className="object-contain" />
              </span>
              <span className="max-w-full truncate text-[8px] font-black sm:text-[10px]">{item.label}</span>
              {badge > 0 && (
                <span className="absolute right-1 top-0 min-w-[18px] rounded-full border border-red-300/50 bg-red-600 px-1 text-[9px] font-black leading-[16px] text-white">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
