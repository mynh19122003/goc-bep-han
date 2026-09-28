'use client';

import React, { useEffect, useState } from 'react';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useGameStore } from '@/stores/useGameStore';
import { HeaderHUD } from '@/components/hud/HeaderHUD';
import { GameActionDock, GamePanelType } from '@/components/hud/GameActionDock';
import { RestaurantScene } from '@/components/scenes/RestaurantScene';
import { KitchenDrawer } from '@/components/panels/KitchenDrawer';
import { DeliveryDrawer } from '@/components/dining/DeliveryDrawer';
import { CookingTargetOrder } from '@/components/cooking/CookingEngine';

// Global Modals
import { MarketModal } from '@/components/market/MarketModal';
import { BargainMiniGame } from '@/components/market/BargainMiniGame';
import { ReviewFeedModal } from '@/components/hud/ReviewFeedModal';
import { MenuModal } from '@/components/modals/MenuModal';
import { UpgradeModal } from '@/components/modals/UpgradeModal';
import { DayEndModal } from '@/components/modals/DayEndModal';
import { SettingsModal } from '@/components/modals/SettingsModal';
import { CookbookModal } from '@/components/modals/CookbookModal';
import { GameIntroModal } from '@/components/modals/GameIntroModal';
import { GAME_VERSION } from '@/config/version';

export default function GamePage() {
  // Start continuous 1s game loop for customer patience, timers & day cycle
  useGameLoop();

  const { setActiveModal } = useGameStore();

  // Single active panel state (Contextual Drawer pattern: ONE GAME SCREEN)
  const [activePanel, setActivePanel] = useState<'kitchen' | 'delivery' | null>(null);
  const [targetedCookingOrder, setTargetedCookingOrder] = useState<CookingTargetOrder | null>(null);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const seenVersion = window.localStorage.getItem('goc-bep-han:intro-version');
    if (seenVersion !== GAME_VERSION) {
      setShowIntro(true);
    }
  }, []);

  const closeIntro = () => {
    window.localStorage.setItem('goc-bep-han:intro-version', GAME_VERSION);
    setShowIntro(false);
  };

  // Handle panel selection from bottom dock
  const handleSelectDockPanel = (panel: GamePanelType) => {
    if (panel === 'menu') {
      setActivePanel(null);
      setActiveModal('menu');
    } else if (panel === 'inventory') {
      setActivePanel(null);
      setActiveModal('market');
    } else if (panel === 'upgrade') {
      setActivePanel(null);
      setActiveModal('upgrades');
    } else {
      setActivePanel(panel);
    }
  };

  // Handle direct click on a table order to cook
  const handleCookOrder = (order: CookingTargetOrder) => {
    setTargetedCookingOrder(order);
    setActivePanel('kitchen');
  };

  return (
    <div className="w-full h-dvh overflow-hidden flex flex-col font-baloo bg-stone-950 text-stone-100 select-none relative">
      {/* ========================================================================= */}
      {/* 1. TOP GLOBAL HUD (28-34px standardized icons, day/time, coin, rating)    */}
      {/* ========================================================================= */}
      <HeaderHUD
        onOpenDelivery={() => setActivePanel('delivery')}
        onOpenSettings={() => setActiveModal('settings')}
        onOpenGuide={() => setShowIntro(true)}
      />

      {/* ========================================================================= */}
      {/* 2. MAIN GAME SCREEN: RESTAURANT SCENE (Takes 70-100% space)                */}
      {/* ========================================================================= */}
      <main className="flex-1 relative overflow-hidden w-full h-full">
        <RestaurantScene
          onCookOrder={handleCookOrder}
          onOpenKitchen={() => setActivePanel('kitchen')}
          onOpenDelivery={() => setActivePanel('delivery')}
        />

        {/* ========================================================================= */}
        {/* 3. CONTEXTUAL DRAWERS: KITCHEN & DELIVERY (Only ONE active at a time)     */}
        {/* ========================================================================= */}
        <KitchenDrawer
          isOpen={activePanel === 'kitchen'}
          onClose={() => {
            setActivePanel(null);
            setTargetedCookingOrder(null);
          }}
          initialOrder={targetedCookingOrder}
        />

        <DeliveryDrawer
          isOpen={activePanel === 'delivery'}
          onClose={() => setActivePanel(null)}
        />
      </main>

      {/* ========================================================================= */}
      {/* 4. GAME ACTION DOCK (Centered on desktop, full-width on mobile)           */}
      {/* ========================================================================= */}
      <GameActionDock
        activePanel={activePanel}
        onSelectPanel={handleSelectDockPanel}
      />

      {/* ========================================================================= */}
      {/* 5. GLOBAL MODALS (Market, Bargain, Reviews, Menu, Upgrades, Day End)      */}
      {/* ========================================================================= */}
      <MarketModal />
      <BargainMiniGame />
      <ReviewFeedModal />
      <MenuModal />
      <UpgradeModal />
      <DayEndModal />
      <SettingsModal />
      <CookbookModal />
      <GameIntroModal isOpen={showIntro} onClose={closeIntro} />
    </div>
  );
}
