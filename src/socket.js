import { io } from "socket.io-client";
import {host} from "./utils/APIRoutes"
// const socket = io(host, {
//   reconnectionDelayMax: 10000,
//   path: "/socket/main",
//   transports: ["websocket"],
//   });

const socket = io(host, {
  reconnectionDelayMax: 10000,
  });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
