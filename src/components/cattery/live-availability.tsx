"use client";

import { useEffect, useState, useCallback } from "react";
import { io, type Socket } from "socket.io-client";
import { Badge } from "@/components/ui/badge";
import { Radio, Users } from "lucide-react";

interface LiveEvent {
  type: string;
  kittenId?: string;
  kittenName?: string;
  message: string;
  timestamp: string;
}

interface Snapshot {
  onlineViewers: number;
  message: string;
  timestamp: string;
}

/**
 * LiveAvailability — connects to the WebSocket mini-service (port 3003 via
 * the XTransformPort gateway param) and shows a live indicator with the
 * latest availability event + online viewer count.
 */
export function LiveAvailability({ kittenId, kittenName }: { kittenId?: string; kittenName?: string }) {
  const [connected, setConnected] = useState(false);
  const [viewers, setViewers] = useState<number | null>(null);
  const [latestEvent, setLatestEvent] = useState<LiveEvent | null>(null);

  useEffect(() => {
    // Connect via the Caddy gateway — path MUST be "/" with XTransformPort.
    const socket: Socket = io("/?XTransformPort=3003", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("subscribe");
    });

    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", () => setConnected(false));

    socket.on("availability:snapshot", (data: Snapshot) => {
      setViewers(data.onlineViewers);
    });

    socket.on("availability:event", (data: LiveEvent) => {
      setLatestEvent(data);
      if (data.type === "stats-update" && data.message.includes("онлайн:")) {
        const match = data.message.match(/(\d+)/);
        if (match) setViewers(parseInt(match[1], 10));
      }
    });

    // If a specific kitten is being viewed, broadcast that.
    if (kittenId && kittenName) {
      const emitViewing = () => socket.emit("kitten:viewing", { kittenId, kittenName });
      if (socket.connected) emitViewing();
      else socket.on("connect", emitViewing);
    }

    return () => {
      socket.disconnect();
    };
  }, [kittenId, kittenName]);

  if (!connected) {
    return (
      <Badge variant="outline" className="text-muted-foreground border-border">
        <Radio className="h-3 w-3 mr-1.5 animate-pulse" />
        Соединение...
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Badge className="bg-primary/10 text-primary border border-primary/30">
        <span className="relative flex h-2 w-2 mr-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        В эфире
      </Badge>
      {viewers !== null && viewers > 0 && (
        <Badge variant="outline" className="text-muted-foreground">
          <Users className="h-3 w-3 mr-1" />
          {viewers} {viewers === 1 ? "зритель" : viewers < 5 ? "зрителя" : "зрителей"}
        </Badge>
      )}
      {latestEvent && (
        <span className="text-xs text-muted-foreground italic line-clamp-1 max-w-[16rem]">
          {latestEvent.message}
        </span>
      )}
    </div>
  );
}
