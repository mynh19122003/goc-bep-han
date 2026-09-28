'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';
import { PHASE3_UI_ASSETS } from '@/game/assets/phase3UiAssets';

export const TableView: React.FC = () => {
  const { tables, preparedDishes, isDayActive, startDay, serveTable, cleanTable } = useGameStore();

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 overflow-hidden bg-gradient-to-b from-amber-100/70 to-orange-50/50 font-baloo select-none">
      {/* Table status header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-black text-amber-950 uppercase tracking-wider">
          <GameAssetIcon name="bowl" size={16} />
          <span>Khu Vực Bàn Khách ({tables.filter((t) => t.status !== 'empty').length}/4)</span>
        </div>
        <span className="text-[10px] text-amber-900 font-bold bg-amber-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
          <span>Giao nhanh nhận tip</span>
          <GameAssetIcon name="star" size={12} />
        </span>
      </div>

      {/* 4 Tables Grid */}
      <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto pr-0.5">
        {tables.map((table) => {
          const hasCustomer = table.status === 'seated' && table.customer;
          const isEating = table.status === 'eating';
          const isDirty = table.status === 'dirty';

          const canServe =
            hasCustomer && preparedDishes.some((p) => p.dishId === table.customer?.orderDishId);

          const patiencePercent = hasCustomer
            ? Math.max(0, Math.min(100, (table.customer!.currentPatience / table.customer!.maxPatience) * 100))
            : 0;

          return (
            <motion.div
              key={table.id}
              whileTap={{ scale: 0.98 }}
              className={`rounded-2xl p-2.5 border-2 flex flex-col justify-between shadow-xs transition-all relative ${
                hasCustomer
                  ? 'bg-white border-amber-300 shadow-cozy'
                  : isEating
                  ? 'bg-amber-50/90 border-amber-200'
                  : isDirty
                  ? 'bg-stone-100 border-dashed border-red-300 animate-pulse'
                  : 'bg-stone-50/60 border-dashed border-stone-200'
              }`}
            >
              {/* Top row: Table name & icon */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-black text-stone-800 truncate max-w-[85px]">
                    {table.name}
                  </span>
                </div>
                {hasCustomer && (
                  <span className="text-[10px] font-bold text-stone-600">
                    {Math.ceil(table.customer!.currentPatience)}s
                  </span>
                )}
              </div>

              {/* Table Center Graphic / Content */}
              <div className="my-1.5 min-h-[46px] flex items-center justify-center">
                {hasCustomer ? (
                  <div className="flex items-center gap-2 w-full">
                    <div className="relative shrink-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black ${table.customer!.avatarColor}`}
                      >
                        {table.customer!.name.charAt(0)}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold text-stone-800 truncate block">
                          {table.customer!.orderDishName}
                        </span>
                      </div>
                      {/* Patience Progress bar */}
                      <div className="w-full bg-stone-100 rounded-full h-1 mt-1 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-200 ${
                            patiencePercent < 30
                              ? 'bg-red-500 animate-pulse'
                              : patiencePercent < 60
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${patiencePercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : isEating ? (
                  <div className="text-center">
                    <span className="text-[10px] text-amber-800 font-bold block">
                      Đang ăn ngon miệng ({Math.ceil(table.eatingTimeRemaining)}s)
                    </span>
                  </div>
                ) : isDirty ? (
                  <button
                    type="button"
                    onClick={() => cleanTable(table.id)}
                    className="w-full py-1.5 bg-red-100 hover:bg-red-200 text-red-800 font-black text-[10px] rounded-xl border border-red-300 flex items-center justify-center gap-1 active:scale-95 shadow-xs"
                  >
                    <span>Dọn Bàn (+5 Xu)</span>
                  </button>
                ) : (
                  <span className="text-xs text-stone-400 font-medium italic">Bàn trống</span>
                )}
              </div>

              {/* Action Button if Customer Seated */}
              {hasCustomer && (
                canServe ? (
                  <button
                    type="button"
                    onClick={() => serveTable(table.id)}
                    className="w-full flex items-center justify-center cursor-pointer active:scale-95 transition-all drop-shadow-md py-0.5"
                    title="Giao món cho bàn này"
                  >
                    <Image
                      src={PHASE3_UI_ASSETS.btn_serve_giao_mon.src}
                      alt="Giao Món"
                      width={PHASE3_UI_ASSETS.btn_serve_giao_mon.width}
                      height={PHASE3_UI_ASSETS.btn_serve_giao_mon.height}
                      className="h-7 w-auto object-contain pointer-events-none"
                    />
                  </button>
                ) : (
                  <div className="w-full py-1 rounded-xl text-[10px] font-black flex items-center justify-center bg-stone-200 text-stone-500 select-none">
                    <span>Chưa có món</span>
                  </div>
                )
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Start day prompt if inactive */}
      {!isDayActive && (
        <button
          type="button"
          onClick={startDay}
          className="w-full mt-2 flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all drop-shadow-md"
          title="Mở cửa đón khách"
        >
          <Image
            src={PHASE3_UI_ASSETS.btn_start_bat_dau.src}
            alt="Mở Cửa Đón Khách"
            width={PHASE3_UI_ASSETS.btn_start_bat_dau.width}
            height={PHASE3_UI_ASSETS.btn_start_bat_dau.height}
            className="h-10 w-auto object-contain pointer-events-none"
          />
        </button>
      )}
    </div>
  );
};
