'use client';

import React from 'react';
import { GAME_ASSETS } from '@/game/assets/gameAssets';
import { GameIconButton } from '@/components/ui/game/GameIconButton';
import { useGameStore } from '@/stores/useGameStore';

export type GamePanelType = 'kitchen' | 'delivery' | 'menu' | 'inventory' | 'upgrade' | null;

interface GameActionDockProps {
  activePanel: GamePanelType;
  onSelectPanel: (panel: GamePanelType) => void;
  waitingDineInCount?: number;
  deliveryCount?: number;
}

export const GameActionDock: React.FC<GameActionDockProps> = ({
  activePanel,
  onSelectPanel,
  waitingDineInCount = 0,
  deliveryCount = 0,
}) => {
  const { tables, deliveryQueue } = useGameStore();

  const totalWaitingOrders =
    waitingDineInCount || tables.filter((t) => t.status === 'seated').length;
  const totalDeliveries = deliveryCount || deliveryQueue.length;

  return (
    <nav
      aria-label="Thanh điều hướng trò chơi"
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none pb-[max(0.35rem,env(safe-area-inset-bottom))] px-1.5 sm:px-2"
    >
      <div className="pointer-events-auto grid grid-cols-5 items-stretch gap-0.5 sm:gap-1.5 p-1 sm:p-2 bg-stone-900/95 backdrop-blur-md border border-amber-600/50 rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full">
        {/* 1. Quán (Màn hình chính) */}
        <GameIconButton
          asset={GAME_ASSETS.navigation.restaurant}
          label="Quán"
          size="dock"
          variant="dock"
          active={activePanel === null}
          onClick={() => onSelectPanel(null)}
          title="Trở về sảnh quán ăn Hanok"
        />

        {/* 2. Bếp Nấu (Kitchen Panel) */}
        <GameIconButton
          asset={GAME_ASSETS.navigation.kitchen}
          label="Bếp"
          size="dock"
          variant="dock"
          badge={totalWaitingOrders > 0 ? totalWaitingOrders : null}
          active={activePanel === 'kitchen'}
          onClick={() => onSelectPanel(activePanel === 'kitchen' ? null : 'kitchen')}
          title="Mở gian bếp chế biến theo yêu cầu"
        />

        {/* 3. Giao Hàng (Delivery Panel) */}
        <GameIconButton
          asset={GAME_ASSETS.navigation.delivery}
          label="Giao Hàng"
          size="dock"
          variant="dock"
          badge={totalDeliveries > 0 ? totalDeliveries : null}
          active={activePanel === 'delivery'}
          onClick={() => onSelectPanel(activePanel === 'delivery' ? null : 'delivery')}
          title="Mở danh sách đơn shipper trực tuyến"
        />

        {/* 4. Thực Đơn (Menu Modal) */}
        <GameIconButton
          asset={GAME_ASSETS.navigation.menu}
          label="Thực Đơn"
          size="dock"
          variant="dock"
          active={activePanel === 'menu'}
          onClick={() => onSelectPanel(activePanel === 'menu' ? null : 'menu')}
          title="Sổ thực đơn và công thức món ăn"
        />

        {/* 5. Chợ / Kho (Inventory & Market) */}
        <GameIconButton
          asset={GAME_ASSETS.navigation.inventory}
          label="Chợ Sớm"
          size="dock"
          variant="dock"
          active={activePanel === 'inventory'}
          onClick={() => onSelectPanel(activePanel === 'inventory' ? null : 'inventory')}
          title="Đi chợ sớm & quản lý kho nguyên liệu"
        />
      </div>
    </nav>
  );
};
