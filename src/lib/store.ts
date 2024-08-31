import { User } from "../types/user";

export class UserManger {
  private static instance: UserManger;
  private connectedUsers: User[] = [];

  static getInstance() {
    if (UserManger.instance) {
      return UserManger.instance;
    }

    UserManger.instance = new UserManger();
    return UserManger.instance;
  }

  addUser(user: User) {
    const existingUser = this.getUserById(user.userId);

    if (existingUser) {
      this.removeUserById(user.userId);
    }

    this.connectedUsers.push(user);
    console.log(this.connectedUsers);
  }

  getUser(socketId: string) {
    return this.connectedUsers.find((user) => user.socketId === socketId);
  }

  getUserById(userId: string) {
    return this.connectedUsers.find((user) => user.userId === userId);
  }

  removeUser(socketId: string) {
    const existingUser = this.getUser(socketId);
    if (existingUser) {
      this.connectedUsers = this.connectedUsers.filter(
        (user) => user.socketId !== socketId
      );
    }
    console.log(this.connectedUsers);
  }

  removeUserById(userId: string) {
    const existingUser = this.getUserById(userId);
    if (existingUser) {
      this.connectedUsers = this.connectedUsers.filter(
        (user) => user.userId !== userId
      );
    }
  }
}
