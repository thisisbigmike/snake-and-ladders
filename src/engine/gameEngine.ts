import type { BoardConfig } from '../config/boardConfig';

export type GameState = {
  currentPosition: number;
  diceResult: number;
};

/**
 * Calculates the final position after rolling the dice, handling bounce-back logic.
 */
export function calculateMove(currentPosition: number, diceResult: number, config: BoardConfig): number {
  const targetPosition = currentPosition + diceResult;
  
  if (targetPosition === 100) {
    return 100;
  }
  
  if (targetPosition > 100) {
    if (config.exactRollToWin) {
      // Bounce back
      const overShoot = targetPosition - 100;
      return 100 - overShoot;
    } else {
      return 100; // Not exact roll to win means you just stop at 100
    }
  }
  
  return targetPosition;
}

/**
 * Resolves snakes and ladders. Can be recursive if we want chained snakes/ladders,
 * but typical boards don't have chains. We'll do a simple lookup.
 */
export function resolveSpecialCells(position: number, config: BoardConfig): number {
  if (config.snakes[position]) {
    return config.snakes[position];
  }
  if (config.ladders[position]) {
    return config.ladders[position];
  }
  return position;
}

/**
 * True if the crypto dice roll should be used
 */
export function rollDice(): number {
  // Use crypto for randomness as per PRD
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  // array[0] is between 0 and 2^32 - 1
  return (array[0] % 6) + 1;
}

/**
 * Checks if a position is the winning position
 */
export function checkWin(position: number): boolean {
  return position === 100;
}
