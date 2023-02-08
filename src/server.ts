import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
  maxHttpBufferSize: 1e8
});

const port = process.env.PORT || 8000

server.listen(port, () => {
  console.log(`listening on *:${port}`);
})

export default io;
