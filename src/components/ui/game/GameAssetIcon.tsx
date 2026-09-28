'use client';

import React from 'react';
import Image from 'next/image';
import { GAME_ASSETS } from '@/game/assets/gameAssets';

export interface GameAssetIconProps {
  name: string;
  size?: number;
  className?: string;
  alt?: string;
}

const SAFE_ICON_ASSETS: Record<string, string> = {
  coin: GAME_ASSETS.hud.coin,
  heart: GAME_ASSETS.hud.heart,
  close: GAME_ASSETS.actions.close,
  plus: GAME_ASSETS.actions.plus,
  minus: GAME_ASSETS.actions.minus,
  pot: GAME_ASSETS.cooking.pot,
  pan: GAME_ASSETS.cooking.pan,
  bowl: GAME_ASSETS.cooking.bowl,
  board: GAME_ASSETS.cooking.board,
  chilli: GAME_ASSETS.toppings.chilli,
  sauce: GAME_ASSETS.ingredients.tuong_ot_gochujang,
  menu: GAME_ASSETS.navigation.menu,
  cooking: GAME_ASSETS.navigation.kitchen,
  recipe: GAME_ASSETS.ui.sign_recipe,
  ingredient: GAME_ASSETS.ui.sign_ingredient,
  delivery: GAME_ASSETS.navigation.delivery,
  takeaway: GAME_ASSETS.cooking.takeaway_box,
  knife: GAME_ASSETS.cooking.knife,
  gas_stove: GAME_ASSETS.cooking.stove,
  ladle: GAME_ASSETS.cooking.ladle,
  lantern: GAME_ASSETS.props.red_lantern,
  home: GAME_ASSETS.navigation.restaurant,
  serve: GAME_ASSETS.cooking.bowl,
  fire: GAME_ASSETS.cooking.stove,
};

export const GameAssetIcon: React.FC<GameAssetIconProps> = ({
  name,
  size = 24,
  className = '',
  alt,
}) => {
  const src = SAFE_ICON_ASSETS[name];
  if (!src) return null;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt || name}
        width={size}
        height={size}
        className="h-full w-full object-contain pointer-events-none"
        draggable={false}
      />
    </span>
  );
};
