import React from 'react';
import { getCellPosition } from '../config/boardConfig';

interface LadderProps {
  startCell: number;
  endCell: number;
}

interface SnakeProps {
  startCell: number;
  endCell: number;
  index: number;
}

export const Ladder: React.FC<LadderProps> = ({ startCell, endCell }) => {
  const start = getCellPosition(startCell);
  const end = getCellPosition(endCell);

  const x1 = (start.x * 10) + 5;
  const y1 = (start.y * 10) + 5;
  const x2 = (end.x * 10) + 5;
  const y2 = (end.y * 10) + 5;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);

  // Offset for the parallel rails
  const offset = 1.2;
  const px = -(dy / length) * offset;
  const py = (dx / length) * offset;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md" style={{ zIndex: 5 }}>
      <g stroke="#854d0e" strokeLinecap="round">
        {/* Shadow/Backing for the ladder */}
        <line x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} strokeWidth="4" className="opacity-20" />
        
        {/* Left rail */}
        <line x1={`${x1 + px}%`} y1={`${y1 + py}%`} x2={`${x2 + px}%`} y2={`${y2 + py}%`} strokeWidth="0.8" />
        {/* Right rail */}
        <line x1={`${x1 - px}%`} y1={`${y1 - py}%`} x2={`${x2 - px}%`} y2={`${y2 - py}%`} strokeWidth="0.8" />
        
        {/* Rungs */}
        <line 
          x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} 
          strokeWidth="2.5" 
          strokeDasharray="0 4" 
          strokeLinecap="butt"
        />
      </g>
    </svg>
  );
};

const SNAKE_COLORS = [
  '#22c55e', // Green
  '#eab308', // Yellow
  '#3b82f6', // Blue
  '#ef4444', // Red
];

export const Snake: React.FC<SnakeProps> = ({ startCell, endCell, index }) => {
  const head = getCellPosition(startCell);
  const tail = getCellPosition(endCell);

  const x1 = (head.x * 10) + 5;
  const y1 = (head.y * 10) + 5;
  const x2 = (tail.x * 10) + 5;
  const y2 = (tail.y * 10) + 5;

  const color = SNAKE_COLORS[index % SNAKE_COLORS.length];

  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  
  const dx = x2 - x1;
  const dy = y2 - y1;
  
  // Alternate curve direction based on index
  const curveDirection = index % 2 === 0 ? 1 : -1;
  const offsetAmount = 15;
  
  const cx = mx - dy * (offsetAmount / Math.sqrt(dx*dx + dy*dy)) * curveDirection;
  const cy = my + dx * (offsetAmount / Math.sqrt(dx*dx + dy*dy)) * curveDirection;

  // Path data for the curve
  const pathData = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-xl" style={{ zIndex: 6 }}>
      {/* Snake Outline */}
      <path 
        d={pathData}
        fill="none" 
        stroke="#1e293b" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
      />
      {/* Snake Body */}
      <path 
        d={pathData}
        fill="none" 
        stroke={color} 
        strokeWidth="1.8" 
        strokeLinecap="round" 
      />
      
      {/* Snake Pattern (dots) */}
      <path 
        d={pathData}
        fill="none" 
        stroke="#1e293b" 
        strokeWidth="0.8" 
        strokeDasharray="0 3"
        strokeLinecap="round" 
        className="opacity-50"
      />

      {/* Snake Head */}
      <circle cx={`${x1}%`} cy={`${y1}%`} r="1.8" fill={color} stroke="#1e293b" strokeWidth="0.4" />
      {/* Snake Eye */}
      <circle cx={`${x1}%`} cy={`${y1}%`} r="0.5" fill="white" />
      <circle cx={`${x1}%`} cy={`${y1}%`} r="0.2" fill="black" />
      
      {/* Snake Tongue */}
      <path 
        d={`M ${x1} ${y1} L ${x1 + 2} ${y1 - 2}`} 
        fill="none" 
        stroke="#ef4444" 
        strokeWidth="0.3" 
      />
    </svg>
  );
};
