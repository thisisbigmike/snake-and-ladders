import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { getCellPosition } from '../config/boardConfig';
import { Snake, Ladder } from './BoardOverlays';
import { Token } from './Token';

const CELL_COLORS = [
  'bg-[#ffea00]', // Vibrant Yellow
  'bg-[#ffffff]', // White
  'bg-[#ef4444]', // Bright Red
  'bg-[#3b82f6]', // Bright Blue
  'bg-[#22c55e]', // Bright Green
];

export const Board: React.FC = () => {
  const config = useGameStore((state) => state.config);
  const players = useGameStore((state) => state.players);

  // Generate an array of 1 to 100
  const cells = Array.from({ length: 100 }, (_, i) => i + 1);

  // A deterministic way to pick a color for a cell to make it look scattered
  const getCellColor = (cellNum: number, x: number, y: number) => {
    // The classic board has Yellow, White, Red, Blue, Green in a specific pseudo-pattern.
    // This formula ensures a nice scatter of the 5 colors.
    const index = (cellNum * 7 + x * 3 + y * 5) % 5;
    return CELL_COLORS[index];
  };

  return (
    <div className="relative w-full max-w-2xl aspect-square bg-card rounded-md shadow-2xl p-1 md:p-2 border-4 border-slate-800">
      <div className="relative w-full h-full bg-slate-900 overflow-hidden shadow-inner border-2 border-slate-900">
        
        {/* Render Cells */}
        {cells.map((cellNum) => {
          const { x, y } = getCellPosition(cellNum);
          
          return (
            <div
              key={cellNum}
              className={`absolute flex p-1 md:p-2 text-xs md:text-sm font-bold border border-slate-800/20 text-slate-900
                ${getCellColor(cellNum, x, y)}`}
              style={{
                left: `${x * 10}%`,
                top: `${y * 10}%`,
                width: '10%',
                height: '10%',
                // Align text based on movement direction (like the classic board)
                justifyContent: (y % 2 !== 0) ? 'flex-end' : 'flex-start',
              }}
            >
              <span className="opacity-80">{cellNum}</span>
            </div>
          );
        })}

        {/* Render Ladders */}
        {Object.entries(config.ladders).map(([bottom, top]) => (
          <Ladder key={`ladder-${bottom}`} startCell={Number(bottom)} endCell={top} />
        ))}

        {/* Render Snakes */}
        {Object.entries(config.snakes).map(([head, tail], idx) => {
          // Pass an index to the snake so it can vary its appearance
          return <Snake key={`snake-${head}`} startCell={Number(head)} endCell={tail} index={idx} />
        })}

        {/* Render Tokens */}
        {players.map((player, index) => (
          <Token 
            key={player.id} 
            playerId={player.id} 
            position={player.position} 
            color={player.color} 
            index={index} 
          />
        ))}

      </div>
    </div>
  );
};
