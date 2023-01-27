export default function () {
  const file = ref();
  function uploadImage(event: any) {
    const files = event.target.files;
    if (files.length === 0) return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      console.log("Only images are supported.");
      return;
    }
    file.value = files[0];
  }

  function clearFile() {
    file.value = "";
  }
  return { uploadImage, file, clearFile };
}
