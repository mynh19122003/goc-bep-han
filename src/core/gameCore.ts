import {
  Dish,
  Ingredient,
  IngredientId,
  PreparedDish,
} from '@/types/game';

export type IngredientRequirements = Partial<Record<IngredientId, number>>;

export function cloneInventory(
  source: Record<string, Ingredient>
): Record<string, Ingredient> {
  return Object.fromEntries(
    Object.entries(source).map(([id, item]) => [id, { ...item }])
  );
}

export function mergeInventoryWithDefaults(
  defaults: Record<string, Ingredient>,
  persisted?: Record<string, Ingredient>
): Record<string, Ingredient> {
  return Object.fromEntries(
    Object.entries(defaults).map(([id, item]) => [
      id,
      { ...item, ...(persisted?.[id] || {}) },
    ])
  );
}

export function cloneDishes<T extends Record<string, Dish>>(source: T): T {
  return Object.fromEntries(
    Object.entries(source).map(([id, dish]) => [
      id,
      {
        ...dish,
        requiredIngredients: { ...dish.requiredIngredients },
        recipeSteps: [...dish.recipeSteps],
      },
    ])
  ) as T;
}

export function mergeDishesWithDefaults<T extends Record<string, Dish>>(
  defaults: T,
  persisted?: Record<string, Dish>
): T {
  return Object.fromEntries(
    Object.entries(defaults).map(([id, dish]) => {
      const saved = persisted?.[id] as Dish | undefined;
      return [
        id,
        {
          ...dish,
          ...(saved || {}),
          requiredIngredients: {
            ...dish.requiredIngredients,
            ...(saved?.requiredIngredients || {}),
          },
          recipeSteps: saved?.recipeSteps ? [...saved.recipeSteps] : [...dish.recipeSteps],
        },
      ];
    })
  ) as T;
}

export function buildConsumptionRequirements(
  dish: Dish,
  selectedToppings: IngredientId[] = []
): IngredientRequirements {
  const requirements: IngredientRequirements = {
    ...dish.requiredIngredients,
  };

  const toppingCounts = selectedToppings.reduce<Partial<Record<IngredientId, number>>>(
    (acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    },
    {}
  );

  for (const [id, count] of Object.entries(toppingCounts) as [
    IngredientId,
    number
  ][]) {
    // Ingredients already included in the canonical dish recipe count as the
    // first serving. Only repeated/extra toppings add extra stock usage.
    const canonicalQty = requirements[id] || 0;
    requirements[id] = Math.max(canonicalQty, count);
  }

  return requirements;
}

export function hasIngredients(
  inventory: Record<string, Ingredient>,
  requirements: IngredientRequirements
): boolean {
  return Object.entries(requirements).every(([id, qty]) => {
    const needed = qty || 0;
    const item = inventory[id];
    return needed <= 0 || Boolean(item && item.stock >= needed && item.freshness > 10);
  });
}

export function deductIngredients(
  inventory: Record<string, Ingredient>,
  requirements: IngredientRequirements
): Record<string, Ingredient> | null {
  if (!hasIngredients(inventory, requirements)) return null;

  const next = cloneInventory(inventory);
  for (const [id, qty] of Object.entries(requirements)) {
    const needed = qty || 0;
    if (needed <= 0 || !next[id]) continue;
    next[id] = {
      ...next[id],
      stock: next[id].stock - needed,
    };
  }
  return next;
}

export function preparedDishMatchesOrder(params: {
  prepared: PreparedDish;
  orderId?: string;
  dishId: string;
  requiredToppings?: IngredientId[];
  excludedToppings?: IngredientId[];
  spiceLevel?: number;
}): boolean {
  const {
    prepared,
    orderId,
    dishId,
    requiredToppings = [],
    excludedToppings = [],
    spiceLevel,
  } = params;

  if (prepared.dishId !== dishId) return false;

  // A targeted dish must never be stolen by a different order.
  if (prepared.targetOrderId) {
    return Boolean(orderId && prepared.targetOrderId === orderId);
  }

  const toppings = prepared.toppings || [];
  if (requiredToppings.some((id) => !toppings.includes(id))) return false;
  if (excludedToppings.some((id) => toppings.includes(id))) return false;

  if (
    spiceLevel !== undefined &&
    prepared.spiceLevel !== undefined &&
    prepared.spiceLevel !== spiceLevel
  ) {
    return false;
  }

  return true;
}

export function restaurantLevelFromReputation(reputationPoints: number): number {
  return Math.max(1, Math.floor(Math.max(0, reputationPoints) / 100) + 1);
}

export function restaurantProgress(reputationPoints: number): {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  progressPercent: number;
} {
  const safeReputation = Math.max(0, reputationPoints);
  const level = restaurantLevelFromReputation(safeReputation);
  const levelStart = (level - 1) * 100;
  const currentXp = safeReputation - levelStart;
  const nextLevelXp = 100;
  return {
    level,
    currentXp,
    nextLevelXp,
    progressPercent: Math.min(100, (currentXp / nextLevelXp) * 100),
  };
}

export function averageFreshnessForRequirements(
  inventory: Record<string, Ingredient>,
  requirements: IngredientRequirements
): number {
  let weightedFreshness = 0;
  let totalUnits = 0;

  for (const [id, qty] of Object.entries(requirements)) {
    const units = qty || 0;
    const item = inventory[id];
    if (!item || units <= 0) continue;
    weightedFreshness += item.freshness * units;
    totalUnits += units;
  }

  return totalUnits > 0 ? weightedFreshness / totalUnits : 100;
}

export function createGameId(prefix: string): string {
  const uuid =
    typeof globalThis !== 'undefined' &&
    globalThis.crypto &&
    typeof globalThis.crypto.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  return `${prefix}_${uuid}`;
}
