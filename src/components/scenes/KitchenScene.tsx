'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/stores/useGameStore';
import { TokbokkiStation } from '@/components/cooking/TokbokkiStation';
import { KimbapStation } from '@/components/cooking/KimbapStation';
import { RamyeonStation } from '@/components/cooking/RamyeonStation';
import { ActiveOrderQueue } from '@/components/cooking/ActiveOrderQueue';
import { CookingEngine, CookingTargetOrder } from '@/components/cooking/CookingEngine';
import { GAME_ASSETS } from '@/config/gameAssets';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';
import { PHASE3_UI_ASSETS } from '@/game/assets/phase3UiAssets';

export const KitchenScene: React.FC = () => {
  const {
    tables,
    deliveryQueue,
    dishes,
    inventory,
    activeStation,
    setActiveStation,
    preparedDishes,
    discardPreparedDish,
    prepareInstantItem,
    completeCustomOrder,
  } = useGameStore();

  // Active cooking order targeting CookingEngine
  const [activeCookingOrder, setActiveCookingOrder] = useState<CookingTargetOrder | null>(null);

  // Handle click on an order card from queue
  const handleSelectOrder = (order: CookingTargetOrder) => {
    setActiveCookingOrder(order);
  };

  // Quick start a free cook (e.g. Spicy Ramen)
  const handleCookFreeDish = (dishId: string) => {
    const dish = dishes[dishId];
    setActiveCookingOrder({
      orderType: 'free_cook',
      customerName: 'Khách Đặt Bàn Trước',
      dishId: dishId,
      dishName: dish ? dish.name : 'Mì Cay Seoul 7 Cấp Độ',
      dishEmoji: dish?.emoji,
      requiredToppings: ['beef', 'sausage', 'kimchi'],
      spiceLevel: 2,
      price: dish?.price || 65,
    });
  };

  // Cooking completed by player
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

    setActiveCookingOrder(null);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2 sm:p-3 relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-600/40 text-stone-100 select-none font-baloo">
      {/* 1. Real Korean Kitchen Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={GAME_ASSETS.backgrounds.kitchen}
          alt="Không gian gian bếp quán Hàn Quốc"
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover object-center filter brightness-[0.32] saturate-[1.2]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-amber-950/40" />
      </div>

      {/* 2. Header & Station Navigation */}
      <div className="relative z-10 shrink-0 mb-2">
        <div className="flex items-center justify-between bg-stone-900/90 backdrop-blur-md p-2 rounded-2xl border border-amber-500/40 mb-2 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center shrink-0">
              <GameAssetIcon name="cooking" size={20} />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black text-amber-200 uppercase tracking-wide">
                GIAN BẾP CHẾ BIẾN THEO YÊU CẦU
              </h2>
              <span className="text-[10px] text-amber-300/80 font-bold block">
                Mì Cay • Tokbokki • Kimbap • Topping tươi ngon
              </span>
            </div>
          </div>

          {/* Tray counter */}
          <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-xl shadow-inner">
            <Image
              src={PHASE3_UI_ASSETS.btn_tray_khay.src}
              alt="Khay"
              width={PHASE3_UI_ASSETS.btn_tray_khay.width}
              height={PHASE3_UI_ASSETS.btn_tray_khay.height}
              className="h-4 w-auto object-contain pointer-events-none"
            />
            <span>{preparedDishes.length}/4</span>
          </div>
        </div>

        {/* Station Selectors: Default is Orders Queue, or tactile station minigames */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveStation(null)}
            className={`flex-1 min-w-[90px] py-1.5 px-2 rounded-xl text-xs font-black border transition-all cursor-pointer text-center ${
              activeStation === null
                ? 'bg-gradient-to-b from-amber-500 to-amber-700 text-white shadow-lg border-amber-300 scale-[1.02]'
                : 'bg-stone-900/80 hover:bg-stone-800/80 backdrop-blur-md border-stone-700/80 text-stone-300'
            }`}
          >
            <span className="block leading-tight truncate">Đơn Cần Nấu</span>
            <span className="text-[9px] opacity-85 block truncate">
              {tables.filter((t) => t.status === 'seated').length + deliveryQueue.length} Đơn Chờ
            </span>
          </button>

          {[
            { id: 'spicy_ramyeon', label: 'Mì Cay (Tô)', badge: '7 Cấp Độ' },
            { id: 'tokbokki', label: 'Tokbokki (Chảo)', badge: 'Canh Lửa' },
            { id: 'kimbap', label: 'Kimbap (Mành)', badge: 'Vuốt Cuộn' },
            { id: 'ramyeon', label: 'Ramyeon (Nồi)', badge: 'Gõ Trứng' },
          ].map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => {
                if (st.id === 'spicy_ramyeon') {
                  handleCookFreeDish('spicy_ramyeon');
                } else {
                  setActiveStation(st.id as any);
                }
              }}
              className={`flex-1 min-w-[90px] py-1.5 px-2 rounded-xl text-xs font-black border transition-all cursor-pointer text-center ${
                activeStation === st.id
                  ? 'bg-gradient-to-b from-amber-500 to-orange-600 text-white shadow-lg border-amber-300 scale-[1.02]'
                  : 'bg-stone-900/80 hover:bg-stone-800/80 backdrop-blur-md border-stone-700/80 text-stone-300'
              }`}
            >
              <span className="block leading-tight truncate">{st.label}</span>
              <span className="text-[9px] opacity-85 block truncate">{st.badge}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Workspace Area */}
      <div className="relative z-10 flex-1 w-full overflow-y-auto mb-2">
        {activeStation === null && (
          <div className="flex flex-col gap-3">
            {/* Active Order Queue: Compact Cards */}
            <ActiveOrderQueue
              tables={tables}
              deliveryQueue={deliveryQueue}
              dishes={dishes}
              inventory={inventory}
              onSelectOrder={handleSelectOrder}
              onCookFreeDish={handleCookFreeDish}
            />
          </div>
        )}

        {activeStation === 'tokbokki' && <TokbokkiStation />}
        {activeStation === 'kimbap' && <KimbapStation />}
        {activeStation === 'ramyeon' && <RamyeonStation />}
      </div>

      {/* 4. Ready Dishes Tray & Instant Grab Items */}
      <div className="relative z-10 shrink-0 bg-stone-900/90 backdrop-blur-md rounded-2xl p-2 border border-amber-500/40 shadow-lg flex items-center justify-between gap-2">
        {/* Quick Banana Milk */}
        <button
          type="button"
          onClick={() => prepareInstantItem('banana_milk')}
          className="flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 px-2.5 py-1 rounded-xl text-left active:scale-95 transition-all shrink-0 cursor-pointer shadow-md"
        >
          <div className="w-6 h-6 relative flex items-center justify-center">
            <Image
              src={GAME_ASSETS.props.drinks_carrier}
              alt="Sữa chuối"
              width={24}
              height={24}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-[10px] font-black text-amber-200 block leading-tight">
              Sữa Chuối Lạnh
            </span>
            <span className="text-[9px] text-amber-400/90 font-bold">
              Kho: {inventory.banana_milk_carton?.stock || 0}
            </span>
          </div>
        </button>

        {/* Ready Dishes Buffer Tray */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 flex-1 justify-end min-h-[36px]">
          {preparedDishes.length === 0 ? (
            <span className="text-[10px] text-amber-300/60 font-semibold italic pr-2">
              Khay giữ nóng trống (món nấu xong ra đây)
            </span>
          ) : (
            preparedDishes.map((p) => {
              const dishAsset =
                (GAME_ASSETS.dishes as Record<string, string>)[p.dishId] ||
                GAME_ASSETS.dishes.ramyeon;

              return (
                <div
                  key={p.id}
                  className="flex items-center gap-1.5 bg-amber-950/90 border border-amber-500/50 px-2 py-1 rounded-xl shrink-0 shadow-md"
                >
                  <div className="w-5 h-5 relative flex-shrink-0">
                    <Image
                      src={dishAsset}
                      alt={p.name}
                      width={20}
                      height={20}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[10px] font-black text-amber-200 truncate max-w-[70px]">
                    {p.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => discardPreparedDish(p.id)}
                    className="p-0.5 hover:opacity-80 active:scale-95 transition-all ml-0.5 cursor-pointer"
                    title="Hủy món này"
                  >
                    <Image
                      src={PHASE3_UI_ASSETS.ui_cancel_huy.src}
                      alt="Hủy"
                      width={PHASE3_UI_ASSETS.ui_cancel_huy.width}
                      height={PHASE3_UI_ASSETS.ui_cancel_huy.height}
                      className="h-4 w-auto object-contain pointer-events-none"
                    />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 5. Unified Cooking Engine Modal Overlay */}
      {activeCookingOrder && (
        <CookingEngine
          order={activeCookingOrder}
          inventory={inventory}
          onClose={() => setActiveCookingOrder(null)}
          onFinishCook={handleFinishCustomCook}
        />
      )}
    </div>
  );
};
