(this["webpackJsonpvujade-site"]=this["webpackJsonpvujade-site"]||[]).push([[0],{13:function(e,t,n){e.exports=n(27)},21:function(e,t,n){},22:function(e,t,n){},27:function(e,t,n){"use strict";n.r(t);var o=n(0),a=n.n(o),c=n(10),r=n.n(c),l=(n(21),n(29)),i=(n(22),n(11)),s=n(3),d=n(12);const u="https://vujade-site-bd6c94750c62.herokuapp.com";function m(e){let{src:t,videoID:n,onVideoClick:c}=e;const r=Object(o.useRef)(null),{ref:l,inView:s}=Object(i.a)({triggerOnce:!0,rootMargin:"50px 0px"});return a.a.createElement("div",{ref:l,style:{width:"100%",height:"auto"}},s&&a.a.createElement("video",{ref:r,src:t,loop:!0,muted:!0,playsInline:!0,onClick:()=>c(n),onMouseEnter:()=>{if(r.current){const e=r.current.play();void 0!==e&&e.catch(e=>{console.error("Play was interrupted.",e)})}},onMouseLeave:()=>{r.current&&!r.current.paused&&r.current.pause()},style:{width:"100%",height:"auto"}}))}function v(e){let{videoInfo:t,onClose:n}=e;return a.a.createElement("div",{className:"modal",onClick:n},a.a.createElement("div",{className:"modal-content",onClick:e=>{e.stopPropagation()}},a.a.createElement("span",{className:"close",onClick:n},"\xd7"),a.a.createElement("h2",null,t.videoName),a.a.createElement("div",{className:"embed-container"},a.a.createElement("iframe",{src:(e=>{const t=e.split("vimeo.com/")[1].split("/")[0];return"https://player.vimeo.com/video/".concat(t)})(t.URL),frameBorder:"0",allow:"autoplay; fullscreen",allowFullScreen:!0,title:t.videoName})),a.a.createElement("p",{style:{whiteSpace:"pre-wrap"}},t.Description||"")))}function p(e){let{scenes:t,uniqueVideoIDs:n,selectedVideoInfo:o,setSelectedVideoInfo:c}=e;const r=Object(s.o)(),i=e=>{c(null),l.a.get("".concat(u,"/video_info/").concat(e)).then(t=>{c(t.data),r("/videos/".concat(e))}).catch(e=>{console.error("Error fetching video info: ",e)})};return a.a.createElement("div",{className:"App"},a.a.createElement("div",{className:"video-menu"},n.map(e=>{let{videoID:t,videoName:n}=e;return a.a.createElement("div",{key:t,onClick:()=>i(t)},n)})),a.a.createElement("div",{className:"video-grid"},t.map(e=>a.a.createElement(m,{key:e.sceneURL,src:e.sceneURL,videoID:e.videoID,onVideoClick:()=>i(e.videoID)}))),o&&a.a.createElement(v,{videoInfo:o,onClose:()=>{c(null),r("/")}}))}var f=function(){const[e,t]=Object(o.useState)([]),[n,c]=Object(o.useState)(null),[r,i]=Object(o.useState)([]);return Object(o.useEffect)(()=>{l.a.get("".concat(u,"/scenes")).then(e=>{t(function(e){for(let t=e.length-1;t>0;t--){const n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e}(e.data))}).catch(e=>{console.error("Error fetching scenes: ",e)}),l.a.get("".concat(u,"/videos")).then(e=>{i(e.data)}).catch(e=>{console.error("Error fetching videos: ",e)})},[]),a.a.createElement(d.a,null,a.a.createElement(s.c,null,a.a.createElement(s.a,{path:"/videos/:videoID",element:a.a.createElement(p,{scenes:e,uniqueVideoIDs:r,selectedVideoInfo:n,setSelectedVideoInfo:c})}),a.a.createElement(s.a,{path:"/",element:a.a.createElement(p,{scenes:e,uniqueVideoIDs:r,selectedVideoInfo:n,setSelectedVideoInfo:c})})))};var h=e=>{e&&e instanceof Function&&n.e(3).then(n.bind(null,30)).then(t=>{let{getCLS:n,getFID:o,getFCP:a,getLCP:c,getTTFB:r}=t;n(e),o(e),a(e),c(e),r(e)})};r.a.createRoot(document.getElementById("root")).render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(f,null))),h()}},[[13,1,2]]]);
//# sourceMappingURL=main.e0ea5c73.chunk.js.map