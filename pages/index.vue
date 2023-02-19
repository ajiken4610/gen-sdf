<template lang="pug">
div
  input(v-model="inValA")
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
const SIZE = 512;
const MIN_SIZE = 64;
const sdfTargetA = new WebGLRenderTarget(SIZE, SIZE);
const sdfTargetB = new WebGLRenderTarget(MIN_SIZE, MIN_SIZE)
let nonSDF = new WebGLRenderTarget(MIN_SIZE, MIN_SIZE)
onUnmounted(() => {
  sdfTargetA.dispose()
  sdfTargetB.dispose()
  nonSDF.dispose()
})


// init camera
const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
camera.position.set(0, 0, 1);
camera.lookAt(0, 0, 0);
// init scene
const scene = new Scene();
// init mesh
const planeG = new PlaneGeometry(2, 2);
const sdfShader = new ShaderMaterial({
  vertexShader: `
varying vec2 v_UV;
void main(){
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  v_UV = uv;
}`,
  fragmentShader: `
varying vec2 v_UV;
uniform sampler2D sdf0;
uniform sampler2D nonSdf;
uniform float t;
float unpackDistance(in float packed){
  float normalized = (packed - .5) * 2.;
  return (pow(2.,abs(normalized * 16.)) - 1.) * sign(normalized);
}
void main(){
  float dataA = texture2D(sdf0,v_UV).r;
  float unpackedA = unpackDistance(dataA);
  float dataB = texture2D(nonSdf,v_UV).r;
  float s = clamp(sin(t)+.5,0.,1.);
  // gl_FragColor = vec4(vec3(smoothstep(-.05,.05,mix(unpackedA,unpackedB,s))),1.);
  // gl_FragColor = vec4(vec3(mix(unpackedA,unpackedB,s))*32.,1.);
  gl_FragColor = vec4(vec3(mix(step(.0,unpackedA),dataB,s)),1.);
  // gl_FragColor = vec4(vec3((unpackedA+1.)/2.),1.);
}`,
  uniforms: {
    sdf0: { value: sdfTargetB.texture },
    nonSdf: { value: nonSDF.texture },
    t: { value: 0 }
  }
});
const plane = new Mesh(planeG, sdfShader);
scene.add(plane);
onUnmounted(() => {
  planeG.dispose()
  sdfShader.dispose()
})
const copyShader = new ShaderMaterial({
  vertexShader: `
varying vec2 v_UV;
void main(){
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  v_UV = uv;
}`,
  fragmentShader: `
varying vec2 v_UV;
uniform sampler2D tex;
void main(){
  gl_FragColor = texture2D(tex,v_UV);
}
`,
  uniforms: {
    tex: { value: sdfTargetA.texture }
  }
})
const inValA = ref("opqrs")


watch(inValA, async () => {
  const helloTex = new CanvasTexture((await generateTextedCanvas(inValA.value, { width: SIZE, height: SIZE, originalRatio: true })).canvas)
  genSDF(renderer, sdfTargetA, helloTex, SIZE, SIZE)
  renderer.setRenderTarget(sdfTargetB)
  plane.material = copyShader;
  copyShader.uniforms["tex"]!.value = sdfTargetA.texture;
  renderer.render(scene, camera)
  renderer.setRenderTarget(nonSDF)
  plane.material = copyShader;
  copyShader.uniforms["tex"]!.value = helloTex;
  renderer.render(scene, camera)
  plane.material = sdfShader;
}, { immediate: true })
// run
let running = true;
onUnmounted(() => {
  running = false;
})
const clock = new Clock()
const render = () => {
  running && requestAnimationFrame(render)
  sdfShader.uniforms["t"]!.value = clock.getElapsedTime()
  renderer.setRenderTarget(null);
  renderer.render(scene, camera)
}
render()
</script>