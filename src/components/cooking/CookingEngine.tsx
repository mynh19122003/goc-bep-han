'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { IngredientId, Ingredient } from '@/types/game';
import { GAME_ASSETS } from '@/game/assets/gameAssets';
import {
  getRecipeConfig,
  validateDishQuality,
  DishValidationResult,
} from '@/config/recipes';
import { ToppingSelector } from './ToppingSelector';
import { GameAssetIcon } from '@/components/ui/game/GameAssetIcon';
import { CloseButton } from '@/components/ui/game/CloseButton';
import { GameButton } from '@/components/ui/game/GameButton';
import { soundManager } from '@/utils/audio';
import { buildConsumptionRequirements, hasIngredients } from '@/core/gameCore';

export interface CookingTargetOrder {
  orderType: 'dine_in' | 'delivery' | 'free_cook';
  orderId?: string;
  tableId?: number;
  customerName: string;
  customerAvatar?: string;
  dishId: string;
  dishName: string;
  dishEmoji?: string;
  requiredToppings?: IngredientId[];
  excludedToppings?: IngredientId[];
  spiceLevel?: number;
  price?: number;
  timeRemaining?: number;
}

interface CookingEngineProps {
  order: CookingTargetOrder;
  inventory: Record<string, Ingredient>;
  onClose: () => void;
  onFinishCook: (result: {
    order: CookingTargetOrder;
    validation: DishValidationResult;
    usedIngredients: IngredientId[];
    toppings: IngredientId[];
    spiceLevel: number;
  }) => void;
}

// Predefined safe coordinate slots inside the cookware vessel (percentages)
const TOPPING_SLOTS = [
  { left: '44%', top: '38%' },
  { left: '26%', top: '30%' },
  { left: '60%', top: '28%' },
  { left: '24%', top: '54%' },
  { left: '62%', top: '52%' },
  { left: '42%', top: '60%' },
  { left: '44%', top: '20%' },
];

