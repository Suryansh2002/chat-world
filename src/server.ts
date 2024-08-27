import { createServer } from "node:http";
import next from "next";
import { Server  } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents } from "./lib/types";
import { handleSocket } from "./websocket";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server<ClientToServerEvents,ServerToClientEvents,InterServerEvents>(httpServer);

  io.on("connection", (socket) => {
    handleSocket(socket);
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});