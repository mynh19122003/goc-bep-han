'use client';

import React from 'react';
import Image from 'next/image';
import { GAME_ASSETS, SemanticIconName } from '@/config/gameAssets';

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
  // Try to find image source in semanticIcons
  const semantic = (GAME_ASSETS.semanticIcons as Record<string, string>)[name];
  const ui = (GAME_ASSETS.ui as Record<string, string>)[name];
  const button = (GAME_ASSETS.buttons as Record<string, string>)[name];
  const prop = (GAME_ASSETS.props as Record<string, string>)[name];
  const ingredient = (GAME_ASSETS.ingredients as Record<string, string>)[name];
  const dish = (GAME_ASSETS.dishes as Record<string, string>)[name];

  const src = semantic || ui || button || prop || ingredient || dish;

  if (!src) {
    // Never invent a glyph/SVG fallback. Missing assets stay visually empty so
    // the asset audit can catch them instead of silently mixing art styles.
    return null;
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
