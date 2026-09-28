'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { GAME_ASSETS } from '@/game/assets/gameAssets';
import { GAME_BUILD_LABEL, GAME_TITLE, GAME_VERSION } from '@/config/version';
import { GameButton } from '@/components/ui/game/GameButton';
import { CloseButton } from '@/components/ui/game/CloseButton';

type IntroTab = 'intro' | 'guide' | 'about';

interface GameIntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const guideSteps = [
  {
    title: '1. Mở quán & nhận khách',
    text: 'Bấm Mở Quán, theo dõi bàn ăn và thanh kiên nhẫn. Khách sẽ gọi món theo từng yêu cầu riêng.',
    asset: GAME_ASSETS.navigation.restaurant,
  },
  {
    title: '2. Chọn đúng đơn cần nấu',
    text: 'Mở Bếp hoặc chạm trực tiếp vào order của khách. Luôn kiểm tra topping, món cấm và cấp cay trước khi bắt đầu.',
    asset: GAME_ASSETS.navigation.kitchen,
  },
  {
    title: '3. Thao tác theo từng món',
    text: 'Tokbokki cần lật chảo, Kimbap cần cuộn và cắt, Ramyeon cần canh mực nước. Sau đó thêm topping đúng yêu cầu.',
    asset: GAME_ASSETS.cooking.pan,
  },
  {
    title: '4. Giao món & quản lý quán',
    text: 'Đặt món đã hoàn thành lên khay, giao đúng order, nhập nguyên liệu ở Chợ và nâng cấp quán để phục vụ nhanh hơn.',
    asset: GAME_ASSETS.navigation.inventory,
  },
];

