'use client';

import React from 'react';
import Image from 'next/image';
import { GAME_ASSETS, SemanticIconName } from '@/config/gameAssets';
import { PHASE3_SEMANTIC_MAP } from '@/game/assets/phase3UiAssets';

export interface GameAssetIconProps {
  name: SemanticIconName | string;
  size?: number;
  className?: string;
  alt?: string;
}

export const GameAssetIcon: React.FC<GameAssetIconProps> = ({
  name,
  size = 24,
  className = '',
  alt,
}) => {
  // Try to find image source in phase3 semantic map first
  const phase3Meta = PHASE3_SEMANTIC_MAP[name];
  const phase3Src = phase3Meta?.path;

  // Try to find image source in semanticIcons
  const semantic = (GAME_ASSETS.semanticIcons as Record<string, string>)[name];
  const ui = (GAME_ASSETS.ui as Record<string, string>)[name];
  const button = (GAME_ASSETS.buttons as Record<string, string>)[name];
  const prop = (GAME_ASSETS.props as Record<string, string>)[name];
  const ingredient = (GAME_ASSETS.ingredients as Record<string, string>)[name];
  const dish = (GAME_ASSETS.dishes as Record<string, string>)[name];

  const src = phase3Src || semantic || ui || button || prop || ingredient || dish;

  if (!src) {
    // If not found in game assets, return a simple text label to audit missing assets without emoji/star
    return (
      <span
        className={`inline-flex items-center justify-center font-bold text-[10px] text-amber-400 px-1 border border-amber-400/40 rounded ${className}`}
        style={{ height: size }}
      >
        Thiếu asset
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt || name}
        width={size}
        height={size}
        className="w-full h-full object-contain pointer-events-none drop-shadow-sm"
        draggable={false}
      />
    </span>
  );
};
