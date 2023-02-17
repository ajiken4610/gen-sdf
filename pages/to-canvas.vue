<template lang="pug">
div
  textarea.textarea(v-model="inputValue")
  canvas(ref="canvasElem")
</template>
<script setup lang="ts">
const inputValue = ref(
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
);
const canvasElem = ref<HTMLCanvasElement>();
onMounted(() => {
  watch(
    inputValue,
    (text) => {
      generateTextedCanvas(text, { width: 512, height: 512, canvas: canvasElem.value!, maxWidth: 512 });
    },
    { immediate: true }
  );
});
</script>
<style scoped lang="scss">
.textarea {
  width: 100%;
  min-height: 5rem;
}
</style>
