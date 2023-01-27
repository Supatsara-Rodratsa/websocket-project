<script lang="ts" setup>
import { UserInfo } from "~~/library/interfaces";
import { userStore } from "~~/stores/users";
definePageMeta({
  middleware: ["middleware"],
});

const userAccount = reactive({} as UserInfo);
const useUserStore = userStore();
const { createUsername, createUserProfile } = useUserStore;
const { user, logout } = useFirebase();

function createUserAccount() {
  if (userAccount.username) {
    createUsername(userAccount.username);
    navigateTo("/chat");
  }
}

function getProfileImage(profile: string) {
  createUserProfile(profile);
}

function onLogout() {
  logout();
}
</script>
<template>
  <div class="relative w-screen flex justify-center">
    <div class="absolute bottom-0 right-0 bg-transparent">
      <img
        class="bg-transparent"
        src="~assets/images/sally-3.png"
        width="250"
        height="250"
      />
    </div>
    <div class="flex flex-col fixed top-0 w-screen z-[99]">
      <div
        class="flex justify-between items-center p-5 h-20 bg-orange z-20 border-b-darkOrange border-b-2"
      >
        <h1 class="text-[24px] text-white font-bold">
          Hola, {{ user?.email }} :)
        </h1>
        <button
          class="text-[14px] rounded-[8px] min-w-[80px] px-4 py-2 bg-sally hover:bg-darkYellow hover:text-white"
          @click="onLogout()"
        >
          Log Out
        </button>
      </div>
    </div>
    <div
      class="flex flex-col justify-center items-center h-screen gap-5 relative bg-transparent w-fit"
    >
      <h1 class="text-[30px] text-orange font-bold">Join Sally's Community</h1>
      <UploadProfile
        @uploadedProfileImage="getProfileImage($event)"
      ></UploadProfile>
      <input
        placeholder="Enter Username"
        v-model="userAccount.username"
        class="border border-r-0 border-t-0 border-l-0 border-gray-100 focus:outline-none text-lg placeholder:text-grey"
      />
      <button
        class="rounded-[8px] min-w-[80px] px-4 py-2 bg-sally hover:bg-orange hover:text-white"
        @click="createUserAccount()"
      >
        Join
      </button>
    </div>
  </div>
</template>
