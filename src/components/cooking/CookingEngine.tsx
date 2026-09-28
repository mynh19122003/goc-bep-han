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

  const requiredToppings = order.requiredToppings || [];
  const excludedToppings = order.excludedToppings || [];
  const missingRequired = requiredToppings.filter((id) => !selectedToppings.includes(id));
  const forbiddenSelected = excludedToppings.filter((id) => selectedToppings.includes(id));
  const spiceMatches =
    !recipe.supportsSpiceLevel ||
    order.spiceLevel === undefined ||
    currentSpice === order.spiceLevel;

  const techniqueReady =
    recipe.stationType === 'pan'
      ? panFlipCount >= 2
      : recipe.stationType === 'board'
      ? boardRollProgress >= 100 && boardSliceCount >= 8
      : recipe.stationType === 'pot'
      ? potWaterLevel >= 70 && potWaterLevel <= 80
      : true;

  const canEvaluate = baseAdded && techniqueReady && !isCookingActive;

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
      {/* 2. LIVE ORDER REQUIREMENTS                                                */}
      {/* ========================================================================= */}
      <section className="rounded-2xl border border-stone-700 bg-stone-900/55 p-2.5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div>
            <span className="text-[9px] font-black uppercase tracking-wider text-stone-500">Order hiện tại</span>
            <p className="text-[11px] font-black text-amber-100">Làm đúng yêu cầu trước khi hoàn thành</p>
          </div>
          <span className={`rounded-full border px-2 py-1 text-[9px] font-black ${
            missingRequired.length === 0 && forbiddenSelected.length === 0 && spiceMatches
              ? 'border-emerald-500/30 bg-emerald-950/45 text-emerald-300'
              : 'border-amber-500/25 bg-amber-950/40 text-amber-300'
          }`}>
            {missingRequired.length === 0 && forbiddenSelected.length === 0 && spiceMatches
              ? 'Đang đúng yêu cầu'
              : 'Cần kiểm tra'}
          </span>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-amber-500/20 bg-black/20 p-2">
            <span className="text-[9px] font-black uppercase text-amber-300">Cần có</span>
            <div className="mt-1 flex min-h-[28px] flex-wrap gap-1">
              {requiredToppings.length > 0 ? (
                requiredToppings.map((topId) => {
                  const item = inventory[topId];
                  const asset =
                    (GAME_ASSETS.toppings as Record<string, string>)[topId] ||
                    (GAME_ASSETS.ingredients as Record<string, string>)[topId];
                  const selected = selectedToppings.includes(topId);
                  return (
                    <span
                      key={topId}
                      className={`inline-flex items-center gap-1 rounded-lg border px-1.5 py-1 text-[9px] font-black ${
                        selected
                          ? 'border-emerald-500/30 bg-emerald-950/45 text-emerald-300'
                          : 'border-amber-500/25 bg-amber-950/35 text-amber-100'
                      }`}
                    >
                      {asset && (
                        <span className="relative h-3.5 w-3.5">
                          <Image src={asset} alt="" fill sizes="14px" className="object-contain" />
                        </span>
                      )}
                      {item?.vietnameseName || topId}
                    </span>
                  );
                })
              ) : (
                <span className="text-[9px] font-bold text-stone-500">Không bắt buộc topping</span>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-red-500/15 bg-black/20 p-2">
            <span className="text-[9px] font-black uppercase text-red-300">Không cho</span>
            <div className="mt-1 flex min-h-[28px] flex-wrap gap-1">
              {excludedToppings.length > 0 ? (
                excludedToppings.map((topId) => (
                  <span
                    key={topId}
                    className={`rounded-lg border px-1.5 py-1 text-[9px] font-black ${
                      selectedToppings.includes(topId)
                        ? 'border-red-500/50 bg-red-950/60 text-red-200'
                        : 'border-stone-700 bg-stone-950/40 text-stone-400'
                    }`}
                  >
                    {inventory[topId]?.vietnameseName || topId}
                  </span>
                ))
              ) : (
                <span className="text-[9px] font-bold text-stone-500">Không có nguyên liệu cấm</span>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-red-500/15 bg-black/20 p-2">
            <span className="text-[9px] font-black uppercase text-red-300">Độ cay</span>
            <div className="mt-1 flex min-h-[28px] items-center gap-1.5">
              {recipe.supportsSpiceLevel ? (
                <>
                  <GameAssetIcon name="chilli" size={15} />
                  <span className={`text-[10px] font-black ${
                    spiceMatches ? 'text-emerald-300' : 'text-red-300'
                  }`}>
                    Khách cần {order.spiceLevel === undefined ? 'tự chọn' : `cấp ${order.spiceLevel}`}
                  </span>
                </>
              ) : (
                <span className="text-[9px] font-bold text-stone-500">Món không dùng cấp cay</span>
              )}
            </div>
          </div>
        </div>
      </section>

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
          <div className="mt-2 w-full max-w-[380px] rounded-xl border border-amber-500/20 bg-amber-950/20 p-2">
            <div className="flex items-center gap-2">
              <GameButton
                fullWidth
                compact
                tone={panFlipCount >= 2 ? 'success' : 'primary'}
                onClick={handlePanFlip}
                disabled={!baseAdded}
              >
                Lật chảo {panFlipCount}/2
              </GameButton>
              <span className={`shrink-0 rounded-lg border px-2 py-1 text-[9px] font-black ${
                panFlipCount >= 2
                  ? 'border-emerald-500/25 bg-emerald-950/45 text-emerald-300'
                  : 'border-amber-500/20 bg-black/25 text-amber-300'
              }`}>
                {panFlipCount >= 2 ? 'Đạt' : 'Chưa đủ'}
              </span>
            </div>
            <p className="mt-1.5 text-center text-[9px] font-bold text-amber-200/60">Vuốt chảo lên hoặc bấm nút để lật</p>
          </div>
        )}

        {recipe.stationType === 'board' && (
          <div className="mt-2 w-full max-w-[420px] rounded-xl border border-emerald-500/20 bg-emerald-950/15 p-2">
            <div className="grid grid-cols-2 gap-2">
              <GameButton
                compact
                tone={boardRollProgress >= 100 ? 'success' : 'neutral'}
                onClick={handleBoardRoll}
                disabled={!baseAdded || boardRollProgress >= 100}
              >
                Cuộn {boardRollProgress}%
              </GameButton>
              <GameButton
                compact
                tone={boardSliceCount >= 8 ? 'success' : 'primary'}
                onClick={handleBoardSlice}
                disabled={boardRollProgress < 100 || boardSliceCount >= 8}
              >
                Cắt {boardSliceCount}/8
              </GameButton>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="h-1.5 overflow-hidden rounded-full bg-stone-800">
                <div className="h-full bg-emerald-500 transition-all" style={{ width: `${boardRollProgress}%` }} />
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-stone-800">
                <div className="h-full bg-amber-500 transition-all" style={{ width: `${Math.min(100, (boardSliceCount / 8) * 100)}%` }} />
              </div>
            </div>
            <p className="mt-1.5 text-center text-[9px] font-bold text-emerald-200/60">Vuốt lên để cuộn • Vuốt ngang để cắt</p>
          </div>
        )}

        {recipe.stationType === 'pot' && (
          <div className="mt-2 w-full max-w-[380px] rounded-xl border border-blue-400/20 bg-blue-950/20 p-2">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <div>
                <span className="text-[9px] font-black uppercase text-blue-300">Mực nước</span>
                <p className="text-xs font-black text-blue-100">{potWaterLevel}%</p>
              </div>
              <span className={`rounded-lg border px-2 py-1 text-[9px] font-black ${
                techniqueReady
                  ? 'border-emerald-500/25 bg-emerald-950/45 text-emerald-300'
                  : 'border-blue-500/20 bg-black/25 text-blue-300'
              }`}>
                Chuẩn 70–80%
              </span>
            </div>
            <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-2">
              <button
                type="button"
                onClick={() => setPotWaterLevel((value) => Math.max(0, value - 5))}
                className="h-11 rounded-xl border border-stone-600 bg-stone-800 text-xs font-black text-white transition active:scale-95"
              >
                −5
              </button>
              <div className="relative h-3 overflow-hidden rounded-full border border-blue-500/20 bg-stone-950">
                <div className="absolute inset-y-0 left-[70%] w-[10%] bg-emerald-500/20" />
                <div
                  className={`h-full rounded-full transition-all ${
                    techniqueReady ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${potWaterLevel}%` }}
                />
              </div>
              <button
                type="button"
                onClick={() => setPotWaterLevel((value) => Math.min(100, value + 5))}
                className="h-11 rounded-xl border border-blue-400 bg-blue-700 text-xs font-black text-white transition active:scale-95"
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
      <div className="grid w-full gap-2 rounded-2xl border border-stone-700 bg-stone-900/55 p-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        {/* Base Ingredient Toggle Button */}
        <button
          type="button"
          onClick={handleToggleBase}
          className={`h-11 w-full px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer active:scale-95 ${
            baseAdded
              ? 'bg-emerald-700 hover:bg-emerald-600 text-white border-2 border-emerald-400'
              : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white border-2 border-amber-300'
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
          <div className="grid grid-cols-[44px_minmax(76px,1fr)_44px] items-center gap-1 rounded-xl border border-amber-600/35 bg-stone-950 p-1 shadow">
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
          disabled={!canEvaluate}
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
          {isCookingActive
            ? 'Đang nấu món...'
            : !baseAdded
            ? 'Thêm nguyên liệu nền'
            : !techniqueReady
            ? 'Hoàn tất thao tác nấu'
            : 'Hoàn thành món'}
        </GameButton>
      </div>

      {/* ========================================================================= */}
      {/* 7. DISH RESULT                                                           */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {validationResult && (
          <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/78 p-0 backdrop-blur-sm sm:items-center sm:p-3">
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 28 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 28 }}
              className="w-full max-w-sm rounded-t-3xl border-t border-amber-500/40 bg-[#191310]/98 p-4 text-stone-100 shadow-2xl sm:rounded-3xl sm:border"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${
                  validationResult.quality === 'perfect'
                    ? 'border-amber-400/35 bg-amber-950/45'
                    : validationResult.quality === 'good'
                    ? 'border-emerald-400/30 bg-emerald-950/35'
                    : validationResult.quality === 'ok'
                    ? 'border-orange-400/30 bg-orange-950/30'
                    : 'border-red-500/30 bg-red-950/35'
                }`}>
                  <span className="relative h-10 w-10">
                    <Image
                      src={
                        validationResult.quality === 'perfect' || validationResult.quality === 'good'
                          ? GAME_ASSETS.props.heart_icon
                          : GAME_ASSETS.props.rice_bowl
                      }
                      alt=""
                      fill
                      sizes="40px"
                      className="object-contain"
                    />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-stone-500">Kết quả món ăn</span>
                  <h3 className={`text-base font-black ${
                    validationResult.quality === 'perfect'
                      ? 'text-amber-300'
                      : validationResult.quality === 'good'
                      ? 'text-emerald-300'
                      : validationResult.quality === 'ok'
                      ? 'text-orange-300'
                      : 'text-red-300'
                  }`}>
                    {validationResult.quality === 'perfect'
                      ? 'Hoàn hảo'
                      : validationResult.quality === 'good'
                      ? 'Rất ngon'
                      : validationResult.quality === 'ok'
                      ? 'Tạm ổn'
                      : 'Chưa đạt'}
                  </h3>
                  <p className="mt-0.5 text-[10px] leading-relaxed text-stone-400">{validationResult.feedbackText}</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-stone-700 bg-black/25 p-2.5 text-center">
                  <span className="block text-[9px] font-black uppercase text-stone-500">Điểm</span>
                  <strong className="text-lg font-black text-amber-300">{validationResult.score}/100</strong>
                </div>
                <div className="rounded-xl border border-stone-700 bg-black/25 p-2.5 text-center">
                  <span className="block text-[9px] font-black uppercase text-stone-500">Giá trị dự kiến</span>
                  <strong className="text-lg font-black text-emerald-300">
                    +{Math.round(
                      (order.price || 50) *
                        (validationResult.quality === 'perfect'
                          ? 1.3
                          : validationResult.quality === 'good'
                          ? 1.15
                          : validationResult.quality === 'ok'
                          ? 1
                          : 0.6)
                    )} Xu
                  </strong>
                </div>
              </div>

              {(validationResult.missingToppings.length > 0 ||
                validationResult.wrongToppings.length > 0 ||
                !validationResult.isSpiceCorrect) && (
                <div className="mt-3 rounded-xl border border-red-500/20 bg-red-950/20 p-2.5">
                  <span className="text-[9px] font-black uppercase text-red-300">Cần xem lại</span>
                  <div className="mt-1 space-y-1 text-[10px] font-bold text-stone-300">
                    {validationResult.missingToppings.length > 0 && (
                      <p>• Thiếu: {validationResult.missingToppings.map((id) => inventory[id]?.vietnameseName || id).join(', ')}</p>
                    )}
                    {validationResult.wrongToppings.length > 0 && (
                      <p>• Không nên có: {validationResult.wrongToppings.map((id) => inventory[id]?.vietnameseName || id).join(', ')}</p>
                    )}
                    {!validationResult.isSpiceCorrect && <p>• Cấp cay chưa đúng yêu cầu khách</p>}
                  </div>
                </div>
              )}

              <div className="mt-3 grid grid-cols-2 gap-2">
                {(validationResult.quality === 'ok' || validationResult.quality === 'fail') && (
                  <GameButton
                    fullWidth
                    tone="neutral"
                    onClick={() => setValidationResult(null)}
                  >
                    Chỉnh lại
                  </GameButton>
                )}
                <GameButton
                  fullWidth
                  tone="success"
                  onClick={handleConfirmResult}
                  className={validationResult.quality === 'perfect' || validationResult.quality === 'good' ? 'col-span-2' : ''}
                >
                  Đặt lên khay
                </GameButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
