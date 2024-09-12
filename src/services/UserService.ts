import { Socket } from "socket.io";
import { GameManager, UserManger } from "../lib/store";
import { User } from "../types/index";

export const userService = (socket: Socket) => {
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
    userManager.removeUser(socket.id);
  });
};
