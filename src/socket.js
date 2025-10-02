import { io } from "socket.io-client";

// Utilise l'URL dynamique de .env
const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"], // force WebSocket (optionnel)
});

export default socket;
