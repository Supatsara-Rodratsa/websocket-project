<script lang="ts" setup>
import { sallyImage } from "~~/library/constants";
import { UserInfo } from "~~/library/interfaces";
import { userStore } from "~~/stores/users";

const props = defineProps<{ user: UserInfo; message: String; time: String }>();
const { userAccount } = userStore();
const isYourMessage = ref(false);
onMounted(() => {
  if (props.user && props.user.id && props.user.id === userAccount.id) {
    isYourMessage.value = true;
  }
});
</script>
<template>
  <div
    class="flex w-full"
    :style="`justify-content: ${isYourMessage ? 'end' : 'start'}`"
  >
    <div
      v-if="isYourMessage"
      class="bg-orange px-4 py-2 w-fit rounded-[30px] rounded-tr-none max-w-[250px]"
      :style="'overflow-wrap: break-word;'"
    >
      <p>{{ message }}</p>
    </div>
    <div class="flex gap-3 items-start" v-else>
      <div class="rounded-full overflow-hidden object-cover w-[40px] h-[40px]">
        <img
          class="object-cover"
          :src="user.image ? user.image : sallyImage"
          width="40"
          height="40"
        />
      </div>
      <div class="flex items-end gap-1">
        <div class="flex flex-col gap-0">
          <p class="text-[10px] mb-[2px] text-grey">{{ user.username }}</p>

          <div
            class="bg-sally px-4 py-2 w-fit rounded-[30px] rounded-tl-none max-w-[250px]"
            :style="'overflow-wrap: break-word;'"
          >
            <p>{{ message }}</p>
          </div>
        </div>
        <p class="text-[12px] mb-[2px] text-grey">{{ time }}</p>
      </div>
    </div>
  </div>
</template>
