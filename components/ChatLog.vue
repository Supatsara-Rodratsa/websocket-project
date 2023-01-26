<script setup>
import { toRefs } from "vue";
import { useScroll } from "@vueuse/core";
const props = defineProps(["chatLog", "typingLog"]);
// const { chatLog } = toRefs(props);
const chatBox = ref(null);
const { y } = useScroll(chatBox, {
  behavior: "smooth",
});

watch(
  props.chatLog,
  () => {
    nextTick(() => {
      y.value = chatBox.value.scrollHeight;
    });
  },
  { deep: true }
);
const typingUsers = computed(() => {
  if (props.typingLog && props.typingLog.length > 0) {
    if (props.typingLog.length == 1)
      return `${props.typingLog[0]} is typing...`;
    else return `${props.typingLog.join()} are typing...`;
  }
  return null;
});
</script>
<template>
  <div ref="chatBox" class="chat p-4 overflow-scroll border-0 max-w-20">
    <div class="flex flex-col gap-3 bg-transparent">
      <div v-for="(chat, index) in chatLog" v-bind:key="index">
        <ActivityLog
          :log="chat.message"
          v-if="chat.type == 'ActivityLog'"
        ></ActivityLog>
        <MessageLog
          :user="chat.user"
          :message="chat.message"
          :time="chat.time"
          v-else
        ></MessageLog>
      </div>
      <!-- <div class="absolute bottom-0" v-show="typingUsers">
        <p>{{ typingUsers }}</p>
      </div> -->
    </div>
  </div>
</template>
<style scoped>
.chat {
  height: calc(100vh - 160px);
}
</style>
