<script setup>
import { sallyImage } from "~~/library/constants";

const emit = defineEmits(["uploadedProfileImage"]);
const url = ref("");
const { uploadImage, file } = useUtilities();
function onClickedImage() {
  document.getElementById("fileUpload").click();
}

function onFileSelected(event) {
  uploadImage(event);
  const reader = new FileReader();
  reader.readAsDataURL(file.value);
  reader.onload = async (_event) => {
    url.value = reader.result;
    emit("uploadedProfileImage", url.value);
  };
}
</script>
<template>
  <div class="relative">
    <div
      class="flex rounded-full overflow-hidden w-[200px] h-[200px] cursor-pointer"
    >
      <img
        class="object-cover"
        :src="url ? url : sallyImage"
        @click="onClickedImage"
        width="200"
        height="200"
      />
      <input
        type="file"
        class="hidden"
        @change="onFileSelected($event)"
        id="fileUpload"
      />
    </div>
    <div
      class="flex items-center justify-center absolute w-[40px] h-[40px] rounded-full bottom-[5px] right-[20px] z-50 bg-orange"
    >
      <img src="~assets/images/camera.png" width="20" height="20" />
    </div>
  </div>
</template>
