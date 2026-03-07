import { io } from "socket.io-client";

const aiSocket = io(import.meta.env.VITE_API_URL + "/ai", {
  autoConnect: false,
});

export default aiSocket;
