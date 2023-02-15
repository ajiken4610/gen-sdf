const serializer = new XMLSerializer();

export default (
  text: string,
  options: { width: number; height: number; maxWidth?: number; html?: boolean; canvas?: HTMLCanvasElement }
) => {
  return new Promise<{ canvas: HTMLCanvasElement; width: number; height: number }>((resolve) => {
    const templateDiv = document.createElement("div");
    if (options.html) {
      templateDiv.innerHTML = text;
    } else {
      templateDiv.innerText = text;
    }
    templateDiv.style.width = "fit-content";
    options.maxWidth && (templateDiv.style.maxWidth = options.maxWidth + "px");
    templateDiv.style.background = "black";
    templateDiv.style.color = "white";
    document.body.appendChild(templateDiv);
    const vw = templateDiv.offsetWidth + 1;
    const vh = templateDiv.offsetHeight;
    document.body.removeChild(templateDiv);
    const serializedHtml = serializer.serializeToString(templateDiv);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0, 0, ${vw}, ${vh}" width="${options.width}" height="${options.height}" preserveAspectRatio="none">
      <foreignObject width="100%" height="100%">
        ${serializedHtml}
      </foreignObject>
    </svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = (self.URL || self.webkitURL || self).createObjectURL(blob);
    const image = new Image();
    image.src = url;
    image.onload = () => {
      ctx?.drawImage(image, 0, 0);
      (self.URL || self.webkitURL || self).revokeObjectURL(url);
      resolve({ canvas, width: vw, height: vh });
    };
    const canvas = options.canvas || document.createElement("canvas");
    canvas.width = options.width;
    canvas.height = options.height;
    // canvas.style.border = "solid"
    const ctx = canvas.getContext("2d");
    ctx!.fillStyle = "rgb( 0, 0, 0)";
    ctx?.fillRect(0, 0, canvas.width, canvas.height);
  });
};
