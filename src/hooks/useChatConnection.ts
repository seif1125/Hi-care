import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/useChatStore';

export const useChatConnection = (userId: string, token: string) => {
  const socketRef = useRef<WebSocket | null>(null);
  const addMessage = useChatStore((state) => state.addMessage);

  useEffect(() => {
    if (!token) return;

    // Connect with token in query params
    const ws = new WebSocket(`ws://localhost:8080?token=${token}`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      addMessage(data.senderId, {
        id: crypto.randomUUID(),
        senderId: data.senderId,
        text: data.text,
        timestamp: new Date()
      });
    };

    return () => ws.close();
  }, [token, addMessage]);

  const sendMessage = (recipientId: string, text: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ recipientId, text }));
    }
  };

  return { sendMessage };
};