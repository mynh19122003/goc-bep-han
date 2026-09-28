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
    activeStation,
    setActiveStation,
    discardPreparedDish,
  } = useGameStore();

  const [currentOrder, setCurrentOrder] = useState<CookingTargetOrder | null>(initialOrder);
  const [isDishPickerOpen, setIsDishPickerOpen] = useState(false);

  // Update currentOrder when initialOrder changes from outside
  useEffect(() => {
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
        // Free cook default dish
        setCurrentOrder({
          orderType: 'free_cook',
          customerName: 'Đầu Bếp Tự Do',
          dishId: 'spicy_ramyeon',
          dishName: 'Mì Cay Seoul 7 Cấp Độ',
          dishEmoji: '',
          requiredToppings: ['beef', 'sausage', 'kimchi'],
          spiceLevel: 2,
          price: 65,
        });
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
    setCurrentOrder({
      orderType: 'free_cook',
      customerName: 'Đầu Bếp Sáng Tạo',
      dishId: dishId,
      dishName: dish ? dish.name : 'Món Tự Chọn',
      dishEmoji: '',
      requiredToppings: ['beef', 'sausage', 'kimchi'],
      spiceLevel: 1,
      price: dish ? dish.price : 60,
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
    completeCustomOrder({
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
      <div className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end bg-stone-950/75 backdrop-blur-xs select-none font-baloo">
        {/* Backdrop click to close */}
        <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

        {/* Drawer Container: Bottom Sheet on Mobile, Right Panel on Desktop */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-10 w-full sm:max-w-2xl lg:max-w-3xl h-[90vh] sm:h-full bg-stone-900/98 backdrop-blur-xl rounded-t-[28px] sm:rounded-t-none border-t-2 sm:border-t-0 sm:border-l-2 border-amber-600/50 shadow-2xl flex flex-col justify-between overflow-hidden text-stone-100"
        >
          {/* Mobile pull indicator */}
          <div className="w-12 h-1.5 bg-stone-600/70 rounded-full mx-auto mt-2 sm:hidden shrink-0" />

          {/* 1. Drawer Header */}
          <div className="shrink-0 p-2.5 sm:p-4 border-b border-amber-600/30 bg-stone-950/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-600/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                <Image
                  src={GAME_ASSETS.navigation.kitchen}
                  alt="Bếp nấu"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-xs sm:text-base font-black text-amber-200 uppercase tracking-wide flex items-center gap-1.5 leading-tight truncate">
                  <span>GIAN BẾP HÀN</span>
                  <span className="text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shrink-0">
                    Khay: {preparedDishes.length}/4
                  </span>
                </h2>
                <span className="text-[10px] sm:text-[11px] text-amber-300/80 font-bold block leading-none truncate">
                  Mì Cay • Tokbokki • Kimbap
                </span>
              </div>
            </div>

            {/* Header Actions: + Nấu Tự Do & Close Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDishPickerOpen(true)}
                title="Mở menu nấu tự do"
                className="h-8 sm:h-9 px-2.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-400/60 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <div className="h-5 w-auto aspect-[476/210] relative">
                  <Image
                    src="/assets/phase3-ui/btn_free_cook_nau_tu_do.png"
                    alt="Nấu Tự Do"
                    width={476}
                    height={210}
                    className="h-full w-auto object-contain pointer-events-none"
                  />
                </div>
                <span className="text-xs font-black text-amber-200 hidden xs:inline">Nấu Tự Do</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                title="Đóng gian bếp"
                className="w-8 h-8 rounded-xl overflow-hidden cursor-pointer transition-transform active:scale-90"
              >
                <Image
                  src="/assets/phase3-ui/ui_close_dong.png"
                  alt="Đóng"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain pointer-events-none drop-shadow"
                />
              </button>
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
                  className="h-10 sm:h-11 px-4 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:brightness-110 text-white rounded-2xl font-black text-xs sm:text-sm shadow-lg border border-amber-300 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <div className="h-6 w-auto aspect-[476/210] relative">
                    <Image
                      src="/assets/phase3-ui/btn_free_cook_nau_tu_do.png"
                      alt="Nấu tự do"
                      width={476}
                      height={210}
                      className="h-full w-auto object-contain pointer-events-none"
                    />
                  </div>
                  <span>Mở Menu Chọn Món Tự Do</span>
                </button>
              </div>
            )}
          </div>

          {/* 4. Drawer Footer: Prepared Dishes Tray */}
          {preparedDishes.length > 0 && (
            <div className="shrink-0 p-2 sm:p-3 bg-stone-950 border-t border-amber-600/30 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-x-auto">
                <div className="h-6 w-auto aspect-[619/254] relative shrink-0">
                  <Image
                    src="/assets/phase3-ui/btn_tray_khay.png"
                    alt="Khay"
                    width={619}
                    height={254}
                    className="h-full w-auto object-contain pointer-events-none"
                  />
                </div>
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
                        className="w-4 h-4 relative ml-1 cursor-pointer transition-transform active:scale-90"
                        title="Hủy món này"
                      >
                        <Image
                          src="/assets/phase3-ui/ui_cancel_huy.png"
                          alt="Hủy"
                          width={16}
                          height={16}
                          className="w-full h-full object-contain pointer-events-none"
                        />
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
