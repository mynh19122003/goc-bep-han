'use client';

import React from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { SceneType } from '@/types/game';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';

export const SceneCameraNav: React.FC = () => {
  const { activeScene, setActiveScene, deliveryQueue, tables } = useGameStore();

  const waitingCustomers = tables.filter((t) => t.status === 'seated').length;
  const arrivedShippers = deliveryQueue.filter((o) => o.shipperStatus === 'arrived').length;

  const scenes: { id: SceneType; label: string; iconName: string; badge: number }[] = [
    {
      id: 'storefront',
      label: 'Mặt Tiền',
      iconName: 'home',
      badge: arrivedShippers,
    },
    {
      id: 'dining',
      label: 'Phòng Ăn',
      iconName: 'bowl',
      badge: waitingCustomers,
    },
    {
      id: 'kitchen',
      label: 'Gian Bếp',
      iconName: 'cooking',
      badge: 0,
    },
  ];

  return (
    <div className="w-full bg-stone-900/90 backdrop-blur-md p-1.5 px-3 flex items-center justify-around border-b border-stone-800 shadow-md z-30 shrink-0 font-baloo">
      <div className="flex items-center gap-1.5 w-full max-w-sm mx-auto">
        {scenes.map((s) => {
          const isActive = activeScene === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveScene(s.id)}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 relative cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md scale-[1.02]'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <GameAssetIcon name={s.iconName} size={16} />
              <span>{s.label}</span>
              {s.badge > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-extrabold rounded-full px-1.5 py-0.2 shadow-xs">
                  {s.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
