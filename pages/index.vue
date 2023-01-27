<script lang="ts" setup>
import useFirebase from "~~/composables/useFirebase";
definePageMeta({
  middleware: ["middleware"],
});

const userEmail = ref();
const userPassword = ref();
const { registerUser, loginUser, user, logout, googleLogin } = useFirebase();

function onRegister() {
  registerUser(userEmail.value, userPassword.value);
}

function onLogin() {
  loginUser(userEmail.value, userPassword.value);
}

function onLogout() {
  logout();
}

function onGoogleLogin() {
  googleLogin();
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
    <div
      class="flex flex-col justify-center items-center h-screen gap-5 relative bg-transparent w-[50%]"
    >
      <h1 class="text-[30px] text-orange font-bold text-center">
        Welcome to Sally's Community
      </h1>
      <div class="flex flex-col justify-start w-[85%]">
        <label>Email</label>
        <input
          placeholder="Your Email"
          v-model="userEmail"
          class="border border-r-0 border-t-0 border-l-0 border-gray-100 focus:outline-none text-lg placeholder:text-grey placeholder:text-sm"
        />
      </div>
      <div class="flex flex-col justify-start w-[85%]">
        <label>Password</label>
        <input
          placeholder="Your Password"
          type="password"
          v-model="userPassword"
          class="border border-r-0 border-t-0 border-l-0 border-gray-100 focus:outline-none text-lg placeholder:text-grey placeholder:text-sm"
        />
      </div>

      <div class="flex gap-3">
        <button
          class="rounded-[8px] min-w-[80px] px-4 py-2 bg-sally hover:bg-orange hover:text-white"
          @click="onRegister"
        >
          Register
        </button>
        <button
          class="rounded-[8px] min-w-[80px] px-4 py-2 bg-sally hover:bg-orange hover:text-white"
          @click="onLogin"
        >
          Login
        </button>
        <button
          class="rounded-[8px] min-w-[80px] px-4 py-2 bg-sally hover:bg-orange hover:text-white"
          @click="onGoogleLogin"
        >
          Google
        </button>
      </div>
    </div>
  </div>
</template>
