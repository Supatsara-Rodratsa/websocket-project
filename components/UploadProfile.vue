<script setup>
const emit = defineEmits(["uploadedProfileImage"]);
const url = ref("");
function onClickedImage() {
  document.getElementById("fileUpload").click();
}

function onFileSelected(event) {
  let byteArray;
  const files = event.target.files;
  if (files.length === 0) return;

  const mimeType = files[0].type;
  if (mimeType.match(/image\/*/) == null) {
    this.message = "Only images are supported.";
    console.log(this.message);
    return;
  }

  const reader = new FileReader();
  this.imagePath = files;

  reader.readAsDataURL(files[0]);
  reader.onload = async (_event) => {
    url.value = reader.result;
    emit("uploadedProfileImage", url.value);
  };
}
</script>
<template>
  <div
    class="flex rounded-full overflow-hidden w-[200px] h-[200px] cursor-pointer"
  >
    <img
      class="object-cover"
      :src="url ? url : 'images/sally-2.jpeg'"
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
</template>
