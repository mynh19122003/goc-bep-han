'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_ASSETS } from '@/game/assets/gameAssets';
import { CookingEngine, CookingTargetOrder } from '@/components/cooking/CookingEngine';
import { TokbokkiStation } from '@/components/cooking/TokbokkiStation';
import { RamyeonStation } from '@/components/cooking/RamyeonStation';
import { KimbapStation } from '@/components/cooking/KimbapStation';
import { DishPicker } from '@/components/modals/DishPicker';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';
import { GameIconButton } from '@/components/ui/game/GameIconButton';

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
    activeStation,
    setActiveStation,
    discardPreparedDish,
  } = useGameStore();

  const [currentOrder, setCurrentOrder] = useState<CookingTargetOrder | null>(initialOrder);
  const [isDishPickerOpen, setIsDishPickerOpen] = useState(false);

  // Update currentOrder when initialOrder changes from outside
  useEffect(() => {
    if (!isOpen) return;
    setActiveStation(null);

    if (initialOrder) {
      setCurrentOrder(initialOrder);
      setActiveStation(null);
    } else if (!currentOrder) {
      // Default to first waiting table customer or first delivery
      const firstSeated = tables.find((t) => t.status === 'seated' && t.customer);
      if (firstSeated?.customer) {
        setCurrentOrder({
          orderType: 'dine_in',
          orderId: firstSeated.customer.id,
          tableId: firstSeated.id,
          customerName: firstSeated.customer.name,
          dishId: firstSeated.customer.orderDishId,
          dishName: firstSeated.customer.orderDishName,
          dishEmoji: firstSeated.customer.orderDishEmoji,
          requiredToppings: firstSeated.customer.requiredToppings,
          excludedToppings: firstSeated.customer.excludedToppings,
          spiceLevel: firstSeated.customer.spiceLevel,
          price: dishes[firstSeated.customer.orderDishId]?.price || 50,
        });
      } else if (deliveryQueue.length > 0) {
        const firstDel = deliveryQueue[0];
        setCurrentOrder({
          orderType: 'delivery',
          orderId: firstDel.id,
          customerName: firstDel.customerName,
          dishId: firstDel.dishId,
          dishName: firstDel.dishName,
          dishEmoji: firstDel.dishEmoji,
          requiredToppings: firstDel.requiredToppings,
          excludedToppings: firstDel.excludedToppings,
          spiceLevel: firstDel.spiceLevel,
          price: firstDel.price,
        });
      } else {
        setCurrentOrder(null);
      }
    }
  }, [initialOrder, isOpen]);

  if (!isOpen) return null;

  // Compile list of all waiting orders for quick switching chips
  const waitingOrders: CookingTargetOrder[] = [];

  tables.forEach((table) => {
    if (table.status === 'seated' && table.customer) {
      waitingOrders.push({
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

  deliveryQueue.forEach((del) => {
    waitingOrders.push({
      orderType: 'delivery',
      orderId: del.id,
      customerName: del.customerName,
      dishId: del.dishId,
      dishName: del.dishName,
      dishEmoji: del.dishEmoji,
      requiredToppings: del.requiredToppings,
      excludedToppings: del.excludedToppings,
      spiceLevel: del.spiceLevel,
      price: del.price,
    });
  });

  // Handle selecting a dish from Dish Picker
  const handleSelectFreeDish = (dishId: string) => {
    const dish = dishes[dishId];
    if (!dish || !dish.isUnlocked) return;

    if (dish.stationType === 'instant') {
      prepareInstantItem(dishId);
      setCurrentOrder(null);
      setActiveStation(null);
      return;
    }

    setCurrentOrder({
      orderType: 'free_cook',
      customerName: 'Đầu Bếp Sáng Tạo',
      dishId,
      dishName: dish.name,
      dishEmoji: '',
      requiredToppings: [],
      excludedToppings: [],
      spiceLevel: undefined,
      price: dish.price,
    });
    setActiveStation(null);
  };

  const handleFinishCustomCook = (result: {
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

    if (!completed) {
      return;
    }

    // Auto advance to next waiting order or close if none left
    const remaining = waitingOrders.filter(
      (o) => o.orderId !== result.order.orderId
    );
    if (remaining.length > 0) {
      setCurrentOrder(remaining[0]);
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/70 backdrop-blur-xs select-none font-baloo">
        {/* Backdrop click to close */}
        <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

        {/* Drawer Container (Right side on Desktop, Bottom Sheet on Mobile) */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-10 w-full sm:max-w-2xl lg:max-w-3xl h-full bg-stone-900/95 backdrop-blur-xl border-l-2 border-amber-600/50 shadow-2xl flex flex-col justify-between overflow-hidden text-stone-100"
        >
          {/* 1. Drawer Header */}
          <div className="shrink-0 p-3 sm:p-4 border-b border-amber-600/30 bg-stone-950/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-600/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                <Image
                  src={GAME_ASSETS.navigation.kitchen}
                  alt="Bếp nấu"
                  width={30}
                  height={30}
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-amber-200 uppercase tracking-wide flex items-center gap-2 leading-tight">
                  <span>GIAN BẾP NẤU HÀN QUỐC</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                    Khay: {preparedDishes.length}/8
                  </span>
                </h2>
                <span className="text-[11px] text-amber-300/80 font-bold block leading-none">
                  Chế biến theo yêu cầu • Mì Cay, Tokbokki, Kimbap
                </span>
              </div>
            </div>

            {/* Header Actions: + Nấu Tự Do & Close Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDishPickerOpen(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white rounded-xl text-xs font-black shadow border border-amber-400/50 flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
              >
                <GameAssetIcon name="menu" size={14} />
                <span>+ Nấu Tự Do</span>
              </button>

              <GameIconButton
                asset={GAME_ASSETS.actions.close}
                size="sm"
                variant="glass"
                onClick={onClose}
                title="Đóng gian bếp"
              />
            </div>
          </div>

          {/* 2. Quick Active Orders Chips Bar */}
          <div className="shrink-0 px-3 py-2 bg-stone-950/60 border-b border-stone-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-bold text-stone-400 shrink-0 uppercase tracking-wider">
              Đơn Chờ:
            </span>

            {waitingOrders.length === 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-300/80 font-bold italic">
                  Chưa có đơn chờ từ khách
                </span>
                <button
                  type="button"
                  onClick={() => setIsDishPickerOpen(true)}
                  className="text-xs font-black text-amber-400 underline cursor-pointer hover:text-amber-300"
                >
                  Chọn món nấu ngay
                </button>
              </div>
            ) : (
              waitingOrders.map((order, idx) => {
                const isSelected =
                  currentOrder?.orderId === order.orderId && activeStation === null;
                const dishAsset =
                  (GAME_ASSETS.dishes as Record<string, string>)[order.dishId] ||
                  GAME_ASSETS.dishes.ramyeon;

                return (
                  <button
                    key={`${order.orderType}-${order.orderId || idx}`}
                    type="button"
                    onClick={() => {
                      setCurrentOrder(order);
                      setActiveStation(null);
                    }}
                    className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-300 shadow-md scale-105'
                        : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300 border-stone-700'
                    }`}
                  >
                    <div className="w-4 h-4 relative shrink-0">
                      <Image
                        src={dishAsset}
                        alt={order.dishName}
                        width={16}
                        height={16}
                        className="object-contain"
                      />
                    </div>
                    <span className="truncate max-w-[90px]">{order.customerName}</span>
                    {order.spiceLevel !== undefined && order.spiceLevel > 0 && (
                      <span className="text-[10px] text-red-300">
                        Lv.{order.spiceLevel}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* 3. Main Cooking Area (CookingEngine or Specific Stations) */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-4">
            {activeStation === 'tokbokki' ? (
              <TokbokkiStation />
            ) : activeStation === 'ramyeon' ? (
              <RamyeonStation />
            ) : activeStation === 'kimbap' ? (
              <KimbapStation />
            ) : currentOrder ? (
              <CookingEngine
                key={`${currentOrder.orderType}-${currentOrder.orderId || currentOrder.dishId}-${currentOrder.tableId || 'free'}`}
                order={currentOrder}
                inventory={inventory}
                onFinishCook={handleFinishCustomCook}
                onClose={() => setCurrentOrder(null)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 relative mb-2 opacity-75">
                  <Image
                    src={GAME_ASSETS.cooking.pot}
                    alt="Nồi nấu"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-sm font-black text-amber-200 mb-1">
                  Chưa chọn món để chế biến
                </h3>
                <p className="text-xs text-stone-400 max-w-xs mb-3">
                  Chọn một đơn hàng chờ bên trên hoặc mở Thực Đơn Nấu Tự Do để thỏa sức sáng tạo.
                </p>
                <button
                  type="button"
                  onClick={() => setIsDishPickerOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:brightness-110 text-white rounded-2xl font-black text-xs sm:text-sm shadow-lg border border-amber-300 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <GameAssetIcon name="menu" size={16} />
                  <span>Mở Menu Chọn Món Tự Do</span>
                </button>
              </div>
            )}
          </div>

          {/* 4. Drawer Footer: Prepared Dishes Tray */}
          {preparedDishes.length > 0 && (
            <div className="shrink-0 p-2 sm:p-3 bg-stone-950 border-t border-amber-600/30 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[10px] font-bold text-amber-300/80 shrink-0 uppercase">
                  Món Đã Nấu Xong:
                </span>
                {preparedDishes.map((dish) => {
                  const dishAsset =
                    (GAME_ASSETS.dishes as Record<string, string>)[dish.dishId] ||
                    GAME_ASSETS.dishes.ramyeon;
                  return (
                    <div
                      key={dish.id}
                      className="shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-xl bg-amber-950/80 border border-amber-500/50 text-xs font-black text-amber-200"
                    >
                      <div className="w-4 h-4 relative shrink-0">
                        <Image
                          src={dishAsset}
                          alt={dish.name}
                          width={16}
                          height={16}
                          className="object-contain"
                        />
                      </div>
                      <span className="truncate max-w-[80px]">{dish.name}</span>
                      <button
                        type="button"
                        onClick={() => discardPreparedDish(dish.id)}
                        className="text-stone-400 hover:text-red-400 text-xs ml-1 cursor-pointer"
                        title="Hủy món này"
                      >
                        <GameAssetIcon name="close" size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* 5. Dish Picker Modal */}
      <DishPicker
        isOpen={isDishPickerOpen}
        onClose={() => setIsDishPickerOpen(false)}
        onSelectDish={handleSelectFreeDish}
      />
    </AnimatePresence>
  );
};
