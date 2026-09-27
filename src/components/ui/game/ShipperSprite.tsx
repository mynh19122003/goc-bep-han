'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GameImage } from './GameImage';
import { GAME_ASSETS } from '@/config/gameAssets';

interface ShipperSpriteProps {
  color?: 'green' | 'orange';
  status?: 'on_the_way' | 'arrived' | 'picked_up' | 'cancelled';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ShipperSprite: React.FC<ShipperSpriteProps> = ({
  color = 'green',
  status = 'arrived',
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: { width: 75, height: 110 },
    md: { width: 100, height: 145 },
    lg: { width: 125, height: 180 },
  };

  const { width, height } = sizeMap[size];
  const spriteSrc =
    color === 'orange' ? GAME_ASSETS.shippers.orange : GAME_ASSETS.shippers.green;

  return (
    <div className={`relative flex flex-col items-center justify-end select-none ${className}`}>
      {/* Status indicator bubble */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className={`absolute -top-3 z-10 px-2 py-0.5 rounded-full text-[10px] font-black shadow-md border ${
          status === 'arrived'
            ? 'bg-teal-500 text-white border-teal-300 animate-pulse'
            : status === 'on_the_way'
            ? 'bg-amber-500 text-white border-amber-300'
            : 'bg-stone-700 text-stone-300 border-stone-600'
        }`}
      >
        {status === 'arrived' ? 'Đang chờ món' : status === 'on_the_way' ? 'Đang tới...' : 'Đã giao'}
      </motion.div>

      {/* Shipper character sprite */}
      <motion.div
        animate={
          status === 'on_the_way'
            ? { x: [-3, 3, -3], y: [0, -2, 0] }
            : { y: [0, -2, 0] }
        }
        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        className="filter drop-shadow-lg"
      >
        <GameImage
          src={spriteSrc}
          alt={`Shipper ${color === 'orange' ? 'áo cam' : 'áo xanh'}`}
          width={width}
          height={height}
          className="object-contain"
        />
      </motion.div>
    </div>
  );
};
