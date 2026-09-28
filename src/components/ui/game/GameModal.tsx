'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CloseButton } from '@/components/ui/game/CloseButton';

interface GameModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  maxWidth?: string;
  className?: string;
  showClose?: boolean;
}

export const GameModal: React.FC<GameModalProps> = ({
  title,
  subtitle,
  onClose,
  children,
  icon,
  maxWidth = 'max-w-2xl',
  className = '',
  showClose = true,
}) => (
  <div className="fixed inset-0 z-50 flex items-end bg-black/70 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4">
    <button type="button" className="absolute inset-0" aria-label="Đóng" onClick={onClose} />
    <motion.section
      initial={{ y: 28, opacity: 0, scale: 0.98 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 28, opacity: 0, scale: 0.98 }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      className={`relative z-10 flex h-[88dvh] max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-3xl border-t border-amber-500/30 bg-[#1a1411]/98 text-stone-100 shadow-2xl sm:h-auto sm:max-h-[88dvh] sm:rounded-3xl sm:border ${maxWidth} ${className}`}
    >
      <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-stone-600/70 sm:hidden" />
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-amber-500/20 px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex min-w-0 items-center gap-2">
          {icon && <div className="shrink-0">{icon}</div>}
          <div className="min-w-0">
            <h2 className="truncate text-sm font-black uppercase tracking-wide text-amber-100 sm:text-base">{title}</h2>
            {subtitle && <p className="truncate text-[10px] font-bold text-stone-400">{subtitle}</p>}
          </div>
        </div>
        {showClose && <CloseButton onClick={onClose} />}
      </header>
      <div className="game-scrollbar min-h-0 flex-1 overflow-y-auto p-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-4">
        {children}
      </div>
    </motion.section>
  </div>
);
