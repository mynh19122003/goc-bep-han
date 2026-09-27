export interface BackgroundAsset {
  id: 'storefront' | 'dining' | 'kitchen';
  title: string;
  subtitle: string;
  themeColor: string;
  ambientLight: string;
}

export const SCENE_BACKGROUNDS: Record<'storefront' | 'dining' | 'kitchen', BackgroundAsset> = {
  storefront: {
    id: 'storefront',
    title: 'Mặt Tiền Quán & Chợ Sớm',
    subtitle: 'Khu Giao Hàng Trực Tuyến • Chợ Noryangjin',
    themeColor: '#E03131',
    ambientLight: 'from-amber-950/80 via-red-950/70 to-stone-900',
  },
  dining: {
    id: 'dining',
    title: 'Phòng Ăn Hanok Ấm Cúng',
    subtitle: '4 Bàn Khách • View Cửa Sổ Phố Seoul',
    themeColor: '#F59E0B',
    ambientLight: 'from-amber-900/60 via-stone-900/80 to-stone-950',
  },
  kitchen: {
    id: 'kitchen',
    title: 'Gian Bếp Chế Biến',
    subtitle: 'Chảo Tok • Mành Kimbap • Nồi Ramyeon',
    themeColor: '#10B981',
    ambientLight: 'from-stone-900/80 via-amber-950/60 to-stone-950',
  },
};

export const SPRITE_ASSETS = {
  icons: {
    coin: '🪙',
    star: '⭐',
    flame: '🔥',
    steam: '♨️',
    heart: '❤️',
    clock: '⏱️',
    scooter: '🛵',
    chopsticks: '🥢',
    pot: '🍲',
    pan: '🍳',
    bamboo: '🪵',
    sponge: '🧽',
    newspaper: '📰',
    cookbook: '📖',
  },
  characters: {
    grandma: { avatar: '👵', name: 'Bà Bán Rau Noryangjin', tag: 'Tiểu Thương' },
    shipper: { avatar: '🛵', name: 'Shipper Giao Hàng', tag: 'Giao Hàng' },
    chef: { avatar: '🧑‍🍳', name: 'Bếp Trưởng Quán', tag: 'Đầu Bếp' },
  },
};
