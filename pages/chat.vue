<script lang="ts" setup>
// const { $socket } = useNuxtApp();
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { storeToRefs } from "pinia";
import io, { Socket } from "socket.io-client";
import { userStore } from "~~/stores/users";

definePageMeta({
  middleware: ["middleware"],
});

const config = useRuntimeConfig();
const chatLog = ref("");
const text = ref("");
const useUserStore = userStore();
const { userAccount } = storeToRefs(useUserStore);
let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
function addToChat(m: string) {
  chatLog.value += `<div>${m}</div>`;
}
function send() {
  socket.emit("message", text.value);
  addToChat(text.value); // optimistic UI
  text.value = "";
}

onMounted(() => {
  socket = io(config.public.wssUrl); // "http://192.168.20.31:3000");
  console.log("URL:: ", config.public.wssUrl);
  socket.emit("newUser", userAccount.value);

  socket.on("message", (data) => {
    console.log(data, "<<<<");
    addToChat(data.message);
  });
});
</script>
<template>
  <div class="relative">
    <div
      class="flex justify-center items-center fixed top-0 w-screen p-5 h-20 bg-orange"
    >
      Group
    </div>
    <ChatLog class="mt-20 h-full" :chat-log="chatLog" />
    <img
      class="absolute opacity-80 z-0 -bottom-10 w-[300px]"
      src="images/sally.png"
    />
    <div
      class="flex justify-between fixed bottom-0 w-screen p-5 h-20 bg-darkYellow gap-2"
    >
      <input
        placeholder="Enter Message"
        v-model="text"
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
