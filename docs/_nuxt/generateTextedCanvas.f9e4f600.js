const f=new XMLSerializer;function u(a,e){var r=new FileReader;r.onload=function(t){e(t.target.result)},r.readAsDataURL(a)}const y=(a,e)=>new Promise(async r=>{const t=document.createElement("div");e.html?t.innerHTML=a:t.innerText=a,t.style.width="fit-content",e.maxWidth&&(t.style.maxWidth=e.maxWidth+"px"),t.style.background="black",t.style.color="white",t.style.fontFamily="sans-serif",t.style.lineHeight="1.5em";const o=f.serializeToString(t);let l=e.width,h=e.height;const g=document.createElement("div");g.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0, 0, ${l}, ${h}" width="${e.width}" height="${e.height}" preserveAspectRatio="none">
      <foreignObject width="100%">
        ${o}
      </foreignObject>
    </svg>`;const d=g.querySelector("svg > foreignObject > *");document.body.appendChild(g);const s=d.getBoundingClientRect();document.body.removeChild(g),l=s.right-s.left,h=s.bottom-s.top;const w=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0, 0, ${l}, ${h}" width="${e.width}" height="${e.height}"${e.originalRatio?"":' preserveAspectRatio="none"'}>
    <foreignObject width="100%" height="100%">
      ${o}
    </foreignObject>
  </svg>`,m=new Blob([w],{type:"image/svg+xml;charset=utf-8"}),v=await new Promise(b=>{u(m,b)}),c=new Image;c.src=v,c.onload=()=>{i==null||i.drawImage(c,0,0),r({canvas:n,width:l,height:h})};const n=e.canvas||document.createElement("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.fillStyle="rgb( 0, 0, 0)",i==null||i.fillRect(0,0,n.width,n.height)});export{y as g};
