import io from "socket.io-client";
import { API_URL } from "./api.service";

const SOCKET_URL = API_URL.slice(0, -4);

// Export individual socket connections
export const chatSocket = io.connect(SOCKET_URL + "/chat");
export const cupsSocket = io.connect(SOCKET_URL + "/cups");
export const shuffleSocket = io.connect(SOCKET_URL + "/shuffle");
export const kingSocket = io.connect(SOCKET_URL + "/king");
export const rouletteSocket = io.connect(SOCKET_URL + "/roulette");
export const crashSocket = io.connect(SOCKET_URL + "/crash");

// Export all socket connections
export const sockets = [
  chatSocket,
  cupsSocket,
  shuffleSocket,
  kingSocket,
  rouletteSocket,
  crashSocket,
];

// Authenticate websocket connections
export const authenticateSockets = token => {
  console.log("[WS] Authenticating...");

  // Emit auth event for all sockets
  sockets.forEach(socket => socket.emit("auth", token));
};
