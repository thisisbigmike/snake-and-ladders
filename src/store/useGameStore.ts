import { create } from 'zustand';
import type { BoardConfig } from '../config/boardConfig';
import { defaultBoardConfig } from '../config/boardConfig';
import { calculateMove, checkWin, resolveSpecialCells, rollDice } from '../engine/gameEngine';

export type GamePhase = 'IDLE' | 'ROLLING' | 'ROLLED' | 'MOVING' | 'RESOLVING' | 'CHECK_WIN' | 'GAME_OVER';

export type Player = {
  id: string;
  name: string;
  position: number;
  color: string;
};

export type GameState = {
  players: Player[];
  currentTurnIndex: number;
  diceResult: number | null;
  phase: GamePhase;
  winner: Player | null;
  config: BoardConfig;
  soundEnabled: boolean;
  
  // Actions
  setupGame: (names: string[]) => void;
  rollDice: () => void;
  moveToken: () => void;
  finishMoving: () => void;
  finishResolving: () => void;
  toggleSound: () => void;
};

const DEFAULT_COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#22c55e', // Green
  '#eab308', // Yellow
  '#a855f7', // Purple
  '#f97316', // Orange
  '#ec4899', // Pink
  '#06b6d4', // Cyan
];

export const useGameStore = create<GameState>((set, get) => ({
  players: [],
  currentTurnIndex: 0,
  diceResult: null,
  phase: 'IDLE',
  winner: null,
  config: defaultBoardConfig,
  soundEnabled: true,

  setupGame: (names: string[]) => {
    const players: Player[] = names.map((name, i) => ({
      id: `p${i + 1}`,
      name: name.trim() || `Player ${i + 1}`,
      position: 1, // Start at cell 1
      color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
    }));

    set({
      players,
      currentTurnIndex: 0,
      diceResult: null,
      phase: 'IDLE',
      winner: null,
    });
  },

  rollDice: () => {
    const state = get();
    if (state.phase !== 'IDLE' || state.winner) return;

    const result = rollDice();
    
    set({ phase: 'ROLLING', diceResult: result });

    // Transition to ROLLED after roll animation time
    setTimeout(() => {
      set({ phase: 'ROLLED' });
    }, 600);
  },

  moveToken: () => {
    const state = get();
    if (state.phase !== 'ROLLED') return;

    const currentPlayer = state.players[state.currentTurnIndex];
    const newPosition = calculateMove(currentPlayer.position, state.diceResult!, state.config);
    
    set((draft) => {
      const newPlayers = [...draft.players];
      newPlayers[draft.currentTurnIndex] = {
        ...currentPlayer,
        position: newPosition
      };
      return { players: newPlayers, phase: 'MOVING' };
    });
  },

  finishMoving: () => {
    const state = get();
    if (state.phase !== 'MOVING') return;

    set({ phase: 'RESOLVING' });

    // In RESOLVING phase, we check for snakes and ladders.
    // Transition after a small delay so user sees they landed on it first
    setTimeout(() => {
      const stateAfterMove = get();
      const currentPlayer = stateAfterMove.players[stateAfterMove.currentTurnIndex];
      const resolvedPosition = resolveSpecialCells(currentPlayer.position, stateAfterMove.config);

      if (resolvedPosition !== currentPlayer.position) {
        // We moved via snake or ladder
        set((draft) => {
          const newPlayers = [...draft.players];
          newPlayers[draft.currentTurnIndex] = {
            ...currentPlayer,
            position: resolvedPosition
          };
          return { players: newPlayers, phase: 'CHECK_WIN' };
        });
      } else {
        set({ phase: 'CHECK_WIN' });
      }
    }, 400); // Small pause before snake/ladder takes effect
  },

  finishResolving: () => {
    // This action can be called if we want to delay CHECK_WIN until after ladder animation finishes.
    // The Token component will call this when its animation completes and phase === 'CHECK_WIN'.
    const state = get();
    if (state.phase !== 'CHECK_WIN') return;

    const currentPlayer = state.players[state.currentTurnIndex];
    if (checkWin(currentPlayer.position)) {
      set({ phase: 'GAME_OVER', winner: currentPlayer });
    } else {
      // Next turn
      const isRollAgain = state.config.rollAgainOnSix && state.diceResult === 6;
      
      set((draft) => ({
        phase: 'IDLE',
        currentTurnIndex: isRollAgain ? draft.currentTurnIndex : (draft.currentTurnIndex + 1) % draft.players.length
      }));
    }
  },
  
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled }))
}));
