<script lang="ts" setup>
import { sallyImage } from "~~/library/constants";
import { UserInfo } from "~~/library/interfaces";

const prop = defineProps<{ user: UserInfo }>();
</script>
<template>
  <div class="flex flex-col items-center gap-1">
    <div class="relative">
      <div class="w-[60px] h-[60px] overflow-hidden rounded-full">
        <img
          class="object-fill"
          :src="user.image ? user.image : sallyImage"
          width="100"
          height="100"
        />
      </div>
      <div
        class="absolute w-[13px] h-[13px] rounded-full bottom-0 right-0 z-50"
        :style="`background-color: ${user.isOnline ? '#4F833A' : '#77756E'}`"
      ></div>
    </div>
    <p class="text-[10px] text-black">{{ user.username }}</p>
  </div>
</template>
