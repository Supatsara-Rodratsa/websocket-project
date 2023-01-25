import { Server, Socket } from "socket.io";
import { defineNuxtModule } from "@nuxt/kit";
import { UserInfo } from "~~/library/interfaces";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const userMap = new Map<String, UserInfo>();

function buildMessage(id: string, newMessage: string) {
  // convert to POJO (Plain Old Javascript Object)
  // information sent thru the socket has to be able to be stringified & parsed
  // (JSON.stringify, JSON.parse)
  return { id: "1", message: newMessage };
}

function joinGroupChat(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) {
  socket.on("newUser", function getNewUserInfo(user: UserInfo) {
    userMap.set(socket.id, user);

    setTimeout(() => {
      socket.emit(
        "message",
        buildMessage(socket.id, `welcome ${getUserName(socket.id)}`)
      );
      socket.broadcast.emit(
        "message",
        buildMessage(socket.id, `${getUserName(socket.id)} joined`)
      );
    });
  });
}

function leftGroupChat(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) {
  socket.on("disconnecting", () => {
    console.log("disconnected", socket.id);
    socket.broadcast.emit(
      "message",
      buildMessage(socket.id, `${getUserName(socket.id)} left`)
    );
  });
}

function getUserName(id: string) {
  return userMap.get(id)?.username;
}

export default defineNuxtModule({
  setup(_, nuxt) {
    nuxt.hook("listen", (server) => {
      console.log("Socket listen", server.address(), server.eventNames());
      const io = new Server(server);

      nuxt.hook("close", () => io.close());

      io.on("connection", (socket) => {
        console.log("Connection", socket.id);
      });

      io.on("connect", (socket) => {
        if (!userMap.get(socket.id)) {
          socket.emit("newUser", true);
        }

        joinGroupChat(socket);

        socket.on("message", function message(data) {
          console.log("message received: %s", data);
          socket.broadcast.emit("message", buildMessage(socket.id, data));
        });

        leftGroupChat(socket);
      });
    });
  },
});
