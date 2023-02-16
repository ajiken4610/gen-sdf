<template lang="pug">




div
</template>

<script setup lang="ts">




import { CanvasTexture, Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, WebGLRenderTarget, WebGLRenderer } from "three";
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
onUnmounted(() => {
  planeG.dispose()
})
const plane = new Mesh(planeG)
scene.add(plane)

// init srcTex
const hello = await generateTextedCanvas("Hello", { width: 512, height: 512, maxWidth: 512, originalRatio: true })
const world = await generateTextedCanvas("World", { width: 512, height: 512, maxWidth: 512, originalRatio: true })
// document.body.appendChild(hello.canvas)
const helloTex = new CanvasTexture(hello.canvas)
const worldTex = new CanvasTexture(world.canvas)

// render
renderer.render(scene, camera)

let srcTarget = new WebGLRenderTarget(512, 512)
let dstTarget = new WebGLRenderTarget(512, 512);
onUnmounted(() => {
  srcTarget.dispose()
  dstTarget.dispose()
  srcTarget.texture.dispose()
  dstTarget.texture.dispose()
})

// step1: 周囲4px
const step1Shader = new ShaderMaterial({
  vertexShader:/* glsl */`
varying vec2 v_UV;
void main(){
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  v_UV = uv;
}`,
  fragmentShader:/* glsl */`
uniform sampler2D map;
varying vec2 v_UV;
void main(){
  gl_FragColor = texture2D(map,v_UV);
}`,
  uniforms: {
    map: { value: helloTex }
  }
})
onUnmounted(() => {
  step1Shader.dispose()
})
plane.material = step1Shader;
renderer.render(scene, camera)
</script>