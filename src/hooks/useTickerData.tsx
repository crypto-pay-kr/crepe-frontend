// hooks/useTickerData.ts
import { useEffect, useState } from "react";
import { useWebSocket } from "@/context/WebSocketContext";

export interface TickerData {
  type: "ticker";
  code: string;
  trade_price: number;
  signed_change_rate: number;
  change: "RISE" | "FALL" | "EVEN";
  [key: string]: any;
}

export function useTickerData() {
  const { socket } = useWebSocket();
  const [tickerData, setTickerData] = useState<Record<string, TickerData>>({});

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const blob = event.data;
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result as string) as TickerData;
          if (parsed.type === "ticker") {
            setTickerData((prev) => ({
              ...prev,
              [parsed.code]: parsed,
            }));
          }
        } catch (err) {
          console.error("WebSocket parsing error:", err);
        }
      };


      reader.readAsText(blob);
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket]);

  return tickerData;
}