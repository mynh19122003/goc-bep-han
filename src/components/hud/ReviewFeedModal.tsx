'use client';

import React from 'react';
import Image from 'next/image';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_ASSETS } from '@/game/assets/gameAssets';
import { GameModal } from '@/components/ui/game/GameModal';

export const ReviewFeedModal: React.FC = () => {
  const { activeModal, setActiveModal, reviews, rating } = useGameStore();

  if (activeModal !== 'reviews') return null;

  return (
    <GameModal
      title="Đánh giá thực khách"
      subtitle={`Điểm hiện tại ${rating.toFixed(1)} / 5.0`}
      onClose={() => setActiveModal('none')}
      maxWidth="max-w-md"
      icon={<span className="relative h-9 w-9"><Image src={GAME_ASSETS.hud.rating} alt="" fill sizes="36px" className="object-contain" /></span>}
    >
      <div className="space-y-2.5">
        {reviews.length === 0 ? (
          <div className="py-10 text-center text-[11px] font-bold text-stone-500">Chưa có đánh giá mới.</div>
        ) : (
          reviews.map((review) => {
            const imageAvatar = review.avatar?.startsWith('/');
            return (
              <article key={review.id} className="rounded-2xl border border-stone-700 bg-stone-900/65 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-amber-500/15 bg-black/20">
                      {imageAvatar ? (
                        <div className="relative h-9 w-9">
                          <Image src={review.avatar} alt={review.author} fill sizes="36px" className="object-contain" />
                        </div>
                      ) : (
                        <span className="text-xs font-black text-amber-300">{review.author.charAt(0)}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-xs font-black text-amber-100">{review.author}</h3>
                      <p className="text-[9px] text-stone-500">{review.timeAgo}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span key={index} className={`relative h-3.5 w-3.5 ${index < review.rating ? 'opacity-100' : 'opacity-15 grayscale'}`}>
                        <Image src={GAME_ASSETS.hud.rating} alt="" fill sizes="14px" className="object-contain" />
                      </span>
                    ))}
                  </div>
                </div>

                <p className="mt-2 text-[11px] leading-relaxed text-stone-300">“{review.comment}”</p>

                <div className="mt-2 flex items-center justify-between gap-2 border-t border-stone-800 pt-2">
                  <span className="truncate text-[9px] font-bold text-amber-300">{review.dishName}</span>
                  <span className="rounded-lg border border-stone-700 bg-black/20 px-2 py-1 text-[8px] font-black text-stone-400">
                    {review.orderType === 'delivery' ? 'Giao hàng' : 'Tại quán'}
                  </span>
                </div>
              </article>
            );
          })
        )}
      </div>
    </GameModal>
  );
};
