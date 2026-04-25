import { supabase } from '../lib/supabase';
import { useGameStore } from '../store/useGameStore';
import type { GameState } from '../store/useGameStore';

export const joinRoom = (roomId: string) => {
  const channel = supabase.channel(`room:${roomId}`, {
    config: {
      broadcast: { self: false },
    },
  });

  channel
    .on('broadcast', { event: 'state-update' }, ({ payload }) => {
      console.log('Received state update:', payload);
      useGameStore.getState().syncState(payload);
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Joined room: ${roomId}`);
      }
    });

  return channel;
};

export const broadcastState = (channel: any, state: Partial<GameState>) => {
  if (!channel) return;
  
  // We only broadcast essential state to avoid bloat
  const payload = {
    players: state.players,
    currentTurnIndex: state.currentTurnIndex,
    diceResult: state.diceResult,
    phase: state.phase,
    winner: state.winner,
  };

  channel.send({
    type: 'broadcast',
    event: 'state-update',
    payload,
  });
};
