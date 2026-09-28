import { IngredientId } from '@/types/game';
import { GAME_ASSETS } from '@/config/gameAssets';

export interface CookingStepConfig {
  id: string;
  stepNumber: number;
  title: string;
  instruction: string;
  type: 'prepare' | 'base' | 'toppings' | 'spice' | 'finish';
}

export interface DishRecipeConfig {
  dishId: string;
  name: string;
  koreanName: string;
  stationType: 'bowl' | 'pot' | 'pan' | 'board';
  containerAsset: string;
  baseIngredients: IngredientId[];
  allowedToppings: IngredientId[];
  supportsSpiceLevel: boolean;
  defaultSpiceLevel: number;
  maxSpiceLevel: number;
  steps: CookingStepConfig[];
  idealCookSeconds: number;
}

export const RECIPE_CONFIGS: Record<string, DishRecipeConfig> = {
  spicy_ramyeon: {
    dishId: 'spicy_ramyeon',
    name: 'Mì Cay Seoul 7 Cấp Độ',
    koreanName: '매운 라면',
    stationType: 'pot',
    containerAsset: GAME_ASSETS.cooking.pot,
    baseIngredients: ['ramyeon_noodles', 'water'],
    allowedToppings: [
      'beef',
      'sausage',
      'kimchi',
      'egg',
      'mushroom',
      'scallion',
      'cheese',
      'chilli',
      'spinach',
    ],
    supportsSpiceLevel: true,
    defaultSpiceLevel: 0,
    maxSpiceLevel: 5,
    idealCookSeconds: 6,
    steps: [
      {
        id: 'prep',
        stepNumber: 1,
        title: 'Lấy Nồi Nấu Mì',
        instruction: 'Đặt nồi nhôm truyền thống lên bếp',
        type: 'prepare',
      },
      {
        id: 'base',
        stepNumber: 2,
        title: 'Nấu Mì & Nước Dùng',
        instruction: 'Cho vắt mì vàng dai và đong nước dùng Dashi ngọt thơm',
        type: 'base',
      },
      {
        id: 'toppings',
        stepNumber: 3,
        title: 'Gắp Topping Theo Order',
        instruction: 'Chọn đúng các món topping khách yêu cầu',
        type: 'toppings',
      },
      {
        id: 'spice',
        stepNumber: 4,
        title: 'Đong Cấp Độ Cay',
        instruction: 'Chỉnh đúng cấp độ ớt theo khẩu vị khách gọi',
        type: 'spice',
      },
      {
        id: 'finish',
        stepNumber: 5,
        title: 'Hoàn Thành & Giao Món',
        instruction: 'Kiểm tra độ chín thơm và dâng lên bàn!',
        type: 'finish',
      },
    ],
  },

  ramyeon: {
    dishId: 'ramyeon',
    name: 'Ramyeon Kim Chi Nóng',
    koreanName: '라면',
    stationType: 'pot',
    containerAsset: GAME_ASSETS.cooking.pot,
    baseIngredients: ['ramyeon_noodles', 'water'],
    allowedToppings: [
      'egg',
      'kimchi',
      'scallion',
      'sausage',
      'cheese',
      'mushroom',
      'chilli',
    ],
    supportsSpiceLevel: true,
    defaultSpiceLevel: 1,
    maxSpiceLevel: 3,
    idealCookSeconds: 5,
    steps: [
      {
        id: 'prep',
        stepNumber: 1,
        title: 'Lấy Nồi Nấu Mì',
        instruction: 'Đặt nồi nhôm lên bếp',
        type: 'prepare',
      },
      {
        id: 'base',
        stepNumber: 2,
        title: 'Mì & Nước Dùng',
        instruction: 'Thả mì Shin và nước dùng dashi nóng',
        type: 'base',
      },
      {
        id: 'toppings',
        stepNumber: 3,
        title: 'Thêm Topping',
        instruction: 'Chọn trứng, kim chi, hành hoa theo yêu cầu',
        type: 'toppings',
      },
      {
        id: 'finish',
        stepNumber: 4,
        title: 'Hoàn Thành Món',
        instruction: 'Canh nước dùng sôi sùng sục rồi múc ra!',
        type: 'finish',
      },
    ],
  },

  cheese_ramyeon: {
    dishId: 'cheese_ramyeon',
    name: 'Ramyeon Phô Mai Đặc Biệt',
    koreanName: '치즈 라면',
    stationType: 'pot',
    containerAsset: GAME_ASSETS.cooking.pot,
    baseIngredients: ['ramyeon_noodles', 'water', 'cheese'],
    allowedToppings: ['egg', 'scallion', 'sausage', 'kimchi', 'mushroom'],
    supportsSpiceLevel: true,
    defaultSpiceLevel: 1,
    maxSpiceLevel: 3,
    idealCookSeconds: 6,
    steps: [
      {
        id: 'prep',
        stepNumber: 1,
        title: 'Lấy Nồi',
        instruction: 'Đặt nồi vàng lên bếp',
        type: 'prepare',
      },
      {
        id: 'base',
        stepNumber: 2,
        title: 'Nấu Mì & Phô Mai',
        instruction: 'Cho mì và đặt lớp phô mai béo ngậy tan chảy',
        type: 'base',
      },
      {
        id: 'toppings',
        stepNumber: 3,
        title: 'Thêm Topping',
        instruction: 'Gắp thêm trứng và rau củ',
        type: 'toppings',
      },
      {
        id: 'finish',
        stepNumber: 4,
        title: 'Giao Món',
        instruction: 'Sợi mì béo vàng thơm lừng sẵn sàng phục vụ!',
        type: 'finish',
      },
    ],
  },

  tokbokki: {
    dishId: 'tokbokki',
    name: 'Tokbokki Cay Ngọt',
    koreanName: '떡볶이',
    stationType: 'pan',
    containerAsset: GAME_ASSETS.cooking.pan,
    baseIngredients: ['rice_cake', 'gochujang'],
    allowedToppings: ['fish_cake', 'egg', 'cheese', 'sausage', 'scallion'],
    supportsSpiceLevel: true,
    defaultSpiceLevel: 2,
    maxSpiceLevel: 4,
    idealCookSeconds: 6,
    steps: [
      {
        id: 'prep',
        stepNumber: 1,
        title: 'Chuẩn Bị Chảo Gang',
        instruction: 'Làm nóng chảo sâu lòng',
        type: 'prepare',
      },
      {
        id: 'base',
        stepNumber: 2,
        title: 'Bánh Gạo & Sốt Cay',
        instruction: 'Đổ bánh gạo dẻo và hòa quyện sốt Gochujang đỏ au',
        type: 'base',
      },
      {
        id: 'toppings',
        stepNumber: 3,
        title: 'Thêm Topping',
        instruction: 'Thả chả cá Busan, trứng luộc, xúc xích',
        type: 'toppings',
      },
      {
        id: 'finish',
        stepNumber: 4,
        title: 'Khuấy Đều & Dâng Món',
        instruction: 'Sốt sánh kẹo óng ả thơm ngào ngạt!',
        type: 'finish',
      },
    ],
  },

  cheese_tokbokki: {
    dishId: 'cheese_tokbokki',
    name: 'Tokbokki Phô Mai Kéo Sợi',
    koreanName: '치즈 떡볶이',
    stationType: 'pan',
    containerAsset: GAME_ASSETS.cooking.pan,
    baseIngredients: ['rice_cake', 'gochujang', 'cheese'],
    allowedToppings: ['fish_cake', 'sausage', 'egg', 'scallion'],
    supportsSpiceLevel: true,
    defaultSpiceLevel: 2,
    maxSpiceLevel: 4,
    idealCookSeconds: 6,
    steps: [
      {
        id: 'prep',
        stepNumber: 1,
        title: 'Chuẩn Bị Chảo Gang',
        instruction: 'Làm nóng chảo',
        type: 'prepare',
      },
      {
        id: 'base',
        stepNumber: 2,
        title: 'Bánh Gạo Sốt Phô Mai',
        instruction: 'Bánh gạo đẫm sốt phủ phô mai kéo sợi',
        type: 'base',
      },
      {
        id: 'toppings',
        stepNumber: 3,
        title: 'Thêm Topping',
        instruction: 'Thêm chả cá và xúc xích',
        type: 'toppings',
      },
      {
        id: 'finish',
        stepNumber: 4,
        title: 'Hoàn Thành',
        instruction: 'Phô mai tan chảy thơm phức kéo sợi!',
        type: 'finish',
      },
    ],
  },

  kimbap_classic: {
    dishId: 'kimbap_classic',
    name: 'Kimbap Truyền Thống',
    koreanName: '김밥',
    stationType: 'board',
    containerAsset: GAME_ASSETS.cooking.board,
    baseIngredients: ['seaweed', 'rice'],
    allowedToppings: [
      'carrot',
      'cucumber',
      'egg',
      'sausage',
      'fish_cake',
      'beef',
      'kimchi',
    ],
    supportsSpiceLevel: false,
    defaultSpiceLevel: 0,
    maxSpiceLevel: 0,
    idealCookSeconds: 5,
    steps: [
      {
        id: 'prep',
        stepNumber: 1,
        title: 'Trải Mành Tre & Rong Biển',
        instruction: 'Đặt lá rong biển Nori phẳng phiu',
        type: 'prepare',
      },
      {
        id: 'base',
        stepNumber: 2,
        title: 'Rải Đều Cơm Dẻo',
        instruction: 'Phết cơm trộn dầu mè vừa vặn',
        type: 'base',
      },
      {
        id: 'toppings',
        stepNumber: 3,
        title: 'Xếp Nhân Topping',
        instruction: 'Xếp cà rốt, dưa leo, trứng, xúc xích theo hàng',
        type: 'toppings',
      },
      {
        id: 'finish',
        stepNumber: 4,
        title: 'Cuộn Chặt & Cắt Khoanh',
        instruction: 'Cuộn đều tay và cắt 8 khoanh tròn xoe!',
        type: 'finish',
      },
    ],
  },

  kimbap: {
    dishId: 'kimbap',
    name: 'Kimbap Rong Biển',
    koreanName: '김밥',
    stationType: 'board',
    containerAsset: GAME_ASSETS.cooking.board,
    baseIngredients: ['seaweed', 'rice'],
    allowedToppings: [
      'carrot',
      'cucumber',
      'egg',
      'sausage',
      'fish_cake',
      'beef',
    ],
    supportsSpiceLevel: false,
    defaultSpiceLevel: 0,
    maxSpiceLevel: 0,
    idealCookSeconds: 5,
    steps: [
      {
        id: 'prep',
        stepNumber: 1,
        title: 'Trải Mành Tre',
        instruction: 'Đặt lá rong biển Nori',
        type: 'prepare',
      },
      {
        id: 'base',
        stepNumber: 2,
        title: 'Cơm Dẻo',
        instruction: 'Rải cơm mỏng đều bề mặt',
        type: 'base',
      },
      {
        id: 'toppings',
        stepNumber: 3,
        title: 'Topping Nhân',
        instruction: 'Xếp nhân đầy đặn sắc màu',
        type: 'toppings',
      },
      {
        id: 'finish',
        stepNumber: 4,
        title: 'Cuộn & Cắt Đều',
        instruction: 'Hoàn tất khoanh kimbap bóng bẩy!',
        type: 'finish',
      },
    ],
  },

  kimbap_cheese: {
    dishId: 'kimbap_cheese',
    name: 'Kimbap Phô Mai Trứng',
    koreanName: '치즈 김밥',
    stationType: 'board',
    containerAsset: GAME_ASSETS.cooking.board,
    baseIngredients: ['seaweed', 'rice', 'cheese'],
    allowedToppings: ['carrot', 'cucumber', 'egg', 'sausage'],
    supportsSpiceLevel: false,
    defaultSpiceLevel: 0,
    maxSpiceLevel: 0,
    idealCookSeconds: 5,
    steps: [
      {
        id: 'prep',
        stepNumber: 1,
        title: 'Trải Rong Biển',
        instruction: 'Đặt rong biển lên thớt',
        type: 'prepare',
      },
      {
        id: 'base',
        stepNumber: 2,
        title: 'Cơm & Phô Mai',
        instruction: 'Rải cơm dẻo và phô mai thanh ngậy',
        type: 'base',
      },
      {
        id: 'toppings',
        stepNumber: 3,
        title: 'Thêm Topping',
        instruction: 'Xếp trứng và rau củ',
        type: 'toppings',
      },
      {
        id: 'finish',
        stepNumber: 4,
        title: 'Cuộn Kimbap',
        instruction: 'Cắt khoanh đều đẹp mắt',
        type: 'finish',
      },
    ],
  },

  banana_milk: {
    dishId: 'banana_milk',
    name: 'Sữa Chuối Ướp Lạnh',
    koreanName: '바나나맛 우유',
    stationType: 'bowl',
    containerAsset: GAME_ASSETS.cooking.bowl,
    baseIngredients: ['banana_milk_carton'],
    allowedToppings: [],
    supportsSpiceLevel: false,
    defaultSpiceLevel: 0,
    maxSpiceLevel: 0,
    idealCookSeconds: 1,
    steps: [
      {
        id: 'prep',
        stepNumber: 1,
        title: 'Lấy Sữa Chuối Ướp Lạnh',
        instruction: 'Lấy hộp sữa chuối từ ngăn mát',
        type: 'prepare',
      },
      {
        id: 'finish',
        stepNumber: 2,
        title: 'Phục Vụ',
        instruction: 'Cắm ống hút và giao ngay cho khách',
        type: 'finish',
      },
    ],
  },

  canh_kimchi: {
    dishId: 'canh_kimchi',
    name: 'Canh Kim Chi Hầm Bò',
    koreanName: '김치찌개',
    stationType: 'pot',
    containerAsset: GAME_ASSETS.cooking.pot,
    baseIngredients: ['kimchi', 'water'],
    allowedToppings: ['beef', 'mushroom', 'scallion', 'egg', 'chilli'],
    supportsSpiceLevel: true,
    defaultSpiceLevel: 2,
    maxSpiceLevel: 4,
    idealCookSeconds: 6,
    steps: [
      {
        id: 'prep',
        stepNumber: 1,
        title: 'Lấy Nồi Đất',
        instruction: 'Đặt niêu đất giữ nhiệt',
        type: 'prepare',
      },
      {
        id: 'base',
        stepNumber: 2,
        title: 'Kim Chi & Nước Dùng',
        instruction: 'Hầm kim chi chín tới đậm đà',
        type: 'base',
      },
      {
        id: 'toppings',
        stepNumber: 3,
        title: 'Topping Bò & Nấm',
        instruction: 'Thả thịt bò Bulgogi và nấm tươi',
        type: 'toppings',
      },
      {
        id: 'finish',
        stepNumber: 4,
        title: 'Hoàn Thành Canh',
        instruction: 'Canh sôi ùng ục ấm nồng!',
        type: 'finish',
      },
    ],
  },

  bibimbap: {
    dishId: 'bibimbap',
    name: 'Cơm Trộn Cung Đình Bibimbap',
    koreanName: '비빔밥',
    stationType: 'bowl',
    containerAsset: GAME_ASSETS.cooking.bowl,
    baseIngredients: ['rice', 'gochujang'],
    allowedToppings: [
      'beef',
      'egg',
      'spinach',
      'carrot',
      'mushroom',
      'kimchi',
      'sesame',
    ],
    supportsSpiceLevel: true,
    defaultSpiceLevel: 1,
    maxSpiceLevel: 3,
    idealCookSeconds: 5,
    steps: [
      {
        id: 'prep',
        stepNumber: 1,
        title: 'Chuẩn Bị Tô Đá',
        instruction: 'Làm nóng tô đá giữ nhiệt lâu',
        type: 'prepare',
      },
      {
        id: 'base',
        stepNumber: 2,
        title: 'Cơm Dẻo & Sốt Trộn',
        instruction: 'Xới cơm trắng đáy giòn nhẹ và sốt Gochujang',
        type: 'base',
      },
      {
        id: 'toppings',
        stepNumber: 3,
        title: 'Bày Topping 5 Sắc Màu',
        instruction: 'Xếp đều bò, trứng lòng đào, nấm, rau',
        type: 'toppings',
      },
      {
        id: 'finish',
        stepNumber: 4,
        title: 'Rắc Mè & Giao Món',
        instruction: 'Rắc mè rang thơm nức mũi và dâng bàn!',
        type: 'finish',
      },
    ],
  },
};

