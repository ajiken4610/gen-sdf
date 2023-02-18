<template lang="pug">
div
  input(v-model="inVal")
</template>

<script setup lang="ts">
import { CanvasTexture, WebGLRenderer } from "three";
// init renderer
const renderer = new WebGLRenderer()
renderer.setSize(512, 512)
document.body.appendChild(renderer.domElement)
onUnmounted(() => {
  document.body.removeChild(renderer.domElement)
  renderer.dispose()
})

const inVal = ref("hello")
watch(inVal, async () => {
  const helloTex = new CanvasTexture((await generateTextedCanvas(inVal.value, { width: 512, height: 512, originalRatio: true })).canvas)
  genSDF(renderer, null, helloTex, 512, 512)
}, { immediate: true })


</script>