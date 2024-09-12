export type User = {
  username: string;
  userId: string;
  socketId: string;
};

export type GameRoom = {
  gameRoomId: string;
  users: string[];
};
