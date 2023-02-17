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
// const world = await generateTextedCanvas("World", { width: 512, height: 512, maxWidth: 512, originalRatio: true })
// document.body.appendChild(hello.canvas)
const helloTex = new CanvasTexture(hello.canvas)
// const worldTex = new CanvasTexture(world.canvas)

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
uniform float w;
uniform float h;
varying vec2 v_UV;

vec2 addOffset(in vec2 uv,in float x,in float y){
  return vec2(uv.x + x * w,uv.y + y * h);
}

float searchForXAxis(in bool center){
  bool px1 = texture2D(map,addOffset(v_UV,1.,0.)).r > .5;
  if(px1 != center){
    return 1.;
  }
  bool nx1 = texture2D(map,addOffset(v_UV,-1.,0.)).r > .5;
  if(nx1 != center){
    return -1.;
  }
  bool px2 = texture2D(map,addOffset(v_UV,2.,0.)).r > .5;
  if(px2 != center){
    return 2.;
  }
  bool nx2 = texture2D(map,addOffset(v_UV,-2.,0.)).r > .5;
  if(nx2 != center){
    return -2.;
  }
  bool px3 = texture2D(map,addOffset(v_UV,3.,0.)).r > .5;
  if(px3 != center){
    return 3.;
  }
  bool nx3 = texture2D(map,addOffset(v_UV,-3.,0.)).r > .5;
  if(nx3 != center){
    return -3.;
  }
  return 0.;
}

float searchForYAxis(in bool center){
  bool py1 = texture2D(map,addOffset(v_UV,0.,1.)).r > .5;
  if(py1 != center){
    return 1.;
  }
  bool ny1 = texture2D(map,addOffset(v_UV,0.,-1.)).r > .5;
  if(ny1 != center){
    return -1.;
  }
  bool py2 = texture2D(map,addOffset(v_UV,0.,2.)).r > .5;
  if(py2 != center){
    return 2.;
  }
  bool ny2 = texture2D(map,addOffset(v_UV,0.,-2.)).r > .5;
  if(ny2 != center){
    return -2.;
  }
  bool py3 = texture2D(map,addOffset(v_UV,0.,3.)).r > .5;
  if(py3 != center){
    return 3.;
  }
  bool ny3 = texture2D(map,addOffset(v_UV,0.,-3.)).r > .5;
  if(ny3 != center){
    return -3.;
  }
  return 0.;
}

vec2 normalizeCoord(in float rawX,in float rawY){
  vec2 raw = vec2(rawX,rawY);
  vec2 logged = log2(abs(raw) + 1.) * sign(raw) / 16.;
  return (logged + 1.) / 2.;
}

void main(){
  bool center = texture2D(map,v_UV).r > .5;
  float resultX = searchForXAxis(center);
  float resultY = searchForYAxis(center);
  vec4 result;
  if(resultX == 0.){
    if(resultY == 0.){
      result = vec4(0.,0.,0.,1.);
    }else{
      result = vec4(normalizeCoord(0.,resultY),1.,1.);
    }
  }else{
    if(resultY == 0.){
      result = vec4(normalizeCoord(resultX,.0),1.,1.);
    }else{
      float iFac = resultX / resultY + resultY / resultX;
      float iX = resultY / iFac;
      float iY = resultX / iFac;
      result = vec4(normalizeCoord(iX,iY),1.,1.);
      // result = vec4(0.,0.,0.,1.);
    }
  }
  gl_FragColor = result;
  // gl_FragColor = vec4(normalizeCoord(resultX,resultY),0.,1.);
}`,
  uniforms: {
    map: { value: helloTex },
    w: { value: 1 / 512 },
    h: { value: 1 / 512 }
  }
})
onUnmounted(() => {
  step1Shader.dispose()
})
plane.material = step1Shader;
renderer.setRenderTarget(srcTarget);
renderer.render(scene, camera)
// step2
const step2Shader = new ShaderMaterial({
  vertexShader:/* glsl */`
varying vec2 v_UV;
void main(){
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  v_UV = uv;
}`,
  fragmentShader:/* glsl */`
uniform sampler2D map;
uniform float w;
uniform float h;
uniform float f;
varying vec2 v_UV;

vec2 unpackDistance(in vec2 packed){
  vec2 normalized = (packed - .5) * 2.;
  return pow(vec2(2.),abs(normalized * 16.)) * sign(normalized);
}

