'use client';

import React from 'react';
import Image from 'next/image';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_ASSETS } from '@/game/assets/gameAssets';
import { GameModal } from '@/components/ui/game/GameModal';
import { GameButton } from '@/components/ui/game/GameButton';

const upgradeAsset = (id: string) => {
  if (id === 'stove_speed') return GAME_ASSETS.cooking.stove;
  if (id === 'delivery_ebike') return GAME_ASSETS.navigation.delivery;
  if (id === 'bargain_charm') return GAME_ASSETS.navigation.inventory;
  return GAME_ASSETS.props.condiment_tray;
};

export const UpgradeModal: React.FC = () => {
  const { activeModal, setActiveModal, upgrades, coins, buyUpgrade } = useGameStore();

  if (activeModal !== 'upgrades') return null;

  return (
    <GameModal
      title="Nâng cấp quán"
      subtitle="Thiết bị và dịch vụ hỗ trợ vận hành"
      onClose={() => setActiveModal('none')}
      maxWidth="max-w-xl"
      icon={<span className="relative h-9 w-9"><Image src={GAME_ASSETS.cooking.stove} alt="" fill sizes="36px" className="object-contain" /></span>}
    >
      <div className="space-y-2.5">
        {upgrades.map((upgrade) => {
          const maxed = upgrade.level >= upgrade.maxLevel;
          const canBuy = !maxed && coins >= upgrade.cost;
          return (
            <article key={upgrade.id} className="grid grid-cols-[48px_minmax(0,1fr)] gap-3 rounded-2xl border border-stone-700 bg-stone-900/65 p-3 sm:grid-cols-[48px_minmax(0,1fr)_auto] sm:items-center">
              <span className="relative h-12 w-12 shrink-0 rounded-xl border border-amber-500/20 bg-black/20 p-1">
                <Image src={upgradeAsset(upgrade.id)} alt="" fill sizes="48px" className="object-contain p-1" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-xs font-black text-amber-100">{upgrade.name}</h3>
                  <span className="shrink-0 rounded-full border border-amber-500/20 bg-amber-950/40 px-2 py-0.5 text-[9px] font-black text-amber-300">
                    {upgrade.level}/{upgrade.maxLevel}
                  </span>
                </div>
                <p className="mt-0.5 text-[10px] leading-relaxed text-stone-400">{upgrade.description}</p>
                <p className="mt-1 text-[10px] font-bold text-emerald-300">{upgrade.effectDescription}</p>
              </div>

              <div className="col-span-2 shrink-0 sm:col-span-1">
                {maxed ? (
                  <span className="inline-flex min-h-[40px] w-full items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-950/50 px-3 py-2 text-[10px] font-black text-emerald-300 sm:w-auto">
                    Tối đa
                  </span>
                ) : (
                  <GameButton fullWidth compact disabled={!canBuy} onClick={() => buyUpgrade(upgrade.id)} className="sm:w-auto">
                    {upgrade.cost} Xu
                  </GameButton>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </GameModal>
  );
};
