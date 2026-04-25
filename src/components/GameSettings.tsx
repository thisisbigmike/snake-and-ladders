import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Volume2, VolumeX, RotateCcw, Trophy, Plus, X } from 'lucide-react';

export const GameSettings: React.FC = () => {
  const { setupGame, toggleSound, soundEnabled, winner, players, currentTurnIndex } = useGameStore();
  const [playerNames, setPlayerNames] = useState<string[]>(['Player 1', 'Player 2']);

  const isGameActive = players.length > 0;

  const handleAddPlayer = () => {
    if (playerNames.length < 8) {
      setPlayerNames([...playerNames, `Player ${playerNames.length + 1}`]);
    }
  };

  const handleRemovePlayer = (index: number) => {
    if (playerNames.length > 1) {
      const newNames = [...playerNames];
      newNames.splice(index, 1);
      setPlayerNames(newNames);
    }
  };

  const handleNameChange = (index: number, newName: string) => {
    const newNames = [...playerNames];
    newNames[index] = newName;
    setPlayerNames(newNames);
  };

  if (!isGameActive) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 p-6 md:p-8 bg-card rounded-2xl shadow-xl border border-border w-full max-w-sm">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Snakes & Ladders</h2>
          <p className="text-muted-foreground">Add players to start</p>
        </div>

        <div className="w-full space-y-3">
          {playerNames.map((name, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder={`Player ${index + 1}`}
                  maxLength={15}
                />
              </div>
              {playerNames.length > 1 && (
                <button
                  onClick={() => handleRemovePlayer(index)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  aria-label="Remove player"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
          
          {playerNames.length < 8 && (
            <button
              onClick={handleAddPlayer}
              className="w-full py-2 flex items-center justify-center space-x-2 border-2 border-dashed border-border text-muted-foreground rounded-lg hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Plus size={18} />
              <span>Add Player</span>
            </button>
          )}
        </div>

        <button
          onClick={() => setupGame(playerNames)}
          disabled={playerNames.length === 0}
          className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-sm space-y-6">
      {/* Player Roster */}
      <div className="bg-card rounded-2xl shadow-lg border border-border p-4 space-y-3">
        <h3 className="font-semibold text-lg flex items-center justify-between">
          <span>Players</span>
          {winner && <span className="text-sm px-2 py-1 bg-token-4/20 text-token-4 rounded-md">Game Over</span>}
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {players.map((player, index) => {
            const isCurrentTurn = index === currentTurnIndex && !winner;
            return (
              <div 
                key={player.id}
                className={`flex items-center justify-between p-2 rounded-lg transition-colors
                  ${isCurrentTurn ? 'bg-primary/5 border border-primary/20' : 'bg-transparent'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm flex-shrink-0" 
                    style={{ backgroundColor: player.color }} 
                  />
                  <span className={`font-medium truncate max-w-[120px] ${isCurrentTurn ? 'text-primary' : 'text-muted-foreground'}`} title={player.name}>
                    {player.name}
                  </span>
                </div>
                <div className="text-sm font-semibold flex-shrink-0">
                  Cell {player.position}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Winner Display */}
      {winner && (
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center space-y-3 animate-in fade-in zoom-in">
          <Trophy className="w-12 h-12 mx-auto text-primary" />
          <h2 className="text-2xl font-bold truncate px-2" title={winner.name}>{winner.name} Wins!</h2>
        </div>
      )}

      {/* Controls */}
      <div className="flex space-x-3">
        <button
          onClick={toggleSound}
          className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/80 transition-colors"
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
        </button>
        <button
          onClick={() => setupGame(players.map(p => p.name))} // Restart with same names
          className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20 transition-colors"
        >
          <RotateCcw size={20} />
          <span>Restart</span>
        </button>
      </div>
    </div>
  );
};
