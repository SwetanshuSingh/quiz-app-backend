import { Server, Socket } from "socket.io";
import { GameManager, UserManger } from "../lib/store";
import { User } from "../types/index";

export const userService = (socket: Socket, io: Server) => {
  const userManager = UserManger.getInstance();
  const gameManager = GameManager.getInstance();

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
    socket.leave(joinedRoom.gameRoomId);

    const roomData = gameManager.getRoom(joinedRoom.gameRoomId);
    if (roomData?.users.length === 0) {
      gameManager.removeGameRoom(roomData.gameRoomId);
      return;
    }

    io.to(joinedRoom.gameRoomId).emit("game-state", roomData?.users.length);
    userManager.removeUser(socket.id);
  });
};
