<script lang="ts" setup>
import { sallyImage } from "~~/library/constants";
import { UserInfo } from "~~/library/interfaces";
import { userStore } from "~~/stores/users";

const props = defineProps<{
  user?: UserInfo;
  message: String;
  time?: String;
  isTyping: Boolean;
  type: "MessageLog" | "ImageLog";
}>();
const { userAccount } = userStore();
const isYourMessage = ref(false);
onMounted(() => {
  if (props.user && props.user.id && props.user.id === userAccount.id) {
    isYourMessage.value = true;
  }
});

function renderMessage(text: String) {
  if (props.type === "ImageLog") {
    return `<img class="rounded-[10px] w-[200px] h-[200px] object-cover" src=${props.message} width="100" "height="100">`;
  }
  var urlRegex =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

  return text.replace(urlRegex, function (url) {
    return (
      `<a class="${
        isYourMessage.value ? "text-cream" : "text-orange"
      } underline" href="${url}" target="_blank">` +
      url +
      "</a>"
    );
  });
}
</script>
<template>
  <div
    class="flex w-full"
    :style="`justify-content: ${isYourMessage ? 'end' : 'start'}`"
  >
    <div class="flex flex-row items-end gap-1" v-if="isYourMessage">
      <p class="text-[12px] mb-[2px] text-grey">{{ time || "" }}</p>
      <div
        class="bg-orange px-4 py-2 w-fit rounded-[30px] rounded-tr-none max-w-[250px]"
        :style="'overflow-wrap: break-word;'"
      >
        <p v-html="renderMessage(message)"></p>
      </div>
    </div>
    <div class="flex gap-3 items-start" v-else>
      <div class="rounded-full overflow-hidden object-cover w-[40px] h-[40px]">
        <img
          class="object-cover"
          :src="user && user.image ? user.image : sallyImage"
          width="40"
          height="40"
        />
      </div>
      <div class="flex items-end gap-1">
        <div class="flex flex-col gap-0">
          <p class="text-[10px] mb-[2px] text-grey">
            {{ !isTyping ? (user && user.username) || "" : message }}
          </p>

          <div
            class="bg-sally px-4 py-2 w-fit rounded-[30px] rounded-tl-none max-w-[250px]"
            :style="'overflow-wrap: break-word;'"
          >
            <p v-if="!isTyping" v-html="renderMessage(message)"></p>
            <div class="loader" v-else>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <p class="text-[12px] mb-[2px] text-grey">{{ time || "" }}</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.loader {
  text-align: center;
}
.loader span {
  display: inline-block;
  vertical-align: middle;
  width: 7px;
  height: 7px;
  background: black;
  border-radius: 7px;
  animation: loader 0.8s infinite alternate;
  margin-right: 6px;
}
.loader span:nth-of-type(2) {
  animation-delay: 0.2s;
}
.loader span:nth-of-type(3) {
  animation-delay: 0.6s;
}
@keyframes loader {
  0% {
    opacity: 0.9;
  }
  100% {
    opacity: 0.1;
  }
}
</style>
