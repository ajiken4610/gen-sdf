<template lang="pug">
div
</template>

<script setup lang="ts">
import { CanvasTexture, Mesh, MeshBasicMaterial, OrthographicCamera, PlaneGeometry, Scene, WebGLRenderer } from "three";
// init renderer
const renderer = new WebGLRenderer()
renderer.setSize(512, 512)
document.body.appendChild(renderer.domElement)
onUnmounted(() => {
  document.body.removeChild(renderer.domElement)
  renderer.dispose()
})

// init camera
const camera = new OrthographicCamera(-1, 1, 1, -1, .1, 10)
camera.position.set(0, 0, 1)
camera.lookAt(0, 0, 0)
// init scene
const scene = new Scene()
// init mesh
const planeG = new PlaneGeometry(2, 2)
const planeM = new MeshBasicMaterial({ color: 0xffffff })
onUnmounted(() => {
  planeG.dispose()
  planeM.dispose()
})
scene.add(new Mesh(planeG, planeM))

// init srcTex
const hello = await generateTextedCanvas("Hello", { width: 512, height: 512, maxWidth: 512, originalRatio: true })
const world = await generateTextedCanvas("World", { width: 512, height: 512, maxWidth: 512, originalRatio: true })
// document.body.appendChild(hello.canvas)
const helloTex = new CanvasTexture(hello.canvas)
const worldTex = new CanvasTexture(world.canvas)
planeM.map = helloTex

// render
renderer.render(scene, camera)
</script>