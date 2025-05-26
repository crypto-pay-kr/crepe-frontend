// context/WebSocketContext.ts
"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

export interface TickerData {
  type: "ticker";
  code: string;
  trade_price: number;
  signed_change_rate: number;
  change: "RISE" | "FALL" | "EVEN";
  [key: string]: any;
}

interface WebSocketContextValue {
  socket: WebSocket | null;
}

const WebSocketContext = createContext<WebSocketContextValue>({ socket: null });

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("wss://api.upbit.com/websocket/v1");
    ws.binaryType = "blob";

    ws.onopen = () => {
      ws.send(
        JSON.stringify([
          { ticket: "ticker-stream" },
          { type: "ticker", codes: ["KRW-XRP", "KRW-USDT", "KRW-SOL"] }
        ])
      );

      setSocket(ws);
    };


    return () => {
      ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket }}>
  {children}
  </WebSocketContext.Provider>
);
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}