/**
 * Fetch recipe config. Unknown dishes receive a neutral, non-spicy recipe so
 * missing configuration can never silently become spicy ramyeon.
 */
export function getRecipeConfig(dishId: string): DishRecipeConfig {
  if (RECIPE_CONFIGS[dishId]) {
    return RECIPE_CONFIGS[dishId];
  }

  if (dishId.includes('ramyeon')) return RECIPE_CONFIGS.ramyeon;
  if (dishId.includes('tokbokki')) return RECIPE_CONFIGS.tokbokki;
  if (dishId.includes('kimbap')) return RECIPE_CONFIGS.kimbap_classic;

  return {
    dishId,
    name: dishId,
    koreanName: '',
    stationType: 'bowl',
    containerAsset: GAME_ASSETS.cooking.bowl,
    baseIngredients: [],
    allowedToppings: [],
    supportsSpiceLevel: false,
    defaultSpiceLevel: 0,
    maxSpiceLevel: 0,
    idealCookSeconds: 1,
    steps: [
      {
        id: 'finish',
        stepNumber: 1,
        title: 'Hoàn Thành',
        instruction: 'Món này chưa có công thức tương tác riêng.',
        type: 'finish',
      },
    ],
  };
}

export function generateOrderCustomization(dishId: string): {
  requiredToppings: IngredientId[];
  excludedToppings?: IngredientId[];
  spiceLevel?: number;
} {
  const recipe = getRecipeConfig(dishId);
  if (!recipe || !recipe.allowedToppings || recipe.allowedToppings.length === 0) {
    return { requiredToppings: [], excludedToppings: [], spiceLevel: 0 };
  }

  // Pick 1 to 3 random toppings
  const maxPick = Math.min(3, recipe.allowedToppings.length);
  const count = 1 + Math.floor(Math.random() * maxPick);
  const shuffled = [...recipe.allowedToppings].sort(() => 0.5 - Math.random());
  const requiredToppings = shuffled.slice(0, count);

  // 25% chance of excluded topping
  let excludedToppings: IngredientId[] | undefined;
  const remaining = recipe.allowedToppings.filter((t) => !requiredToppings.includes(t));
  if (remaining.length > 0 && Math.random() < 0.25) {
    excludedToppings = [remaining[Math.floor(Math.random() * remaining.length)]];
  }

  // Spice level
  let spiceLevel: number | undefined;
  if (recipe.supportsSpiceLevel) {
    spiceLevel = Math.floor(Math.random() * (recipe.maxSpiceLevel + 1));
  }

  return { requiredToppings, excludedToppings, spiceLevel };
}