vec2 normalizeCoord(in vec2 raw){
  vec2 logged = log2(abs(raw) + 1.) * sign(raw) / 16.;
  return (logged + 1.) / 2.;
}

vec2 addOffset(in float x,in float y){
  return vec2(v_UV.x + x * w * f,v_UV.y + y * h * f);
}

bool aIsMinThanB(in vec2 aCoord,in vec4 a,in vec2 bCoord,in vec4 b){
  if(a.z == 0.){
    return false;
  }
  if(b.z == 0.){
    return true;
  }
  vec2 aDist = unpackDistance(a.xy);
  vec2 bDist = unpackDistance(b.xy);
  float aLen = length(aDist + aCoord);
  float bLen = length(bDist + bCoord);
  if(aLen < bLen){
    return true;
  }else{
    return false;
  }
}

void updateDatas(inout vec2 minCoord,inout vec4 minData,in float offsetX,in float offsetY){
  vec2 offset = addOffset(offsetX,offsetY);
  vec4 data = texture2D(map,offset);
  if(!aIsMinThanB(minCoord,minData,offset,data)){
    minCoord = vec2(offsetX,offsetY);
    minData = data;
  }
}

void main(){
  vec2 minCoord = vec2(0.,0.);
  vec4 center = texture2D(map,v_UV);
  vec4 minData = center;

  updateDatas(minCoord,minData,1.,0.);
  updateDatas(minCoord,minData,-1.,0.);
  updateDatas(minCoord,minData,2.,0.);
  updateDatas(minCoord,minData,-2.,0.);
  updateDatas(minCoord,minData,3.,0.);
  updateDatas(minCoord,minData,-3.,0.);
  updateDatas(minCoord,minData,0.,1.);
  updateDatas(minCoord,minData,0.,-1.);
  updateDatas(minCoord,minData,0.,2.);
  updateDatas(minCoord,minData,0.,-2.);
  updateDatas(minCoord,minData,0.,3.);
  updateDatas(minCoord,minData,0.,-3.);

  gl_FragColor = vec4(normalizeCoord(unpackDistance(minData.xy) + minCoord * f),minData.z,1.);
  // gl_FragColor = vec4((unpackDistance(center.xy) + minCoord * f) / 4.,0.,1.);
}
`,
  uniforms: {
    map: { value: null },
    w: { value: 1 / 512 },
    h: { value: 1 / 512 },
    f: { value: null }
  }
})
onUnmounted(() => {
  step2Shader.dispose()
})
plane.material = step2Shader;
for (var i = 0; i < 3; i++) {
  step2Shader.uniforms["f"]!.value = 4 ** (i + 1);
  step2Shader.uniforms["map"]!.value = srcTarget.texture;
  renderer.setRenderTarget(dstTarget);
  renderer.render(scene, camera);
  [srcTarget, dstTarget] = [dstTarget, srcTarget];
}
// renderer.setRenderTarget(null)
// renderer.render(scene, camera)
// step3
const step3Shader = new ShaderMaterial({
  vertexShader:/* glsl */`
varying vec2 v_UV;
void main(){
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  v_UV = uv;
}`,
  fragmentShader:/* glsl */`
uniform sampler2D map;
uniform sampler2D tex;
uniform float w;
uniform float h;
varying vec2 v_UV;
vec2 unpackDistance(in vec2 packed){
  vec2 normalized = (packed - .5) * 2.;
  return pow(vec2(2.),abs(normalized * 16.)) * sign(normalized);
}
float normalizeLength(in float raw){
  float logged = log2(abs(raw) + 1.) * sign(raw) / 16.;
  return (logged + 1.) / 2.;
}
void main(){
  vec4 data = texture2D(map,v_UV);
  vec2 unpacked = unpackDistance(data.xy);
  float length = length(unpacked);
  length = texture2D(tex,v_UV).r > .5 ? length : -length;
  length = normalizeLength(length);
  gl_FragColor = vec4(vec3(length),1.);
}
`,
  uniforms: {
    map: { value: null },
    tex: { value: null },
    w: { value: 1 / 512 },
    h: { value: 1 / 512 },
    f: { value: null }
  }
})
onUnmounted(() => {
  step3Shader.dispose()
})
step3Shader.uniforms["map"]!.value = srcTarget.texture;
step3Shader.uniforms["tex"]!.value = helloTex;
plane.material = step3Shader
renderer.setRenderTarget(null)
renderer.render(scene, camera)
</script>