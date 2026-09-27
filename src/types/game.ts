export type IngredientId =
  | 'rice_cake'
  | 'fish_cake'
  | 'egg'
  | 'seaweed'
  | 'rice'
  | 'carrot'
  | 'cucumber'
  | 'sausage'
  | 'cheese'
  | 'ramyeon_noodles'
  | 'scallion'
  | 'kimchi'
  | 'beef'
  | 'gochujang'
  | 'soy_sauce'
  | 'sugar'
  | 'water'
  | 'mushroom'
  | 'chilli'
  | 'spinach'
  | 'sesame'
  | 'banana_milk_carton';

export type IngredientCategory = 'raw' | 'topping' | 'sauce' | 'instant';

export interface Ingredient {
  id: IngredientId;
  name: string;
  vietnameseName: string;
  emoji: string;
  category: IngredientCategory;
  baseCost: number;
  cost: number; // Current fluctuating cost today
  priceChangePercent: number; // e.g. +20 or -15%
  stock: number;
  shelfLifeDays: number;
  freshness: number; // 0 to 100%
  description: string;
}

export type DishCategory = 'main' | 'side' | 'drink';
export type StationType = 'tokbokki' | 'kimbap' | 'ramyeon' | 'instant';

export interface Dish {
  id: string;
  name: string;
  koreanName: string;
  category: DishCategory;
  stationType: StationType;
  price: number;
  prepTime: number; // in seconds
  emoji: string;
  requiredIngredients: { [key in IngredientId]?: number };
  recipeSteps: string[];
  unlockLevel: number;
  unlockCost: number;
  isUnlocked: boolean;
  description: string;
}

export type CustomerMood = 'happy' | 'normal' | 'impatient' | 'angry';

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
  visualSprite?: string;
  visualCategory?: 'student' | 'office' | 'adult' | 'gym' | 'elderly';
  gender?: 'male' | 'female';
  orderDishId: string;
  orderDishName: string;
  orderDishEmoji: string;
  maxPatience: number;
  currentPatience: number; // seconds remaining
  tipMultiplier: number;
  personality: 'friendly' | 'rushed' | 'critic' | 'student';
  mood: CustomerMood;
  quote: string;
  state: 'arriving' | 'waiting' | 'eating' | 'satisfied' | 'angry_left';
  servedDishQuality?: 'perfect' | 'good' | 'burned';
  requiredToppings?: IngredientId[];
  excludedToppings?: IngredientId[];
  spiceLevel?: number; // 0 to 5
}

export interface DineInTable {
  id: number;
  name: string;
  subtitle: string;
  icon: string;
  customer: Customer | null;
  status: 'empty' | 'seated' | 'eating' | 'dirty';
  eatingTimeRemaining: number;
}

export interface DeliveryOrder {
  id: string; // e.g. #DH-802
  customerName: string;
  address: string;
  dishId: string;
  dishName: string;
  dishEmoji: string;
  price: number;
  tip: number;
  orderTime: number;
  shipperArriveSeconds: number; // counts down to 0
  shipperWaitSeconds: number; // counts down once shipper arrives
  shipperStatus: 'on_the_way' | 'arrived' | 'picked_up' | 'cancelled';
  shipperColor?: 'green' | 'orange';
  shipperSprite?: string;
  requiredToppings?: IngredientId[];
  excludedToppings?: IngredientId[];
  spiceLevel?: number; // 0 to 5
}

export interface CustomerReview {
  id: string;
  author: string;
  avatar: string;
  rating: number; // 1 to 5
  comment: string;
  dishName: string;
  orderType: 'dine_in' | 'delivery';
  timeAgo: string;
  tag: 'tasty' | 'fast' | 'spicy' | 'late' | 'burned' | 'broken';
}

export interface MarketNews {
  headline: string;
  subtext: string;
  weatherIcon: string;
  dateStr: string;
  affectedNotice: string;
}

export interface BargainSession {
  ingredientId: IngredientId;
  quantity: number;
  originalPrice: number;
  sliderPosition: number; // 0 to 100
  sliderDirection: 1 | -1;
  status: 'active' | 'success' | 'banned';
  discountAwarded: number; // 0.05, 0.1, 0.2
}

export interface TokbokkiCookSession {
  status: 'idle' | 'sauce_ratio' | 'cooking_stir' | 'perfect' | 'burned';
  dishId: string | null;
  gochujangSpoons: number;
  soySauceSpoons: number;
  sugarSpoons: number;
  spicyMeter: number;
  saltyMeter: number;
  sweetMeter: number;
  heatNeedle: number; // 0 to 100
  heatDirection: 1 | -1;
  isStirring: boolean;
  greenZoneTime: number; // seconds kept in green zone
  totalCookTime: number;
  requiredCookTime: number;
}

export interface KimbapCookSession {
  dishId: string | null;
  step: 'idle' | 'ingredients' | 'rolling' | 'slicing' | 'ready';
  placedIngredients: IngredientId[];
  requiredIngredientsQueue: IngredientId[];
  rollProgress: number; // 0 to 100
  slicesMade: number; // 0 to 8
}

export interface RamyeonCookSession {
  dishId: string | null;
  step: 'idle' | 'pouring_water' | 'adding_contents' | 'egg_crack_rhythm' | 'boiling' | 'ready' | 'burned';
  waterLevel: number; // 0 to 100, target 65-80
  noodlesAdded: boolean;
  soupAdded: boolean;
  eggCrackTaps: number; // 0, 1, 2
  boilProgress: number; // 0 to 100
}

export interface PreparedDish {
  id: string;
  dishId: string;
  name: string;
  emoji: string;
  quality: 'perfect' | 'good' | 'burned';
  preparedAt: number;
  toppings?: IngredientId[];
  spiceLevel?: number;
  targetOrderId?: string;
}

export interface UpgradeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: number;
  maxLevel: number;
  cost: number;
  effectDescription: string;
}

export interface DailyReport {
  day: number;
  revenue: number;
  customersServed: number;
  deliveriesCompleted: number;
  customersLost: number;
  ratingChange: number;
  tipsEarned: number;
}

export type SceneType = 'storefront' | 'dining' | 'kitchen';
export type ActiveTab = 'kitchen' | 'tables' | 'delivery' | 'market';
export type ActiveStation = 'tokbokki' | 'kimbap' | 'ramyeon' | 'spicy_ramyeon' | string | null;
export type ModalType =
  | 'none'
  | 'market'
  | 'bargain'
  | 'reviews'
  | 'upgrades'
  | 'day_end'
  | 'settings'
  | 'menu'
  | 'cookbook'
  | 'sauce';

