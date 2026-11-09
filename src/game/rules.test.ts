import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateOutcome,
  evaluateRoll,
  calculateHarm,
  healHarm,
  calculateExpAddition,
  spendLuckPoint,
} from '../utils/dice.ts';

describe('Monstro da Semana Rules Engine', () => {
  describe('Roll Outcomes', () => {
    test('totals of 6 or less produce a falha and mark XP', () => {
      assert.equal(calculateOutcome(2), 'falha');
      assert.equal(calculateOutcome(6), 'falha');
      const evalRoll = evaluateRoll(2, 3, 0, 0); // 5
      assert.equal(evalRoll.outcome, 'falha');
      assert.equal(evalRoll.awardsXp, true);
    });

    test('totals between 7 and 9 produce a parcial (mixed success) without XP', () => {
      assert.equal(calculateOutcome(7), 'parcial');
      assert.equal(calculateOutcome(8), 'parcial');
      assert.equal(calculateOutcome(9), 'parcial');
      const evalRoll = evaluateRoll(4, 3, 1, 0); // 8
      assert.equal(evalRoll.outcome, 'parcial');
      assert.equal(evalRoll.awardsXp, false);
    });

    test('totals of 10 or 11 produce a sucesso', () => {
      assert.equal(calculateOutcome(10), 'sucesso');
      assert.equal(calculateOutcome(11), 'sucesso');
      const evalRoll = evaluateRoll(5, 5, 1, 0); // 11
      assert.equal(evalRoll.outcome, 'sucesso');
      assert.equal(evalRoll.awardsXp, false);
    });

    test('totals of 12+ produce avancado only when advanced move is unlocked', () => {
      assert.equal(calculateOutcome(12, false), 'sucesso');
      assert.equal(calculateOutcome(13, false), 'sucesso');
      assert.equal(calculateOutcome(12, true), 'avancado');
      assert.equal(calculateOutcome(14, true), 'avancado');
    });

    test('modifiers are added correctly', () => {
      const evalRoll = evaluateRoll(3, 3, 2, -1); // 6 + 2 - 1 = 7
      assert.equal(evalRoll.total, 7);
      assert.equal(evalRoll.outcome, 'parcial');
    });
  });

  describe('Harm & Health Track', () => {
    test('takes harm reduced by armor', () => {
      const res = calculateHarm(1, 3, 1); // 1 + (3 - 1) = 3
      assert.equal(res.netHarmTaken, 2);
      assert.equal(res.newHarm, 3);
      assert.equal(res.isUnstable, false);
      assert.equal(res.isFatal, false);
    });

    test('harm reaching 4+ triggers unstable wound', () => {
      const res = calculateHarm(2, 2, 0); // 2 + 2 = 4
      assert.equal(res.newHarm, 4);
      assert.equal(res.isUnstable, true);
    });

    test('harm reaching 8 is fatal/incapacitating', () => {
      const res = calculateHarm(6, 4, 1); // 6 + 3 = 9 clamped to 8
      assert.equal(res.newHarm, 8);
      assert.equal(res.isFatal, true);
    });

    test('healing below 4 removes unstable state', () => {
      const healed = healHarm(5, 3, true); // 5 - 3 = 2
      assert.equal(healed.newHarm, 2);
      assert.equal(healed.isUnstable, false);
    });

    test('healing while still 4+ maintains unstable state', () => {
      const healed = healHarm(6, 1, true); // 6 - 1 = 5
      assert.equal(healed.newHarm, 5);
      assert.equal(healed.isUnstable, true);
    });
  });

  describe('Experience & Level Up', () => {
    test('marks 5 exp boxes to trigger level up and carries remainder', () => {
      const step1 = calculateExpAddition(3, 1); // 4
      assert.equal(step1.newExp, 4);
      assert.equal(step1.levelUpsGained, 0);

      const step2 = calculateExpAddition(4, 2); // 6 => 1 level up, 1 exp remaining
      assert.equal(step2.newExp, 1);
      assert.equal(step2.levelUpsGained, 1);
    });
  });

  describe('Luck Burn Mechanism', () => {
    test('marking luck marks box until max is reached', () => {
      const res1 = spendLuckPoint(2, 7);
      assert.equal(res1.newLuck, 3);
      assert.equal(res1.canSpend, true);
      assert.equal(res1.isDoomed, false);

      const resDoomed = spendLuckPoint(6, 7);
      assert.equal(resDoomed.newLuck, 7);
      assert.equal(resDoomed.canSpend, true);
      assert.equal(resDoomed.isDoomed, true); // No luck left

      const resExhausted = spendLuckPoint(7, 7);
      assert.equal(resExhausted.canSpend, false);
    });
  });
});
