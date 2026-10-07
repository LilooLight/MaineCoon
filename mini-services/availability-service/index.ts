import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer((req, res) => {
  // Health check endpoint
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, service: "cattery-availability", uptime: process.uptime() }));
    return;
  }
  res.writeHead(404);
  res.end("Not found");
});

const io = new Server(httpServer, {
  // DO NOT change the path — Caddy forwards based on it
  path: "/",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// In-memory availability store (synced with the main DB via periodic polling
// would be the production approach; here we simulate real-time events).
interface AvailabilityEvent {
  type: "kitten-reserved" | "kitten-available" | "kitten-adopted" | "litter-born" | "stats-update";
  kittenId?: string;
  kittenName?: string;
  message: string;
  timestamp: string;
}

const subscribers = new Set<string>();

io.on("connection", (socket) => {
  console.log(`[availability] client connected: ${socket.id}`);
  subscribers.add(socket.id);

  // Send a welcome snapshot of current "live" stats (simulated)
  socket.emit("availability:snapshot", {
    onlineViewers: subscribers.size,
    message: "Вы смотрите каталог в реальном времени",
    timestamp: new Date().toISOString(),
  });

  socket.on("subscribe", () => {
    socket.emit("availability:event", {
      type: "stats-update",
      message: `Сейчас онлайн: ${subscribers.size} ${subscribers.size === 1 ? "зритель" : "зрителей"}`,
      timestamp: new Date().toISOString(),
    } satisfies AvailabilityEvent);
  });

  // Broadcast a "viewing" event when a client opens a kitten detail
  socket.on("kitten:viewing", (data: { kittenId: string; kittenName: string }) => {
    // Notify other viewers that someone is looking at this kitten
    socket.broadcast.emit("availability:event", {
      type: "stats-update",
      kittenId: data.kittenId,
      kittenName: data.kittenName,
      message: `Кто-то сейчас смотрит котёнка «${data.kittenName}»`,
      timestamp: new Date().toISOString(),
    } satisfies AvailabilityEvent);
  });

  socket.on("disconnect", () => {
    subscribers.delete(socket.id);
    console.log(`[availability] client disconnected: ${socket.id}`);
  });

  socket.on("error", (err) => {
    console.error(`[availability] socket error (${socket.id}):`, err);
  });
});

// Simulated real-time events every ~45s to demonstrate the channel works.
// In production these would come from booking/admin mutations.
const DEMO_EVENTS: AvailabilityEvent[] = [
  { type: "stats-update", message: "Заводчик обновил фотографии помёта «Зима 2024»", timestamp: "" },
  { type: "stats-update", message: "Новый посетитель смотрит каталог", timestamp: "" },
];

let demoIndex = 0;
setInterval(() => {
  if (subscribers.size === 0) return;
  const ev = DEMO_EVENTS[demoIndex % DEMO_EVENTS.length];
  demoIndex++;
  io.emit("availability:event", {
    ...ev,
    timestamp: new Date().toISOString(),
  } satisfies AvailabilityEvent);
  console.log(`[availability] broadcast: ${ev.message}`);
}, 45000);

const PORT = 3003;
httpServer.listen(PORT, () => {
  console.log(`[availability] WebSocket service running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("[availability] SIGTERM, shutting down...");
  io.close(() => {
    httpServer.close(() => process.exit(0));
  });
});

process.on("SIGINT", () => {
  console.log("[availability] SIGINT, shutting down...");
  io.close(() => {
    httpServer.close(() => process.exit(0));
  });
});
