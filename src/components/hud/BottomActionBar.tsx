'use client';

import React from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';

interface BottomActionBarProps {
  onOpenDelivery: () => void;
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({ onOpenDelivery }) => {
  const { activeTab, setActiveTab, setActiveModal, deliveryQueue } = useGameStore();

  const navItems = [
    {
      id: 'kitchen',
      label: 'Quầy Bếp',
      iconName: 'cooking',
      badge: 0,
      action: () => setActiveTab('kitchen'),
    },
    {
      id: 'tables',
      label: 'Bàn Ăn',
      iconName: 'bowl',
      badge: 0,
      action: () => setActiveTab('tables'),
    },
    {
      id: 'delivery',
      label: 'Giao Hàng',
      iconName: 'delivery',
      badge: deliveryQueue.length,
      action: onOpenDelivery,
    },
    {
      id: 'market',
      label: 'Chợ Sớm',
      iconName: 'cart',
      badge: 0,
      action: () => setActiveModal('market'),
    },
    {
      id: 'reviews',
      label: 'Nhận Xét',
      iconName: 'star',
      badge: 0,
      action: () => setActiveModal('reviews'),
    },
  ];

  return (
    <nav className="w-full bg-[#FFFDF9]/95 backdrop-blur-md border-t border-amber-300 shadow-lg px-2 py-1.5 shrink-0 z-30 pb-[max(0.5rem,env(safe-area-inset-bottom))] font-baloo">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.action}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all relative cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-amber-100 text-amber-950 font-black scale-105 border border-amber-400/60 shadow-sm'
                  : 'text-stone-600 hover:text-amber-950 font-bold'
              }`}
            >
              <div className="relative mb-0.5">
                <GameAssetIcon
                  name={item.iconName}
                  size={20}
                  className={isActive ? 'scale-110 drop-shadow' : 'opacity-80'}
                />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] leading-tight tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
