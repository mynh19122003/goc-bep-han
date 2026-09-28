'use client';

import React from 'react';
import Image from 'next/image';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_ASSETS } from '@/game/assets/gameAssets';
import { CustomerSprite } from '@/components/ui/game/CustomerSprite';
import { ShipperSprite } from '@/components/ui/game/ShipperSprite';
import { OrderBubble } from '@/components/ui/game/OrderBubble';
import { CookingTargetOrder } from '@/components/cooking/CookingEngine';
import { preparedDishMatchesOrder } from '@/core/gameCore';
import { GameButton } from '@/components/ui/game/GameButton';
import { GameSurface } from '@/components/ui/game/GameSurface';

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

  const activeShipperOrder = deliveryQueue[0] || null;
  const waitingTables = tables.filter((t) => t.status === 'seated').length;

  return (
    <section className="relative h-full w-full overflow-hidden">
      <Image
        src={GAME_ASSETS.backgrounds.restaurant}
        alt="Phòng ăn Hanok"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center brightness-[0.93] saturate-[1.05]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/45" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="mx-auto flex w-full max-w-[1380px] items-center justify-between gap-2 px-2 pt-2 sm:px-4 sm:pt-3">
          <GameSurface className="flex min-w-0 items-center gap-2 px-3 py-2">
            <span className="relative h-7 w-7 shrink-0">
              <Image src={GAME_ASSETS.props.red_lantern} alt="" fill sizes="28px" className="object-contain" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-xs font-black uppercase tracking-wide text-amber-100 sm:text-sm">
                Phòng ăn Hanok
              </h1>
              <p className="truncate text-[10px] font-bold text-amber-200/70">
                {isDayActive ? `${waitingTables} bàn đang chờ món` : 'Quán đang đóng cửa'}
              </p>
            </div>
          </GameSurface>

          {!isDayActive && (
            <GameButton tone="success" compact onClick={startDay}>
              Mở cửa đón khách
            </GameButton>
          )}
        </div>

        <div className="game-scrollbar mx-auto grid w-full max-w-[1380px] flex-1 grid-cols-1 gap-2.5 overflow-y-auto px-2 pb-24 pt-2 sm:gap-3 sm:px-4 lg:grid-cols-[200px_minmax(0,1fr)]">
          <aside>
            <button type="button" onClick={onOpenDelivery} className="block w-full text-left">
              <GameSurface className="p-2.5 transition hover:border-teal-300/60" strong>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="relative h-6 w-6">
                      <Image src={GAME_ASSETS.navigation.delivery} alt="" fill sizes="24px" className="object-contain" />
                    </span>
                    <span className="text-[11px] font-black text-teal-200">Giao hàng</span>
                  </div>
                  <span className="rounded-full bg-teal-950/80 px-2 py-0.5 text-[9px] font-black text-teal-300">
                    {deliveryQueue.length}
                  </span>
                </div>

                <div className="flex min-h-[84px] flex-col items-center justify-center rounded-xl border border-teal-400/15 bg-black/20 p-2 sm:min-h-[104px]">
                  {activeShipperOrder ? (
                    <>
                      <div className="mb-1 w-full">
                        <OrderBubble
                          dishName={activeShipperOrder.dishName}
                          dishId={activeShipperOrder.dishId}
                          secondsRemaining={
                            activeShipperOrder.shipperStatus === 'arrived'
                              ? activeShipperOrder.shipperWaitSeconds
                              : activeShipperOrder.shipperArriveSeconds
                          }
                          canServe={preparedDishes.some((prepared) =>
                            preparedDishMatchesOrder({
                              prepared,
                              orderId: activeShipperOrder.id,
                              dishId: activeShipperOrder.dishId,
                              requiredToppings: activeShipperOrder.requiredToppings,
                              excludedToppings: activeShipperOrder.excludedToppings,
                              spiceLevel: activeShipperOrder.spiceLevel,
                            })
                          )}
                          onServeClick={(event?: any) => {
                            event?.stopPropagation?.();
                            serveDeliveryOrder(activeShipperOrder.id);
                          }}
                        />
                      </div>
                      <ShipperSprite
                        color={activeShipperOrder.shipperColor || 'green'}
                        status={activeShipperOrder.shipperStatus}
                        size="sm"
                      />
                    </>
                  ) : (
                    <>
                      <span className="relative mb-1 h-10 w-10 opacity-70">
                        <Image src={GAME_ASSETS.props.delivery_crate} alt="" fill sizes="40px" className="object-contain" />
                      </span>
                      <span className="text-[10px] font-bold text-stone-400">Chưa có đơn online</span>
                    </>
                  )}
                </div>
              </GameSurface>
            </button>
          </aside>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {tables.map((table, index) => {
              const customer = table.customer;
              const seated = table.status === 'seated' && customer;
              const eating = table.status === 'eating' && customer;
              const dirty = table.status === 'dirty';
              const empty = table.status === 'empty';

              const canServe = Boolean(
                seated &&
                  customer &&
                  preparedDishes.some((prepared) =>
                    preparedDishMatchesOrder({
                      prepared,
                      orderId: customer.id,
                      dishId: customer.orderDishId,
                      requiredToppings: customer.requiredToppings,
                      excludedToppings: customer.excludedToppings,
                      spiceLevel: customer.spiceLevel,
                    })
                  )
              );

              const patiencePercent = seated && customer
                ? Math.max(0, Math.min(100, (customer.currentPatience / customer.maxPatience) * 100))
                : 0;

              const cookOrder = () => {
                if (!customer) return;
                onCookOrder({
                  orderType: 'dine_in',
                  orderId: customer.id,
                  tableId: table.id,
                  customerName: customer.name,
                  dishId: customer.orderDishId,
                  dishName: customer.orderDishName,
                  dishEmoji: customer.orderDishEmoji,
                  requiredToppings: customer.requiredToppings,
                  excludedToppings: customer.excludedToppings,
                  spiceLevel: customer.spiceLevel,
                  price: dishes[customer.orderDishId]?.price || 50,
                });
              };

              return (
                <GameSurface
                  key={table.id}
                  className="relative flex min-h-[170px] flex-col p-2.5 sm:min-h-[198px] sm:p-3"
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-amber-400/35 bg-amber-600/15 text-[9px] font-black text-amber-200">
                        {index + 1}
                      </span>
                      <span className="truncate text-[11px] font-black text-amber-100">{table.name}</span>
                    </div>
                    {seated && customer && (
                      <span className={`rounded-full border px-2 py-0.5 text-[9px] font-black ${
                        patiencePercent < 30
                          ? 'border-red-500/60 bg-red-950/80 text-red-300'
                          : 'border-amber-500/30 bg-black/25 text-amber-200'
                      }`}>
                        {Math.ceil(customer.currentPatience)}s
                      </span>
                    )}
                  </div>

                  <div className="flex min-h-0 flex-1 items-center justify-center">
                    {seated && customer && (
                      <div className="flex w-full flex-col items-center">
                        <button
                          type="button"
                          onClick={canServe ? () => serveTable(table.id) : cookOrder}
                          className="mb-1 w-full transition active:scale-[.98]"
                        >
                          <OrderBubble
                            dishName={customer.orderDishName}
                            dishId={customer.orderDishId}
                            patiencePercent={patiencePercent}
                            secondsRemaining={customer.currentPatience}
                            canServe={canServe}
                            onServeClick={() => serveTable(table.id)}
                          />
                        </button>
                        <CustomerSprite
                          spriteSrc={customer.visualSprite || customer.avatar}
                          name={customer.name}
                          mood={customer.mood}
                          size="md"
                          isEating={false}
                        />
                        <span className="mt-0.5 max-w-[130px] truncate text-[10px] font-black text-amber-100">
                          {customer.name}
                        </span>
                      </div>
                    )}

                    {eating && customer && (
                      <div className="flex flex-col items-center">
                        <CustomerSprite
                          spriteSrc={customer.visualSprite || customer.avatar}
                          name={customer.name}
                          mood="happy"
                          size="md"
                          isEating
                        />
                        <span className="mt-1 rounded-full border border-emerald-400/25 bg-emerald-950/70 px-2 py-0.5 text-[10px] font-black text-emerald-300">
                          Đang dùng món
                        </span>
                      </div>
                    )}

                    {dirty && (
                      <button
                        type="button"
                        onClick={() => cleanTable(table.id)}
                        className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-amber-400/45 bg-amber-950/30 p-4 transition hover:bg-amber-950/45 active:scale-95"
                      >
                        <span className="relative mb-1 h-10 w-10">
                          <Image src={GAME_ASSETS.props.rice_bowl} alt="" fill sizes="40px" className="object-contain" />
                        </span>
                        <span className="text-xs font-black text-amber-200">Dọn bàn</span>
                        <span className="text-[9px] text-amber-200/60">Nhấn để thu dọn</span>
                      </button>
                    )}

                    {empty && (
                      <div className="flex flex-col items-center py-3 opacity-70">
                        <span className="relative mb-1 h-10 w-10">
                          <Image src={GAME_ASSETS.props.condiment_tray} alt="" fill sizes="40px" className="object-contain" />
                        </span>
                        <span className="text-[11px] font-black text-stone-300">Bàn sẵn sàng</span>
                        <span className="text-[9px] text-stone-400">Chờ khách vào bàn</span>
                      </div>
                    )}
                  </div>

                  {seated && customer && (
                    <div className="mt-1.5">
                      {canServe ? (
                        <GameButton fullWidth compact tone="success" onClick={() => serveTable(table.id)}>
                          Giao món
                        </GameButton>
                      ) : (
                        <GameButton fullWidth compact onClick={cookOrder} iconSrc={GAME_ASSETS.navigation.kitchen}>
                          Nấu món này
                        </GameButton>
                      )}
                    </div>
                  )}
                </GameSurface>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
