export type BoardConfig = {
  snakes: Record<number, number>;
  ladders: Record<number, number>;
  exactRollToWin: boolean;
  rollAgainOnSix: boolean;
};

export const defaultBoardConfig: BoardConfig = {
  // Map of snake head -> tail from classic board
  snakes: {
    16: 6,
    47: 26,
    49: 11,
    56: 53,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    98: 78,
  },
  // Map of ladder bottom -> top from classic board
  ladders: {
    1: 38,
    4: 14,
    9: 31,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    80: 100,
  },
  exactRollToWin: true,
  rollAgainOnSix: false,
};

export function getCellPosition(cellNumber: number, boardSize: number = 10) {
  if (cellNumber < 1) cellNumber = 1;
  if (cellNumber > boardSize * boardSize) cellNumber = boardSize * boardSize;

  const zeroIndexed = cellNumber - 1;
  const rowFromBottom = Math.floor(zeroIndexed / boardSize);
  const isRowReversed = rowFromBottom % 2 !== 0;
  
  const colFromLeft = zeroIndexed % boardSize;
  const col = isRowReversed ? (boardSize - 1) - colFromLeft : colFromLeft;
  
  const row = (boardSize - 1) - rowFromBottom;

  return { x: col, y: row };
}
