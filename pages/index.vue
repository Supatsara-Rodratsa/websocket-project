<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { UserInfo } from "~~/library/interfaces";
import { userStore } from "~~/stores/users";

definePageMeta({
  middleware: ["middleware"],
});

const userAccount = reactive({} as UserInfo);
const useUserStore = userStore();
const { createUsername, createUserProfile } = useUserStore;
function createUserAccount() {
  if (userAccount.username) {
    createUsername(userAccount.username);
    navigateTo("/chat");
  }
}

function getProfileImage(profile: string) {
  createUserProfile(profile);
}
</script>
<template>
  <div class="relative">
    <div class="absolute bottom-0 right-0 bg-transparent">
      <img
        class="bg-transparent"
        src="~assets/images/sally-3.png"
        width="250"
        height="250"
      />
    </div>
    <div
      class="flex flex-col justify-center items-center h-screen gap-5 relative bg-transparent"
    >
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
