<template lang="pug">
div
</template>
<script setup lang="ts">
onMounted(() => {
  const templateDiv = document.createElement("div")
  templateDiv.innerText = "ろーれむ\nいぷさむ\nなんちゃら\nかんちゃら"
  templateDiv.style.width = "fit-content"
  templateDiv.style.background = "black"
  templateDiv.style.color = "white"
  document.body.appendChild(templateDiv)
  const serializedHtml = new XMLSerializer().serializeToString(templateDiv)
  const w = 512
  const h = 512
  const vw = templateDiv.offsetWidth + 1
  const vh = templateDiv.offsetHeight
  document.body.removeChild(templateDiv)
  // console.log(vw, vh)
  // console.log(vh)
  // console.log(serializedHtml)
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0, 0, ${vw}, ${vh}" width="${w}" height="${h}" preserveAspectRatio="none">
      <foreignObject width="100%" height="100%">
        ${serializedHtml}
      </foreignObject>
    </svg>`
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = (self.URL || self.webkitURL || self).createObjectURL(blob)
  const image = new Image()
  image.src = url;
  image.onload = () => {
    ctx?.drawImage(image, 0, 0);
    (self.URL || self.webkitURL || self).revokeObjectURL(url)
  }
  const canvas = document.createElement("canvas")
  canvas.width = 512
  canvas.height = 512
  // canvas.style.border = "solid"
  const ctx = canvas.getContext("2d")
  ctx!.fillStyle = 'rgb( 0, 0, 0)';
  ctx?.fillRect(0, 0, canvas.width, canvas.height);
  document.body.appendChild(canvas)
})

</script>

<style scoped lang="scss">
.wrap-content {
  width: fit-content
}
</style>