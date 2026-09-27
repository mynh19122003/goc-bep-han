'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { IngredientId } from '@/types/game';
import { GAME_ASSETS } from '@/config/gameAssets';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';

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

  const updateCartQty = (id: IngredientId, delta: number) => {
    const current = cart[id] || 0;
    const next = Math.max(0, current + delta);
    setCart({ ...cart, [id]: next });
  };

  let totalCost = 0;
  let totalItemsCount = 0;
  Object.entries(cart).forEach(([id, qty]) => {
    const item = inventory[id];
    if (item && qty > 0) {
      totalCost += item.cost * qty;
      totalItemsCount += qty;
    }
  });

  const canAfford = coins >= totalCost && totalCost > 0;

  const handleCheckout = () => {
    const list = Object.entries(cart)
      .filter(([_, qty]) => qty > 0)
      .map(([id, quantity]) => ({ id: id as IngredientId, quantity }));

    if (list.length === 0) return;
    const success = buyIngredients(list);
    if (success) {
      setCart({});
      setActiveModal('none');
    }
  };

  const inventoryList = Object.values(inventory);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 select-none font-baloo">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="bg-stone-900 rounded-3xl max-w-lg w-full p-4 sm:p-5 shadow-2xl border-4 border-amber-600/60 relative flex flex-col max-h-[90vh] text-stone-100"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setActiveModal('none')}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-100 border border-stone-700 transition-colors cursor-pointer"
          >
            <GameAssetIcon name="close" size={18} />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
              <GameAssetIcon name="cart" size={24} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-200 tracking-wide uppercase">
                CHỢ SỚM NORYANGJIN
              </h2>
              <p className="text-[11px] text-amber-300/80 font-bold">
                Giá cả biến động mỗi sáng theo thời tiết và thời vụ
              </p>
            </div>
          </div>

          {/* Morning Newspaper Card */}
          <div className="bg-amber-950/40 rounded-2xl p-2.5 border-2 border-amber-600/40 mb-3 shadow-inner">
            <div className="flex items-center justify-between text-[11px] font-black text-amber-300 border-b border-amber-600/30 pb-1 mb-1.5">
              <span>BẢN TIN CHỢ SÁNG HÔM NAY</span>
              <span className="text-amber-400">{currentNews.dateStr}</span>
            </div>
            <h4 className="font-black text-amber-100 text-xs">{currentNews.headline}</h4>
            <p className="text-[11px] text-stone-300 mt-0.5">{currentNews.subtext}</p>
            <span className="inline-block mt-1 text-[10px] font-black text-red-300 bg-red-950/80 border border-red-500/40 px-2 py-0.5 rounded-md">
              {currentNews.affectedNotice}
            </span>
          </div>

          {/* Catalog Scrollable List */}
          <div className="overflow-y-auto space-y-2 pr-1 flex-1">
            {inventoryList.map((item) => {
              const currentQty = cart[item.id] || 0;
              const isBanned = bannedMarketItemsToday.includes(item.id);
              const assetSrc =
                (GAME_ASSETS.ingredients as Record<string, string>)[item.id] ||
                (GAME_ASSETS.toppings as Record<string, string>)[item.id] ||
                GAME_ASSETS.ingredients.trung;

              return (
                <div
                  key={item.id}
                  className={`border-2 rounded-2xl p-2.5 flex items-center justify-between gap-2 transition-all ${
                    isBanned
                      ? 'bg-red-950/30 border-red-900/60 opacity-60'
                      : 'bg-stone-950/70 hover:border-amber-600/50 border-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 p-1 bg-stone-800 rounded-xl shadow-inner border border-amber-500/30 flex items-center justify-center shrink-0">
                      <Image
                        src={assetSrc}
                        alt={item.vietnameseName}
                        width={32}
                        height={32}
                        className="w-full h-full object-contain pointer-events-none drop-shadow"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-amber-100 text-xs truncate">
                          {item.vietnameseName}
                        </h4>
                        {/* Price change badge */}
                        {item.priceChangePercent > 0 ? (
                          <span className="text-[9px] font-bold text-red-300 bg-red-950/80 border border-red-500/40 px-1 rounded">
                            +{item.priceChangePercent}%
                          </span>
                        ) : item.priceChangePercent < 0 ? (
                          <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-1 rounded">
                            {item.priceChangePercent}%
                          </span>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] mt-0.5">
                        <span className="text-amber-400 font-black">{item.cost} Xu</span>
                        <span className="text-stone-600">•</span>
                        <span className="text-stone-300">Kho: {item.stock}</span>
                        <span className="text-stone-600">•</span>
                        <span className="text-emerald-400 font-semibold">Hạn: {item.shelfLifeDays}d</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Bargain Trigger */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isBanned ? (
                      <span className="text-[10px] font-bold text-red-300 bg-red-950/80 border border-red-500/40 px-2 py-1 rounded-xl">
                        Từ chối bán
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => startBargain(item.id, Math.max(3, currentQty || 3))}
                          title="Mặc cả với tiểu thương"
                          className="p-1.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 rounded-xl font-black text-[10px] flex items-center gap-1 active:scale-95 shadow-sm cursor-pointer"
                        >
                          <GameAssetIcon name="ingredient" size={14} />
                          <span className="hidden sm:inline">Mặc Cả</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.id, -1)}
                            className="w-7 h-7 rounded-lg bg-stone-800 border border-stone-700 font-bold text-stone-200 hover:bg-stone-700 flex items-center justify-center text-xs cursor-pointer active:scale-95"
                          >
                            <GameAssetIcon name="minus" size={12} />
                          </button>
                          <span className="font-black text-amber-300 w-5 text-center text-xs">
                            {currentQty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.id, 1)}
                            className="w-7 h-7 rounded-lg bg-emerald-600 font-bold text-white hover:bg-emerald-500 flex items-center justify-center text-xs cursor-pointer active:scale-95"
                          >
                            <GameAssetIcon name="plus" size={12} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout Footer */}
          <div className="mt-3 pt-3 border-t border-stone-800 flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] text-stone-400 block">Tổng thanh toán:</span>
              <div className="flex items-center gap-1.5">
                <GameAssetIcon name="coin" size={18} />
                <span className="text-base font-black text-amber-200">
                  {totalCost.toLocaleString()}
                </span>
                <span className="text-xs text-amber-300/80 font-bold">Xu</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={!canAfford}
              className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
                canAfford
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white active:scale-95 border border-emerald-400/40'
                  : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
              }`}
            >
              <GameAssetIcon name="complete" size={16} />
              <span>Nhập Hàng Vào Kho</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
