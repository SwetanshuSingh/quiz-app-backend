import express, { Express } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { userService } from "./services/UserService";
import { gameService } from "./services/GameService";

const PORT = 3001;
const app: Express = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://quiz-app-three-delta-73.vercel.app",
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.emit("hello", { message: "Hello from the server!" });
  userService(socket, io);
  gameService(socket, io);
});

server.listen(PORT, async () => {
  console.log("Server Running on:", PORT);
});
