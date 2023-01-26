<script setup>
defineProps({ log: String });
</script>
<template>
  <div class="flex justify-center">
    <div class="text-center bg-cream w-fit px-4 py-2 rounded-[30px]">
      {{ log }}
    </div>
  </div>
</template>
