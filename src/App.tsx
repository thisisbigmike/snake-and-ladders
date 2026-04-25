import { useGameStore } from './store/useGameStore';
import { useEffect, useRef } from 'react';
import { joinRoom, broadcastState } from './services/roomService';
import { Board } from './components/Board';
import { Dice } from './components/Dice';
import { GameSettings } from './components/GameSettings';

function App() {
  const { phase, players, currentTurnIndex, rollDice, moveToken, finishMoving, finishResolving, winner, roomId, setRoomId } = useGameStore();
  const channelRef = useRef<any>(null);

  // Initialize room from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomFromUrl = params.get('room');
    if (roomFromUrl) {
      setRoomId(roomFromUrl);
    }
  }, [setRoomId]);

  // Setup Realtime Channel
  useEffect(() => {
    if (roomId) {
      channelRef.current = joinRoom(roomId);
      return () => {
        if (channelRef.current) channelRef.current.unsubscribe();
      };
    }
  }, [roomId]);

  // Broadcast state changes
  useEffect(() => {
    if (roomId && channelRef.current && phase !== 'MOVING' && phase !== 'RESOLVING') {
      // Only broadcast when it's our turn or we just rolled
      // For simplicity in this demo, we broadcast most state transitions
      broadcastState(channelRef.current, {
        players,
        currentTurnIndex,
        diceResult: useGameStore.getState().diceResult,
        phase,
        winner,
      });
    }
  }, [phase, players, currentTurnIndex, winner, roomId]);

  const isGameActive = players.length > 0;
  const currentPlayer = players[currentTurnIndex];
  const isBotTurn = currentPlayer?.isBot && !winner && isGameActive;

  // Bot logic
  useEffect(() => {
    if (!isBotTurn) return;

    let timer: ReturnType<typeof setTimeout>;

    if (phase === 'IDLE') {
      timer = setTimeout(() => {
        rollDice();
      }, 1000); // Wait 1s before bot rolls
    } else if (phase === 'ROLLED') {
      timer = setTimeout(() => {
        moveToken();
      }, 800); // Wait 800ms before bot moves
    }

    return () => clearTimeout(timer);
  }, [phase, isBotTurn, rollDice, moveToken]);

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
