import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { PlayerSetup } from '../store/useGameStore';
import { Volume2, VolumeX, RotateCcw, Trophy, Plus, X, Bot, Share2, Globe, Copy, Check } from 'lucide-react';

export const GameSettings: React.FC = () => {
  const { setupGame, toggleSound, soundEnabled, winner, players, currentTurnIndex, roomId, setRoomId } = useGameStore();
  const [playerSetups, setPlayerSetups] = useState<PlayerSetup[]>([
    { name: 'Player 1', isBot: false },
    { name: 'Bot 1', isBot: true },
  ]);
  const [copied, setCopied] = useState(false);

  const isGameActive = players.length > 0;

  const handleAddPlayer = (isBot: boolean) => {
    if (playerSetups.length < 8) {
      setPlayerSetups([...playerSetups, { 
        name: isBot ? `Bot ${playerSetups.filter(p => p.isBot).length + 1}` : `Player ${playerSetups.filter(p => !p.isBot).length + 1}`, 
        isBot 
      }]);
    }
  };

  const handleRemovePlayer = (index: number) => {
    if (playerSetups.length > 1) {
      const newSetups = [...playerSetups];
      newSetups.splice(index, 1);
      setPlayerSetups(newSetups);
    }
  };

  const handleNameChange = (index: number, newName: string) => {
    const newSetups = [...playerSetups];
    newSetups[index].name = newName;
    setPlayerSetups(newSetups);
  };

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 9);
    setRoomId(newRoomId);
    // Update URL without refresh
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('room', newRoomId);
    window.history.pushState({}, '', newUrl);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isGameActive) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 p-6 md:p-8 bg-card rounded-2xl shadow-xl border border-border w-full max-w-sm">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Snakes & Ladders</h2>
          <p className="text-muted-foreground">Setup players & bots</p>
        </div>

        <div className="w-full space-y-3">
          {playerSetups.map((setup, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex-1 relative flex items-center bg-muted/50 border border-border rounded-lg focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                {setup.isBot && <Bot size={16} className="ml-3 text-primary" />}
                <input
                  type="text"
                  value={setup.name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  className="w-full px-3 py-2 bg-transparent focus:outline-none"
                  placeholder={setup.isBot ? `Bot ${index + 1}` : `Player ${index + 1}`}
                  maxLength={15}
                />
              </div>
              {playerSetups.length > 1 && (
                <button
                  onClick={() => handleRemovePlayer(index)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
          
          <div className="flex gap-2">
            {playerSetups.length < 8 && (
              <button
                onClick={() => handleAddPlayer(false)}
                className="flex-1 py-2 flex items-center justify-center space-x-2 border-2 border-dashed border-border text-muted-foreground rounded-lg hover:border-primary/50 hover:text-primary transition-colors text-sm"
              >
                <Plus size={16} />
                <span>Player</span>
              </button>
            )}
            {playerSetups.length < 8 && (
              <button
                onClick={() => handleAddPlayer(true)}
                className="flex-1 py-2 flex items-center justify-center space-x-2 border-2 border-dashed border-border text-muted-foreground rounded-lg hover:border-primary/50 hover:text-primary transition-colors text-sm"
              >
                <Bot size={16} />
                <span>Bot</span>
              </button>
            )}
          </div>
        </div>

        <div className="w-full pt-4 space-y-3 border-t border-border">
          <button
            onClick={() => setupGame(playerSetups)}
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg active:scale-[0.98]"
          >
            Start Local Game
          </button>
          
          {!roomId ? (
            <button
              onClick={handleCreateRoom}
              className="w-full py-3 bg-secondary text-secondary-foreground font-semibold rounded-xl hover:bg-secondary/80 transition-colors flex items-center justify-center space-x-2"
            >
              <Globe size={18} />
              <span>Create Online Room</span>
            </button>
          ) : (
            <div className="space-y-2">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">Online Room Active</div>
              <button
                onClick={handleCopyLink}
                className="w-full py-3 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary/20 transition-colors flex items-center justify-center space-x-2 border border-primary/20"
              >
                {copied ? <Check size={18} /> : <Share2 size={18} />}
                <span>{copied ? 'Link Copied!' : 'Share Room Link'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-sm space-y-6">
      {/* Room Link (if online) */}
      {roomId && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 overflow-hidden">
            <Globe size={16} className="text-primary flex-shrink-0" />
            <span className="text-xs font-mono truncate text-muted-foreground">Room: {roomId}</span>
          </div>
          <button onClick={handleCopyLink} className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors text-primary">
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      )}

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
                  <div className="flex items-center gap-2">
                    <span className={`font-medium truncate max-w-[120px] ${isCurrentTurn ? 'text-primary' : 'text-muted-foreground'}`}>
                      {player.name}
                    </span>
                    {player.isBot && (
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                        Bot
                      </span>
                    )}
                  </div>
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
          <h2 className="text-2xl font-bold truncate px-2">{winner.name} Wins!</h2>
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
          onClick={() => setupGame(players.map(p => ({ name: p.name, isBot: !!p.isBot })))}
          className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20 transition-colors"
        >
          <RotateCcw size={20} />
          <span>Restart</span>
        </button>
      </div>
    </div>
  );
};
