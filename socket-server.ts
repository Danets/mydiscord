import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

const httpServer = createServer();

const io = new SocketIOServer(httpServer, {
  path: "/api/socket/io",
  cors: {
    origin: process.env.NEXT_PUBLIC_SITE_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🔌 New client has connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client has disconnected:", socket.id);
  });
});

httpServer.listen(3001, () => {
  console.log("🚀 Socket.IO is listining to port 3001");
});
