import { RollOutcome, RatingName } from '../types/motw';

export interface RollEvaluation {
  dice: [number, number];
  sumDice: number;
  ratingModifier: number;
  situationalModifier: number;
  total: number;
  outcome: RollOutcome;
  outcomeLabel: string;
  awardsXp: boolean;
}

/**
 * Calculates outcome category according to Monstro da Semana rules:
 * <= 6: Falha (Keeper makes a move, hunter gains 1 XP)
 * 7-9: Sucesso Parcial (mixed success, compromise)
 * 10-11: Sucesso Total
 * 12+: Sucesso Avançado (if hunter unlocked advanced move for this move) or Sucesso Total
 */
export function calculateOutcome(total: number, hasAdvanced = false): RollOutcome {
  if (total <= 6) return 'falha';
  if (total <= 9) return 'parcial';
  if (total >= 12 && hasAdvanced) return 'avancado';
  return 'sucesso';
}

export function getOutcomeLabel(outcome: RollOutcome): string {
  switch (outcome) {
    case 'falha':
      return 'Falha (Marque 1 XP)';
    case 'parcial':
      return 'Sucesso Parcial (7-9)';
    case 'sucesso':
      return 'Sucesso Total (10+)';
    case 'avancado':
      return 'Sucesso Avançado (12+)';
  }
}

export function evaluateRoll(
  die1: number,
  die2: number,
  ratingModifier = 0,
  situationalModifier = 0,
  hasAdvanced = false
): RollEvaluation {
  // Clamp dice to valid 1-6 range
  const d1 = Math.max(1, Math.min(6, Math.floor(die1)));
  const d2 = Math.max(1, Math.min(6, Math.floor(die2)));
  const sumDice = d1 + d2;
  const total = sumDice + ratingModifier + situationalModifier;
  const outcome = calculateOutcome(total, hasAdvanced);

  return {
    dice: [d1, d2],
    sumDice,
    ratingModifier,
    situationalModifier,
    total,
    outcome,
    outcomeLabel: getOutcomeLabel(outcome),
    awardsXp: outcome === 'falha',
  };
}

/**
 * Health & Harm calculations:
 * 0-3 harm: Minor damage
 * 4-7 harm: Serious damage (instável / unstable)
 * 8+ harm: Fatal / Out of action
 */
export function calculateHarm(
  currentHarm: number,
  incomingHarm: number,
  armour = 0,
  ignoresArmour = false
): { newHarm: number; netHarmTaken: number; isUnstable: boolean; isFatal: boolean } {
  const effectiveArmour = ignoresArmour ? 0 : Math.max(0, armour);
  const netHarmTaken = Math.max(0, incomingHarm - effectiveArmour);
  const newHarm = Math.max(0, Math.min(8, currentHarm + netHarmTaken));
  const isUnstable = newHarm >= 4;
  const isFatal = newHarm >= 8;

  return {
    newHarm,
    netHarmTaken,
    isUnstable,
    isFatal,
  };
}

/**
 * Heals harm. If harm drops below 4, stabilizes automatically unless permanently unstable.
 */
export function healHarm(
  currentHarm: number,
  amount: number,
  wasUnstable: boolean
): { newHarm: number; isUnstable: boolean } {
  const newHarm = Math.max(0, currentHarm - amount);
  return {
    newHarm,
    isUnstable: newHarm >= 4 ? wasUnstable : false,
  };
}

/**
 * Experience calculations:
 * When hunter marks the 5th box of experience, they immediately level up (resetting experience or carrying over).
 */
export function calculateExpAddition(
  currentExp: number,
  addedExp: number
): { newExp: number; levelUpsGained: number } {
  const total = Math.max(0, currentExp + addedExp);
  const levelUpsGained = Math.floor(total / 5);
  const newExp = total % 5;

  return {
    newExp,
    levelUpsGained,
  };
}

export function calculateLevel(levelUpsTaken: number): number {
  return Math.max(1, 1 + (levelUpsTaken || 0));
}

export function calculateExpProgress(experience: number): {
  current: number;
  max: number;
  remainingToLevelUp: number;
  isReadyToLevelUp: boolean;
} {
  const current = Math.max(0, experience || 0);
  const max = 5;
  const remaining = Math.max(0, max - current);
  return {
    current,
    max,
    remainingToLevelUp: remaining,
    isReadyToLevelUp: current >= 5,
  };
}

/**
 * Luck spending:
 * Spending 1 Luck box turns any roll into a 12 (Sucesso Avançado / Total) or avoids suffering harm/danger completely.
 */
export function spendLuckPoint(
  currentLuck: number,
  maxLuck = 7
): { newLuck: number; canSpend: boolean; isDoomed: boolean } {
  if (currentLuck >= maxLuck) {
    return { newLuck: currentLuck, canSpend: false, isDoomed: true };
  }
  const newLuck = currentLuck + 1;
  const isDoomed = newLuck >= maxLuck;
  return {
    newLuck,
    canSpend: true,
    isDoomed,
  };
}
