import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { Dices, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

const DICE_FACES: Record<number, React.ElementType> = {
  1: Dice1,
  2: Dice2,
  3: Dice3,
  4: Dice4,
  5: Dice5,
  6: Dice6,
};

export const Dice: React.FC = () => {
  const { rollDice, moveToken, diceResult, phase, winner, currentTurnIndex, players } = useGameStore();

  const isRolling = phase === 'ROLLING';
  const canRoll = phase === 'IDLE' && !winner;
  const canMove = phase === 'ROLLED';
  
  const CurrentDiceIcon = diceResult ? DICE_FACES[diceResult] : Dices;
  const currentPlayer = players[currentTurnIndex];

  const handleRoll = () => {
    if (canRoll) {
      rollDice();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <button
        onClick={canRoll ? handleRoll : undefined}
        disabled={!canRoll}
        className={`relative w-24 h-24 rounded-2xl flex items-center justify-center transition-all shadow-lg
          ${canRoll ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'}
        `}
        style={{
          backgroundColor: (canRoll || canMove) ? currentPlayer?.color || 'var(--primary)' : 'var(--muted)',
          color: (canRoll || canMove) ? '#ffffff' : 'var(--muted-foreground)',
          opacity: (canRoll || canMove || isRolling) ? 1 : 0.7,
        }}
      >
        <AnimatePresence mode="wait">
          {isRolling ? (
            <motion.div
              key="rolling"
              initial={{ rotate: 0, scale: 0.8 }}
              animate={{ rotate: 360, scale: 1.2 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
            >
              <Dices size={48} />
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <CurrentDiceIcon size={48} strokeWidth={1.5} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {canMove && (
        <button
          onClick={moveToken}
          className="px-8 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 shadow-md animate-in slide-in-from-bottom-2 active:scale-95 transition-all"
        >
          Move Token
        </button>
      )}
      
      <div className="text-sm font-medium text-muted-foreground text-center h-5">
        {canRoll ? `${currentPlayer?.name} Ready to Roll` : 
         isRolling ? 'Rolling...' : 
         canMove ? `Move ${diceResult} spaces` : 
         'Moving...'}
      </div>
    </div>
  );
};

