import { useState, useEffect } from 'react';


export interface WebSocketData {
  connectedusers: number;
  red: {
    status: number;
    timestamp: string;
  };
  yoon: {
    status: number;
    timestamp: string;
  };
  WaitCount: {
    nwait: number;
    real_time_left: number;
    timestamp: string;
  };
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