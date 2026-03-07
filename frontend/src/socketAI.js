import { io } from "socket.io-client";

const aiSocket = io(import.meta.env.VITE_SOCKET_URL + "/ai", {
  autoConnect: false,
  transports: ["websocket", "polling"], // 👈 Ye line add karni hai (websocket first)
  withCredentials: true, // 👈 Ye bhi safe side ke liye add kar do
});

export default aiSocket;