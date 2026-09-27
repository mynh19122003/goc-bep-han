'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_ASSETS } from '@/config/gameAssets';
import { CustomerSprite } from '@/components/ui/game/CustomerSprite';
import { OrderBubble } from '@/components/ui/game/OrderBubble';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';

export const DiningScene: React.FC = () => {
  const { tables, preparedDishes, isDayActive, startDay, serveTable, cleanTable } = useGameStore();

  return (
    <div className="w-full h-full flex flex-col justify-between p-3 relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-600/40 text-stone-100 select-none font-baloo">
      {/* 1. Real Korean Dining Room Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={GAME_ASSETS.backgrounds.dining}
          alt="Không gian phòng ăn Hàn Quốc"
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover object-center filter brightness-[0.35] saturate-[1.25]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-amber-950/40" />
      </div>

      {/* 2. Top Header HUD with Cozy Wooden Theme */}
      <div className="relative z-10 rounded-2xl overflow-hidden p-2.5 bg-stone-900/85 backdrop-blur-md border border-amber-500/40 shadow-lg mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
              <GameAssetIcon name="bowl" size={18} />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black text-amber-200 tracking-wide uppercase">
                PHÒNG ĂN HANOK ẤM CÚNG
              </h2>
              <p className="text-[10px] text-amber-300/80 font-bold">
                4 Bàn Khách • Thưởng Thức Món Nóng Hổi
              </p>
            </div>
          </div>

          <span className="text-xs font-black text-amber-300 bg-amber-950/90 border border-amber-500/50 px-2.5 py-1 rounded-xl shadow-inner">
            {tables.filter((t) => t.status === 'seated').length} Đang Đợi
          </span>
        </div>
      </div>

      {/* 3. 4 Dining Tables Grid */}
      <div className="relative z-10 flex-1 grid grid-cols-2 gap-2.5 overflow-y-auto pr-0.5 mb-2">
        {tables.map((table) => {
          const hasCustomer = table.status === 'seated' && table.customer;
          const isEating = table.status === 'eating';
          const isDirty = table.status === 'dirty';

          const canServe = Boolean(
            hasCustomer && preparedDishes.some((p) => p.dishId === table.customer?.orderDishId)
          );

          const patiencePercent = hasCustomer
            ? Math.max(0, Math.min(100, (table.customer!.currentPatience / table.customer!.maxPatience) * 100))
            : 0;

          return (
            <motion.div
              key={table.id}
              whileTap={{ scale: 0.98 }}
              className={`rounded-2xl p-2 border-2 flex flex-col justify-between transition-all relative ${
                hasCustomer
                  ? 'bg-stone-900/90 backdrop-blur-md border-amber-400/80 shadow-xl'
                  : isEating
                  ? 'bg-amber-950/70 backdrop-blur-md border-amber-500/50 shadow-md'
                  : isDirty
                  ? 'bg-red-950/60 backdrop-blur-md border-dashed border-red-500/80 animate-pulse'
                  : 'bg-stone-900/60 backdrop-blur-sm border-dashed border-stone-700/60'
              }`}
            >
              {/* Table Top Bar: Name & Waiting Time */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-amber-200">
                    {table.name}
                  </span>
                  <span className="text-[9px] text-stone-400 font-bold">({table.subtitle})</span>
                </div>

                {hasCustomer && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border flex items-center gap-1 ${
                      patiencePercent < 30
                        ? 'bg-red-950 text-red-300 border-red-500 animate-pulse'
                        : 'bg-amber-950/90 text-amber-300 border-amber-500/50'
                    }`}
                  >
                    <GameAssetIcon name="clock" size={11} />
                    {Math.ceil(table.customer!.currentPatience)}s
                  </span>
                )}
              </div>

              {/* Table Center: Character Sprite & Order Speech Bubble */}
              <div className="my-1 min-h-[110px] flex items-center justify-center">
                {hasCustomer ? (
                  <div className="flex flex-col items-center w-full">
                    {/* Order speech bubble above customer */}
                    <div className="w-full mb-1">
                      <OrderBubble
                        dishName={table.customer!.orderDishName}
                        dishEmoji={table.customer!.orderDishEmoji}
                        patiencePercent={patiencePercent}
                        secondsRemaining={table.customer!.currentPatience}
                        canServe={canServe}
                      />
                    </div>

                    {/* 2D Chibi Customer Sprite */}
                    <div className="relative">
                      <CustomerSprite
                        spriteSrc={table.customer!.visualSprite || table.customer!.avatar}
                        name={table.customer!.name}
                        mood={table.customer!.mood}
                        size="sm"
                        isEating={false}
                      />
                      <span className="text-[10px] font-black text-amber-200/90 block text-center mt-0.5 truncate max-w-[90px]">
                        {table.customer!.name}
                      </span>
                    </div>
                  </div>
                ) : isEating ? (
                  <div className="flex flex-col items-center justify-center text-center py-1">
                    {/* Eating Customer Sprite */}
                    <CustomerSprite
                      spriteSrc={
                        table.customer?.visualSprite ||
                        table.customer?.avatar ||
                        GAME_ASSETS.customers.students.female
                      }
                      name="Khách đang ăn"
                      mood="happy"
                      size="sm"
                      isEating={true}
                    />
                    <div className="mt-1 bg-amber-900/80 border border-amber-500/40 px-2 py-0.5 rounded-lg">
                      <span className="text-[10px] text-amber-200 font-extrabold block">
                        Đang thưởng thức ({Math.ceil(table.eatingTimeRemaining)}s)
                      </span>
                    </div>
                  </div>
                ) : isDirty ? (
                  <div className="flex flex-col items-center justify-center text-center p-2 w-full">
                    <div className="w-8 h-8 relative mb-1">
                      <GameAssetIcon name="bowl" size={32} />
                    </div>
                    <button
                      type="button"
                      onClick={() => cleanTable(table.id)}
                      className="w-full py-1.5 bg-red-600/40 hover:bg-red-600/60 border border-red-400 text-red-200 font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-1 active:scale-95 shadow-md transition-all cursor-pointer"
                    >
                      <span>Dọn Bàn Này (+5 Xu)</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 text-stone-500">
                    <div className="w-6 h-6 relative mb-1 opacity-50">
                      <GameAssetIcon name="home" size={24} />
                    </div>
                    <span className="text-[11px] font-semibold italic">Bàn sạch sẵn sàng</span>
                  </div>
                )}
              </div>

              {/* Table Action Button */}
              {hasCustomer && (
                <button
                  type="button"
                  onClick={() => serveTable(table.id)}
                  disabled={!canServe}
                  className={`w-full py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md ${
                    canServe
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white cursor-pointer active:scale-95 animate-bounce-slight'
                      : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                  }`}
                >
                  <GameAssetIcon name="complete" size={16} />
                  <span>{canServe ? 'Giao Bàn Ngay' : 'Cần Nấu Món Này'}</span>
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Start Day Button (if day is inactive) */}
      {!isDayActive && (
        <button
          type="button"
          onClick={startDay}
          className="relative z-10 w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-black text-xs rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 border border-amber-400/40 cursor-pointer"
        >
          <GameAssetIcon name="lantern" size={18} />
          <span>Mở Cửa Đón Khách Vào Bàn</span>
        </button>
      )}
    </div>
  );
};
