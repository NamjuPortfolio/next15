import { useState, useEffect } from 'react';
interface PetitionStatus {
  status: number;
  timestamp: string;
}

interface WebSocketData {
  connectedusers: number;
  yoon: PetitionStatus;
  red: PetitionStatus;
}
export const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState<unknown>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      setData(receivedData);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = (message: unknown) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    }
  };

  return { isConnected, data: data as WebSocketData | null , sendMessage };
};