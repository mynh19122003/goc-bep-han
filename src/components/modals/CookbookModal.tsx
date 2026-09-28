'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/stores/useGameStore';
import { GAME_ASSETS } from '@/game/assets/gameAssets';
import { GameModal } from '@/components/ui/game/GameModal';

const chapters = [
  {
    id: 1,
    title: 'Tokbokki',
    asset: GAME_ASSETS.cooking.pan,
    lines: [
      'Pha sốt theo đúng tỷ lệ và giữ nhiệt ổn định.',
      'Lật chảo ít nhất 2 lần để sốt áo đều bánh gạo.',
      'Tránh để nhiệt quá cao hoặc món sẽ bị cháy.',
    ],
  },
  {
    id: 2,
    title: 'Kimbap',
    asset: GAME_ASSETS.cooking.board,
    lines: [
      'Xếp đúng nguyên liệu theo recipe hiện tại.',
      'Vuốt lên để cuộn đến 100%.',
      'Sau đó vuốt ngang hoặc bấm cắt đủ 8 khoanh.',
    ],
  },
  {
    id: 3,
    title: 'Ramyeon',
    asset: GAME_ASSETS.cooking.pot,
    lines: [
      'Canh mực nước trong vùng 70–80%.',
      'Chọn topping và cấp cay theo yêu cầu khách.',
      'Không để nồi quá lâu sau khi chín để tránh cháy.',
    ],
  },
  {
    id: 4,
    title: 'Chợ sáng',
    asset: GAME_ASSETS.navigation.inventory,
    lines: [
      'Theo dõi giá biến động mỗi ngày.',
      'Độ tươi thấp sẽ giảm chất lượng món.',
      'Mặc cả đúng vùng xanh để mua hàng rẻ hơn.',
    ],
  },
  {
    id: 5,
    title: 'Giao hàng',
    asset: GAME_ASSETS.navigation.delivery,
    lines: [
      'Nấu đúng order trước khi shipper tới.',
      'Món phải khớp order ID, topping và độ cay.',
      'Chỉ nhận doanh thu sau khi giao đúng món cho shipper.',
    ],
  },
];

export const CookbookModal: React.FC = () => {
  const { activeModal, setActiveModal } = useGameStore();
  const [activeChapter, setActiveChapter] = useState(1);

  if (activeModal !== 'cookbook') return null;

  const current = chapters.find((chapter) => chapter.id === activeChapter) || chapters[0];

  return (
    <GameModal
      title="Sổ tay đầu bếp"
      subtitle="Hướng dẫn các cơ chế chính trong game"
      onClose={() => setActiveModal('none')}
      maxWidth="max-w-lg"
      icon={<span className="relative h-9 w-9"><Image src={GAME_ASSETS.ui.sign_recipe} alt="" fill sizes="36px" className="object-contain" /></span>}
    >
      <div className="game-scrollbar mb-3 flex gap-1.5 overflow-x-auto pb-1">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            type="button"
            onClick={() => setActiveChapter(chapter.id)}
            className={`flex h-10 shrink-0 items-center gap-1.5 rounded-xl border px-2.5 text-[10px] font-black transition active:scale-95 ${
              activeChapter === chapter.id
                ? 'border-amber-300/50 bg-amber-600/65 text-white'
                : 'border-stone-700 bg-stone-900 text-stone-400'
            }`}
          >
            <span className="relative h-5 w-5">
              <Image src={chapter.asset} alt="" fill sizes="20px" className="object-contain" />
            </span>
            {chapter.title}
          </button>
        ))}
      </div>

      <section className="rounded-2xl border border-stone-700 bg-stone-900/65 p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="relative h-12 w-12 shrink-0">
            <Image src={current.asset} alt="" fill sizes="48px" className="object-contain" />
          </span>
          <div>
            <h3 className="text-sm font-black text-amber-100">{current.title}</h3>
            <p className="text-[10px] text-stone-500">Mẹo thao tác nhanh</p>
          </div>
        </div>

        <ol className="space-y-2">
          {current.lines.map((line, index) => (
            <li key={line} className="flex gap-2 rounded-xl border border-stone-800 bg-black/20 p-2.5 text-[11px] leading-relaxed text-stone-300">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-600/20 text-[9px] font-black text-amber-300">
                {index + 1}
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ol>
      </section>
    </GameModal>
  );
};
