import { Socket } from "socket.io";
import { UserManger } from "../lib/store";
import { User } from "../types/user";

export const userService = (socket: Socket) => {
  const userManager = UserManger.getInstance();

  socket.on("new-user", (data) => {
    const userData: User = {
      ...data,
      socketId: socket.id,
    };

    userManager.addUser(userData);
  });

  socket.on("disconnect", () => {
    userManager.removeUser(socket.id);
  });
};
