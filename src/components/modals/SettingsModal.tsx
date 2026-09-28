'use client';

import React from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { GameModal } from '@/components/ui/game/GameModal';
import { GameButton } from '@/components/ui/game/GameButton';

export const SettingsModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    sfxEnabled,
    bgmEnabled,
    toggleSfx,
    toggleBgm,
    resetGameData,
  } = useGameStore();

  if (activeModal !== 'settings') return null;

  return (
    <GameModal
      title="Cài đặt"
      subtitle="Âm thanh và dữ liệu trò chơi"
      onClose={() => setActiveModal('none')}
      maxWidth="max-w-md"
      icon={<span className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-950/50 text-[10px] font-black text-amber-200">SET</span>}
    >
      <div className="space-y-3">
        <section className="rounded-2xl border border-stone-700 bg-black/20 p-3">
          <h3 className="mb-2 text-[10px] font-black uppercase tracking-wider text-amber-300">Âm thanh</h3>

          <div className="flex items-center justify-between gap-3 border-b border-stone-800 py-2">
            <div>
              <p className="text-xs font-black text-stone-100">Hiệu ứng âm thanh</p>
              <p className="text-[10px] text-stone-500">Nút bấm, nấu ăn, thông báo</p>
            </div>
            <GameButton compact tone={sfxEnabled ? 'success' : 'neutral'} onClick={toggleSfx}>
              SFX {sfxEnabled ? 'Bật' : 'Tắt'}
            </GameButton>
          </div>

          <div className="flex items-center justify-between gap-3 py-2">
            <div>
              <p className="text-xs font-black text-stone-100">Nhạc nền</p>
              <p className="text-[10px] text-stone-500">Không gian quán ăn</p>
            </div>
            <GameButton compact tone={bgmEnabled ? 'success' : 'neutral'} onClick={toggleBgm}>
              BGM {bgmEnabled ? 'Bật' : 'Tắt'}
            </GameButton>
          </div>
        </section>

        <section className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-3">
          <h3 className="mb-1 text-[10px] font-black uppercase tracking-wider text-amber-300">Mẹo nhanh</h3>
          <ul className="space-y-1 text-[11px] leading-relaxed text-stone-300">
            <li>• Phục vụ trước khi thanh kiên nhẫn xuống thấp.</li>
            <li>• Đọc yêu cầu topping và cấp cay trước khi nấu.</li>
            <li>• Theo dõi độ tươi nguyên liệu trước khi nhập thêm hàng.</li>
          </ul>
        </section>

        <GameButton
          fullWidth
          tone="danger"
          onClick={() => {
            if (confirm('Bạn có chắc muốn xóa toàn bộ tiến trình và chơi lại từ đầu?')) {
              resetGameData();
            }
          }}
        >
          Reset dữ liệu trò chơi
        </GameButton>
      </div>
    </GameModal>
  );
};
