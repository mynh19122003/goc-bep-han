'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/stores/useGameStore';
import { IngredientId } from '@/types/game';
import { GAME_ASSETS } from '@/game/assets/gameAssets';
import { GameModal } from '@/components/ui/game/GameModal';
import { GameButton } from '@/components/ui/game/GameButton';

export const MarketModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    inventory,
    coins,
    currentNews,
    bannedMarketItemsToday,
    buyIngredients,
    startBargain,
  } = useGameStore();

  const [cart, setCart] = useState<Record<string, number>>({});

  if (activeModal !== 'market') return null;

  const items = Object.values(inventory);

  const updateQty = (id: IngredientId, delta: number) => {
    setCart((current) => ({ ...current, [id]: Math.max(0, (current[id] || 0) + delta) }));
  };

  const totalCost = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = inventory[id];
    return sum + (item && qty > 0 ? item.cost * qty : 0);
  }, 0);

  const checkout = () => {
    const list = Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, quantity]) => ({ id: id as IngredientId, quantity }));

    if (list.length === 0) return;
    if (buyIngredients(list)) {
      setCart({});
      setActiveModal('none');
    }
  };

  return (
    <GameModal
      title="Chợ sáng"
      subtitle="Theo dõi giá, độ tươi và bổ sung kho"
      onClose={() => setActiveModal('none')}
      maxWidth="max-w-2xl"
      icon={<span className="relative h-9 w-9"><Image src={GAME_ASSETS.navigation.inventory} alt="" fill sizes="36px" className="object-contain" /></span>}
    >
      <section className="mb-3 rounded-2xl border border-amber-500/20 bg-amber-950/20 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[9px] font-black uppercase tracking-wider text-amber-300">Bản tin hôm nay</span>
          <span className="text-[9px] font-bold text-stone-500">{currentNews.dateStr}</span>
        </div>
        <h3 className="mt-1 text-xs font-black text-amber-100">{currentNews.headline}</h3>
        <p className="mt-0.5 text-[10px] leading-relaxed text-stone-400">{currentNews.subtext}</p>
        <span className="mt-1.5 inline-block rounded-lg border border-red-500/20 bg-red-950/40 px-2 py-1 text-[9px] font-black text-red-300">
          {currentNews.affectedNotice}
        </span>
      </section>

      <div className="space-y-2">
        {items.map((item) => {
          const qty = cart[item.id] || 0;
          const banned = bannedMarketItemsToday.includes(item.id);
          const asset =
            (GAME_ASSETS.ingredients as Record<string, string>)[item.id] ||
            (GAME_ASSETS.toppings as Record<string, string>)[item.id];

          return (
            <article
              key={item.id}
              className={`flex items-center gap-2 rounded-2xl border p-2.5 ${
                banned ? 'border-red-900/40 bg-red-950/20 opacity-60' : 'border-stone-700 bg-stone-900/65'
              }`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-stone-700 bg-black/20 p-1">
                {asset ? (
                  <div className="relative h-9 w-9"><Image src={asset} alt={item.vietnameseName} fill sizes="36px" className="object-contain" /></div>
                ) : (
                  <span className="text-center text-[8px] font-black text-red-300">Thiếu asset</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate text-[11px] font-black text-amber-100">{item.vietnameseName}</h3>
                  {item.priceChangePercent !== 0 && (
                    <span className={`rounded px-1.5 py-0.5 text-[8px] font-black ${
                      item.priceChangePercent > 0 ? 'bg-red-950/60 text-red-300' : 'bg-emerald-950/60 text-emerald-300'
                    }`}>
                      {item.priceChangePercent > 0 ? '+' : ''}{item.priceChangePercent}%
                    </span>
                  )}
                </div>

                <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[9px] font-bold">
                  <span className="text-amber-300">{item.cost} Xu</span>
                  <span className="text-stone-400">Kho {item.stock}</span>
                  <span className={item.freshness > 60 ? 'text-emerald-300' : item.freshness > 10 ? 'text-amber-300' : 'text-red-300'}>
                    Tươi {item.freshness}%
                  </span>
                </div>
              </div>

              {banned ? (
                <span className="shrink-0 rounded-xl border border-red-800/40 px-2 py-1 text-[9px] font-black text-red-300">Tạm khóa</span>
              ) : (
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startBargain(item.id, Math.max(3, qty || 3))}
                    className="hidden min-h-[36px] rounded-lg border border-amber-500/20 bg-amber-950/40 px-2 text-[9px] font-black text-amber-300 transition hover:bg-amber-900/50 sm:block"
                  >
                    Mặc cả
                  </button>
                  <button type="button" onClick={() => updateQty(item.id, -1)} className="h-9 w-9 rounded-lg border border-stone-700 bg-stone-800 text-sm font-black text-stone-200 active:scale-95">−</button>
                  <span className="w-5 text-center text-[10px] font-black text-amber-200">{qty}</span>
                  <button type="button" onClick={() => updateQty(item.id, 1)} className="h-9 w-9 rounded-lg border border-emerald-500/25 bg-emerald-700 text-sm font-black text-white active:scale-95">+</button>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="sticky bottom-0 mt-3 flex items-center justify-between gap-3 rounded-2xl border border-amber-500/20 bg-[#17110f]/96 p-3 shadow-lg">
        <div>
          <p className="text-[9px] font-bold uppercase text-stone-500">Tổng đơn</p>
          <p className="text-base font-black text-amber-200">{totalCost.toLocaleString()} Xu</p>
        </div>
        <GameButton compact tone="success" disabled={totalCost <= 0 || coins < totalCost} onClick={checkout}>
          Nhập kho
        </GameButton>
      </div>
    </GameModal>
  );
};
