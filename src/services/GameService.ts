import { Server, Socket } from "socket.io";
import { GameManager, UserManger } from "../lib/store";
import { GameRoom } from "../types";

export const gameService = (socket: Socket, io: Server) => {
  const gameManager = GameManager.getInstance();
  const userManager = UserManger.getInstance();

  socket.on("create-game-room", (roomId: string) => {
    const userDetails = userManager.getUser(socket.id);

    if (!userDetails) {
      console.log("User not found while creating game!");
      return;
    }

    const existingRoom = gameManager.getRoom(roomId);
    if (existingRoom) {
      console.log("Invalid Room Id");
      return;
    }

    const gameRoomData: GameRoom = {
      gameRoomId: roomId,
      users: [userDetails.userId],
    };

    gameManager.addGameRoom(gameRoomData);
    socket.join(roomId);
    console.log("Game room created");
  });

  socket.on("join-game-room", (roomId: string) => {
    const userDetails = userManager.getUser(socket.id);

    if (!userDetails) {
      console.log("User not found while joining the game!");
      return;
    }

    const existingRoom = gameManager.getRoom(roomId);

    if (!existingRoom) {
      console.log("Room not found!");
      return;
    }

    gameManager.addUserToRoom(roomId, userDetails.userId);

    socket.join(roomId);
    console.log("Game room joined");
  });

  socket.on("get-game-state", (roomId: string) => {
    console.log("Received Request");
    const existingRoom = gameManager.getRoom(roomId);
    const connectedUsers = existingRoom?.users.length;

    io.to(roomId).emit("game-state", connectedUsers);
  });
};