export interface DishValidationResult {
  score: number; // 0 to 100
  quality: 'perfect' | 'good' | 'ok' | 'fail';
  feedbackText: string;
  missingToppings: IngredientId[];
  wrongToppings: IngredientId[];
  isSpiceCorrect: boolean;
}

export function validateDishQuality(params: {
  dishId: string;
  cookedToppings: IngredientId[];
  cookedSpiceLevel?: number;
  baseAdded: boolean;
  requiredToppings?: IngredientId[];
  excludedToppings?: IngredientId[];
  targetSpiceLevel?: number;
}): DishValidationResult {
  let score = 100;
  const missingToppings: IngredientId[] = [];
  const wrongToppings: IngredientId[] = [];

  // Base ingredients must be added
  if (!params.baseAdded) {
    score -= 40;
  }

  const recipe = getRecipeConfig(params.dishId);
  const required = params.requiredToppings || [];
  const excluded = params.excludedToppings || [];

  // 1. Check required toppings
  required.forEach((req) => {
    if (!params.cookedToppings.includes(req)) {
      missingToppings.push(req);
      score -= 25; // severe penalty
    }
  });

  // 2. Check excluded/forbidden toppings
  excluded.forEach((exc) => {
    if (params.cookedToppings.includes(exc)) {
      wrongToppings.push(exc);
      score -= 35; // customer hates this
    }
  });

  // 3. Check extra unrequested toppings if required toppings were specified
  if (required.length > 0) {
    params.cookedToppings.forEach((top) => {
      if (!required.includes(top) && !excluded.includes(top)) {
        score -= 5;
      }
    });
  }

  // 4. Check spice level
  let isSpiceCorrect = true;
  if (recipe.supportsSpiceLevel && params.targetSpiceLevel !== undefined && params.cookedSpiceLevel !== undefined) {
    const diff = Math.abs(params.targetSpiceLevel - params.cookedSpiceLevel);
    if (diff === 1) {
      score -= 10;
      isSpiceCorrect = false;
    } else if (diff >= 2) {
      score -= 25;
      isSpiceCorrect = false;
    }
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let quality: 'perfect' | 'good' | 'ok' | 'fail' = 'perfect';
  let feedbackText = 'Tuyệt Đỉnh Seoul! Món ăn chuẩn vị hoàn hảo 100%';

  if (score >= 95) {
    quality = 'perfect';
    feedbackText = 'Xuất Sắc! Khách hàng cực kỳ hài lòng với món ăn!';
  } else if (score >= 80) {
    quality = 'good';
    feedbackText = 'Ngon Miệng! Đầy đủ topping thơm lừng ấm bụng.';
  } else if (score >= 60) {
    quality = 'ok';
    feedbackText = 'Tạm Được! Một vài nguyên liệu chưa đúng ý khách lắm.';
  } else {
    quality = 'fail';
    feedbackText = 'Khách Thất Vọng! Sai lệch topping hoặc cấp độ cay.';
  }

  return {
    score,
    quality,
    feedbackText,
    missingToppings,
    wrongToppings,
    isSpiceCorrect,
  };
}

