import { GameRoom, User } from "../types/index";

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
        (user) => user.socketId !== socketId,
      );
    }
    console.log(this.connectedUsers);
  }

  removeUserById(userId: string) {
    const existingUser = this.getUserById(userId);
    if (existingUser) {
      this.connectedUsers = this.connectedUsers.filter(
        (user) => user.userId !== userId,
      );
    }
  }
}

export class GameManager {
  private static instance: GameManager;
  private gameRooms: GameRoom[] = [];

  static getInstance() {
    if (GameManager.instance) {
      return GameManager.instance;
    }

    GameManager.instance = new GameManager();
    return GameManager.instance;
  }

  addGameRoom(gameRoom: GameRoom) {
    this.gameRooms.push(gameRoom);
    console.log(this.gameRooms);
  }

  removeGameRoom(roomId: string) {
    const existingRoom = this.getRoom(roomId);

    if (!existingRoom) {
      return;
    }

    this.gameRooms = this.gameRooms.filter(
      (gameRoom) => gameRoom.gameRoomId !== existingRoom.gameRoomId,
    );
  }

  getRoom(roomId: string) {
    return this.gameRooms.find((gameRoom) => gameRoom.gameRoomId === roomId);
  }

  addUserToRoom(roomId: string, userId: string) {
    const existingRoom = this.getRoom(roomId);

    if (!existingRoom) {
      return;
    }

    const updatedRoomDetails: GameRoom = {
      ...existingRoom,
      users: [...existingRoom.users, userId],
    };

    this.removeGameRoom(roomId);
    this.addGameRoom(updatedRoomDetails);
  }
}
