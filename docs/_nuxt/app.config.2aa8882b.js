import{s as h,x,a as q,y as p,z as k,r as y,b as A,A as P,B as C,C as R,D as T,E as N}from"./entry.7ae02e9f.js";function j(t,a){return h()._useHead(t,a)}async function _(t,a=x()){if(a._routePreloaded||(a._routePreloaded=new Set),a._routePreloaded.has(t))return;const e=a._preloadPromises=a._preloadPromises||[];if(e.length>4)return Promise.all(e).then(()=>_(t,a));a._routePreloaded.add(t);const r=a.resolve(t).matched.map(o=>{var n;return(n=o.components)==null?void 0:n.default}).filter(o=>typeof o=="function");for(const o of r){const n=Promise.resolve(o()).catch(()=>{}).finally(()=>e.splice(e.indexOf(n)));e.push(n)}await Promise.all(e)}const b=globalThis.requestIdleCallback||(t=>{const a=Date.now(),e={didTimeout:!1,timeRemaining:()=>Math.max(0,50-(Date.now()-a))};return setTimeout(()=>{t(e)},1)}),S=globalThis.cancelIdleCallback||(t=>{clearTimeout(t)}),B=t=>{const a=h();a.isHydrating?a.hooks.hookOnce("app:suspense:resolve",()=>{b(t)}):b(t)},E=(...t)=>t.find(a=>a!==void 0),w="noopener noreferrer";function I(t){const a=t.componentName||"NuxtLink";return q({name:a,props:{to:{type:[String,Object],default:void 0,required:!1},href:{type:[String,Object],default:void 0,required:!1},target:{type:String,default:void 0,required:!1},rel:{type:String,default:void 0,required:!1},noRel:{type:Boolean,default:void 0,required:!1},prefetch:{type:Boolean,default:void 0,required:!1},noPrefetch:{type:Boolean,default:void 0,required:!1},activeClass:{type:String,default:void 0,required:!1},exactActiveClass:{type:String,default:void 0,required:!1},prefetchedClass:{type:String,default:void 0,required:!1},replace:{type:Boolean,default:void 0,required:!1},ariaCurrentValue:{type:String,default:void 0,required:!1},external:{type:Boolean,default:void 0,required:!1},custom:{type:Boolean,default:void 0,required:!1}},setup(e,{slots:r}){const o=x(),n=p(()=>e.to||e.href||""),c=p(()=>e.external||e.target&&e.target!=="_self"?!0:typeof n.value=="object"?!1:n.value===""||k(n.value,!0)),v=y(!1),s=y(null);if(e.prefetch!==!1&&e.noPrefetch!==!0&&typeof n.value=="string"&&e.target!=="_blank"&&!D()){const f=h();let u,l=null;A(()=>{const m=L();B(()=>{u=b(()=>{var d;(d=s==null?void 0:s.value)!=null&&d.tagName&&(l=m.observe(s.value,async()=>{l==null||l(),l=null,await Promise.all([f.hooks.callHook("link:prefetch",n.value).catch(()=>{}),!c.value&&_(n.value,o).catch(()=>{})]),v.value=!0}))})})}),P(()=>{u&&S(u),l==null||l(),l=null})}return()=>{var m,d;if(!c.value)return C(R("RouterLink"),{ref:g=>{s.value=g==null?void 0:g.$el},to:n.value,...v.value&&!e.custom?{class:e.prefetchedClass||t.prefetchedClass}:{},activeClass:e.activeClass||t.activeClass,exactActiveClass:e.exactActiveClass||t.exactActiveClass,replace:e.replace,ariaCurrentValue:e.ariaCurrentValue,custom:e.custom},r.default);const i=typeof n.value=="object"?((m=o.resolve(n.value))==null?void 0:m.href)??null:n.value||null,f=e.target||null,u=e.noRel?null:E(e.rel,t.externalRelAttribute,i?w:"")||null,l=()=>T(i,{replace:e.replace});return e.custom?r.default?r.default({href:i,navigate:l,route:o.resolve(i),rel:u,target:f,isExternal:c.value,isActive:!1,isExactActive:!1}):null:C("a",{ref:s,href:i,rel:u,target:f},(d=r.default)==null?void 0:d.call(r))}}})}const H=I({componentName:"NuxtLink"});function L(){const t=h();if(t._observer)return t._observer;let a=null;const e=new Map,r=(n,c)=>(a||(a=new IntersectionObserver(v=>{for(const s of v){const i=e.get(s.target);(s.isIntersecting||s.intersectionRatio>0)&&i&&i()}})),e.set(n,c),a.observe(n),()=>{e.delete(n),a.unobserve(n),e.size===0&&(a.disconnect(),a=null)});return t._observer={observe:r}}function D(){const t=navigator.connection;return!!(t&&(t.saveData||/2g/.test(t.effectiveType)))}const O={};N(O);export{H as _,j as u};
