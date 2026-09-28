'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_ASSETS } from '@/config/gameAssets';
import { ShipperSprite } from '@/components/ui/game/ShipperSprite';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';

export const StorefrontScene: React.FC = () => {
  const {
    deliveryQueue,
    preparedDishes,
    serveDeliveryOrder,
    setActiveModal,
    rating,
    reviews,
  } = useGameStore();

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 relative rounded-3xl overflow-hidden shadow-2xl border-2 border-red-500/40 text-stone-100 select-none font-baloo">
      {/* 1. Real Korean Storefront Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={GAME_ASSETS.backgrounds.storefront}
          alt="Mặt tiền quán ăn đường phố Hàn Quốc"
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover object-center filter brightness-[0.38] saturate-[1.2]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-red-950/40" />
      </div>

      {/* Pojangmacha Awning Stripe Banner */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(90deg,#E03131,#E03131_14px,#FDF8F3_14px,#FDF8F3_28px)] opacity-90 z-20" />

      {/* 2. Top Header HUD */}
      <div className="relative z-10 rounded-2xl overflow-hidden p-2.5 bg-stone-900/85 backdrop-blur-md border border-red-500/40 shadow-lg mb-2 mt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-8 rounded-xl bg-red-500/20 border border-red-400/40 p-0.5 flex items-center justify-center shrink-0">
              <Image
                src="/assets/phase3-ui/btn_delivery_giao_hang.png"
                alt="Giao hàng"
                width={747}
                height={251}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black text-amber-200 tracking-wide uppercase">
                MẶT TIỀN QUÁN & GIAO HÀNG
              </h2>
              <p className="text-[10px] text-amber-300/80 font-bold">
                Đơn Trực Tuyến • Shipper Tới Cửa Nhận Món
              </p>
            </div>
          </div>

          {/* Quick Review Modal Link */}
          <button
            type="button"
            onClick={() => setActiveModal('reviews')}
            className="flex items-center gap-1.5 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/50 text-amber-300 font-black px-2.5 py-1 rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-4 h-4 relative shrink-0">
              <Image
                src="/assets/phase3-ui/tab_review_danh_gia.png"
                alt="Đánh giá"
                width={371}
                height={225}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
            <span>{rating.toFixed(1)}</span>
            <span className="text-[9px] text-amber-200/70 font-semibold">({reviews.length})</span>
          </button>
        </div>
      </div>

      {/* 3. Middle: Shipper & Delivery Queue Area */}
      <div className="relative z-10 flex-1 overflow-y-auto space-y-2.5 pr-0.5 mb-2">
        <div className="flex items-center justify-between text-xs font-bold text-amber-200 px-1">
          <div className="flex items-center gap-1.5">
            <GameAssetIcon name="delivery" size={16} />
            <span>Hàng Đợi Shipper Nhận Đơn ({deliveryQueue.length})</span>
          </div>
          <span className="text-[10px] text-stone-400">
            {deliveryQueue.length > 0 ? 'Shipper đang trên đường tới!' : 'Đang chờ đơn mới...'}
          </span>
        </div>

        {deliveryQueue.length === 0 ? (
          <div className="bg-stone-900/80 backdrop-blur-md rounded-2xl p-5 text-center border border-stone-700/80 text-stone-400 shadow-md">
            <div className="flex justify-center mb-2">
              <ShipperSprite color="green" status="on_the_way" size="sm" />
            </div>
            <p className="text-xs font-black text-amber-200">Quầy giao hàng đang rảnh rỗi</p>
            <p className="text-[10px] text-stone-300 mt-1">
              Khách đang đặt món trên ứng dụng, shipper sẽ đến lấy hàng ngay!
            </p>
          </div>
        ) : (
          deliveryQueue.map((order) => {
            const canServe =
              order.shipperStatus === 'arrived' &&
              preparedDishes.some((p) => p.dishId === order.dishId);

            const dishAsset =
              (GAME_ASSETS.dishes as Record<string, string>)[order.dishId] ||
              GAME_ASSETS.dishes.ramyeon;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-3 border-2 transition-all shadow-lg ${
                  order.shipperStatus === 'arrived'
                    ? 'bg-stone-900/90 backdrop-blur-md border-teal-400/90'
                    : 'bg-stone-900/85 backdrop-blur-md border-amber-600/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  {/* Left: 2D Chibi Shipper Sprite */}
                  <div className="shrink-0 flex flex-col items-center">
                    <ShipperSprite
                      color={order.shipperColor || 'green'}
                      status={order.shipperStatus}
                      size="sm"
                    />
                  </div>

                  {/* Right: Order details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-amber-300 text-xs">{order.id}</span>
                      <span className="text-xs font-black text-emerald-400">
                        +{order.price + order.tip} Xu
                      </span>
                    </div>

                    <div className="flex items-center gap-2 my-1">
                      <div className="w-5 h-5 relative flex-shrink-0">
                        <Image
                          src={dishAsset}
                          alt={order.dishName}
                          width={20}
                          height={20}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-black text-stone-100 text-xs truncate">
                        {order.dishName}
                      </span>
                    </div>

                    <div className="text-[10px] text-stone-400 truncate">
                      <span>{order.address}</span>
                    </div>

                    {/* Status badge */}
                    <div className="mt-1.5 flex items-center justify-between">
                      {order.shipperStatus === 'on_the_way' ? (
                        <span className="text-[10px] font-black text-amber-300 flex items-center gap-1 bg-amber-950/80 px-2 py-0.5 rounded-lg border border-amber-500/40">
                          <div className="w-3.5 h-3.5 relative">
                            <Image
                              src="/assets/phase3-ui/ui_timer_thoi_gian.png"
                              alt="Timer"
                              width={24}
                              height={24}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          Tới sau: {Math.ceil(order.shipperArriveSeconds)}s
                        </span>
                      ) : (
                        <div className="h-6 w-auto aspect-[343/210] relative flex items-center justify-center">
                          <Image
                            src="/assets/phase3-ui/status_waiting_dang_cho.png"
                            alt="Đang chờ"
                            width={343}
                            height={210}
                            className="h-full w-auto object-contain pointer-events-none drop-shadow-xs"
                          />
                        </div>
                      )}

                      <span className="text-[10px] text-amber-300 font-semibold">
                        Tip: {order.tip} Xu
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hand to shipper action button */}
                <button
                  type="button"
                  onClick={() => serveDeliveryOrder(order.id)}
                  disabled={!canServe}
                  className={`w-full mt-2.5 h-9 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                    canServe
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white active:scale-95'
                      : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed opacity-60'
                  }`}
                >
                  {canServe ? (
                    <>
                      <div className="h-5 w-auto aspect-[480/212] relative">
                        <Image
                          src="/assets/phase3-ui/btn_serve_giao_mon.png"
                          alt="Giao Món"
                          width={480}
                          height={212}
                          className="h-full w-auto object-contain pointer-events-none"
                        />
                      </div>
                      <span>Giao Cho Shipper Ngay</span>
                    </>
                  ) : (
                    <span>
                      {order.shipperStatus === 'on_the_way'
                        ? 'Đợi Shipper Đến Cửa'
                        : 'Cần Nấu Món Ở Bếp'}
                    </span>
                  )}
                </button>
              </motion.div>
            );
          })
        )}
      </div>

      {/* 4. Bottom Shortcuts: Morning Market & Cookbook */}
      <div className="relative z-10 grid grid-cols-2 gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setActiveModal('market')}
          className="p-2.5 rounded-2xl bg-stone-900/85 hover:bg-stone-800/90 backdrop-blur-md border border-amber-500/40 text-amber-200 text-left transition-all active:scale-95 flex items-center gap-2.5 shadow-md cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 p-1 flex items-center justify-center shrink-0">
            <Image
              src="/assets/phase3-ui/tab_market_cho.png"
              alt="Chợ sớm"
              width={40}
              height={40}
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>
          <div className="min-w-0">
            <span className="font-extrabold text-[11px] block leading-tight text-amber-100">
              Chợ Sớm
            </span>
            <span className="text-[9px] text-amber-300/80 block">Mua sắm & Trả giá</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveModal('cookbook')}
          className="p-2.5 rounded-2xl bg-stone-900/85 hover:bg-stone-800/90 backdrop-blur-md border border-amber-500/40 text-amber-200 text-left transition-all active:scale-95 flex items-center gap-2.5 shadow-md cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 p-1 flex items-center justify-center shrink-0">
            <Image
              src="/assets/phase3-ui/tab_recipe_cong_thuc.png"
              alt="Công thức"
              width={40}
              height={40}
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>
          <div className="min-w-0">
            <span className="font-extrabold text-[11px] block leading-tight text-amber-100">
              Bí Quyết Nấu
            </span>
            <span className="text-[9px] text-amber-300/80 block">Cẩm nang món Hàn</span>
          </div>
        </button>
      </div>
    </div>
  );
};
