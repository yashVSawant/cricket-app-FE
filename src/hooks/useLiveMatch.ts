import { useEffect, useState, useCallback } from 'react';
import { getSocket } from '@/lib/socket';
import { Match, Delivery } from '@/types';

interface UseLiveMatchReturn {
  match: Match | null;
  lastDelivery: Delivery | null;
  isConnected: boolean;
  joinRoom: () => void;
  leaveRoom: () => void;
}

export function useLiveMatch(
  matchId: string,
  initialMatch: Match | null = null,
): UseLiveMatchReturn {
  const [match, setMatch] = useState<Match | null>(initialMatch);
  const [lastDelivery, setLastDelivery] = useState<Delivery | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const socket = getSocket();

  const joinRoom = useCallback(() => {
    if (!matchId) return;
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit('join:match', { matchId });
  }, [matchId, socket]);

  const leaveRoom = useCallback(() => {
    if (!matchId) return;
    socket.emit('leave:match', { matchId });
  }, [matchId, socket]);

  useEffect(() => {
    if (initialMatch) {
      setMatch(initialMatch);
    }
  }, [initialMatch]);

  useEffect(() => {
    if (!matchId) return;

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      setIsConnected(true);
      socket.emit('join:match', { matchId });
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onDeliveryPosted = (data: { match: Match; delivery: Delivery }) => {
      setMatch(data.match);
      setLastDelivery(data.delivery);
    };

    const onDeliveryUndone = (data: { match: Match }) => {
      setMatch(data.match);
      setLastDelivery(null);
    };

    const onMatchUpdated = (updatedMatch: Match) => {
      setMatch(updatedMatch);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('delivery:posted', onDeliveryPosted);
    socket.on('delivery:undone', onDeliveryUndone);
    socket.on('match:updated', onMatchUpdated);

    if (socket.connected) {
      setIsConnected(true);
      socket.emit('join:match', { matchId });
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('delivery:posted', onDeliveryPosted);
      socket.off('delivery:undone', onDeliveryUndone);
      socket.off('match:updated', onMatchUpdated);
      socket.emit('leave:match', { matchId });
    };
  }, [matchId, socket]);

  return {
    match,
    lastDelivery,
    isConnected,
    joinRoom,
    leaveRoom,
  };
}
