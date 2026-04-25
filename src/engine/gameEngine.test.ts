import { describe, it, expect } from 'vitest';
import { calculateMove, checkWin, resolveSpecialCells } from './gameEngine';
import { defaultBoardConfig } from '../config/boardConfig';

describe('Game Engine - Pure Logic', () => {
  it('should calculate basic moves correctly', () => {
    expect(calculateMove(1, 4, defaultBoardConfig)).toBe(5);
    expect(calculateMove(10, 6, defaultBoardConfig)).toBe(16);
  });

  it('should handle bounce-back logic at the end of the board', () => {
    // Current 98, roll 4 => 102. Overshoot by 2. Bounce back: 100 - 2 = 98.
    expect(calculateMove(98, 4, defaultBoardConfig)).toBe(98);
    // Current 99, roll 5 => 104. Overshoot by 4. Bounce back: 100 - 4 = 96.
    expect(calculateMove(99, 5, defaultBoardConfig)).toBe(96);
  });

  it('should not bounce back if exactRollToWin is false', () => {
    const config = { ...defaultBoardConfig, exactRollToWin: false };
    expect(calculateMove(98, 4, config)).toBe(100);
  });

  it('should identify winning positions', () => {
    expect(checkWin(100)).toBe(true);
    expect(checkWin(99)).toBe(false);
    expect(checkWin(101)).toBe(false);
  });

  it('should resolve ladders', () => {
    // Ladder at 1 goes to 38
    expect(resolveSpecialCells(1, defaultBoardConfig)).toBe(38);
    // Not a ladder
    expect(resolveSpecialCells(3, defaultBoardConfig)).toBe(3);
  });

  it('should resolve snakes', () => {
    // Snake at 16 goes to 6
    expect(resolveSpecialCells(16, defaultBoardConfig)).toBe(6);
  });
});
