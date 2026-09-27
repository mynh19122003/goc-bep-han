'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/useGameStore';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';

export const ReviewFeedModal: React.FC = () => {
  const { activeModal, setActiveModal, reviews, rating } = useGameStore();

  if (activeModal !== 'reviews') return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none font-baloo">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="bg-stone-900 rounded-3xl max-w-md w-full p-4 sm:p-5 shadow-2xl border-4 border-amber-600/60 relative flex flex-col max-h-[85vh] text-stone-100"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setActiveModal('none')}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-100 border border-stone-700 transition-colors cursor-pointer"
          >
            <GameAssetIcon name="close" size={18} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <GameAssetIcon name="star" size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-amber-200 text-base uppercase">
                  ĐÁNH GIÁ TỪ THỰC KHÁCH
                </h3>
                <span className="text-xs font-black text-amber-300 bg-amber-950/90 border border-amber-500/50 px-2 py-0.5 rounded-xl flex items-center gap-1 shadow-inner">
                  <GameAssetIcon name="star" size={14} />
                  {rating.toFixed(1)} / 5.0
                </span>
              </div>
              <p className="text-[11px] text-amber-300/80 font-bold">
                Ý kiến từ khách ăn tại quán & đơn giao tận nơi
              </p>
            </div>
          </div>

          {/* Review Feed List */}
          <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
            {reviews.map((rev) => {
              const isSpriteAvatar = rev.avatar?.startsWith('/');

              return (
                <div
                  key={rev.id}
                  className="bg-stone-950/70 rounded-2xl p-3 border-2 border-stone-800 shadow-md"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      {/* Avatar presentation */}
                      <div className="w-10 h-10 rounded-2xl bg-stone-800 border border-amber-500/30 overflow-hidden flex items-center justify-center shrink-0">
                        {isSpriteAvatar ? (
                          <div className="relative w-8 h-8">
                            <Image
                              src={rev.avatar}
                              alt={rev.author}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-amber-300">{rev.author.charAt(0)}</span>
                        )}
                      </div>

                      <div>
                        <h4 className="font-extrabold text-amber-100 text-xs">{rev.author}</h4>
                        <span className="text-[10px] text-stone-400 font-medium">{rev.timeAgo}</span>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <GameAssetIcon
                          key={i}
                          name="star"
                          size={14}
                          className={i < rev.rating ? 'opacity-100' : 'opacity-20 grayscale'}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 font-medium mt-1 leading-snug">
                    &quot;{rev.comment}&quot;
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-stone-800 text-[10px] text-stone-400">
                    <span className="font-bold text-amber-300 flex items-center gap-1">
                      <GameAssetIcon
                        name={rev.orderType === 'delivery' ? 'delivery' : 'bowl'}
                        size={14}
                      />
                      {rev.dishName}
                    </span>

                    <span
                      className={`font-black px-2 py-0.5 rounded-lg border ${
                        rev.tag === 'tasty' || rev.tag === 'fast'
                          ? 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40'
                          : rev.tag === 'spicy'
                          ? 'text-amber-300 bg-amber-950/60 border-amber-500/40'
                          : 'text-red-300 bg-red-950/60 border-red-500/40'
                      }`}
                    >
                      {rev.tag === 'tasty'
                        ? 'Ngon miệng'
                        : rev.tag === 'fast'
                        ? 'Giao nhanh'
                        : rev.tag === 'spicy'
                        ? 'Cay đậm vị'
                        : rev.tag === 'late'
                        ? 'Chờ lâu'
                        : 'Góp ý'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
