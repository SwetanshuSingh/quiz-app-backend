import { User } from "../types";

export class UserManger {
  private static instance: UserManger;
  private connectedUsers: User[] = [];

  static async getInstance() {
    if (UserManger.instance) {
      return UserManger.instance;
    }

    UserManger.instance = new UserManger();
    return UserManger.instance;
  }

  async addUser(user: User) {
    const existingUser = await this.getUserById(user.userId);

    if (existingUser) {
      await this.removeUserById(user.userId);
    }

    this.connectedUsers.push(user);
  }

  async getUser(socketId: string) {
    return this.connectedUsers.find((user) => user.socketId === socketId);
  }

  async getUserById(userId: string) {
    return this.connectedUsers.find((user) => user.userId === userId);
  }

  async removeUser(socketId: string) {
    const existingUser = await this.getUser(socketId);
    if (existingUser) {
      this.connectedUsers = this.connectedUsers.filter(
        (user) => user.socketId !== socketId
      );
    }
  }

  async removeUserById(userId: string) {
    const existingUser = await this.getUserById(userId);
    if (existingUser) {
      this.connectedUsers = this.connectedUsers.filter(
        (user) => user.userId !== userId
      );
    }
  }
}
