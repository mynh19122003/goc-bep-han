'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_ASSETS } from '@/config/gameAssets';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';

interface DeliveryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeliveryDrawer: React.FC<DeliveryDrawerProps> = ({ isOpen, onClose }) => {
  const { deliveryQueue, preparedDishes, serveDeliveryOrder } = useGameStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 select-none font-baloo">
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="bg-white rounded-t-[32px] sm:rounded-[32px] w-full max-w-md p-4 sm:p-5 shadow-2xl border-t-4 sm:border-4 border-teal-300 max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center shadow-xs">
                <GameAssetIcon name="delivery" size={24} />
              </div>
              <div>
                <h3 className="font-black text-stone-800 text-sm sm:text-base flex items-center gap-1.5 uppercase">
                  <span>Đơn Giao Tận Nơi</span>
                  <span className="bg-teal-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {deliveryQueue.length} Đơn
                  </span>
                </h3>
                <span className="text-[11px] text-stone-500 font-bold">
                  Chuẩn bị món & giao khi shipper đến cửa
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer"
            >
              <GameAssetIcon name="close" size={16} />
            </button>
          </div>

          {/* Delivery Orders List */}
          <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
            {deliveryQueue.length === 0 ? (
              <div className="text-center py-8 text-stone-400">
                <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <GameAssetIcon name="delivery" size={40} />
                </div>
                <p className="text-xs font-black text-stone-600">Chưa có đơn online mới.</p>
                <p className="text-[11px] text-stone-500 mt-0.5">Điện thoại sẽ rung chuông khi có khách đặt món!</p>
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
                  <div
                    key={order.id}
                    className={`rounded-2xl p-3 border-2 transition-all flex flex-col justify-between gap-2 ${
                      order.shipperStatus === 'arrived'
                        ? 'bg-teal-50/70 border-teal-300 shadow-sm'
                        : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    {/* Top Row: Order ID, Address, Total */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-teal-800 text-xs">
                            {order.id}
                          </span>
                          <span className="text-[10px] text-stone-500 font-bold truncate max-w-[120px]">
                            • {order.customerName}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-500 block mt-0.5 truncate">
                          {order.address}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-stone-800 block">
                          +{order.price + order.tip} Xu
                        </span>
                        <span className="text-[9px] text-emerald-600 font-bold">
                          (Tip: {order.tip} Xu)
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: Dish info */}
                    <div className="flex items-center justify-between bg-white rounded-xl p-2 border border-stone-200/80">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 relative flex-shrink-0">
                          <Image
                            src={dishAsset}
                            alt={order.dishName}
                            width={32}
                            height={32}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="font-black text-xs text-stone-800">
                          {order.dishName}
                        </span>
                      </div>

                      {/* Shipper Status Indicator */}
                      <div>
                        {order.shipperStatus === 'on_the_way' ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
                            <GameAssetIcon name="clock" size={11} />
                            Tới sau: {Math.ceil(order.shipperArriveSeconds)}s
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-black text-teal-800 bg-teal-100 border border-teal-300 px-2 py-0.5 rounded-full animate-pulse">
                            <GameAssetIcon name="delivery" size={12} />
                            Đang chờ ({Math.ceil(order.shipperWaitSeconds)}s)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action: Give to Shipper */}
                    <button
                      type="button"
                      onClick={() => serveDeliveryOrder(order.id)}
                      disabled={!canServe}
                      className={`w-full py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition-all ${
                        canServe
                          ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white cursor-pointer active:scale-95 animate-bounce-slight'
                          : order.shipperStatus === 'on_the_way'
                          ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      <GameAssetIcon name="complete" size={14} />
                      <span>
                        {canServe
                          ? 'Giao Cho Shipper Ngay'
                          : order.shipperStatus === 'on_the_way'
                          ? 'Đang Chờ Shipper Đến'
                          : 'Cần Nấu Món Này Trước'}
                      </span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
