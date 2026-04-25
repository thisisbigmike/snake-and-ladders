import React from 'react';
import { motion } from 'framer-motion';
import { getCellPosition } from '../config/boardConfig';
import { useGameStore } from '../store/useGameStore';

interface TokenProps {
  playerId: string;
  position: number;
  color: string;
  index: number;
}

export const Token: React.FC<TokenProps> = ({ position, color, index }) => {
  const { x, y } = getCellPosition(position);
  const phase = useGameStore((state) => state.phase);

  // Each token is slightly offset based on its index so they don't perfectly overlap
  const offsetX = (index % 2) * 20 - 10;
  const offsetY = Math.floor(index / 2) * 20 - 10;

  // We are using a 10x10 viewBox mapping. So each cell is 10x10 units in our SVG or relative container.
  // If we map this to percentages of the parent container:
  const left = `${(x * 10) + 5}%`;
  const top = `${(y * 10) + 5}%`;

  return (
    <motion.div
      initial={false}
      animate={{
        left,
        top,
        x: offsetX,
        y: offsetY,
      }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 14,
        mass: 0.8,
      }}
      onAnimationComplete={() => {
        if (phase === 'CHECK_WIN') {
          // If we finished animating to the final spot after resolving snakes/ladders, we can finish the turn
          // Wait, this fires for every token. We should probably let the game store handle the timeout or check if this token is the current player.
          // Since the phase will be changed by finishResolving, it's safer to let the main loop or a single effect handle it.
          // Actually, let's just let App.tsx or useGameStore handle the delay so we don't have multiple tokens triggering it.
        }
      }}
      className="absolute w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
      style={{ backgroundColor: color, zIndex: 10 + index }}
    />
  );
};
