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

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
const config = useRuntimeConfig();
const { uploadImage, file, clearFile } = useUtilities();

const useUserStore = userStore();
const { userAccount } = storeToRefs(useUserStore);
const { setUserId } = useUserStore;

const chatLog = reactive([] as Array<ChatInfo>);
const typingUsers = ref([] as Array<String>);
const members = ref([] as Array<UserInfo>);
const showMember = ref(false);
const text = ref("");
const count = ref(0);
const url = ref();

function addToChat(
  m: string,
  type: "ActivityLog" | "MessageLog" | "ImageLog",
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

function send(isImage: boolean = false) {
  addToChat(
    isImage ? url.value : text.value,
    isImage ? "ImageLog" : "MessageLog",
    userAccount.value,
    getCurrentTime()
  ); // optimistic UI

  socket.emit("message", {
    text: isImage ? url.value : text.value,
    type: isImage ? "ImageLog" : "MessageLog",
  });
  socket.emit("onTyping", false);
  if (!isImage) text.value = "";
  else url.value = "";
}

function getCurrentTime() {
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${hour > 9 ? hour : "0" + hour}:${
    minute > 9 ? minute : "0" + minute
  }`;
}

function onTyping() {
  socket.emit("onTyping", text.value !== "");
}

onMounted(() => {
  socket = io(config.public.wssUrl);
  socket.emit("newUser", userAccount.value);

  socket.on("userId", (id) => {
    setUserId(id);
  });

  socket.on("activity", (log) => {
    addToChat(log, "ActivityLog");
  });

  socket.on("message", (data: ChatInfo) => {
    if (data.user && data.message) {
      addToChat(
        data.message,
        data.type === "ImageLog" ? "ImageLog" : "MessageLog",
        data.user,
        data.time
      );
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
    count.value = size;
  });

  socket.on("memberStatus", (data) => {
    members.value = data;
  });
});

function leftGroup() {
  socket.emit("leftGroup", true);
  navigateTo("/joinGroup");
}

function onUploadImage() {
  document.getElementById("fileUpload")?.click();
}

function onFileSelected(event: any) {
  uploadImage(event);
  if (file.value) {
    const reader = new FileReader();
    reader.readAsDataURL(file.value);
    reader.onload = async (_event) => {
      url.value = reader.result;
      send(true);
      clearFile();
    };
  }
}
</script>
<template>
  <div class="relative">
    <img
      class="absolute bg-transparent opacity-60 z-0 -bottom-10 w-[300px]"
      src="~assets/images/sally.png"
    />
    <div class="flex flex-col fixed top-0 w-screen z-[99]">
      <div
        class="flex justify-center items-center p-5 h-20 bg-orange text-white font-bold text-[24px] cursor-pointer z-20 border-b-darkOrange border-b-2"
        @click="showMember = !showMember"
      >
        Sally Lover Eieieiei ({{ count }})
        <div class="right-0 absolute mr-5 cursor-pointer" @click="leftGroup">
          <img
            src="~assets/images/exit.png"
            width="30"
            height="30"
            alt="Leave the group"
          />
        </div>
      </div>
      <div
        class="w-screen bg-orange z-10 flex flex-row justify-between items-center"
        :style="`transform: translate(0px, ${
          showMember ? '0px' : '-100px'
        }); transition: transform 0.8s`"
      >
        <div class="p-4 py-3 w-screen flex flex-row gap-3 overflow-scroll">
          <div v-for="(member, index) in members" v-bind:key="index">
            <MemberStatus :user="member"></MemberStatus>
          </div>
        </div>
      </div>
    </div>

    <ChatLog
      class="mt-20 h-full relative bg-transparent z-10"
      :chat-log="chatLog"
      :typing-log="typingUsers"
      @click="showMember = false"
    />
    <div
      class="flex justify-between fixed bottom-0 w-screen p-5 h-20 bg-darkYellow gap-2"
      @click="showMember = false"
    >
      <div
        class="rounded-full overflow-hidden flex justify-center items-center bg-orange p-4 cursor-pointer"
        @click="onUploadImage"
      >
        <img
          class="w-[24px]"
          src="~assets/images/camera.png"
          width="24"
          height="24"
        />
        <input
          type="file"
          class="hidden"
          @change="onFileSelected($event)"
          id="fileUpload"
        />
      </div>
      <input
        placeholder="Enter Message"
        v-model="text"
        @keyup="onTyping()"
        @keyup.enter="send()"
        class="border-0 rounded-[30px] w-[90%] focus:outline-none p-2 px-4"
      />
      <button
        class="rounded-[8px] min-w-[80px] px-4 py-2 bg-orange text-white"
        @click="send()"
      >
        SEND
      </button>
    </div>
  </div>
</template>