export const GameIntroModal: React.FC<GameIntroModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<IntroTab>('intro');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[160] flex items-end justify-center bg-black/75 backdrop-blur-md sm:items-center sm:p-4">
          <motion.div
            initial={{ y: 36, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 36, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative flex max-h-[92dvh] w-full max-w-[760px] flex-col overflow-hidden rounded-t-[28px] border-t border-amber-500/35 bg-[#18110f]/98 text-stone-100 shadow-2xl sm:rounded-[28px] sm:border"
          >
            <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-stone-600/70 sm:hidden" />

            <header className="relative overflow-hidden border-b border-amber-500/20 px-4 pb-3 pt-4 sm:px-5">
              <div className="absolute inset-0 bg-gradient-to-r from-red-950/55 via-amber-950/25 to-transparent" />
              <div className="relative flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="relative h-14 w-14 shrink-0 rounded-2xl border border-amber-400/20 bg-black/25 p-1.5 shadow-lg">
                    <Image src={GAME_ASSETS.props.food_stall} alt="" fill sizes="56px" className="object-contain p-1" />
                  </span>
                  <div className="min-w-0">
                    <span className="mb-1 inline-flex rounded-full border border-amber-400/25 bg-amber-950/55 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-300">
                      {GAME_BUILD_LABEL}
                    </span>
                    <h2 className="truncate text-lg font-black text-amber-100 sm:text-xl">{GAME_TITLE}</h2>
                    <p className="mt-0.5 text-[10px] font-bold text-stone-400 sm:text-[11px]">
                      Quản lý quán ăn Hàn Quốc • Nấu món • Phục vụ • Nâng cấp
                    </p>
                  </div>
                </div>
                <CloseButton onClick={onClose} />
              </div>
            </header>

            <div className="flex shrink-0 gap-1.5 border-b border-stone-800 bg-black/20 px-3 py-2 sm:px-4">
              {[
                { id: 'intro', label: 'Giới thiệu' },
                { id: 'guide', label: 'Cách chơi' },
                { id: 'about', label: 'Phiên bản' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id as IntroTab)}
                  className={`min-h-[38px] flex-1 rounded-xl border px-2 text-[10px] font-black transition active:scale-95 sm:flex-none sm:px-4 ${
                    tab === item.id
                      ? 'border-amber-300/45 bg-amber-600/65 text-white'
                      : 'border-stone-700 bg-stone-900/70 text-stone-400 hover:bg-stone-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <main className="game-scrollbar min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
              {tab === 'intro' && (
                <div>
                  <div className="grid gap-3 sm:grid-cols-[1.25fr_.75fr]">
                    <section className="rounded-2xl border border-amber-500/20 bg-amber-950/18 p-4">
                      <h3 className="text-sm font-black text-amber-100">Xây quán ăn Hàn của riêng bạn</h3>
                      <p className="mt-2 text-[11px] leading-relaxed text-stone-300">
                        Bạn bắt đầu với một quán nhỏ, tự nhận khách, nấu từng món theo yêu cầu và quản lý nguyên liệu.
                        Khi phục vụ tốt, danh tiếng tăng lên và bạn có thể mở khóa món mới, nâng cấp thiết bị và xử lý nhiều đơn hơn.
                      </p>
                    </section>

                    <section className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Nấu món', asset: GAME_ASSETS.cooking.pot },
                        { label: 'Giao hàng', asset: GAME_ASSETS.navigation.delivery },
                        { label: 'Chợ sáng', asset: GAME_ASSETS.navigation.inventory },
                        { label: 'Nâng cấp', asset: GAME_ASSETS.cooking.stove },
                      ].map((item) => (
                        <div key={item.label} className="flex min-h-[96px] flex-col items-center justify-center rounded-2xl border border-stone-700 bg-stone-900/60 p-2 text-center">
                          <span className="relative h-11 w-11">
                            <Image src={item.asset} alt="" fill sizes="44px" className="object-contain" />
                          </span>
                          <span className="mt-1 text-[10px] font-black text-stone-200">{item.label}</span>
                        </div>
                      ))}
                    </section>
                  </div>

                  <div className="mt-3 rounded-2xl border border-emerald-500/20 bg-emerald-950/18 p-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">Mẹo bắt đầu</span>
                    <p className="mt-1 text-[11px] leading-relaxed text-stone-300">
                      Đừng nấu theo tên món בלבד. Hãy đọc cả topping và cấp cay của từng khách — game chấm đúng toàn bộ order.
                    </p>
                  </div>
                </div>
              )}

              {tab === 'guide' && (
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {guideSteps.map((step) => (
                    <section key={step.title} className="flex gap-3 rounded-2xl border border-stone-700 bg-stone-900/60 p-3">
                      <span className="relative h-11 w-11 shrink-0 rounded-xl border border-amber-500/15 bg-black/20 p-1">
                        <Image src={step.asset} alt="" fill sizes="44px" className="object-contain p-1" />
                      </span>
                      <div>
                        <h3 className="text-[11px] font-black text-amber-100">{step.title}</h3>
                        <p className="mt-1 text-[10px] leading-relaxed text-stone-400">{step.text}</p>
                      </div>
                    </section>
                  ))}
                </div>
              )}

              {tab === 'about' && (
                <div className="space-y-3">
                  <section className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-wider text-stone-500">Phiên bản game</p>
                        <h3 className="mt-1 text-2xl font-black text-amber-100">v{GAME_VERSION}</h3>
                      </div>
                      <span className="rounded-full border border-emerald-500/25 bg-emerald-950/45 px-3 py-1 text-[9px] font-black text-emerald-300">
                        {GAME_BUILD_LABEL}
                      </span>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-stone-700 bg-stone-900/60 p-4">
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-amber-300">Có trong bản hiện tại</h3>
                    <div className="mt-2 grid gap-2 text-[10px] leading-relaxed text-stone-300 sm:grid-cols-2">
                      <span>• Khách ăn tại quán và đơn giao hàng</span>
                      <span>• Mì cay / Ramyeon / Tokbokki / Kimbap</span>
                      <span>• Topping và cấp cay theo từng order</span>
                      <span>• Chợ sáng, kho, mặc cả và độ tươi</span>
                      <span>• Nâng cấp thiết bị và danh tiếng quán</span>
                      <span>• Giao diện responsive cho mobile / desktop</span>
                    </div>
                  </section>
                </div>
              )}
            </main>

            <footer className="shrink-0 border-t border-stone-800 bg-black/20 p-3 sm:px-4">
              <GameButton fullWidth tone="success" onClick={onClose}>
                Vào quán
              </GameButton>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
