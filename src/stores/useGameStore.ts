import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  ActiveStation,
  ActiveTab,
  BargainSession,
  Customer,
  CustomerReview,
  DailyReport,
  DeliveryOrder,
  DineInTable,
  Dish,
  Ingredient,
  IngredientId,
  KimbapCookSession,
  MarketNews,
  ModalType,
  PreparedDish,
  RamyeonCookSession,
  SceneType,
  TokbokkiCookSession,
  UpgradeItem,
} from '@/types/game';
import {
  CUSTOMER_NAMES,
  INITIAL_DISHES,
  INITIAL_INGREDIENTS,
  INITIAL_REVIEWS,
  INITIAL_TABLES,
  INITIAL_UPGRADES,
  MARKET_NEWS_LIST,
} from '@/data/gameData';
import { CUSTOMER_VISUAL_POOL, SHIPPER_LIST } from '@/config/gameAssets';
import { soundManager } from '@/utils/audio';
import { generateOrderCustomization } from '@/config/recipes';
import {
  buildConsumptionRequirements,
  cloneDishes,
  cloneInventory,
  createGameId,
  deductIngredients,
  mergeDishesWithDefaults,
  mergeInventoryWithDefaults,
  preparedDishMatchesOrder,
  restaurantLevelFromReputation,
} from '@/core/gameCore';

interface GameState {
  // Progression & Economy
  coins: number;
  day: number;
  dayTimeSeconds: number; // 0 to 100s per day
  isDayActive: boolean;
  isPaused: boolean;
  rating: number; // 1.0 to 5.0
  reputationPoints: number;

  // Day Statistics
  dailyRevenue: number;
  dailyCustomersServed: number;
  dailyDeliveriesCompleted: number;
  dailyCustomersLost: number;
  dailyTips: number;
  dailyReport: DailyReport | null;

  // Navigation & Modals
  activeScene: SceneType;
  activeTab: ActiveTab;
  activeStation: ActiveStation;
  activeModal: ModalType;
  bgmEnabled: boolean;
  sfxEnabled: boolean;

  // Inventory & Market
  inventory: Record<string, Ingredient>;
  dishes: Record<string, Dish>;
  upgrades: UpgradeItem[];
  currentNews: MarketNews;
  bannedMarketItemsToday: IngredientId[];
  bargainSession: BargainSession | null;

  // Dine-In & Delivery Queues
  tables: DineInTable[];
  deliveryQueue: DeliveryOrder[];
  reviews: CustomerReview[];
  preparedDishes: PreparedDish[];

  // Tactile Cooking States
  tokbokkiSession: TokbokkiCookSession;
  kimbapSession: KimbapCookSession;
  ramyeonSession: RamyeonCookSession;

  // Core Actions
  startDay: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endDay: () => void;
  advanceToNextDay: () => void;
  gameTick: (deltaSeconds: number) => void;
  cookingTick: (deltaSeconds: number) => void;

  // Dine-In Table Actions
  serveTable: (tableId: number) => boolean;
  cleanTable: (tableId: number) => void;

  // Online Delivery Actions
  serveDeliveryOrder: (orderId: string) => boolean;

  // Custom Cooking Engine Integration
  completeCustomOrder: (params: {
    orderType: 'dine_in' | 'delivery' | 'free_cook';
    orderId?: string;
    tableId?: number;
    dishId: string;
    quality: 'perfect' | 'good' | 'ok' | 'fail';
    score: number;
    toppings: IngredientId[];
    spiceLevel: number;
    usedIngredients: IngredientId[];
  }) => boolean;

  // Fast Service & Buffer
  discardPreparedDish: (dishInstanceId: string) => void;
  prepareInstantItem: (dishId: string) => boolean;

  // Market & Bargain Actions
  buyIngredients: (items: { id: IngredientId; quantity: number }[], discount?: number) => boolean;
  startBargain: (ingredientId: IngredientId, quantity: number) => void;
  stopBargain: () => { success: boolean; discount: number; banned: boolean };
  cancelBargain: () => void;

  // Tactile Cooking: Tokbokki
  startTokbokki: (dishId: string) => boolean;
  addTokbokkiSauceSpoon: (type: 'gochujang' | 'soySauce' | 'sugar') => void;
  setTokbokkiStirring: (isStirring: boolean) => void;
  flipTokbokkiPan: () => void;
  finishTokbokki: () => boolean;
  discardTokbokki: () => void;

  // Tactile Cooking: Kimbap
  startKimbap: (dishId: string) => boolean;
  tapKimbapIngredient: (ingredientId: IngredientId) => boolean;
  advanceKimbapRoll: (delta: number) => void;
  sliceKimbap: () => void;
  finishKimbap: () => boolean;
  discardKimbap: () => void;

  // Tactile Cooking: Ramyeon
  startRamyeon: (dishId: string) => boolean;
  pourRamyeonWater: (delta: number) => void;
  addRamyeonContents: () => void;
  tapEggCrack: () => void;
  finishRamyeon: () => boolean;
  discardRamyeon: () => void;

  // Upgrades & Unlocks
  buyUpgrade: (upgradeId: string) => boolean;
  unlockDish: (dishId: string) => boolean;

  // UI Navigation
  setActiveScene: (scene: SceneType) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setActiveStation: (station: ActiveStation) => void;
  setActiveModal: (modal: ModalType) => void;
  toggleBgm: () => void;
  toggleSfx: () => void;
  resetGameData: () => void;
}

const DAY_DURATION_SECONDS = 100;

const createInitialTokbokkiSession = (): TokbokkiCookSession => ({
  status: 'idle',
  dishId: null,
  gochujangSpoons: 0,
  soySauceSpoons: 0,
  sugarSpoons: 0,
  spicyMeter: 0,
  saltyMeter: 0,
  sweetMeter: 0,
  heatNeedle: 20,
  heatDirection: 1,
  isStirring: false,
  greenZoneTime: 0,
  totalCookTime: 0,
  requiredCookTime: 7,
  flipCount: 0,
});

const createInitialKimbapSession = (): KimbapCookSession => ({
  dishId: null,
  step: 'idle',
  placedIngredients: [],
  requiredIngredientsQueue: ['rice', 'carrot', 'cucumber', 'egg', 'fish_cake'],
  rollProgress: 0,
  slicesMade: 0,
});

