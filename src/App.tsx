import React, { useEffect } from 'react';
import { Board } from './components/Board';
import { Dice } from './components/Dice';
import { GameSettings } from './components/GameSettings';
import { useGameStore } from './store/useGameStore';

function App() {
  const players = useGameStore((state) => state.players);
  const phase = useGameStore((state) => state.phase);
  const finishMoving = useGameStore((state) => state.finishMoving);
  const finishResolving = useGameStore((state) => state.finishResolving);

  const isGameActive = players.length > 0;

  // We need to drive the state machine forward when phase changes and no user input is required
  useEffect(() => {
    // When MOVING, wait for token animation to finish then move to RESOLVING
    if (phase === 'MOVING') {
      const timer = setTimeout(() => {
        finishMoving();
      }, 400); // Wait for Framer Motion spring to settle
      return () => clearTimeout(timer);
    }

    // When CHECK_WIN, check win condition and move to next turn
    if (phase === 'CHECK_WIN') {
      const timer = setTimeout(() => {
        finishResolving();
      }, 100); 
      return () => clearTimeout(timer);
    }
  }, [phase, finishMoving, finishResolving]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Game Board */}
        <div className="lg:col-span-8 flex justify-center items-center order-2 lg:order-1">
          {isGameActive ? (
            <Board />
          ) : (
            <div className="w-full max-w-2xl aspect-square bg-muted/20 border-2 border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground">
              Select players to reveal the board
            </div>
          )}
        </div>

        {/* Right Column: Settings & Dice */}
        <div className="lg:col-span-4 flex flex-col items-center space-y-8 order-1 lg:order-2">
          <GameSettings />
          
          {isGameActive && (
            <div className="bg-card p-8 rounded-2xl shadow-lg border border-border w-full max-w-sm flex justify-center">
              <Dice />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
