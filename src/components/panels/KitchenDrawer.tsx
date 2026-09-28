'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_ASSETS } from '@/game/assets/gameAssets';
import { CookingEngine, CookingTargetOrder } from '@/components/cooking/CookingEngine';
import { DishPicker } from '@/components/modals/DishPicker';
import { CloseButton } from '@/components/ui/game/CloseButton';
import { GameButton } from '@/components/ui/game/GameButton';

interface KitchenDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrder?: CookingTargetOrder | null;
}

export const KitchenDrawer: React.FC<KitchenDrawerProps> = ({
  isOpen,
  onClose,
  initialOrder = null,
}) => {
  const {
    tables,
    deliveryQueue,
    dishes,
    inventory,
    preparedDishes,
    completeCustomOrder,
    prepareInstantItem,
    discardPreparedDish,
  } = useGameStore();

  const [currentOrder, setCurrentOrder] = useState<CookingTargetOrder | null>(null);
  const [isDishPickerOpen, setIsDishPickerOpen] = useState(false);

  const waitingOrders = useMemo<CookingTargetOrder[]>(() => {
    const result: CookingTargetOrder[] = [];

    tables.forEach((table) => {
      if (table.status === 'seated' && table.customer) {
        result.push({
          orderType: 'dine_in',
          orderId: table.customer.id,
          tableId: table.id,
          customerName: table.customer.name,
          dishId: table.customer.orderDishId,
          dishName: table.customer.orderDishName,
          dishEmoji: table.customer.orderDishEmoji,
          requiredToppings: table.customer.requiredToppings,
          excludedToppings: table.customer.excludedToppings,
          spiceLevel: table.customer.spiceLevel,
          price: dishes[table.customer.orderDishId]?.price || 50,
        });
      }
    });

    deliveryQueue.forEach((order) => {
      result.push({
        orderType: 'delivery',
        orderId: order.id,
        customerName: order.customerName,
        dishId: order.dishId,
        dishName: order.dishName,
        dishEmoji: order.dishEmoji,
        requiredToppings: order.requiredToppings,
        excludedToppings: order.excludedToppings,
        spiceLevel: order.spiceLevel,
        price: order.price,
      });
    });

    return result;
  }, [tables, deliveryQueue, dishes]);

  useEffect(() => {
    if (!isOpen) return;

    if (initialOrder) {
      setCurrentOrder(initialOrder);
      return;
    }

    setCurrentOrder((current) => {
      if (current?.orderType === 'free_cook') return current;
      if (
        current?.orderId &&
        waitingOrders.some((order) => order.orderId === current.orderId)
      ) {
        return current;
      }
      return waitingOrders[0] || null;
    });
  }, [isOpen, initialOrder, waitingOrders]);

  if (!isOpen) return null;

  const handleSelectFreeDish = (dishId: string) => {
    const dish = dishes[dishId];
    if (!dish || !dish.isUnlocked) return;

    if (dish.stationType === 'instant') {
      prepareInstantItem(dishId);
      setCurrentOrder(null);
      return;
    }

    setCurrentOrder({
      orderType: 'free_cook',
      customerName: 'Nấu tự do',
      dishId,
      dishName: dish.name,
      dishEmoji: '',
      requiredToppings: [],
      excludedToppings: [],
      spiceLevel: undefined,
      price: dish.price,
    });
  };

  const handleFinish = (result: {
    order: CookingTargetOrder;
    validation: any;
    usedIngredients: any[];
    toppings: any[];
    spiceLevel: number;
  }) => {
    const completed = completeCustomOrder({
      orderType: result.order.orderType,
      orderId: result.order.orderId,
      tableId: result.order.tableId,
      dishId: result.order.dishId,
      quality: result.validation.quality,
      score: result.validation.score,
      toppings: result.toppings,
      spiceLevel: result.spiceLevel,
      usedIngredients: result.usedIngredients,
    });

    if (!completed) return;

    const next = waitingOrders.find((order) => order.orderId !== result.order.orderId);
    setCurrentOrder(next || null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end bg-black/65 backdrop-blur-sm sm:items-stretch sm:justify-end">
        <button
          type="button"
          aria-label="Đóng gian bếp"
          className="absolute inset-0 cursor-default"
          onClick={onClose}
        />

        <motion.section
          initial={{ y: 36, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 36, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative z-10 flex h-[88dvh] w-full flex-col overflow-hidden rounded-t-3xl border-t border-amber-500/35 bg-[#1b1411]/98 text-stone-100 shadow-2xl sm:h-full sm:max-w-[760px] sm:rounded-none sm:border-l sm:border-t-0"
        >
          <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-stone-600/70 sm:hidden" />

          <header className="flex shrink-0 items-center justify-between gap-2 border-b border-amber-500/20 px-3 py-2.5 sm:px-4 sm:py-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="relative h-9 w-9 shrink-0 rounded-xl border border-amber-400/20 bg-amber-600/10 p-1">
                <Image src={GAME_ASSETS.navigation.kitchen} alt="" fill sizes="36px" className="object-contain p-1" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-xs font-black uppercase tracking-wide text-amber-100 sm:text-sm">
                    Gian bếp
                  </h2>
                  <span className="rounded-full border border-emerald-500/25 bg-emerald-950/60 px-2 py-0.5 text-[9px] font-black text-emerald-300">
                    Khay {preparedDishes.length}/8
                  </span>
                </div>
                <p className="truncate text-[10px] font-bold text-amber-200/55">
                  Chọn đơn hoặc nấu tự do
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <GameButton
                compact
                onClick={() => setIsDishPickerOpen(true)}
                iconSrc={GAME_ASSETS.navigation.menu}
              >
                Nấu tự do
              </GameButton>
              <CloseButton onClick={onClose} />
            </div>
          </header>

          <div className="game-scrollbar flex shrink-0 items-center gap-1.5 overflow-x-auto border-b border-stone-800 bg-black/20 px-3 py-2">
            <span className="shrink-0 text-[9px] font-black uppercase tracking-wider text-stone-500">
              Đơn chờ
            </span>

            {waitingOrders.length === 0 ? (
              <span className="text-[10px] font-bold text-stone-400">Không có đơn đang chờ</span>
            ) : (
              waitingOrders.map((order) => {
                const selected = currentOrder?.orderId === order.orderId;
                const dishAsset = (GAME_ASSETS.dishes as Record<string, string>)[order.dishId];

                return (
                  <button
                    key={`${order.orderType}-${order.orderId}`}
                    type="button"
                    onClick={() => setCurrentOrder(order)}
                    className={`flex h-9 shrink-0 items-center gap-1.5 rounded-xl border px-2.5 text-[10px] font-black transition active:scale-95 ${
                      selected
                        ? 'border-amber-300/60 bg-amber-600/70 text-white'
                        : 'border-stone-700 bg-stone-900/80 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    {dishAsset && (
                      <span className="relative h-5 w-5 shrink-0">
                        <Image src={dishAsset} alt="" fill sizes="20px" className="object-contain" />
                      </span>
                    )}
                    <span className="max-w-[92px] truncate">{order.customerName}</span>
                  </button>
                );
              })
            )}
          </div>

          <main className="game-scrollbar min-h-0 flex-1 overflow-y-auto p-2.5 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-4">
            {currentOrder ? (
              <CookingEngine
                key={`${currentOrder.orderType}-${currentOrder.orderId || currentOrder.dishId}-${currentOrder.tableId || 'free'}`}
                order={currentOrder}
                inventory={inventory}
                onFinishCook={handleFinish}
                onClose={() => setCurrentOrder(null)}
              />
            ) : (
              <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                <span className="relative mb-2 h-20 w-20 opacity-80">
                  <Image src={GAME_ASSETS.cooking.pot} alt="" fill sizes="80px" className="object-contain" />
                </span>
                <h3 className="text-sm font-black text-amber-100">Chưa chọn món</h3>
                <p className="mt-1 max-w-xs text-[11px] leading-relaxed text-stone-400">
                  Chọn một đơn phía trên hoặc mở danh sách món để nấu tự do.
                </p>
                <GameButton className="mt-3" onClick={() => setIsDishPickerOpen(true)}>
                  Chọn món
                </GameButton>
              </div>
            )}
          </main>

          {preparedDishes.length > 0 && (
            <footer className="shrink-0 border-t border-amber-500/20 bg-black/25 px-3 py-2">
              <div className="game-scrollbar flex items-center gap-1.5 overflow-x-auto">
                <span className="shrink-0 text-[9px] font-black uppercase text-amber-200/60">
                  Khay món
                </span>
                {preparedDishes.map((dish) => {
                  const dishAsset = (GAME_ASSETS.dishes as Record<string, string>)[dish.dishId];
                  return (
                    <div
                      key={dish.id}
                      className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-amber-500/25 bg-amber-950/40 px-2"
                    >
                      {dishAsset && (
                        <span className="relative h-5 w-5">
                          <Image src={dishAsset} alt="" fill sizes="20px" className="object-contain" />
                        </span>
                      )}
                      <span className="max-w-[90px] truncate text-[10px] font-black text-amber-100">{dish.name}</span>
                      <button
                        type="button"
                        onClick={() => discardPreparedDish(dish.id)}
                        className="ml-1 rounded-md px-1.5 py-1 text-[8px] font-black text-red-300 hover:bg-red-950/50"
                      >
                        BỎ
                      </button>
                    </div>
                  );
                })}
              </div>
            </footer>
          )}
        </motion.section>

        <DishPicker
          isOpen={isDishPickerOpen}
          onClose={() => setIsDishPickerOpen(false)}
          onSelectDish={handleSelectFreeDish}
        />
      </div>
    </AnimatePresence>
  );
};
