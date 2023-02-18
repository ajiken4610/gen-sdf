<template lang="pug">
div
  input(v-model="inVal")
</template>

<script setup lang="ts">
import { CanvasTexture, Clock, Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, WebGLRenderTarget, WebGLRenderer } from "three";
// init renderer
const renderer = new WebGLRenderer()
renderer.setSize(512, 512)
document.body.appendChild(renderer.domElement)
onUnmounted(() => {
  document.body.removeChild(renderer.domElement)
  renderer.dispose()
})

const sdfTarget = new WebGLRenderTarget(512, 512);

const inVal = ref("hello")
watch(inVal, async () => {
  const helloTex = new CanvasTexture((await generateTextedCanvas(inVal.value, { width: 512, height: 512, originalRatio: true })).canvas)
  genSDF(renderer, sdfTarget, helloTex, 512, 512)
}, { immediate: true })

// init camera
const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
camera.position.set(0, 0, 1);
camera.lookAt(0, 0, 0);
// init scene
const scene = new Scene();
// init mesh
const planeG = new PlaneGeometry(2, 2);
const planeM = new ShaderMaterial({
  vertexShader: `
varying vec2 v_UV;
void main(){
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  v_UV = uv;
}`,
  fragmentShader: `
varying vec2 v_UV;
uniform sampler2D sdf;
uniform float t;
float unpackDistance(in float packed){
  float normalized = (packed - .5) * 2.;
  return pow(2.,abs(normalized * 16.)) * sign(normalized);
}
void main(){
  float data = texture2D(sdf,v_UV).r;
  float unpacked = unpackDistance(data) / 32.;
  float s = sin(t) / 2.;
  gl_FragColor = vec4(vec3(smoothstep(-.1 + s,.1 + s,unpacked)),1.);
}`,
  uniforms: {
    sdf: { value: sdfTarget.texture },
    t: { value: 0 }
  }
});
const plane = new Mesh(planeG, planeM);
scene.add(plane);
onUnmounted(() => {
  planeG.dispose()
  planeM.dispose()
})
// run
let running = true;
onUnmounted(() => {
  running = false;
})
const clock = new Clock()
const render = () => {
  running && requestAnimationFrame(render)
  planeM.uniforms["t"]!.value = clock.getElapsedTime()
  renderer.setRenderTarget(null);
  renderer.render(scene, camera)
}
render()
</script>