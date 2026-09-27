'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface GameImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
}

export const GameImage: React.FC<GameImageProps> = ({
  src,
  alt,
  fallbackSrc,
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const finalSrc = hasError && fallbackSrc ? fallbackSrc : src;

  return (
    <Image
      src={finalSrc}
      alt={alt}
      className={`select-none ${className}`}
      draggable={false}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};
