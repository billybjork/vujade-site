(this["webpackJsonpvujade-site"]=this["webpackJsonpvujade-site"]||[]).push([[0],{13:function(e,t,n){e.exports=n(27)},21:function(e,t,n){},22:function(e,t,n){},27:function(e,t,n){"use strict";n.r(t);var o=n(0),c=n.n(o),a=n(10),r=n.n(a),l=(n(21),n(29)),i=(n(22),n(11)),s=n(3),d=n(12);const u="https://vujade-site-bd6c94750c62.herokuapp.com";function m(e){let{src:t,videoID:n,onVideoClick:a}=e;const r=Object(o.useRef)(null),{ref:l,inView:s}=Object(i.a)({triggerOnce:!0,rootMargin:"50px 0px"});return c.a.createElement("div",{ref:l,style:{width:"100%",height:"auto"}},s&&c.a.createElement("video",{ref:r,src:t,loop:!0,muted:!0,playsInline:!0,onClick:()=>a(n),onMouseEnter:()=>{if(r.current){const e=r.current.play();void 0!==e&&e.catch(e=>{console.error("Play was interrupted.",e)})}},onMouseLeave:()=>{r.current&&!r.current.paused&&r.current.pause()},style:{width:"100%",height:"auto"}}))}function v(e){let{videoInfo:t,onClose:n}=e;Object(o.useEffect)(()=>{const e=window.getComputedStyle(document.body).overflow;return document.body.style.overflow="hidden",()=>{document.body.style.overflow=e}},[]);return c.a.createElement("div",{className:"modal",onClick:n},c.a.createElement("div",{className:"modal-content",onClick:e=>{e.stopPropagation()}},c.a.createElement("span",{className:"close",onClick:n},"\xd7"),c.a.createElement("h2",null,t.videoName),c.a.createElement("div",{className:"embed-container"},c.a.createElement("iframe",{src:(e=>{const t=e.split("vimeo.com/")[1].split("/")[0];return"https://player.vimeo.com/video/".concat(t)})(t.URL),frameBorder:"0",allow:"autoplay; fullscreen",allowFullScreen:!0,title:t.videoName})),c.a.createElement("div",{dangerouslySetInnerHTML:{__html:t.Description||""}})))}function f(e){let{scenes:t,uniqueVideoIDs:n}=e;const a=Object(s.o)(),{videoID:r}=Object(s.q)(),[i,d]=Object(o.useState)(null);Object(o.useEffect)(()=>{r&&l.a.get("".concat(u,"/video_info/").concat(r)).then(e=>{d(e.data)}).catch(e=>{console.error("Error fetching video info: ",e),a("/")})},[r,a]);const f=e=>{a("/videos/".concat(e))};return c.a.createElement("div",{className:"App"},c.a.createElement("div",{className:"video-menu"},n.map(e=>{let{videoID:t,videoName:n}=e;return c.a.createElement("div",{key:t,onClick:()=>f(t)},n)})),c.a.createElement("div",{className:"video-grid"},t.map(e=>c.a.createElement(m,{key:e.sceneURL,src:e.sceneURL,videoID:e.videoID,onVideoClick:f}))),i&&c.a.createElement(v,{videoInfo:i,onClose:()=>{d(null),a("/")}}))}var p=function(){const[e,t]=Object(o.useState)([]),[n,a]=Object(o.useState)([]);return Object(o.useEffect)(()=>{l.a.get("".concat(u,"/scenes")).then(e=>{t(function(e){for(let t=e.length-1;t>0;t--){const n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e}(e.data))}).catch(e=>{console.error("Error fetching scenes: ",e)}),l.a.get("".concat(u,"/videos")).then(e=>{a(e.data)}).catch(e=>{console.error("Error fetching videos: ",e)})},[]),c.a.createElement(d.a,null,c.a.createElement(s.c,null,c.a.createElement(s.a,{path:"/videos/:videoID",element:c.a.createElement(f,{scenes:e,uniqueVideoIDs:n})}),c.a.createElement(s.a,{path:"/",element:c.a.createElement(f,{scenes:e,uniqueVideoIDs:n})})))};var h=e=>{e&&e instanceof Function&&n.e(3).then(n.bind(null,30)).then(t=>{let{getCLS:n,getFID:o,getFCP:c,getLCP:a,getTTFB:r}=t;n(e),o(e),c(e),a(e),r(e)})};r.a.createRoot(document.getElementById("root")).render(c.a.createElement(c.a.StrictMode,null,c.a.createElement(p,null))),h()}},[[13,1,2]]]);
//# sourceMappingURL=main.31d2c7fe.chunk.js.map