<script setup>
import { toRefs } from "vue";
import { useScroll } from "@vueuse/core";
const props = defineProps(["chatLog"]);
const { chatLog } = toRefs(props);
const chatBox = ref(null);
const { y } = useScroll(chatBox, {
  behavior: "smooth",
});
watch(chatLog, () => {
  nextTick(() => {
    y.value = chatBox.value.scrollHeight;
  });
});
</script>
<template>
  <div class="chat p-4 overflow-scroll border-0 max-w-20">
    <div ref="chatBox" v-html="chatLog"></div>
  </div>
</template>
<style scoped>
.chat {
  height: calc(100vh - 160px);
}
</style>
