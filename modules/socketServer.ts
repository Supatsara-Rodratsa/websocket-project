import { Server, Socket } from "socket.io";
import { defineNuxtModule } from "@nuxt/kit";
import { ChatInfo, UserInfo } from "~~/library/interfaces";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const userMap = new Map<String, UserInfo>();
const typing: Array<UserInfo | undefined> = [];
function buildMessage(
  user?: UserInfo,
  newMessage?: string,
  type?: "MessageLog" | "ImageLog"
): ChatInfo {
  return {
    user: user,
    message: newMessage,
    time: getCurrentTime(),
    type: type,
  };
}

function buildJoiningMessage(socketId: string, isBroadcast: boolean = false) {
  if (!isBroadcast) {
    return `Welcome ${getUserName(socketId)} to the group :)`;
  } else {
    return ` ${getUserName(socketId)} join the group`;
  }
}

function buildLeftMessage(socketId: string) {
  return ` ${getUserName(socketId)} left the group`;
}

function joinGroupChat(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) {
  socket.on("newUser", async function getNewUserInfo(user: UserInfo) {
    setTimeout(() => {
      userMap.set(socket.id, { ...user, id: socket.id, isOnline: true });
      socket.emit("userId", socket.id);
      socket.emit("activity", buildJoiningMessage(socket.id));
      socket.broadcast.emit("activity", buildJoiningMessage(socket.id, true));
      getAllMembers(socket);
      getAllMemberStatus(socket);
    });
  });
}

function disconnecting(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) {
  socket.on("disconnecting", () => {
    console.log("disconnected", socket.id);
    clearOnTyping(socket);
    const currentStatus = userMap.get(socket.id);
    if (currentStatus) {
      userMap.set(socket.id, { ...currentStatus, isOnline: false });
      getAllMemberStatus(socket);
    }
  });
}

function leftGroupChat(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) {
  socket.on("leftGroup", () => {
    clearOnTyping(socket);
    if (getUserName(socket.id)) {
      socket.broadcast.emit("activity", buildLeftMessage(socket.id));
      userMap.delete(socket.id);
      getAllMembers(socket);
      getAllMemberStatus(socket);
    }
  });
}

function getUserName(id: string) {
  return userMap.get(id)?.username;
}

function getCurrentTime() {
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${hour > 9 ? hour : "0" + hour}:${
    minute > 9 ? minute : "0" + minute
  }`;
}

function showMessage(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) {
  socket.on("message", function message(data) {
    console.log("message received: %s", data.text);
    getCurrentTime();
    if (userMap.get(socket.id) != undefined) {
      socket.broadcast.emit(
        "message",
        buildMessage(userMap.get(socket.id), data.text, data.type)
      );
    }
  });
}

function onTyping(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) {
  socket.on("onTyping", (isTyping) => {
    const index = typing.findIndex(
      (val) => val?.id === userMap.get(socket.id)?.id
    );
    if (isTyping) {
      if (index == -1) typing.push(userMap.get(socket.id));
    } else {
      if (index != -1) typing.splice(index, 1);
    }
    socket.emit("onTyping", typing);
    socket.broadcast.emit("onTyping", typing);
  });
}

function clearOnTyping(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) {
  const index = typing.findIndex(
    (val) => val?.id === userMap.get(socket.id)?.id
  );
  if (index != -1) {
    typing.splice(index, 1);
    socket.broadcast.emit("onTyping", typing);
  }
}

function getAllMembers(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) {
  socket.emit("members", `${userMap.size}`);
  socket.broadcast.emit("members", `${userMap.size}`);
}

function getAllMemberStatus(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) {
  const members: UserInfo[] = [];
  for (let value of userMap.values()) {
    members.push(value);
  }
  socket.emit("memberStatus", members);
  socket.broadcast.emit("memberStatus", members);
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

      io.on("connect", async (socket) => {
        joinGroupChat(socket);
        showMessage(socket);
        onTyping(socket);
        disconnecting(socket);
        leftGroupChat(socket);
      });
    });
  },
});