const createInitialRamyeonSession = (): RamyeonCookSession => ({
  dishId: null,
  step: 'idle',
  waterLevel: 0,
  noodlesAdded: false,
  soupAdded: false,
  eggCrackTaps: 0,
  boilProgress: 0,
});

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      coins: 400,
      day: 1,
      dayTimeSeconds: 0,
      isDayActive: false,
      isPaused: false,
      rating: 4.8,
      reputationPoints: 25,

      dailyRevenue: 0,
      dailyCustomersServed: 0,
      dailyDeliveriesCompleted: 0,
      dailyCustomersLost: 0,
      dailyTips: 0,
      dailyReport: null,

      activeScene: 'kitchen',
      activeTab: 'kitchen',
      activeStation: null,
      activeModal: 'none',
      bgmEnabled: false,
      sfxEnabled: true,

      inventory: cloneInventory(INITIAL_INGREDIENTS),
      dishes: cloneDishes(INITIAL_DISHES),
      upgrades: [...INITIAL_UPGRADES],
      currentNews: MARKET_NEWS_LIST[0],
      bannedMarketItemsToday: [],
      bargainSession: null,

      tables: JSON.parse(JSON.stringify(INITIAL_TABLES)),
      deliveryQueue: [],
      reviews: [...INITIAL_REVIEWS],
      preparedDishes: [],

      tokbokkiSession: createInitialTokbokkiSession(),
      kimbapSession: createInitialKimbapSession(),
      ramyeonSession: createInitialRamyeonSession(),

      // --- GAME FLOW ---
      startDay: () => {
        if (get().isDayActive) return;
        soundManager.playCustomerBell();
        set({
          isDayActive: true,
          isPaused: false,
          dayTimeSeconds: 0,
          dailyRevenue: 0,
          dailyCustomersServed: 0,
          dailyDeliveriesCompleted: 0,
          dailyCustomersLost: 0,
          dailyTips: 0,
          dailyReport: null,
        });

        // Spawn first dine-in customer
        setTimeout(() => {
          const state = get();
          if (!state.isDayActive || state.isPaused) return;
          const emptyTable = state.tables.find((t) => t.status === 'empty');
          if (emptyTable) {
            const unlockedDishes = Object.values(state.dishes).filter((d) => d.isUnlocked);
            const randomDish = unlockedDishes[Math.floor(Math.random() * unlockedDishes.length)];
            const randomVisual = CUSTOMER_VISUAL_POOL[Math.floor(Math.random() * CUSTOMER_VISUAL_POOL.length)];
            const customization = generateOrderCustomization(randomDish.id);

            const newCust: Customer = {
              id: createGameId('cust'),
              name: randomVisual.name,
              avatar: randomVisual.sprite,
              avatarColor: randomVisual.category === 'student' ? 'bg-amber-100' : 'bg-orange-100',
              visualSprite: randomVisual.sprite,
              visualCategory: randomVisual.category,
              gender: randomVisual.gender,
              orderDishId: randomDish.id,
              orderDishName: randomDish.name,
              orderDishEmoji: randomDish.emoji,
              maxPatience: 45,
              currentPatience: 45,
              tipMultiplier: 1.0,
              personality: randomVisual.personality,
              mood: 'happy',
              quote: randomVisual.defaultQuote,
              state: 'waiting',
              requiredToppings: customization.requiredToppings,
              excludedToppings: customization.excludedToppings,
              spiceLevel: customization.spiceLevel,
            };

            const updatedTables = state.tables.map((t) =>
              t.id === emptyTable.id ? { ...t, customer: newCust, status: 'seated' as const } : t
            );
            set({ tables: updatedTables });
          }
        }, 800);
      },

      pauseGame: () => set({ isPaused: true }),
      resumeGame: () => set({ isPaused: false }),

      endDay: () => {
        const state = get();
        const report: DailyReport = {
          day: state.day,
          revenue: state.dailyRevenue,
          customersServed: state.dailyCustomersServed,
          deliveriesCompleted: state.dailyDeliveriesCompleted,
          customersLost: state.dailyCustomersLost,
          ratingChange: Number(
            ((state.dailyCustomersServed + state.dailyDeliveriesCompleted) * 0.04 - state.dailyCustomersLost * 0.12).toFixed(2)
          ),
          tipsEarned: state.dailyTips,
        };

        // Freshness decay on inventory
        const updatedInventory = cloneInventory(state.inventory);
        Object.keys(updatedInventory).forEach((key) => {
          const item = updatedInventory[key];
          const decay = Math.floor(100 / item.shelfLifeDays);
          updatedInventory[key] = {
            ...item,
            freshness: Math.max(0, item.freshness - decay),
          };
        });

        soundManager.playSuccess();
        set({
          isDayActive: false,
          isPaused: true,
          dailyReport: report,
          activeModal: 'day_end',
          inventory: updatedInventory,
        });
      },

      advanceToNextDay: () => {
        const state = get();
        const nextNews = MARKET_NEWS_LIST[(state.day) % MARKET_NEWS_LIST.length];

        // Apply price fluctuation based on news
        const updatedInventory = cloneInventory(state.inventory);
        const notice = nextNews.affectedNotice.toLocaleLowerCase('vi-VN');
        Object.keys(updatedInventory).forEach((key) => {
          const item = updatedInventory[key];
          let changePercent = Math.floor(Math.random() * 30) - 15;

          const aliases = [
            item.vietnameseName,
            item.vietnameseName.replace(/\s+(Sợi|Tươi|Giòn|Thơm|Vàng)$/i, ''),
            item.name,
          ].map((value) => value.toLocaleLowerCase('vi-VN'));

          if (aliases.some((alias) => alias && notice.includes(alias))) {
            changePercent =
              nextNews.headline.toLocaleLowerCase('vi-VN').includes('giảm') ||
              notice.includes('giảm')
                ? -25
                : +35;
          }

          updatedInventory[key] = {
            ...item,
            priceChangePercent: changePercent,
            cost: Math.max(2, Math.round(item.baseCost * (1 + changePercent / 100))),
          };
        });

        set({
          day: state.day + 1,
          dayTimeSeconds: 0,
          isPaused: false,
          currentNews: nextNews,
          bannedMarketItemsToday: [],
          tables: JSON.parse(JSON.stringify(INITIAL_TABLES)),
          deliveryQueue: [],
          preparedDishes: [],
          dailyReport: null,
          activeModal: 'none',
          inventory: updatedInventory,
          tokbokkiSession: createInitialTokbokkiSession(),
          kimbapSession: createInitialKimbapSession(),
          ramyeonSession: createInitialRamyeonSession(),
        });
      },

      gameTick: (deltaSeconds: number) => {
        const state = get();
        if (!state.isDayActive || state.isPaused) return;

        const newDayTime = state.dayTimeSeconds + deltaSeconds;
        if (newDayTime >= DAY_DURATION_SECONDS) {
          get().endDay();
          return;
        }

        const ebikeUpgrade = state.upgrades.find((u) => u.id === 'delivery_ebike')?.level || 0;
        const shipperSpeedBoost = 1 + ebikeUpgrade * 0.35;

        const tableComfort = state.upgrades.find((u) => u.id === 'table_comfort')?.level || 0;
        const patienceDecay = 1 / (1 + tableComfort * 0.3);

        // --- 1. Tick Dine-In Tables ---
        let ratingDelta = 0;
        let lostCountDelta = 0;
        const updatedTables = state.tables.map((table) => {
          if (table.status === 'seated' && table.customer) {
            const nextPatience = table.customer.currentPatience - deltaSeconds * patienceDecay;
            if (nextPatience <= 0) {
              soundManager.playError();
              ratingDelta -= 0.15;
              lostCountDelta += 1;
              // Add disappointed review
              const badReview: CustomerReview = {
                id: `rev_${Date.now()}`,
                author: table.customer.name,
                avatar: table.customer.avatar,
                rating: 1,
                comment: 'Quán để khách chờ quá lâu, mình đành bỏ về đói meo!',
                dishName: table.customer.orderDishName,
                orderType: 'dine_in',
                timeAgo: 'Vừa xong',
                tag: 'late',
              };
              set({ reviews: [badReview, ...get().reviews.slice(0, 15)] });
              return { ...table, customer: null, status: 'empty' as const };
            }

            const percent = (nextPatience / table.customer.maxPatience) * 100;
            let mood: Customer['mood'] = 'happy';
            if (percent < 30) mood = 'angry';
            else if (percent < 60) mood = 'impatient';
            else if (percent < 85) mood = 'normal';

            return {
              ...table,
              customer: { ...table.customer, currentPatience: nextPatience, mood },
            };
          } else if (table.status === 'eating') {
            const rem = table.eatingTimeRemaining - deltaSeconds;
            if (rem <= 0) {
              return { ...table, status: 'dirty' as const, eatingTimeRemaining: 0, customer: null };
            }
            return { ...table, eatingTimeRemaining: rem };
          }
          return table;
        });

        // Spawn Dine-in Customer if empty table exists
        const emptyTableIdx = updatedTables.findIndex((t) => t.status === 'empty');
        if (emptyTableIdx !== -1 && Math.random() < 0.04 * deltaSeconds * 10) {
          const unlockedDishes = Object.values(state.dishes).filter((d) => d.isUnlocked);
          if (unlockedDishes.length > 0) {
            const randomDish = unlockedDishes[Math.floor(Math.random() * unlockedDishes.length)];
            const randomVisual = CUSTOMER_VISUAL_POOL[Math.floor(Math.random() * CUSTOMER_VISUAL_POOL.length)];
            const basePatience = 40 + Math.floor(Math.random() * 20);
            const customization = generateOrderCustomization(randomDish.id);

            updatedTables[emptyTableIdx] = {
              ...updatedTables[emptyTableIdx],
              status: 'seated',
              customer: {
                id: `cust_${Date.now()}`,
                name: randomVisual.name,
                avatar: randomVisual.sprite,
                avatarColor: randomVisual.category === 'student' ? 'bg-amber-100' : 'bg-orange-100',
                visualSprite: randomVisual.sprite,
                visualCategory: randomVisual.category,
                gender: randomVisual.gender,
                orderDishId: randomDish.id,
                orderDishName: randomDish.name,
                orderDishEmoji: randomDish.emoji,
                maxPatience: basePatience,
                currentPatience: basePatience,
                tipMultiplier: 1.0,
                personality: randomVisual.personality,
                mood: 'happy',
                quote: randomVisual.defaultQuote,
                state: 'waiting',
                requiredToppings: customization.requiredToppings,
                excludedToppings: customization.excludedToppings,
                spiceLevel: customization.spiceLevel,
              },
            };
            soundManager.playCustomerBell();
          }
        }

        // --- 2. Tick Online Delivery Orders ---
        const updatedDeliveryQueue: DeliveryOrder[] = [];
        state.deliveryQueue.forEach((order) => {
          if (order.shipperStatus === 'on_the_way') {
            const nextTime = order.shipperArriveSeconds - deltaSeconds * shipperSpeedBoost;
            if (nextTime <= 0) {
              soundManager.playCustomerBell();
              updatedDeliveryQueue.push({
                ...order,
                shipperArriveSeconds: 0,
                shipperStatus: 'arrived',
              });
            } else {
              updatedDeliveryQueue.push({ ...order, shipperArriveSeconds: nextTime });
            }
          } else if (order.shipperStatus === 'arrived') {
            const waitTime = order.shipperWaitSeconds - deltaSeconds;
            if (waitTime <= 0) {
              // Shipper cancelled order
              soundManager.playError();
              ratingDelta -= 0.12;
              lostCountDelta += 1;
              const badDeliveryReview: CustomerReview = {
                id: `rev_${Date.now()}`,
                author: order.customerName,
                avatar: '🛵',
                rating: 2,
                comment: `Đơn ${order.id} quán chuẩn bị quá chậm, shipper hủy đơn rồi!`,
                dishName: order.dishName,
                orderType: 'delivery',
                timeAgo: 'Vừa xong',
                tag: 'late',
              };
              set({ reviews: [badDeliveryReview, ...get().reviews.slice(0, 15)] });
            } else {
              updatedDeliveryQueue.push({ ...order, shipperWaitSeconds: waitTime });
            }
          }
        });

        // Spawn new delivery order if queue < 3
        if (updatedDeliveryQueue.length < 3 && Math.random() < 0.035 * deltaSeconds * 10) {
          const unlockedDishes = Object.values(state.dishes).filter((d) => d.isUnlocked);
          if (unlockedDishes.length > 0) {
            const randomDish = unlockedDishes[Math.floor(Math.random() * unlockedDishes.length)];
            const randomShipper = SHIPPER_LIST[Math.floor(Math.random() * SHIPPER_LIST.length)];
            const orderNum = createGameId('DH').replace('DH_', '').slice(0, 8).toUpperCase();
            const addresses = ['P. Hongdae, Tòa B5', 'Đại Học Quốc Gia Seoul', 'Chung cư Mapo, Tầng 12', 'Văn phòng Yeouido'];
            const customization = generateOrderCustomization(randomDish.id);

            const newOrder: DeliveryOrder = {
              id: `#DH-${orderNum}`,
              customerName: `Khách Đặt #${Math.floor(1000 + Math.random() * 9000)}`,
              address: addresses[Math.floor(Math.random() * addresses.length)],
              dishId: randomDish.id,
              dishName: randomDish.name,
              dishEmoji: randomDish.emoji,
              price: Math.round(randomDish.price * 1.15), // delivery price slight markup
              tip: Math.round(randomDish.price * 0.2),
              orderTime: Date.now(),
              shipperArriveSeconds: Math.floor(20 + Math.random() * 15),
              shipperWaitSeconds: 25,
              shipperStatus: 'on_the_way',
              shipperColor: randomShipper.id,
              shipperSprite: randomShipper.sprite,
              requiredToppings: customization.requiredToppings,
              excludedToppings: customization.excludedToppings,
              spiceLevel: customization.spiceLevel,
            };
            updatedDeliveryQueue.push(newOrder);
            soundManager.playClick();
          }
        }

        set({
          dayTimeSeconds: newDayTime,
          tables: updatedTables,
          deliveryQueue: updatedDeliveryQueue,
          rating: Math.max(1, Math.min(5, Number((state.rating + ratingDelta).toFixed(2)))),
          dailyCustomersLost: state.dailyCustomersLost + lostCountDelta,
        });
      },

      cookingTick: (deltaSeconds: number) => {
        const state = get();
        if (state.isPaused) return;

        const stoveLevel = state.upgrades.find((u) => u.id === 'stove_speed')?.level || 0;
        const stoveSpeed = 1 + stoveLevel * 0.25;

        let tokSession = { ...state.tokbokkiSession };
        if (tokSession.status === 'cooking_stir') {
          tokSession.totalCookTime += deltaSeconds * stoveSpeed;

          if (tokSession.isStirring) {
            tokSession.heatNeedle = Math.min(100, tokSession.heatNeedle + deltaSeconds * 28 * stoveSpeed);
          } else {
            tokSession.heatNeedle = Math.max(0, tokSession.heatNeedle - deltaSeconds * 22);
          }

          if (tokSession.heatNeedle >= 50 && tokSession.heatNeedle <= 80) {
            tokSession.greenZoneTime += deltaSeconds * stoveSpeed;
          }

          if (tokSession.totalCookTime >= tokSession.requiredCookTime) {
            const heatRatio = tokSession.greenZoneTime / tokSession.requiredCookTime;
            const sauceTotal =
              tokSession.gochujangSpoons + tokSession.soySauceSpoons + tokSession.sugarSpoons;
            const sauceOk =
              sauceTotal > 0 &&
              Math.abs(tokSession.gochujangSpoons / sauceTotal - 0.5) <= 0.18 &&
              Math.abs(tokSession.soySauceSpoons / sauceTotal - 0.25) <= 0.15 &&
              Math.abs(tokSession.sugarSpoons / sauceTotal - 0.25) <= 0.15;
            const enoughFlips = tokSession.flipCount >= 2;

            if (tokSession.heatNeedle > 95 || heatRatio < 0.25 || !sauceOk) {
              tokSession.status = 'burned';
              soundManager.playError();
            } else if (enoughFlips || heatRatio >= 0.55) {
              tokSession.status = 'perfect';
              soundManager.playSuccess();
            } else {
              tokSession.status = 'burned';
              soundManager.playError();
            }
            tokSession.isStirring = false;
          }
        }

        let ramSession = { ...state.ramyeonSession };
        if (ramSession.step === 'boiling' || ramSession.step === 'ready') {
          const wasReady = ramSession.step === 'ready';
          ramSession.boilProgress += deltaSeconds * 18 * stoveSpeed;
          if (ramSession.boilProgress >= 125) {
            ramSession.step = 'burned';
            soundManager.playError();
          } else if (ramSession.boilProgress >= 100) {
            ramSession.step = 'ready';
            if (!wasReady) soundManager.playSuccess();
          }
        }

        set({
          tokbokkiSession: tokSession,
          ramyeonSession: ramSession,
        });
      },

      // --- DINE-IN SERVICE ---
      serveTable: (tableId: number) => {
        const state = get();
        const table = state.tables.find((t) => t.id === tableId);
        if (!table || !table.customer || table.status !== 'seated') return false;

        const preparedIdx = state.preparedDishes.findIndex((p) =>
          preparedDishMatchesOrder({
            prepared: p,
            orderId: table.customer?.id,
            dishId: table.customer?.orderDishId || '',
            requiredToppings: table.customer?.requiredToppings,
            excludedToppings: table.customer?.excludedToppings,
            spiceLevel: table.customer?.spiceLevel,
          })
        );
        if (preparedIdx === -1) {
          soundManager.playError();
          return false;
        }

        const prepared = state.preparedDishes[preparedIdx];
        const dish = state.dishes[table.customer.orderDishId];

        const patienceRatio = table.customer.currentPatience / table.customer.maxPatience;
        const qualityMultiplier =
          prepared.quality === 'perfect' ? 1 : prepared.quality === 'good' ? 0.9 : 0.55;
        const baseRevenue = Math.round(dish.price * qualityMultiplier);
        const tipRate =
          prepared.quality === 'perfect' && patienceRatio > 0.5
            ? 0.25
            : prepared.quality === 'good'
            ? 0.1
            : 0;
        const tip = Math.round(dish.price * tipRate * table.customer.tipMultiplier);
        const total = baseRevenue + tip;
        const reputationGain =
          prepared.quality === 'perfect' ? 12 : prepared.quality === 'good' ? 7 : 1;

        const updatedDishes = [...state.preparedDishes];
        updatedDishes.splice(preparedIdx, 1);

        soundManager.playCoin();
        soundManager.playSuccess();

        // Customer leaves positive review
        const newReview: CustomerReview = {
          id: `rev_${Date.now()}`,
          author: table.customer.name,
          avatar: table.customer.avatar,
          rating:
            prepared.quality === 'perfect' ? 5 : prepared.quality === 'good' ? 4 : 2,
          comment:
            prepared.quality === 'perfect'
              ? `Món ${dish.name} ở đây đỉnh chóp luôn! Nóng hổi và đậm đà tuyệt đối.`
              : prepared.quality === 'good'
              ? `Món ${dish.name} vị khá ổn, quán phục vụ chu đáo.`
              : `Món ${dish.name} chưa đạt yêu cầu, lần sau quán cố gắng hơn nhé.`,
          dishName: dish.name,
          orderType: 'dine_in',
          timeAgo: 'Vừa xong',
          tag: 'tasty',
        };

        const updatedTables = state.tables.map((t) =>
          t.id === tableId
            ? { ...t, status: 'eating' as const, eatingTimeRemaining: 8, customer: t.customer }
            : t
        );

        set({
          coins: state.coins + total,
          rating: Math.max(
            1,
            Math.min(
              5,
              Number(
                (
                  state.rating +
                  (prepared.quality === 'perfect'
                    ? 0.04
                    : prepared.quality === 'good'
                    ? 0.01
                    : -0.08)
                ).toFixed(2)
              )
            )
          ),
          reputationPoints: state.reputationPoints + reputationGain,
          dailyRevenue: state.dailyRevenue + total,
          dailyTips: state.dailyTips + tip,
          dailyCustomersServed: state.dailyCustomersServed + 1,
          preparedDishes: updatedDishes,
          tables: updatedTables,
          reviews: [newReview, ...state.reviews.slice(0, 15)],
        });

        return true;
      },

      cleanTable: (tableId: number) => {
        soundManager.playClick();
        soundManager.playCoin();
        const state = get();
        set({
          coins: state.coins + 5,
          dailyRevenue: state.dailyRevenue + 5,
          dailyTips: state.dailyTips + 5,
          tables: state.tables.map((t) =>
            t.id === tableId ? { ...t, status: 'empty' as const } : t
          ),
        });
      },

      // --- ONLINE DELIVERY SERVICE ---
      serveDeliveryOrder: (orderId: string) => {
        const state = get();
        const order = state.deliveryQueue.find((o) => o.id === orderId);
        if (!order || order.shipperStatus !== 'arrived') return false;

        const preparedIdx = state.preparedDishes.findIndex((p) =>
          preparedDishMatchesOrder({
            prepared: p,
            orderId: order.id,
            dishId: order.dishId,
            requiredToppings: order.requiredToppings,
            excludedToppings: order.excludedToppings,
            spiceLevel: order.spiceLevel,
          })
        );
        if (preparedIdx === -1) {
          soundManager.playError();
          return false;
        }

        const prepared = state.preparedDishes[preparedIdx];
        const ebikeLevel = state.upgrades.find((u) => u.id === 'delivery_ebike')?.level || 0;
        const qualityMultiplier =
          prepared.quality === 'perfect' ? 1 : prepared.quality === 'good' ? 0.9 : 0.55;
        const boostedTip =
          prepared.quality === 'burned'
            ? 0
            : Math.round(order.tip * (1 + ebikeLevel * 0.3));
        const totalEarned = Math.round(order.price * qualityMultiplier) + boostedTip;
        const reputationGain =
          prepared.quality === 'perfect' ? 10 : prepared.quality === 'good' ? 6 : 0;

        const updatedDishes = [...state.preparedDishes];
        updatedDishes.splice(preparedIdx, 1);

        soundManager.playCoin();
        soundManager.playSuccess();

        const deliveryReview: CustomerReview = {
          id: `rev_${Date.now()}`,
          author: order.customerName,
          avatar: '🛵',
          rating:
            prepared.quality === 'perfect' ? 5 : prepared.quality === 'good' ? 4 : 2,
          comment:
            prepared.quality === 'perfect'
              ? `Đơn ${order.id} giao nhanh, món ${order.dishName} còn nóng hổi và rất ngon!`
              : prepared.quality === 'good'
              ? `Đơn ${order.id} giao ổn, món ${order.dishName} khá vừa miệng.`
              : `Đơn ${order.id} giao tới nhưng món ${order.dishName} chưa đạt chất lượng mong đợi.`,
          dishName: order.dishName,
          orderType: 'delivery',
          timeAgo: 'Vừa xong',
          tag: 'fast',
        };

        set({
          coins: state.coins + totalEarned,
          rating: Math.max(
            1,
            Math.min(
              5,
              Number(
                (
                  state.rating +
                  (prepared.quality === 'perfect'
                    ? 0.04
                    : prepared.quality === 'good'
                    ? 0.01
                    : -0.08)
                ).toFixed(2)
              )
            )
          ),
          reputationPoints: state.reputationPoints + reputationGain,
          dailyRevenue: state.dailyRevenue + totalEarned,
          dailyTips: state.dailyTips + boostedTip,
          dailyDeliveriesCompleted: state.dailyDeliveriesCompleted + 1,
          preparedDishes: updatedDishes,
          deliveryQueue: state.deliveryQueue.filter((o) => o.id !== orderId),
          reviews: [deliveryReview, ...state.reviews.slice(0, 15)],
        });

        return true;
      },

      completeCustomOrder: (params: {
        orderType: 'dine_in' | 'delivery' | 'free_cook';
        orderId?: string;
        tableId?: number;
        dishId: string;
        quality: 'perfect' | 'good' | 'ok' | 'fail';
        score: number;
        toppings: IngredientId[];
        spiceLevel: number;
        usedIngredients: IngredientId[];
      }) => {
        const state = get();
        const dish = state.dishes[params.dishId];
        if (!dish) return false;

        if (params.orderType === 'dine_in') {
          const targetTable = state.tables.find((table) => table.id === params.tableId);
          if (!targetTable?.customer || targetTable.customer.id !== params.orderId) {
            soundManager.playError();
            return false;
          }
        }

        if (
          params.orderType === 'delivery' &&
          !state.deliveryQueue.some((order) => order.id === params.orderId)
        ) {
          soundManager.playError();
          return false;
        }

        if (
          params.orderId &&
          state.preparedDishes.some((prepared) => prepared.targetOrderId === params.orderId)
        ) {
          soundManager.playError();
          return false;
        }

        if (state.preparedDishes.length >= 8) {
          soundManager.playError();
          return false;
        }

        const requirements = buildConsumptionRequirements(dish, params.toppings);
        const updatedInventory = deductIngredients(state.inventory, requirements);
        if (!updatedInventory) {
          soundManager.playError();
          return false;
        }

        const prepared: PreparedDish = {
          id: createGameId('prep'),
          dishId: params.dishId,
          name: dish.name,
          emoji: dish.emoji,
          quality:
            params.quality === 'perfect'
              ? 'perfect'
              : params.quality === 'good'
              ? 'good'
              : 'burned',
          preparedAt: Date.now(),
          preparedOnDay: state.day,
          toppings: [...params.toppings],
          spiceLevel: params.spiceLevel,
          targetOrderId: params.orderId,
          targetOrderType: params.orderType,
          targetTableId: params.tableId,
          score: params.score,
        };

        // Cooking creates a prepared dish. Revenue is awarded only when the
        // correct dine-in customer or arrived shipper actually receives it.
        if (params.orderType === 'dine_in' || params.orderType === 'delivery') {
          set({
            inventory: updatedInventory,
            preparedDishes: [prepared, ...state.preparedDishes],
          });
          soundManager.playSuccess();
          return true;
        }

        set({
          inventory: updatedInventory,
          preparedDishes: [prepared, ...state.preparedDishes],
        });
        soundManager.playSuccess();
        return true;
      },

      discardPreparedDish: (dishInstanceId: string) => {
        soundManager.playClick();
        set({
          preparedDishes: get().preparedDishes.filter((p) => p.id !== dishInstanceId),
        });
      },

      prepareInstantItem: (dishId: string) => {
        const state = get();
        const dish = state.dishes[dishId];
        if (!dish) return false;

        if (state.preparedDishes.length >= 8) {
          soundManager.playError();
          return false;
        }

        const updatedInventory = deductIngredients(state.inventory, dish.requiredIngredients);
        if (!updatedInventory) {
          soundManager.playError();
          return false;
        }

        soundManager.playSuccess();
        set({
          inventory: updatedInventory,
          preparedDishes: [
            {
              id: createGameId('prep'),
              dishId: dish.id,
              name: dish.name,
              emoji: dish.emoji,
              quality: 'perfect',
              preparedAt: Date.now(),
              preparedOnDay: state.day,
            },
            ...state.preparedDishes,
          ],
        });
        return true;
      },

      // --- MARKET & BARGAIN ---
      buyIngredients: (items: { id: IngredientId; quantity: number }[], discount = 0) => {
        const state = get();
        let totalCost = 0;
        items.forEach(({ id, quantity }) => {
          const ing = state.inventory[id];
          if (ing && quantity > 0) {
            totalCost += Math.round(ing.cost * quantity * (1 - discount));
          }
        });

        if (totalCost > state.coins || totalCost === 0) {
          soundManager.playError();
          return false;
        }

        const updatedInventory = cloneInventory(state.inventory);
        items.forEach(({ id, quantity }) => {
          if (updatedInventory[id] && quantity > 0) {
            updatedInventory[id] = {
              ...updatedInventory[id],
              stock: updatedInventory[id].stock + quantity,
              freshness: 100,
            };
          }
        });

        soundManager.playCoin();
        set({
          coins: state.coins - totalCost,
          inventory: updatedInventory,
        });
        return true;
      },

      startBargain: (ingredientId: IngredientId, quantity: number) => {
        const state = get();
        const item = state.inventory[ingredientId];
        if (!item || state.bannedMarketItemsToday.includes(ingredientId)) {
          soundManager.playError();
          return;
        }

        soundManager.playClick();
        set({
          activeModal: 'bargain',
          bargainSession: {
            ingredientId,
            quantity,
            originalPrice: item.cost * quantity,
            sliderPosition: 10,
            sliderDirection: 1,
            status: 'active',
            discountAwarded: 0,
          },
        });
      },

      stopBargain: () => {
        const state = get();
        if (!state.bargainSession) return { success: false, discount: 0, banned: false };

        const pos = state.bargainSession.sliderPosition;
        const charmLevel = state.upgrades.find((u) => u.id === 'bargain_charm')?.level || 0;
        const bestZoneStart = Math.max(60, 80 - charmLevel * 10);

        let discount = 0;
        let isBanned = false;

        if (pos >= bestZoneStart) {
          discount = 0.2;
        } else if (pos >= 50) {
          discount = 0.1;
        } else if (pos >= 25) {
          discount = 0.05;
        } else {
          isBanned = true;
        }

        if (isBanned) {
          soundManager.playError();
          set({
            bannedMarketItemsToday: Array.from(
              new Set([...state.bannedMarketItemsToday, state.bargainSession.ingredientId])
            ),
            bargainSession: { ...state.bargainSession, status: 'banned', discountAwarded: 0 },
          });
          return { success: false, discount: 0, banned: true };
        }

        const purchased = get().buyIngredients(
          [{ id: state.bargainSession.ingredientId, quantity: state.bargainSession.quantity }],
          discount
        );

        if (!purchased) {
          set({
            bargainSession: { ...state.bargainSession, status: 'active', discountAwarded: 0 },
          });
          return { success: false, discount: 0, banned: false };
        }

        soundManager.playSuccess();
        set({
          bargainSession: { ...get().bargainSession!, status: 'success', discountAwarded: discount },
        });
        return { success: true, discount, banned: false };
      },

      cancelBargain: () => {
        set({ bargainSession: null, activeModal: 'market' });
      },

      // --- TACTILE MINIGAME: TOKBOKKI ---
      startTokbokki: (dishId: string) => {
        const state = get();
        const dish = state.dishes[dishId];
        if (!dish || state.tokbokkiSession.status !== 'idle') return false;

        // Check ingredients
        const inventory = deductIngredients(state.inventory, dish.requiredIngredients);
        if (!inventory) {
          soundManager.playError();
          return false;
        }

        soundManager.playSizzle();
        set({
          inventory,
          tokbokkiSession: {
            status: 'sauce_ratio',
            dishId,
            gochujangSpoons: 0,
            soySauceSpoons: 0,
            sugarSpoons: 0,
            spicyMeter: 0,
            saltyMeter: 0,
            sweetMeter: 0,
            heatNeedle: 30,
            heatDirection: 1,
            isStirring: false,
            greenZoneTime: 0,
            totalCookTime: 0,
            requiredCookTime: 7,
            flipCount: 0,
          },
        });
        return true;
      },

      addTokbokkiSauceSpoon: (type) => {
        const state = get();
        const session = state.tokbokkiSession;
        if (session.status !== 'sauce_ratio') return;

        soundManager.playClick();
        const key = `${type}Spoons` as const;
        const nextVal = session[key] + 1;

        const total = session.gochujangSpoons + session.soySauceSpoons + session.sugarSpoons + 1;
        const spicy = Math.round(((type === 'gochujang' ? nextVal : session.gochujangSpoons) / total) * 100);
        const salty = Math.round(((type === 'soySauce' ? nextVal : session.soySauceSpoons) / total) * 100);
        const sweet = Math.round(((type === 'sugar' ? nextVal : session.sugarSpoons) / total) * 100);

        set({
          tokbokkiSession: {
            ...session,
            [key]: nextVal,
            spicyMeter: spicy,
            saltyMeter: salty,
            sweetMeter: sweet,
          },
        });
      },

      setTokbokkiStirring: (isStirring: boolean) => {
        const state = get();
        const session = state.tokbokkiSession;
        if (session.status === 'sauce_ratio' && isStirring) {
          // Transition to stir & heat stage
          soundManager.playSizzle();
          set({
            tokbokkiSession: {
              ...session,
              status: 'cooking_stir',
              isStirring: true,
            },
          });
          return;
        }

        if (session.status === 'cooking_stir') {
          if (isStirring) soundManager.playSizzle();
          set({
            tokbokkiSession: {
              ...session,
              isStirring,
            },
          });
        }
      },

      flipTokbokkiPan: () => {
        const state = get();
        const session = state.tokbokkiSession;
        if (session.status !== 'cooking_stir') return;

        soundManager.playSizzle();
        set({
          tokbokkiSession: {
            ...session,
            flipCount: Math.min(5, session.flipCount + 1),
            heatNeedle: Math.max(0, session.heatNeedle - 8),
          },
        });
      },

      finishTokbokki: () => {
        const state = get();
        const session = state.tokbokkiSession;
        if ((session.status !== 'perfect' && session.status !== 'burned') || !session.dishId) return false;

        const dish = state.dishes[session.dishId];
        soundManager.playChop();

        set({
          preparedDishes: [
            ...state.preparedDishes,
            {
              id: createGameId('prep'),
              dishId: dish.id,
              name: dish.name,
              emoji: dish.emoji,
              quality: session.status === 'perfect' ? 'perfect' : 'burned',
              preparedAt: Date.now(),
              preparedOnDay: state.day,
            },
          ],
          tokbokkiSession: {
            ...session,
            status: 'idle',
            dishId: null,
          },
        });
        return true;
      },

      discardTokbokki: () => {
        soundManager.playClick();
        set({
          tokbokkiSession: {
            ...get().tokbokkiSession,
            status: 'idle',
            dishId: null,
          },
        });
      },

      // --- TACTILE MINIGAME: KIMBAP ---
      startKimbap: (dishId: string) => {
        const state = get();
        const dish = state.dishes[dishId];
        if (!dish || state.kimbapSession.step !== 'idle') return false;

        const inventory = deductIngredients(state.inventory, dish.requiredIngredients);
        if (!inventory) {
          soundManager.playError();
          return false;
        }

        soundManager.playClick();
        set({
          inventory,
          kimbapSession: {
            dishId,
            step: 'ingredients',
            placedIngredients: [],
            requiredIngredientsQueue: (Object.keys(dish.requiredIngredients) as IngredientId[]).filter(
              (id) => !['seaweed'].includes(id)
            ),
            rollProgress: 0,
            slicesMade: 0,
          },
        });
        return true;
      },

      tapKimbapIngredient: (ingredientId: IngredientId) => {
        const state = get();
        const session = state.kimbapSession;
        if (session.step !== 'ingredients') return false;

        const expected = session.requiredIngredientsQueue[session.placedIngredients.length];
        if (expected !== ingredientId) {
          soundManager.playError();
          return false;
        }

        soundManager.playClick();
        const newPlaced = [...session.placedIngredients, ingredientId];
        const isFinishedPlacing = newPlaced.length === session.requiredIngredientsQueue.length;

        set({
          kimbapSession: {
            ...session,
            placedIngredients: newPlaced,
            step: isFinishedPlacing ? 'rolling' : 'ingredients',
          },
        });
        return true;
      },

      advanceKimbapRoll: (delta: number) => {
        const state = get();
        const session = state.kimbapSession;
        if (session.step !== 'rolling') return;

        soundManager.playClick();
        const nextProgress = Math.min(100, session.rollProgress + delta);
        set({
          kimbapSession: {
            ...session,
            rollProgress: nextProgress,
            step: nextProgress >= 100 ? 'slicing' : 'rolling',
          },
        });
      },

      sliceKimbap: () => {
        const state = get();
        const session = state.kimbapSession;
        if (session.step !== 'slicing') return;

        soundManager.playChop();
        const nextSlices = session.slicesMade + 1;
        set({
          kimbapSession: {
            ...session,
            slicesMade: nextSlices,
            step: nextSlices >= 8 ? 'ready' : 'slicing',
          },
        });
      },

      finishKimbap: () => {
        const state = get();
        const session = state.kimbapSession;
        if (session.step !== 'ready' || !session.dishId) return false;

        const dish = state.dishes[session.dishId];
        soundManager.playSuccess();

        set({
          preparedDishes: [
            ...state.preparedDishes,
            {
              id: createGameId('prep'),
              dishId: dish.id,
              name: dish.name,
              emoji: dish.emoji,
              quality: 'perfect',
              preparedAt: Date.now(),
              preparedOnDay: state.day,
            },
          ],
          kimbapSession: {
            ...session,
            step: 'idle',
            dishId: null,
          },
        });
        return true;
      },

      discardKimbap: () => {
        soundManager.playClick();
        set({
          kimbapSession: {
            ...get().kimbapSession,
            step: 'idle',
            dishId: null,
          },
        });
      },

      // --- TACTILE MINIGAME: RAMYEON ---
      startRamyeon: (dishId: string) => {
        const state = get();
        const dish = state.dishes[dishId];
        if (!dish || state.ramyeonSession.step !== 'idle') return false;

        const inventory = deductIngredients(state.inventory, dish.requiredIngredients);
        if (!inventory) {
          soundManager.playError();
          return false;
        }

        soundManager.playClick();
        set({
          inventory,
          ramyeonSession: {
            dishId,
            step: 'pouring_water',
            waterLevel: 0,
            noodlesAdded: false,
            soupAdded: false,
            eggCrackTaps: 0,
            boilProgress: 0,
          },
        });
        return true;
      },

      pourRamyeonWater: (delta: number) => {
        const state = get();
        const session = state.ramyeonSession;
        if (session.step !== 'pouring_water') return;

        soundManager.playBoil();
        const nextLevel = Math.min(100, session.waterLevel + delta);
        set({
          ramyeonSession: {
            ...session,
            waterLevel: nextLevel,
            step: nextLevel >= 75 ? 'adding_contents' : 'pouring_water',
          },
        });
      },

      addRamyeonContents: () => {
        const state = get();
        const session = state.ramyeonSession;
        if (session.step !== 'adding_contents') return;

        soundManager.playClick();
        set({
          ramyeonSession: {
            ...session,
            noodlesAdded: true,
            soupAdded: true,
            step: 'egg_crack_rhythm',
          },
        });
      },

      tapEggCrack: () => {
        const state = get();
        const session = state.ramyeonSession;
        if (session.step !== 'egg_crack_rhythm') return;

        soundManager.playChop();
        const nextTaps = session.eggCrackTaps + 1;
        set({
          ramyeonSession: {
            ...session,
            eggCrackTaps: nextTaps,
            step: nextTaps >= 2 ? 'boiling' : 'egg_crack_rhythm',
          },
        });
      },

      finishRamyeon: () => {
        const state = get();
        const session = state.ramyeonSession;
        if (session.step !== 'ready' || !session.dishId) return false;

        const dish = state.dishes[session.dishId];
        soundManager.playSuccess();

        set({
          preparedDishes: [
            ...state.preparedDishes,
            {
              id: createGameId('prep'),
              dishId: dish.id,
              name: dish.name,
              emoji: dish.emoji,
              quality: 'perfect',
              preparedAt: Date.now(),
              preparedOnDay: state.day,
            },
          ],
          ramyeonSession: {
            ...session,
            step: 'idle',
            dishId: null,
          },
        });
        return true;
      },

      discardRamyeon: () => {
        soundManager.playClick();
        set({
          ramyeonSession: {
            ...get().ramyeonSession,
            step: 'idle',
            dishId: null,
          },
        });
      },

      // --- UPGRADES & UNLOCKS ---
      buyUpgrade: (upgradeId: string) => {
        const state = get();
        const idx = state.upgrades.findIndex((u) => u.id === upgradeId);
        if (idx === -1) return false;

        const u = state.upgrades[idx];
        if (u.level >= u.maxLevel || state.coins < u.cost) {
          soundManager.playError();
          return false;
        }

        const newUpgrades = [...state.upgrades];
        newUpgrades[idx] = {
          ...u,
          level: u.level + 1,
          cost: Math.round(u.cost * 1.6),
        };

        soundManager.playSuccess();
        soundManager.playCoin();
        set({
          coins: state.coins - u.cost,
          upgrades: newUpgrades,
        });
        return true;
      },

      unlockDish: (dishId: string) => {
        const state = get();
        const d = state.dishes[dishId];
        const restaurantLevel = restaurantLevelFromReputation(state.reputationPoints);
        if (!d || d.isUnlocked || state.coins < d.unlockCost || restaurantLevel < d.unlockLevel) {
          soundManager.playError();
          return false;
        }

        soundManager.playSuccess();
        soundManager.playCoin();
        set({
          coins: state.coins - d.unlockCost,
          dishes: {
            ...state.dishes,
            [dishId]: { ...d, isUnlocked: true },
          },
        });
        return true;
      },

      // --- UI NAVIGATION ---
      setActiveScene: (scene: SceneType) => {
        soundManager.playClick();
        set({ activeScene: scene });
      },

      setActiveTab: (tab: ActiveTab) => {
        soundManager.playClick();
        set({ activeTab: tab });
      },

      setActiveStation: (station: ActiveStation) => {
        soundManager.playClick();
        set({ activeStation: station });
      },

      setActiveModal: (modal: ModalType) => {
        soundManager.playClick();
        const state = get();
        set({
          activeModal: modal,
          isPaused:
            modal === 'none'
              ? false
              : state.isDayActive
              ? true
              : state.isPaused,
        });
      },

      toggleBgm: () => {
        const next = !get().bgmEnabled;
        soundManager.toggleBgm(next);
        set({ bgmEnabled: next });
      },

      toggleSfx: () => {
        const next = !get().sfxEnabled;
        soundManager.setMuted(!next);
        set({ sfxEnabled: next });
      },

      resetGameData: () => {
        soundManager.playClick();
        set({
          coins: 400,
          day: 1,
          dayTimeSeconds: 0,
          isDayActive: false,
          isPaused: false,
          rating: 4.8,
          reputationPoints: 25,
          dailyRevenue: 0,
          dailyCustomersServed: 0,
          dailyDeliveriesCompleted: 0,
          dailyCustomersLost: 0,
          dailyTips: 0,
          dailyReport: null,
          inventory: cloneInventory(INITIAL_INGREDIENTS),
          dishes: cloneDishes(INITIAL_DISHES),
          upgrades: [...INITIAL_UPGRADES],
          currentNews: MARKET_NEWS_LIST[0],
          bannedMarketItemsToday: [],
          bargainSession: null,
          tables: JSON.parse(JSON.stringify(INITIAL_TABLES)),
          deliveryQueue: [],
          reviews: [...INITIAL_REVIEWS],
          preparedDishes: [],
          tokbokkiSession: createInitialTokbokkiSession(),
          kimbapSession: createInitialKimbapSession(),
          ramyeonSession: createInitialRamyeonSession(),
          activeScene: 'dining',
          activeTab: 'kitchen',
          activeStation: null,
          activeModal: 'none',
        });
      },
    }),
    {
      name: 'goc-bep-han-tycoon-v2',
      version: 3,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any) => {
        const persisted = persistedState || {};
        return {
          ...persisted,
          inventory: mergeInventoryWithDefaults(INITIAL_INGREDIENTS, persisted.inventory),
          dishes: mergeDishesWithDefaults(INITIAL_DISHES, persisted.dishes),
          reputationPoints: persisted.reputationPoints ?? 25,
          currentNews: persisted.currentNews ?? MARKET_NEWS_LIST[0],
        };
      },
      partialize: (state) => ({
        coins: state.coins,
        day: state.day,
        rating: state.rating,
        reputationPoints: state.reputationPoints,
        currentNews: state.currentNews,
        inventory: state.inventory,
        dishes: state.dishes,
        upgrades: state.upgrades,
        reviews: state.reviews,
        sfxEnabled: state.sfxEnabled,
        bgmEnabled: state.bgmEnabled,
      }),
    }
  )
);
