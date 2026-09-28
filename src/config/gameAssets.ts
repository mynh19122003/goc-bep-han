export interface CustomerVisualMeta {
  id: string;
  name: string;
  category: 'student' | 'office' | 'adult' | 'gym' | 'elderly';
  gender: 'male' | 'female';
  sprite: string;
  personality: 'friendly' | 'rushed' | 'critic' | 'student';
  defaultQuote: string;
}

export interface ShipperVisualMeta {
  id: 'green' | 'orange';
  name: string;
  colorName: string;
  sprite: string;
  brandColor: string;
}

import { GAME_ASSETS, type SemanticIconName } from '@/game/assets/gameAssets';
import { PHASE3_UI_ASSETS, PHASE3_SEMANTIC_MAP, type Phase3SemanticKey } from '@/game/assets/phase3UiAssets';
export { GAME_ASSETS, PHASE3_UI_ASSETS, PHASE3_SEMANTIC_MAP, type SemanticIconName, type Phase3SemanticKey };

export const SHIPPER_LIST: ShipperVisualMeta[] = [
  {
    id: 'green',
    name: 'Shipper Áo Xanh',
    colorName: 'Xanh Lá',
    sprite: GAME_ASSETS.shippers.green,
    brandColor: 'bg-emerald-600',
  },
  {
    id: 'orange',
    name: 'Shipper Áo Cam',
    colorName: 'Cam Tươi',
    sprite: GAME_ASSETS.shippers.orange,
    brandColor: 'bg-orange-500',
  },
];

export const CUSTOMER_VISUAL_POOL: CustomerVisualMeta[] = [
  {
    id: 'student_male',
    name: 'Minh Tuấn',
    category: 'student',
    gender: 'male',
    sprite: GAME_ASSETS.customers.students.male,
    personality: 'student',
    defaultQuote: 'Sau giờ học đói meo, cho em phần mì cay kim chi nhé!',
  },
  {
    id: 'student_female',
    name: 'Hye-jin (Nữ Sinh)',
    category: 'student',
    gender: 'female',
    sprite: GAME_ASSETS.customers.students.female,
    personality: 'student',
    defaultQuote: 'Mê Mì Cay phô mai xúc xích ở đây lắm luôn á quán ơi!',
  },
  {
    id: 'office_male',
    name: 'Lee Jin-Woo',
    category: 'office',
    gender: 'male',
    sprite: GAME_ASSETS.customers.office.male,
    personality: 'rushed',
    defaultQuote: 'Nghỉ trưa ít thời gian, cho tô mì cay cấp 2 làm nóng nhanh nhé!',
  },
  {
    id: 'office_female',
    name: 'Trưởng Phòng Kim',
    category: 'office',
    gender: 'female',
    sprite: GAME_ASSETS.customers.office.female,
    personality: 'critic',
    defaultQuote: 'Cho phần Mì Cay không ớt, thêm nhiều nấm và bắp cải kim chi.',
  },
  {
    id: 'adult_female_01',
    name: 'Chị Soo-yeon',
    category: 'adult',
    gender: 'female',
    sprite: GAME_ASSETS.customers.adults.female_01,
    personality: 'friendly',
    defaultQuote: 'Thời tiết se lạnh thế này húp tô mì cay nóng hổi là tuyệt nhất!',
  },
  {
    id: 'adult_female_02',
    name: 'Bạn Eun-ji',
    category: 'adult',
    gender: 'female',
    sprite: GAME_ASSETS.customers.adults.female_02,
    personality: 'friendly',
    defaultQuote: 'Cho mình Tokbokki phô mai trứng và một hộp sữa chuối nha.',
  },
  {
    id: 'adult_female_03',
    name: 'Cô Na-young',
    category: 'adult',
    gender: 'female',
    sprite: GAME_ASSETS.customers.adults.female_03,
    personality: 'critic',
    defaultQuote: 'Kimbap nhớ cuộn chặt tay và cắt đều khoanh giúp cô nhé.',
  },
  {
    id: 'adult_male_01',
    name: 'Anh Min-ho',
    category: 'adult',
    gender: 'male',
    sprite: GAME_ASSETS.customers.adults.male_01,
    personality: 'friendly',
    defaultQuote: 'Làm cho anh tô Mì Cay cấp 3 thêm xúc xích với chả cá nghen!',
  },
  {
    id: 'adult_male_backpack',
    name: 'Han-sol (Du Khách)',
    category: 'adult',
    gender: 'male',
    sprite: GAME_ASSETS.customers.adults.male_backpack,
    personality: 'friendly',
    defaultQuote: 'Nghe đồn quán này có mì cay chuẩn vị Seoul nhất phố!',
  },
  {
    id: 'adult_male_cap',
    name: 'Bạn Tae-hyung',
    category: 'adult',
    gender: 'male',
    sprite: GAME_ASSETS.customers.adults.male_cap,
    personality: 'student',
    defaultQuote: 'Cho một phần Tokbokki chảo gang nóng hổi nhiều tương ớt cay!',
  },
  {
    id: 'gym_male',
    name: 'HLV Kang (Gym)',
    category: 'gym',
    gender: 'male',
    sprite: GAME_ASSETS.customers.gym.male,
    personality: 'rushed',
    defaultQuote: 'Tập xong cần nạp năng lượng! Cho tô mì thêm 2 trứng gà và chả cá.',
  },
  {
    id: 'gym_female',
    name: 'Bạn Ji-won (Gym)',
    category: 'gym',
    gender: 'female',
    sprite: GAME_ASSETS.customers.gym.female,
    personality: 'friendly',
    defaultQuote: 'Cho mình Kimbap truyền thống nhiều rau củ và trứng gà nhé!',
  },
  {
    id: 'elderly_male',
    name: 'Bác Kim',
    category: 'elderly',
    gender: 'male',
    sprite: GAME_ASSETS.customers.elderly.male,
    personality: 'critic',
    defaultQuote: 'Nước dùng dashi phải hầm kỹ ngọt thanh, ít cay thôi nhé cháu.',
  },
  {
    id: 'elderly_female',
    name: 'Bà Park (Tiểu Thương)',
    category: 'elderly',
    gender: 'female',
    sprite: GAME_ASSETS.customers.elderly.female,
    personality: 'friendly',
    defaultQuote: 'Bán hàng ngoài chợ lạnh quá, vào đây ăn bát mì ấm bụng.',
  },
];
