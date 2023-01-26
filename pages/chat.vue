<script lang="ts" setup>
// const { $socket } = useNuxtApp();
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { storeToRefs } from "pinia";
import io, { Socket } from "socket.io-client";
import { ChatInfo, UserInfo } from "~~/library/interfaces";
import { userStore } from "~~/stores/users";

definePageMeta({
  middleware: ["middleware"],
});

const config = useRuntimeConfig();
const chatLog = reactive([] as Array<ChatInfo>);
const typingUsers = ref([] as Array<String>);
const text = ref("");
const useUserStore = userStore();
const { userAccount } = storeToRefs(useUserStore);
const { setUserId } = useUserStore;
const members = ref(0);
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
function addToChat(
  m: string,
  type: "ActivityLog" | "MessageLog",
  userInfo?: UserInfo,
  time?: string
) {
  const chat: ChatInfo = {
    user: userInfo,
    message: m,
    type: type,
    time: time,
  };
  chatLog.push(chat);
}

function send() {
  socket.emit("message", text.value);
  socket.emit("onTyping", false);
  addToChat(text.value, "MessageLog", userAccount.value); // optimistic UI
  text.value = "";
}

function onTyping() {
  console.log("Typing.....");
  socket.emit("onTyping", text.value !== "");
}

onMounted(() => {
  socket = io("ws://websocket-project.vercel.app/");
  socket.emit("newUser", userAccount.value);

  socket.on("userId", (id) => {
    setUserId(id);
  });

  socket.on("activity", (log) => {
    addToChat(log, "ActivityLog");
  });

  socket.on("message", (data: ChatInfo) => {
    if (data.user && data.message) {
      addToChat(data.message, "MessageLog", data.user, data.time);
    }
  });

  socket.on("onTyping", (users: UserInfo[]) => {
    typingUsers.value = [];
    users.forEach((user) => {
      if (user.id != userAccount.value.id && user.username) {
        typingUsers.value.push(user.username);
      }
    });
  });

  socket.on("members", (size) => {
    members.value = size;
  });
});

// onUnmounted(() => {
//   socket.disconnect(true);
// });
</script>
<template>
  <div class="relative">
    <img
      class="absolute bg-transparent opacity-60 z-0 -bottom-10 w-[300px]"
      src="~assets/images/sally.png"
    />
    <div
      class="flex justify-center items-center fixed top-0 w-screen p-5 h-20 bg-orange text-white font-bold text-[24px]"
    >
      Dani's Group ({{ members }})
    </div>
    <ChatLog
      class="mt-20 h-full relative bg-transparent z-10"
      :chat-log="chatLog"
      :typing-log="typingUsers"
    />
    <div
      class="flex justify-between fixed bottom-0 w-screen p-5 h-20 bg-darkYellow gap-2"
    >
      <input
        placeholder="Enter Message"
        v-model="text"
        @keyup="onTyping()"
        @keyup.enter="send"
        class="border-0 rounded-[30px] w-[90%] focus:outline-none p-2 px-4"
      />
      <button
        class="rounded-[8px] min-w-[80px] px-4 py-2 bg-orange text-white"
        @click="send"
      >
        SEND
      </button>
    </div>
  </div>
</template>
