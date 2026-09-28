'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_ASSETS } from '@/game/assets/gameAssets';
import { CustomerSprite } from '@/components/ui/game/CustomerSprite';
import { ShipperSprite } from '@/components/ui/game/ShipperSprite';
import { OrderBubble } from '@/components/ui/game/OrderBubble';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';
import { CookingTargetOrder } from '@/components/cooking/CookingEngine';
import { preparedDishMatchesOrder } from '@/core/gameCore';

interface RestaurantSceneProps {
  onCookOrder: (order: CookingTargetOrder) => void;
  onOpenKitchen: () => void;
  onOpenDelivery: () => void;
}

export const RestaurantScene: React.FC<RestaurantSceneProps> = ({
  onCookOrder,
  onOpenKitchen,
  onOpenDelivery,
}) => {
  const {
    tables,
    deliveryQueue,
    dishes,
    preparedDishes,
    isDayActive,
    startDay,
    serveTable,
    cleanTable,
    serveDeliveryOrder,
  } = useGameStore();

  const activeShipperOrder = deliveryQueue.length > 0 ? deliveryQueue[0] : null;

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none font-baloo">
      {/* 1. Real Korean Hanok Restaurant Background Image with Bright Warm Lighting */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={GAME_ASSETS.backgrounds.restaurant}
          alt="Không gian quán ăn truyền thống Hàn Quốc"
          fill
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.80] contrast-[1.05] saturate-[1.15]"
          priority
        />
        {/* Soft top & bottom gradient for text contrast without making the scene dark */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-transparent to-stone-950/60 pointer-events-none" />
      </div>

      {/* 2. Top Restaurant Banner & Day Controls */}
      <div className="relative z-10 p-2 sm:p-3 flex items-center justify-between gap-2 max-w-6xl mx-auto w-full">
        {/* Left: Storefront status tag */}
        <div className="flex items-center gap-2 bg-stone-900/85 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-amber-500/40 shadow-lg">
          <div className="w-6 h-6 relative shrink-0">
            <Image
              src={GAME_ASSETS.props.red_lantern}
              alt="Lồng đèn"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-black text-amber-200 uppercase tracking-wide leading-tight">
              TIỆM ĂN HÀN QUỐC HANOK
            </h1>
            <span className="text-[10px] text-amber-300/80 font-bold block leading-none">
              {isDayActive
                ? `Đang phục vụ • ${tables.filter((t) => t.status === 'seated').length} bàn đợi món`
                : 'Cửa hàng đang đóng • Hãy mở quán'}
            </span>
          </div>
        </div>

        {/* Right: Quick Start Day Button if idle */}
        {!isDayActive && (
          <button
            type="button"
            onClick={startDay}
            className="bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:brightness-110 text-white font-black px-4 py-2 rounded-2xl shadow-xl border border-amber-300/60 flex items-center gap-2 active:scale-95 transition-all text-xs sm:text-sm cursor-pointer animate-bounce-slight"
          >
            <div className="w-5 h-5 relative shrink-0">
              <Image
                src={GAME_ASSETS.actions.start}
                alt="Bắt đầu"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <span>Mở Cửa Đón Khách</span>
          </button>
        )}
      </div>

      {/* 3. Main Restaurant Space: Delivery Spot + 4 Dining Table Zones */}
      <div className="relative z-10 flex-1 px-2 sm:px-4 py-1 flex flex-col lg:flex-row gap-3 max-w-6xl mx-auto w-full overflow-y-auto">
        {/* ========================================================================= */}
        {/* A. DELIVERY SPOT (Góc Chờ Shipper Giao Hàng Trực Tuyến)                  */}
        {/* ========================================================================= */}
        <div className="lg:w-64 shrink-0 flex flex-col justify-start">
          <div
            onClick={onOpenDelivery}
            className="bg-stone-900/85 hover:bg-stone-900 backdrop-blur-md border-2 border-teal-500/50 hover:border-teal-400 p-2.5 rounded-3xl shadow-xl transition-all cursor-pointer group"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 relative shrink-0">
                  <Image
                    src={GAME_ASSETS.navigation.delivery}
                    alt="Giao hàng"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <span className="text-xs font-black text-teal-300">Góc Giao Hàng</span>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-950/80 text-teal-300 border border-teal-500/40">
                {deliveryQueue.length} Đơn
              </span>
            </div>

            {/* Shipper Stage */}
            <div className="min-h-[120px] flex flex-col items-center justify-center p-2 rounded-2xl bg-stone-950/60 border border-teal-500/20 group-hover:border-teal-500/40 transition-colors">
              {activeShipperOrder ? (
                <div className="flex flex-col items-center w-full">
                  {/* Floating delivery order bubble */}
                  <div className="w-full mb-1">
                    <OrderBubble
                      dishName={activeShipperOrder.dishName}
                      dishId={activeShipperOrder.dishId}
                      secondsRemaining={
                        activeShipperOrder.shipperStatus === 'arrived'
                          ? activeShipperOrder.shipperWaitSeconds
                          : activeShipperOrder.shipperArriveSeconds
                      }
                      canServe={preparedDishes.some((p) =>
                        preparedDishMatchesOrder({
                          prepared: p,
                          orderId: activeShipperOrder.id,
                          dishId: activeShipperOrder.dishId,
                          requiredToppings: activeShipperOrder.requiredToppings,
                          excludedToppings: activeShipperOrder.excludedToppings,
                          spiceLevel: activeShipperOrder.spiceLevel,
                        })
                      )}
                      onServeClick={(e?: any) => {
                        if (e?.stopPropagation) e.stopPropagation();
                        serveDeliveryOrder(activeShipperOrder.id);
                      }}
                    />
                  </div>

                  {/* Shipper character */}
                  <ShipperSprite
                    color={activeShipperOrder.shipperColor || 'green'}
                    status={activeShipperOrder.shipperStatus}
                    size="sm"
                  />
                  <span className="text-[10px] text-teal-200/90 font-bold mt-1">
                    {activeShipperOrder.customerName}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-2">
                  <div className="w-12 h-12 relative mb-1 opacity-70">
                    <Image
                      src={GAME_ASSETS.props.delivery_crate}
                      alt="Thùng hàng"
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-stone-400">
                    Chưa có đơn online
                  </span>
                  <span className="text-[9px] text-stone-500">
                    Shipper sẽ tới khi có khách đặt
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* B. 4 COZY DINE-IN TABLE ZONES (4 Khu Vực Bàn Ăn Hanok)                     */}
        {/* ========================================================================= */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {tables.map((table, index) => {
            const hasCustomer = table.status === 'seated' && table.customer;
            const isEating = table.status === 'eating';
            const isDirty = table.status === 'dirty';
            const isEmpty = table.status === 'empty';

            const canServe = Boolean(
              hasCustomer && preparedDishes.some((p) => p.dishId === table.customer?.orderDishId)
            );

            const patiencePercent = hasCustomer
              ? Math.max(
                  0,
                  Math.min(100, (table.customer!.currentPatience / table.customer!.maxPatience) * 100)
                )
              : 0;

            return (
              <div
                key={table.id}
                className="relative rounded-3xl p-3 flex flex-col justify-between transition-all bg-stone-900/80 backdrop-blur-md border-2 border-amber-600/40 hover:border-amber-400/70 shadow-xl"
              >
                {/* 1. Table Header: Table Name & Waiting Seconds */}
                <div className="flex items-center justify-between mb-1.5 z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-600/30 border border-amber-400/50 flex items-center justify-center text-[10px] font-black text-amber-300">
                      {index + 1}
                    </span>
                    <span className="text-xs font-black text-amber-200">{table.name}</span>
                  </div>

                  {hasCustomer && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        patiencePercent < 30
                          ? 'bg-red-950 text-red-300 border-red-500 animate-pulse'
                          : 'bg-amber-950/90 text-amber-300 border-amber-500/50'
                      }`}
                    >
                      <GameAssetIcon name="clock" size={11} />
                      <span>{Math.ceil(table.customer!.currentPatience)}s</span>
                    </span>
                  )}
                </div>

                {/* 2. Table Area Content (Customer + Order Bubble or Clean Table Graphic) */}
                <div className="min-h-[145px] flex flex-col items-center justify-center relative my-1">
                  {/* CASE 1: Customer Seated Waiting for Food */}
                  {hasCustomer && table.customer && (
                    <div className="flex flex-col items-center w-full z-10">
                      {/* Floating Order Bubble */}
                      <div
                        onClick={() => {
                          if (canServe) {
                            serveTable(table.id);
                          } else {
                            onCookOrder({
                              orderType: 'dine_in',
                              orderId: table.customer!.id,
                              tableId: table.id,
                              customerName: table.customer!.name,
                              dishId: table.customer!.orderDishId,
                              dishName: table.customer!.orderDishName,
                              dishEmoji: table.customer!.orderDishEmoji,
                              requiredToppings: table.customer!.requiredToppings,
                              excludedToppings: table.customer!.excludedToppings,
                              spiceLevel: table.customer!.spiceLevel,
                              price: dishes[table.customer!.orderDishId]?.price || 50,
                            });
                          }
                        }}
                        className="w-full mb-1 cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
                      >
                        <OrderBubble
                          dishName={table.customer.orderDishName}
                          dishId={table.customer.orderDishId}
                          patiencePercent={patiencePercent}
                          secondsRemaining={table.customer.currentPatience}
                          canServe={canServe}
                          onServeClick={() => serveTable(table.id)}
                        />
                      </div>

                      {/* Customer Sprite sitting behind wooden table */}
                      <div className="relative flex flex-col items-center">
                        <CustomerSprite
                          spriteSrc={table.customer.visualSprite || table.customer.avatar}
                          name={table.customer.name}
                          mood={table.customer.mood}
                          size="md"
                          isEating={false}
                        />
                        <span className="text-[10px] font-black text-amber-200 block text-center mt-0.5 truncate max-w-[120px]">
                          {table.customer.name}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* CASE 2: Customer Happily Eating */}
                  {isEating && table.customer && (
                    <div className="flex flex-col items-center justify-center py-2 z-10">
                      <CustomerSprite
                        spriteSrc={table.customer.visualSprite || table.customer.avatar}
                        name={table.customer.name}
                        mood="happy"
                        size="md"
                        isEating={true}
                      />
                      <span className="mt-1 text-[11px] font-black text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                        Đang dùng món ngon lành...
                      </span>
                    </div>
                  )}

                  {/* CASE 3: Table is Dirty after eating */}
                  {isDirty && (
                    <div
                      onClick={() => cleanTable(table.id)}
                      className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-950/60 border-2 border-dashed border-amber-400 hover:border-amber-300 cursor-pointer transition-all active:scale-95 z-10 text-center w-full"
                    >
                      <div className="w-10 h-10 relative mb-1 animate-bounce-slight">
                        <Image
                          src={GAME_ASSETS.props.rice_bowl}
                          alt="Bát đĩa"
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-xs font-black text-amber-200">
                        Bàn Ăn Cần Dọn Dẹp
                      </span>
                      <span className="text-[10px] font-bold text-amber-400 mt-0.5">
                        Nhấn để dọn bàn & thu tiền
                      </span>
                    </div>
                  )}

                  {/* CASE 4: Table is Empty and Ready for Guests */}
                  {isEmpty && (
                    <div className="flex flex-col items-center justify-center py-4 text-center z-10">
                      <div className="w-12 h-12 relative mb-1 opacity-75">
                        <Image
                          src={GAME_ASSETS.props.condiment_tray}
                          alt="Bàn sẵn sàng"
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-xs font-black text-stone-300">
                        Bàn Ăn Sẵn Sàng
                      </span>
                      <span className="text-[10px] text-stone-400 font-bold">
                        Đang chờ khách vào ngồi
                      </span>
                    </div>
                  )}
                </div>

                {/* 3. Action bar for Seated Table: Cook / Serve */}
                {hasCustomer && table.customer && (
                  <div className="mt-1.5 pt-1.5 border-t border-amber-500/30 flex items-center gap-1.5 z-10">
                    {canServe ? (
                      <button
                        type="button"
                        onClick={() => serveTable(table.id)}
                        className="w-full py-1.5 px-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-black rounded-xl text-xs shadow-md border border-emerald-300 flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
                      >
                        <GameAssetIcon name="bowl" size={14} />
                        <span>Giao Món Cho Khách</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          onCookOrder({
                            orderType: 'dine_in',
                            orderId: table.customer!.id,
                            tableId: table.id,
                            customerName: table.customer!.name,
                            dishId: table.customer!.orderDishId,
                            dishName: table.customer!.orderDishName,
                            dishEmoji: table.customer!.orderDishEmoji,
                            requiredToppings: table.customer!.requiredToppings,
                            excludedToppings: table.customer!.excludedToppings,
                            spiceLevel: table.customer!.spiceLevel,
                            price: dishes[table.customer!.orderDishId]?.price || 50,
                          })
                        }
                        className="w-full py-1.5 px-3 bg-amber-600/90 hover:bg-amber-500 text-white font-black rounded-xl text-xs shadow-md border border-amber-400/50 flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
                      >
                        <GameAssetIcon name="cooking" size={14} />
                        <span>Nấu Món Cho Bàn Này</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Spacer to avoid overlapping with GameActionDock */}
      <div className="h-20 shrink-0 pointer-events-none" />
    </div>
  );
};
