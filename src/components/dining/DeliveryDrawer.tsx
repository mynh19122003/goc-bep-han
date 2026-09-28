'use client';

import React from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_ASSETS } from '@/game/assets/gameAssets';
import { CloseButton } from '@/components/ui/game/CloseButton';
import { GameButton } from '@/components/ui/game/GameButton';
import { preparedDishMatchesOrder } from '@/core/gameCore';

interface DeliveryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeliveryDrawer: React.FC<DeliveryDrawerProps> = ({ isOpen, onClose }) => {
  const { deliveryQueue, preparedDishes, serveDeliveryOrder } = useGameStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end bg-black/65 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4">
        <button type="button" aria-label="Đóng giao hàng" className="absolute inset-0" onClick={onClose} />

        <motion.section
          initial={{ y: 36, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 36, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative z-10 flex h-[82dvh] w-full flex-col overflow-hidden rounded-t-3xl border-t border-teal-400/30 bg-[#171412]/98 text-stone-100 shadow-2xl sm:h-auto sm:max-h-[82vh] sm:max-w-[620px] sm:rounded-3xl sm:border"
        >
          <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-stone-600/70 sm:hidden" />

          <header className="flex items-center justify-between gap-2 border-b border-stone-800 px-3 py-3 sm:px-4">
            <div className="flex min-w-0 items-center gap-2">
              <span className="relative h-9 w-9 shrink-0 rounded-xl border border-teal-400/20 bg-teal-950/50 p-1">
                <Image src={GAME_ASSETS.navigation.delivery} alt="" fill sizes="36px" className="object-contain p-1" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-black uppercase text-teal-100">Giao tận nơi</h3>
                  <span className="rounded-full border border-teal-500/25 bg-teal-950/60 px-2 py-0.5 text-[9px] font-black text-teal-300">
                    {deliveryQueue.length} đơn
                  </span>
                </div>
                <p className="truncate text-[10px] font-bold text-stone-400">Giao khi shipper đã tới cửa</p>
              </div>
            </div>
            <CloseButton onClick={onClose} />
          </header>

          <div className="game-scrollbar min-h-0 flex-1 overflow-y-auto p-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-4">
            {deliveryQueue.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                <span className="relative mb-2 h-16 w-16 opacity-70">
                  <Image src={GAME_ASSETS.props.delivery_crate} alt="" fill sizes="64px" className="object-contain" />
                </span>
                <h4 className="text-sm font-black text-stone-200">Chưa có đơn online</h4>
                <p className="mt-1 max-w-xs text-[11px] leading-relaxed text-stone-500">
                  Khi có khách đặt món, đơn giao sẽ xuất hiện tại đây.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {deliveryQueue.map((order) => {
                  const canServe =
                    order.shipperStatus === 'arrived' &&
                    preparedDishes.some((prepared) =>
                      preparedDishMatchesOrder({
                        prepared,
                        orderId: order.id,
                        dishId: order.dishId,
                        requiredToppings: order.requiredToppings,
                        excludedToppings: order.excludedToppings,
                        spiceLevel: order.spiceLevel,
                      })
                    );

                  const dishAsset = (GAME_ASSETS.dishes as Record<string, string>)[order.dishId];

                  return (
                    <article
                      key={order.id}
                      className={`rounded-2xl border p-3 ${
                        order.shipperStatus === 'arrived'
                          ? 'border-teal-400/40 bg-teal-950/20'
                          : 'border-stone-700 bg-stone-900/65'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black text-teal-300">{order.id}</span>
                            <span className="truncate text-[10px] font-bold text-stone-400">{order.customerName}</span>
                          </div>
                          <p className="mt-0.5 truncate text-[9px] text-stone-500">{order.address}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="block text-xs font-black text-amber-200">+{order.price + order.tip} Xu</span>
                          <span className="text-[9px] font-bold text-emerald-400">Tip {order.tip} Xu</span>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-stone-700/70 bg-black/20 p-2">
                        <div className="flex min-w-0 items-center gap-2">
                          {dishAsset ? (
                            <span className="relative h-9 w-9 shrink-0">
                              <Image src={dishAsset} alt="" fill sizes="36px" className="object-contain" />
                            </span>
                          ) : (
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-900/40 text-[8px] font-black text-red-300">
                              Thiếu ảnh
                            </span>
                          )}
                          <span className="truncate text-xs font-black text-stone-100">{order.dishName}</span>
                        </div>

                        <span className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-black ${
                          order.shipperStatus === 'arrived'
                            ? 'border-teal-400/30 bg-teal-950/50 text-teal-300'
                            : 'border-stone-600 bg-stone-900 text-stone-400'
                        }`}>
                          {order.shipperStatus === 'arrived'
                            ? `Đang chờ ${Math.ceil(order.shipperWaitSeconds)}s`
                            : `Tới sau ${Math.ceil(order.shipperArriveSeconds)}s`}
                        </span>
                      </div>

                      <GameButton
                        fullWidth
                        compact
                        tone={canServe ? 'success' : 'neutral'}
                        disabled={!canServe}
                        onClick={() => serveDeliveryOrder(order.id)}
                        className="mt-2"
                      >
                        {canServe
                          ? 'Giao cho shipper'
                          : order.shipperStatus === 'on_the_way'
                          ? 'Đang chờ shipper'
                          : 'Chưa có món trên khay'}
                      </GameButton>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </AnimatePresence>
  );
};
