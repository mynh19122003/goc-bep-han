'use client';

import React from 'react';
import Image from 'next/image';
import { DineInTable, DeliveryOrder, Dish, Ingredient } from '@/types/game';
import { GAME_ASSETS } from '@/config/gameAssets';
import { CookingTargetOrder } from './CookingEngine';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';

interface ActiveOrderQueueProps {
  tables: DineInTable[];
  deliveryQueue: DeliveryOrder[];
  dishes: Record<string, Dish>;
  inventory: Record<string, Ingredient>;
  onSelectOrder: (order: CookingTargetOrder) => void;
  onCookFreeDish?: (dishId: string) => void;
}

export const ActiveOrderQueue: React.FC<ActiveOrderQueueProps> = ({
  tables,
  deliveryQueue,
  dishes,
  inventory,
  onSelectOrder,
  onCookFreeDish,
}) => {
  // Extract all active orders from Dine-In Tables
  const dineInOrders: CookingTargetOrder[] = tables
    .filter((t) => t.status === 'seated' && t.customer)
    .map((t) => {
      const cust = t.customer!;
      const dish = dishes[cust.orderDishId];
      return {
        orderType: 'dine_in',
        tableId: t.id,
        customerName: cust.name,
        customerAvatar: cust.visualSprite || cust.avatar,
        dishId: cust.orderDishId,
        dishName: cust.orderDishName || dish?.name || cust.orderDishId,
        dishEmoji: cust.orderDishEmoji || dish?.emoji,
        requiredToppings: cust.requiredToppings,
        excludedToppings: cust.excludedToppings,
        spiceLevel: cust.spiceLevel,
        price: dish?.price || 45,
        timeRemaining: Math.round(cust.currentPatience),
      };
    });

  // Extract all active orders from Delivery Queue
  const deliveryOrders: CookingTargetOrder[] = deliveryQueue
    .filter((o) => o.shipperStatus === 'on_the_way' || o.shipperStatus === 'arrived')
    .map((o) => {
      const dish = dishes[o.dishId];
      return {
        orderType: 'delivery',
        orderId: o.id,
        customerName: o.customerName,
        customerAvatar: o.shipperSprite || GAME_ASSETS.shippers.green,
        dishId: o.dishId,
        dishName: o.dishName || dish?.name || o.dishId,
        dishEmoji: o.dishEmoji || dish?.emoji,
        requiredToppings: o.requiredToppings,
        excludedToppings: o.excludedToppings,
        spiceLevel: o.spiceLevel,
        price: o.price,
        timeRemaining:
          o.shipperStatus === 'on_the_way'
            ? Math.round(o.shipperArriveSeconds)
            : Math.round(o.shipperWaitSeconds),
      };
    });

  const allOrders = [...dineInOrders, ...deliveryOrders];

  return (
    <div className="w-full flex flex-col gap-2 font-baloo">
      {/* Header bar of order queue */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <GameAssetIcon name="cooking" size={22} />
          <h3 className="text-sm sm:text-base font-black text-amber-950 uppercase tracking-wide">
            Đơn Hàng Cần Nấu ({allOrders.length})
          </h3>
        </div>
        <span className="text-xs font-bold text-amber-800">
          Chạm vào đơn để vào bếp ngay
        </span>
      </div>

      {/* Orders container: Horizontal scroll on mobile, responsive wrap on desktop */}
      {allOrders.length === 0 ? (
        <div className="w-full bg-[#fdf8f0] border-2 border-dashed border-amber-300 rounded-2xl p-5 sm:p-7 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-14 h-14 relative mb-2">
            <GameAssetIcon name="pot" size={56} />
          </div>
          <h4 className="text-sm sm:text-base font-black text-amber-900">
            Bếp Đang Thảnh Thơi!
          </h4>
          <p className="text-xs text-amber-700 max-w-sm mt-0.5">
            Chưa có khách gọi món mới. Bạn có thể nấu sẵn một phần để dự trữ vào quầy hoặc đón khách tại sảnh!
          </p>

          {/* Quick cook button for spicy ramen if idle */}
          {onCookFreeDish && (
            <button
              type="button"
              onClick={() => onCookFreeDish('spicy_ramyeon')}
              className="mt-3 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black text-xs rounded-xl shadow border border-amber-400 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <GameAssetIcon name="start" size={16} />
              <span>Nấu Thử Mì Cay Dự Trữ</span>
            </button>
          )}
        </div>
      ) : (
        <div className="game-scrollbar flex gap-2.5 overflow-x-auto overscroll-x-contain snap-x snap-mandatory pb-2 px-1 select-none">
          {allOrders.map((order, idx) => {
            const dishAsset =
              (GAME_ASSETS.dishes as Record<string, string>)[order.dishId] || null;

            const isUrgent = order.timeRemaining !== undefined && order.timeRemaining <= 15;

            return (
              <div
                key={`${order.orderType}_${order.tableId || order.orderId}_${idx}`}
                className="flex-shrink-0 w-64 sm:w-72 bg-gradient-to-b from-[#FFFDF9] to-[#FFF5E6] border-2 border-[#D97706]/40 hover:border-[#D97706] rounded-2xl p-3 shadow-md hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                {/* Top: Customer & Tag */}
                <div className="flex items-center justify-between gap-2 border-b border-amber-200/70 pb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {order.customerAvatar ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-amber-100 border border-amber-400 flex-shrink-0">
                        <Image
                          src={order.customerAvatar}
                          alt={order.customerName}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center">
                        {order.customerName.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-xs font-black text-amber-950 truncate block">
                        {order.customerName}
                      </span>
                      <span className="text-[10px] font-bold text-amber-700">
                        {order.orderType === 'dine_in'
                          ? `Bàn ${order.tableId}`
                          : `Đơn ${order.orderId}`}
                      </span>
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  {order.timeRemaining !== undefined && (
                    <div
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black border flex items-center gap-1 ${
                        isUrgent
                          ? 'bg-red-100 text-red-700 border-red-400 animate-pulse'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      <span>{order.timeRemaining}s</span>
                    </div>
                  )}
                </div>

                {/* Middle: Dish visual & requirements */}
                <div className="my-2.5 flex items-center gap-2.5">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 relative flex-shrink-0 bg-amber-50 rounded-xl p-1 border border-amber-200 shadow-inner">
                    <Image
                      src={dishAsset}
                      alt={order.dishName}
                      width={64}
                      height={64}
                      className="w-full h-full object-contain pointer-events-none drop-shadow"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-black text-amber-950 truncate">
                      {order.dishName}
                    </h4>

                    {/* Required toppings chips */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {order.requiredToppings && order.requiredToppings.length > 0 ? (
                        order.requiredToppings.map((topId) => {
                          const item = inventory[topId];
                          return (
                            <span
                              key={topId}
                              className="text-[9px] font-black bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded-md"
                            >
                              +{item ? item.vietnameseName : topId}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-[10px] font-semibold text-amber-700 italic">
                          Chuẩn vị
                        </span>
                      )}
                    </div>

                    {/* Excluded toppings */}
                    {order.excludedToppings && order.excludedToppings.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {order.excludedToppings.map((excId) => {
                          const item = inventory[excId];
                          return (
                            <span
                              key={excId}
                              className="text-[9px] font-black bg-red-100 text-red-700 px-1.5 py-0.5 rounded-md line-through"
                            >
                              -{item ? item.vietnameseName : excId}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Spice requirement */}
                    {order.spiceLevel !== undefined && (
                      <div className="mt-1 flex items-center gap-1">
                        <GameAssetIcon name="chilli" size={13} />
                        <span className="text-[10px] font-black text-red-600">
                          {order.spiceLevel === 0 ? 'Không cay' : `Cấp ${order.spiceLevel}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom: Cook action button */}
                <button
                  type="button"
                  onClick={() => onSelectOrder(order)}
                  className="w-full h-9 sm:h-10 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black text-xs sm:text-sm rounded-xl shadow border border-amber-400 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <GameAssetIcon name="cooking" size={16} />
                  <span>BẮT ĐẦU NẤU</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
