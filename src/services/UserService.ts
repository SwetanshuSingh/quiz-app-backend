import { Server, Socket } from "socket.io";
import { GameManager, UserManger } from "../lib/store";
import { User } from "../types/index";

export const userService = (socket: Socket, io: Server) => {
  const userManager = UserManger.getInstance();
  const gameManager = GameManager.getInstance();

  socket.on("connection", () => {
    console.log("A new user has connected", socket.id);
  });

  socket.on("new-user", (data, callback) => {
    const userData: User = {
      ...data,
      userId: socket.id,
      socketId: socket.id,
    };

    userManager.addUser(userData);
    callback({
      status: "success",
    });
  });

  socket.on("disconnect", () => {
    const joinedRoom = gameManager.getRoomByUserId(socket.id);
    if (!joinedRoom) {
      userManager.removeUser(socket.id);
      return;
    }
    gameManager.removeUserFromRoom(joinedRoom.gameRoomId, socket.id);
    const roomData = gameManager.getRoom(joinedRoom.gameRoomId);
    userManager.removeUser(socket.id);
    io.to(joinedRoom.gameRoomId).emit("game-state", roomData?.users.length);
  });
};
