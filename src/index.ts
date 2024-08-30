import express, { Express } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

const PORT = 3001;
const app: Express = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A new user connected:", socket.id);
});

server.listen(PORT, async () => {
  console.log("Server Running on:", PORT);
});
