'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CustomerMood } from '@/types/game';
import { GAME_ASSETS } from '@/game/assets/gameAssets';

interface CustomerSpriteProps {
  spriteSrc: string;
  name?: string;
  mood?: CustomerMood;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isEating?: boolean;
}

export const CustomerSprite: React.FC<CustomerSpriteProps> = ({
  spriteSrc,
  name,
  mood = 'happy',
  size = 'md',
  className = '',
  isEating = false,
}) => {
  const sizeMap = {
    sm: { width: 58, height: 96 },
    md: { width: 74, height: 124 },
    lg: { width: 96, height: 158 },
  };

  const { width, height } = sizeMap[size];

  // Mood asset indicator
  const moodAsset =
    isEating || mood === 'happy'
      ? GAME_ASSETS.hud.heart
      : mood === 'impatient' || mood === 'angry'
      ? GAME_ASSETS.toppings.chilli
      : null;

  return (
    <div className={`relative flex flex-col items-center justify-end select-none ${className}`}>
      {/* Emotion mood bubble floating above head */}
      {moodAsset && (
        <motion.div
          animate={
            isEating
              ? { y: [0, -5, 0], scale: [1, 1.15, 1] }
              : mood === 'angry'
              ? { x: [-3, 3, -3] }
              : { y: [0, -3, 0] }
          }
          transition={{ repeat: Infinity, duration: isEating ? 0.9 : 2 }}
          className="absolute -top-2 z-20 bg-stone-900/90 border border-amber-400/70 rounded-full p-1 shadow-md flex items-center justify-center w-6 h-6"
        >
          <Image
            src={moodAsset}
            alt="mood"
            width={16}
            height={16}
            className="object-contain w-4 h-4"
          />
        </motion.div>
      )}

      {/* Chibi Character Sprite Image */}
      <motion.div
        animate={
          isEating
            ? { y: [0, -3, 0], scale: [1, 1.02, 1] }
            : mood === 'angry'
            ? { rotate: [-1.5, 1.5, -1.5] }
            : { y: [0, -3, 0] }
        }
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="relative filter drop-shadow-md"
      >
        <Image
          src={spriteSrc}
          alt={name || 'Khách hàng chibi'}
          width={width}
          height={height}
          className="object-contain"
          priority={size === 'lg'}
        />
      </motion.div>
    </div>
  );
};
