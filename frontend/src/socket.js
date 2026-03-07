import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL + "/meeting", {
  autoConnect: false,
  transports: ["websocket", "polling"], // 👈 Ye line yahan bhi add karni hai
  withCredentials: true,
});

export default socket;