export const CookingEngine: React.FC<CookingEngineProps> = ({
  order,
  inventory,
  onClose,
  onFinishCook,
}) => {
  const recipe = getRecipeConfig(order.dishId);

  // Cooking state
  const [baseAdded, setBaseAdded] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState<IngredientId[]>([]);
  const [currentSpice, setCurrentSpice] = useState<number>(
    order.spiceLevel !== undefined ? order.spiceLevel : recipe.defaultSpiceLevel
  );
  const [isCookingActive, setIsCookingActive] = useState(false);
  const [validationResult, setValidationResult] = useState<DishValidationResult | null>(null);
  const [panFlipCount, setPanFlipCount] = useState(0);
  const [boardRollProgress, setBoardRollProgress] = useState(0);
  const [boardSliceCount, setBoardSliceCount] = useState(0);
  const [potWaterLevel, setPotWaterLevel] = useState(60);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setBaseAdded(false);
    setSelectedToppings([]);
    setCurrentSpice(
      order.spiceLevel !== undefined ? order.spiceLevel : recipe.defaultSpiceLevel
    );
    setIsCookingActive(false);
    setValidationResult(null);
    setPanFlipCount(0);
    setBoardRollProgress(0);
    setBoardSliceCount(0);
    setPotWaterLevel(60);
    pointerStart.current = null;
  }, [order.orderId, order.dishId, order.tableId]);

  // Add topping
  const handleAddTopping = (toppingId: IngredientId) => {
    const item = inventory[toppingId];
    const stock = item ? item.stock : 0;
    const currentCount = selectedToppings.filter((t) => t === toppingId).length;

    if (stock - currentCount <= 0) {
      soundManager.playError();
      return;
    }

    soundManager.playClick();
    setSelectedToppings((prev) => [...prev, toppingId]);
  };

  // Remove topping
  const handleRemoveTopping = (toppingId: IngredientId) => {
    soundManager.playClick();
    setSelectedToppings((prev) => {
      const idx = prev.lastIndexOf(toppingId);
      if (idx === -1) return prev;
      const next = [...prev];
      next.splice(idx, 1);
      return next;
    });
  };

  // Toggle base ingredients
  const handleToggleBase = () => {
    soundManager.playClick();
    setBaseAdded((prev) => !prev);
  };

  // Spice level adjusters
  const handleSpiceDecrease = () => {
    if (currentSpice > 0) {
      soundManager.playClick();
      setCurrentSpice((s) => s - 1);
    }
  };

  const handleSpiceIncrease = () => {
    if (currentSpice < recipe.maxSpiceLevel) {
      soundManager.playClick();
      setCurrentSpice((s) => s + 1);
    }
  };

  const handlePanFlip = () => {
    if (recipe.stationType !== 'pan' || !baseAdded) {
      soundManager.playError();
      return;
    }
    soundManager.playSizzle();
    setPanFlipCount((count) => Math.min(5, count + 1));
  };

  const handleBoardRoll = () => {
    if (recipe.stationType !== 'board' || !baseAdded) {
      soundManager.playError();
      return;
    }
    soundManager.playClick();
    setBoardRollProgress((progress) => Math.min(100, progress + 34));
  };

  const handleBoardSlice = () => {
    if (recipe.stationType !== 'board' || boardRollProgress < 100) {
      soundManager.playError();
      return;
    }
    soundManager.playChop();
    setBoardSliceCount((count) => Math.min(8, count + 1));
  };

  const handleCookwarePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };

  const handleCookwarePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerStart.current) return;

    const deltaX = event.clientX - pointerStart.current.x;
    const deltaY = pointerStart.current.y - event.clientY;
    pointerStart.current = null;

    if (recipe.stationType === 'pan' && deltaY >= 24) {
      handlePanFlip();
      return;
    }

    if (recipe.stationType === 'board') {
      if (boardRollProgress < 100 && deltaY >= 24) {
        handleBoardRoll();
      } else if (boardRollProgress >= 100 && Math.abs(deltaX) >= 24) {
        handleBoardSlice();
      }
    }
  };

  // Execute dish evaluation
  const handleServeDish = () => {
    if (!baseAdded) {
      soundManager.playError();
      return;
    }
    if (recipe.stationType === 'pan' && panFlipCount < 2) {
      soundManager.playError();
      return;
    }
    if (
      recipe.stationType === 'board' &&
      (boardRollProgress < 100 || boardSliceCount < 8)
    ) {
      soundManager.playError();
      return;
    }
    if (recipe.stationType === 'pot' && (potWaterLevel < 70 || potWaterLevel > 80)) {
      soundManager.playError();
      return;
    }

    const virtualDish = {
      id: order.dishId,
      name: recipe.name,
      koreanName: recipe.koreanName,
      category: 'main' as const,
      stationType:
        recipe.stationType === 'pan'
          ? ('tokbokki' as const)
          : recipe.stationType === 'board'
          ? ('kimbap' as const)
          : ('ramyeon' as const),
      price: order.price || 0,
      prepTime: recipe.idealCookSeconds,
      emoji: '',
      requiredIngredients: Object.fromEntries(
        recipe.baseIngredients.map((id) => [id, 1])
      ),
      recipeSteps: [],
      unlockLevel: 1,
      unlockCost: 0,
      isUnlocked: true,
      description: '',
    };

    if (!hasIngredients(inventory, buildConsumptionRequirements(virtualDish, selectedToppings))) {
      soundManager.playError();
      return;
    }

    setIsCookingActive(true);
    soundManager.playClick();

    setTimeout(() => {
      setIsCookingActive(false);

      const validation = validateDishQuality({
        dishId: order.dishId,
        cookedToppings: selectedToppings,
        cookedSpiceLevel: currentSpice,
        baseAdded,
        requiredToppings: order.requiredToppings,
        excludedToppings: order.excludedToppings,
        targetSpiceLevel: order.spiceLevel,
      });

      setValidationResult(validation);

      if (validation.quality === 'perfect' || validation.quality === 'good') {
        soundManager.playSuccess();
      } else {
        soundManager.playError();
      }
    }, 500);
  };

  // Confirm result
  const handleConfirmResult = () => {
    if (!validationResult) return;

    const usedIngredients: IngredientId[] = [
      ...(baseAdded ? recipe.baseIngredients : []),
      ...selectedToppings,
    ];

    onFinishCook({
      order,
      validation: validationResult,
      usedIngredients,
      toppings: selectedToppings,
      spiceLevel: currentSpice,
    });
  };

  // Base ingredient names
  const baseIngredientNames = recipe.baseIngredients
    .map((id) => inventory[id]?.vietnameseName || id)
    .join(' + ');

  return (
    <div className="relative flex w-full flex-col gap-2 select-none pb-2 font-baloo">
      {/* ========================================================================= */}
      {/* 1. COMPACT COOKING HEADER                                                 */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between gap-2 rounded-2xl border border-amber-500/20 bg-black/25 p-2.5 shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-600/20 border border-amber-400/40 flex items-center justify-center shrink-0">
            <Image
              src={recipe.containerAsset}
              alt={recipe.name}
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-amber-300 truncate">
                {order.orderType === 'dine_in'
                  ? `Khách Bàn ${order.tableId} • ${order.customerName}`
                  : order.orderType === 'delivery'
                  ? `Đơn Giao Hàng • ${order.customerName}`
                  : 'Nấu Tự Do Sáng Tạo'}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-black text-amber-100 truncate leading-tight">
              {recipe.name}
            </h2>
          </div>
        </div>

        <CloseButton onClick={onClose} label="Đóng" />
      </div>

      {/* ========================================================================= */}
      {/* 2. ORDER REQUIREMENTS SUMMARY PILL                                        */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 rounded-xl border border-stone-700 bg-stone-900/55 px-2.5 py-2 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-amber-300">Yêu cầu:</span>
          {order.requiredToppings && order.requiredToppings.length > 0 ? (
            order.requiredToppings.map((topId) => {
              const item = inventory[topId];
              const asset =
                (GAME_ASSETS.toppings as Record<string, string>)[topId] ||
                (GAME_ASSETS.ingredients as Record<string, string>)[topId];
              return (
                <span
                  key={topId}
                  className="inline-flex items-center gap-1 bg-amber-950/80 border border-amber-500/50 text-amber-100 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                >
                  {asset && (
                    <Image
                      src={asset}
                      alt={topId}
                      width={12}
                      height={12}
                      className="w-3 h-3 object-contain"
                    />
                  )}
                  {item ? item.vietnameseName : topId}
                </span>
              );
            })
          ) : (
            <span className="text-[10px] text-amber-200/80 italic">
              Theo khẩu vị tự do
            </span>
          )}

          {/* Excluded Toppings */}
          {order.excludedToppings && order.excludedToppings.length > 0 && (
            <span className="inline-flex items-center gap-1 ml-1 text-red-300 text-[10px] font-bold">
              <span>(Tránh:</span>
              {order.excludedToppings.map((excId) => inventory[excId]?.vietnameseName || excId).join(', ')}
              <span>)</span>
            </span>
          )}
        </div>

        {/* Spice Requirement */}
        {recipe.supportsSpiceLevel && (
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-200 shrink-0">
            <GameAssetIcon name="chilli" size={14} />
            <span>
              Cần cay:{' '}
              <strong className="text-red-400">
                {order.spiceLevel !== undefined
                  ? order.spiceLevel === 0
                    ? 'Cấp 0 (Không Cay)'
                    : `Cấp ${order.spiceLevel}`
                  : 'Tự Chọn'}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. COOKING WORKSPACE: COOKWARE + BOUNDED INGREDIENT OVERLAY               */}
      {/* ========================================================================= */}
      <div
        className="relative flex w-full flex-col items-center justify-center rounded-2xl border border-amber-500/20 bg-[radial-gradient(circle_at_top,rgba(180,83,9,.12),transparent_56%),rgba(0,0,0,.22)] p-2 sm:p-3"
        onPointerDown={handleCookwarePointerDown}
        onPointerUp={handleCookwarePointerUp}
        onPointerCancel={() => {
          pointerStart.current = null;
        }}
      >
        {/* Cookware Vessel Wrapper with clamp width and exact aspect ratio */}
        <div className="relative flex aspect-square w-[min(58vw,220px)] touch-none items-center justify-center sm:w-[clamp(230px,28vw,310px)]">
          {/* Stove shadow glow */}
          <div className="absolute -bottom-1 w-3/4 h-5 bg-black/60 rounded-full blur-md" />

          {/* Cookware Image (Object Contain, No Stretch, No Transform Scale Hacks) */}
          <Image
            src={recipe.containerAsset}
            alt={recipe.stationType}
            width={340}
            height={340}
            className="w-full h-full object-contain pointer-events-none drop-shadow-xl z-10 transition-transform duration-200"
            style={
              recipe.stationType === 'pan'
                ? {
                    transform: `rotate(${panFlipCount % 2 === 0 ? 0 : -5}deg) translateY(${panFlipCount % 2 === 0 ? 0 : -4}px)`,
                  }
                : undefined
            }
            priority
          />

          {/* Inner Ingredient Clip Area: strictly constrained inside bowl/pot bounds */}
          <div className={`absolute overflow-hidden flex items-center justify-center z-20 pointer-events-auto ${
                recipe.stationType === 'board'
                  ? 'left-[17%] right-[17%] top-[26%] bottom-[22%] rounded-xl'
                  : recipe.stationType === 'pan'
                  ? 'left-[20%] right-[28%] top-[29%] bottom-[27%] rounded-full'
                  : 'left-[22%] right-[22%] top-[23%] bottom-[24%] rounded-full'
              }`}>
            {/* Base broth/rice/sauce texture */}
            {baseAdded ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`absolute inset-0 rounded-full flex items-center justify-center ${
                  recipe.stationType === 'board'
                    ? 'bg-[#18391E]/80 border-2 border-black/40' // seaweed nori
                    : recipe.stationType === 'pan'
                    ? 'bg-[#A82B14] shadow-inner' // gochujang tok sauce
                    : 'bg-[#B45309]/85 shadow-inner' // ramen spicy broth
                }`}
              >
                {/* Steam/broth effect without plastered text */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 animate-pulse opacity-40 pointer-events-none" />
              </motion.div>
            ) : (
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/40 flex items-center justify-center bg-black/40 p-2 text-center">
                <span className="text-[11px] font-bold text-amber-300/80 animate-pulse">
                  Chạm nút bên dưới để cho nguyên liệu nền
                </span>
              </div>
            )}

            {/* Bounded Topping Sprites using predefined coordinates */}
            <div className="relative w-full h-full pointer-events-auto">
              <AnimatePresence>
                {selectedToppings.slice(0, 7).map((topId, index) => {
                  const item = inventory[topId];
                  const asset =
                    (GAME_ASSETS.toppings as Record<string, string>)[topId] ||
                    (GAME_ASSETS.ingredients as Record<string, string>)[topId] ||
                    null;

                  const slot = TOPPING_SLOTS[index % TOPPING_SLOTS.length];

                  return (
                    <motion.button
                      key={`${topId}_${index}`}
                      type="button"
                      initial={{ scale: 0, y: -10 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveTopping(topId)}
                      style={{
                        position: 'absolute',
                        left: slot.left,
                        top: slot.top,
                        transform: 'translate(-50%, -50%)',
                      }}
                      title={`Bấm để gỡ ${item ? item.vietnameseName : topId}`}
                      className="w-8 h-8 sm:w-10 sm:h-10 p-0.5 rounded-full bg-black/40 border border-white/60 shadow-md cursor-pointer hover:border-red-400 active:scale-90 transition-transform flex items-center justify-center z-20"
                    >
                      {asset ? (
                        <Image
                          src={asset}
                          alt={topId}
                          width={36}
                          height={36}
                          className="w-full h-full object-contain pointer-events-none drop-shadow"
                        />
                      ) : (
                        <span className="text-[7px] font-black text-red-300">Thiếu ảnh</span>
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>

              {/* Extra toppings counter pill if > 7 */}
              {selectedToppings.length > 7 && (
                <div className="absolute bottom-2 right-2 bg-red-600 text-white font-black text-[10px] px-1.5 py-0.5 rounded-full shadow border border-white/60">
                  +{selectedToppings.length - 7}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Clean Base State Indicator Pill below vessel */}
        <div className="mt-1 flex max-w-full items-center gap-1.5 rounded-full border border-stone-700 bg-black/25 px-2.5 py-1 text-[10px] font-bold text-amber-200">
          <span>Nguyên liệu nền:</span>
          <span
            className={`px-2 py-0.5 rounded-full border ${
              baseAdded
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                : 'bg-stone-900 text-stone-400 border-stone-700'
            }`}
          >
            {baseAdded ? `Đã cho: ${baseIngredientNames}` : 'Chưa cho nguyên liệu nền'}
          </span>
        </div>

        {recipe.stationType === 'pan' && (
          <div className="mt-2 w-full max-w-[340px] flex items-center gap-2">
            <button
              type="button"
              onClick={handlePanFlip}
              className="flex-1 h-11 rounded-xl border border-amber-400/50 bg-amber-700/80 hover:bg-amber-600 text-white font-black text-xs active:scale-95 transition-all"
            >
              Lật chảo ({panFlipCount}/2)
            </button>
            <span className="text-[10px] text-amber-200/80 font-bold text-right max-w-[130px]">
              Vuốt chảo lên hoặc bấm nút ít nhất 2 lần
            </span>
          </div>
        )}

        {recipe.stationType === 'board' && (
          <div className="mt-2 w-full max-w-[420px] grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleBoardRoll}
              disabled={boardRollProgress >= 100}
              className="h-11 rounded-xl border border-emerald-400/50 bg-emerald-800/80 disabled:opacity-50 text-white font-black text-xs active:scale-95"
            >
              Cuộn kimbap ({boardRollProgress}%)
            </button>
            <button
              type="button"
              onClick={handleBoardSlice}
              disabled={boardRollProgress < 100 || boardSliceCount >= 8}
              className="h-11 rounded-xl border border-amber-400/50 bg-amber-700/80 disabled:opacity-50 text-white font-black text-xs active:scale-95"
            >
              Cắt khoanh ({boardSliceCount}/8)
            </button>
            <span className="col-span-2 text-[10px] text-emerald-200/80 font-bold text-center">
              Vuốt lên để cuộn • Khi đủ 100%, vuốt ngang để cắt
            </span>
          </div>
        )}

        {recipe.stationType === 'pot' && (
          <div className="mt-2 w-full max-w-[360px] rounded-xl border border-blue-400/30 bg-blue-950/30 p-2">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setPotWaterLevel((value) => Math.max(0, value - 5))}
                className="w-11 h-11 rounded-xl bg-stone-800 border border-stone-600 text-white font-black"
              >
                -5
              </button>
              <div className="flex-1 text-center">
                <div className="text-xs font-black text-blue-200">Mực nước {potWaterLevel}%</div>
                <div className="mt-1 h-2 rounded-full bg-stone-950 overflow-hidden border border-blue-500/30">
                  <div
                    className={`h-full transition-all ${
                      potWaterLevel >= 70 && potWaterLevel <= 80
                        ? 'bg-emerald-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${potWaterLevel}%` }}
                  />
                </div>
                <div className="text-[10px] mt-1 text-blue-300/80">Chuẩn: 70–80%</div>
              </div>
              <button
                type="button"
                onClick={() => setPotWaterLevel((value) => Math.min(100, value + 5))}
                className="w-11 h-11 rounded-xl bg-blue-700 border border-blue-400 text-white font-black"
              >
                +5
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. BASE INGREDIENT & SPICE LEVEL CONTROLS (Touch Targets >= 44px)        */}
      {/* ========================================================================= */}
      <div className="flex w-full flex-wrap items-center justify-between gap-2 rounded-2xl border border-stone-700 bg-stone-900/55 p-2">
        {/* Base Ingredient Toggle Button */}
        <button
          type="button"
          onClick={handleToggleBase}
          className={`flex-1 min-w-[160px] h-11 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer active:scale-95 ${
            baseAdded
              ? 'bg-emerald-700 hover:bg-emerald-600 text-white border-2 border-emerald-400'
              : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white border-2 border-amber-300 animate-pulse'
          }`}
        >
          <GameAssetIcon
            name={recipe.stationType === 'board' ? 'board' : 'pot'}
            size={18}
          />
          <span>
            {baseAdded ? 'Đã Cho Nền' : `Cho ${baseIngredientNames}`}
          </span>
        </button>

        {/* Spice Level Stepper (Touch targets >= 44px) */}
        {recipe.supportsSpiceLevel && (
          <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-amber-600/50 shadow">
            <button
              type="button"
              onClick={handleSpiceDecrease}
              disabled={currentSpice <= 0}
              className="w-11 h-11 rounded-lg bg-stone-800 hover:bg-stone-800 disabled:opacity-30 border border-stone-700 flex items-center justify-center text-amber-200 font-black text-base active:scale-90 cursor-pointer"
              title="Giảm độ cay"
            >
              <GameAssetIcon name="minus" size={16} />
            </button>

            <div className="flex items-center gap-1 px-2 text-center">
              <GameAssetIcon name="chilli" size={18} />
              <span className="font-black text-xs sm:text-sm text-amber-100 min-w-[50px]">
                {currentSpice === 0 ? 'Cấp 0' : `Cấp ${currentSpice}`}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSpiceIncrease}
              disabled={currentSpice >= recipe.maxSpiceLevel}
              className="w-11 h-11 rounded-lg bg-red-700 hover:bg-red-600 disabled:opacity-30 border border-red-500 flex items-center justify-center text-white font-black text-base active:scale-90 cursor-pointer"
              title="Tăng độ cay"
            >
              <GameAssetIcon name="plus" size={16} />
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. TOPPING SELECTOR BAR                                                    */}
      {/* ========================================================================= */}
      <div className="w-full rounded-2xl border border-stone-700 bg-stone-900/55 p-2 sm:p-2.5">
        <ToppingSelector
          allowedToppings={recipe.allowedToppings}
          selectedToppings={selectedToppings}
          onAddTopping={handleAddTopping}
          onRemoveTopping={handleRemoveTopping}
          inventory={inventory}
          disabled={isCookingActive}
        />
      </div>

      {/* ========================================================================= */}
      {/* 6. PRIMARY ACTION BUTTONS                                                 */}
      {/* ========================================================================= */}
      <div className="sticky bottom-0 z-20 flex w-full items-center gap-2 rounded-2xl border border-stone-700 bg-[#1a1411]/96 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-xl backdrop-blur">
        {/* Back / Cancel button */}
        <button
          type="button"
          onClick={onClose}
          className="h-11 sm:h-12 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-300 font-bold text-xs sm:text-sm flex items-center gap-1 active:scale-95 transition-transform cursor-pointer shrink-0"
        >
          <span>Quay lại</span>
        </button>

        {/* Primary Finish Cooking Button */}
        <GameButton
          fullWidth
          tone="primary"
          disabled={isCookingActive}
          onClick={handleServeDish}
          iconSrc={GAME_ASSETS.cooking.bowl}
          className="flex-1"
        >
          {isCookingActive ? 'Đang nấu món...' : 'Hoàn thành món'}
        </GameButton>
      </div>

      {/* ========================================================================= */}
      {/* 7. EVALUATION & QUALITY DIALOG MODAL                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {validationResult && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 bg-stone-950/80 backdrop-blur-sm select-none font-baloo">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="relative w-full max-w-sm bg-stone-900 border-2 border-amber-500/80 rounded-3xl p-4 sm:p-5 shadow-2xl text-center text-stone-100 flex flex-col items-center"
            >
              {/* Quality Badge Asset */}
              <div className="w-16 h-16 relative mb-2">
                <Image
                  src={
                    validationResult.quality === 'perfect' ||
                    validationResult.quality === 'good'
                      ? GAME_ASSETS.props.heart_icon
                      : GAME_ASSETS.props.rice_bowl
                  }
                  alt="Kết quả"
                  width={64}
                  height={64}
                  className="object-contain drop-shadow"
                />
              </div>

              <h3
                className={`text-lg font-black uppercase ${
                  validationResult.quality === 'perfect'
                    ? 'text-amber-300'
                    : validationResult.quality === 'good'
                    ? 'text-emerald-300'
                    : 'text-amber-200'
                }`}
              >
                {validationResult.quality === 'perfect'
                  ? 'Hoàn Hảo! Đúng Chuẩn Vị'
                  : validationResult.quality === 'good'
                  ? 'Món Rất Ngon!'
                  : 'Tạm Được'}
              </h3>

              <p className="text-xs text-stone-300 my-1 font-bold">
                {validationResult.feedbackText}
              </p>

              <div className="my-2 bg-stone-950/90 border border-amber-500/40 rounded-2xl p-2.5 w-full flex items-center justify-around text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 block font-bold">Điểm</span>
                  <span className="text-base font-black text-amber-300">
                    {validationResult.score}/100
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block font-bold">Giá trị dự kiến</span>
                  <span className="text-base font-black text-emerald-400">
                    +{Math.round(
                      (order.price || 50) *
                        (validationResult.quality === 'perfect'
                          ? 1.3
                          : validationResult.quality === 'good'
                          ? 1.15
                          : validationResult.quality === 'ok'
                          ? 1.0
                          : 0.6)
                    )}{' '}
                    Xu
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmResult}
                className="w-full mt-2 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:brightness-110 text-white font-black text-sm shadow-lg border border-emerald-300 active:scale-95 cursor-pointer"
              >
                Đặt Lên Khay Giữ Nóng
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
