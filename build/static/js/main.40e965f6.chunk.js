(this["webpackJsonpvujade-site"]=this["webpackJsonpvujade-site"]||[]).push([[0],{14:function(e,t,o){e.exports=o.p+"static/media/splashcube.9243f971.gif"},18:function(e,t,o){e.exports=o(35)},26:function(e,t,o){},27:function(e,t,o){},35:function(e,t,o){"use strict";o.r(t);var n=o(0),a=o.n(n),i=o(13),s=o.n(i),c=(o(26),o(36)),r=(o(27),o(14)),l=o.n(r);var h=function(){return a.a.createElement("div",{id:"splash-section",className:"splash-screen"},a.a.createElement("div",{className:"splash-screen"},a.a.createElement("div",{className:"splash-content"},a.a.createElement("img",{src:l.a,alt:"Splash GIF",className:"splash-image"}),a.a.createElement("div",{className:"splash-text"},a.a.createElement("p",null,"The Rubik\u2019s Cube has 43,000,000,000,000,000,000 possible combinations... and ",a.a.createElement("i",null,"one")," solution."),a.a.createElement("p",null,"It's easy to appreciate the puzzle in its solved form: a universe of possibility reduced to six harmonic faces. But ",a.a.createElement("i",null,"leaving")," it solved would squander all that potential."),a.a.createElement("p",null,a.a.createElement("b",null,"VU JA DE")," exists to scramble \u201csolved\u201d arrangements of cultural ephemera. To flip the switch from ",a.a.createElement("i",{style:{color:"blue"}},"solving")," to ",a.a.createElement("i",{style:{color:"blue"}},"playing.")," From ",a.a.createElement("i",{style:{color:"blue"}},"I've been here before")," to ",a.a.createElement("i",{style:{color:"blue"}},"I've never seen this before.")," From ",a.a.createElement("i",{style:{color:"blue"}},"d\xe9j\xe0 vu")," to ",a.a.createElement("i",{style:{color:"blue"}},"vuj\xe0 de.")),a.a.createElement("p",null,"Like the 43 quintillion permutations of the Rubik's Cube, these stories are starting points, not resolutions. They're not made for an algorithmic feed or a distracted scroll, which is why they come to your email. Explore on your own time, at your own pace, with nobody trying to sell you something in the process."),a.a.createElement("div",{className:"splash-embed",style:{display:"flex",justifyContent:"center"}},a.a.createElement("iframe",{src:"https://vujadeworld.substack.com/embed",width:"480",height:"150",style:{border:"0px solid #EEE",background:"white"},title:"VUJADE Substack"})),a.a.createElement("p",{style:{textAlign:"center"}},a.a.createElement("span",{role:"img","aria-label":"Rolling Eyes Emoji"},"\ud83d\ude44"),a.a.createElement("b",null," Keep scrolling to enter "),a.a.createElement("span",{role:"img","aria-label":"Pointing Down Emoji"},"\ud83d\udc47"))))))},u=o(4),m=o(12);const d=Object(n.createContext)(),p=()=>Object(n.useContext)(d),E=e=>{let{children:t}=e;const[o,i]=Object(n.useState)(!1),[s,c]=Object(n.useState)(null),r=Object(n.useCallback)(e=>{console.log("Opening modal for videoID: ".concat(e)),i(!0),c(e)},[]),l=Object(n.useCallback)(()=>{console.log("Closing modal"),i(!1),c(null)},[]),h=Object(n.useMemo)(()=>({isModalOpen:o,currentVideoID:s,openModal:r,closeModal:l}),[o,s,r,l]);return a.a.createElement(d.Provider,{value:h},t)};var f=function(){const e=Object(u.o)(),t=Object(u.m)(),{isModalOpen:o,currentVideoID:i,closeModal:s}=p(),[r,l]=Object(n.useState)(null),[h,m]=Object(n.useState)(!1),d=Object(n.useRef)(null),E=Object(n.useCallback)(e=>{const t=e.split("vimeo.com/")[1].split("/")[0];return"https://player.vimeo.com/video/".concat(t)},[]);Object(n.useEffect)(()=>{const e=t.pathname.split("/")[1];!e||e===i&&r||(m(!0),c.a.get("".concat("https://vujade-site-bd6c94750c62.herokuapp.com","/api/video_info/").concat(e)).then(e=>{l(e.data),m(!1)}).catch(e=>{console.error("Error fetching video info: ",e),m(!1)}))},[t.pathname,i,r]);const f=Object(n.useCallback)(()=>{s(),e("/")},[s,e]),v=Object(n.useMemo)(()=>r?E(r.URL):null,[r,E]);return h||!r?a.a.createElement("div",null,"Loading..."):a.a.createElement("div",{className:"modal-backdrop ".concat(o?"open":""),onClick:f,ref:d},a.a.createElement("div",{className:"modal",onClick:e=>e.stopPropagation()},a.a.createElement("div",{className:"modal-content"},a.a.createElement("span",{className:"close",onClick:f},"\xd7"),a.a.createElement(a.a.Fragment,null,a.a.createElement("h2",null,r?r.videoName:"Loading..."),a.a.createElement("div",{className:"embed-container"},r&&a.a.createElement("iframe",{src:v,allow:"autoplay; fullscreen",allowFullScreen:!0,title:r?r.videoName:""})),r&&a.a.createElement("div",{dangerouslySetInnerHTML:{__html:r.Description}})))))},v=o(15),b=o.n(v),y=o(16),I=o(10),O=o(3),g=function(e,t){void 0===t&&console.warn('THREE.OrbitControls: The second parameter "domElement" is now mandatory.'),t===document&&console.error('THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.'),this.object=e,this.domElement=t,this.enabled=!0,this.target=new O.u,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.autoRotate=!1,this.autoRotateSpeed=2,this.enableKeys=!0,this.keys={LEFT:37,UP:38,RIGHT:39,BOTTOM:40},this.mouseButtons={LEFT:O.g.ROTATE,MIDDLE:O.g.DOLLY,RIGHT:O.g.PAN},this.touches={ONE:O.s.ROTATE,TWO:O.s.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=function(){return l.phi},this.getAzimuthalAngle=function(){return l.theta},this.saveState=function(){o.target0.copy(o.target),o.position0.copy(o.object.position),o.zoom0=o.object.zoom},this.reset=function(){o.target.copy(o.target0),o.object.position.copy(o.position0),o.object.zoom=o.zoom0,o.object.updateProjectionMatrix(),o.dispatchEvent(n),o.update(),c=s.NONE},this.update=function(){var t=new O.u,a=(new O.l).setFromUnitVectors(e.up,new O.u(0,1,0)),i=a.clone().invert(),p=new O.u,E=new O.l,f=2*Math.PI;return function(){var e=o.object.position;t.copy(e).sub(o.target),t.applyQuaternion(a),l.setFromVector3(t),o.autoRotate&&c===s.NONE&&T(2*Math.PI/60/60*o.autoRotateSpeed),o.enableDamping?(l.theta+=h.theta*o.dampingFactor,l.phi+=h.phi*o.dampingFactor):(l.theta+=h.theta,l.phi+=h.phi);var v=o.minAzimuthAngle,b=o.maxAzimuthAngle;return isFinite(v)&&isFinite(b)&&(v<-Math.PI?v+=f:v>Math.PI&&(v-=f),b<-Math.PI?b+=f:b>Math.PI&&(b-=f),l.theta=v<=b?Math.max(v,Math.min(b,l.theta)):l.theta>(v+b)/2?Math.max(v,l.theta):Math.min(b,l.theta)),l.phi=Math.max(o.minPolarAngle,Math.min(o.maxPolarAngle,l.phi)),l.makeSafe(),l.radius*=u,l.radius=Math.max(o.minDistance,Math.min(o.maxDistance,l.radius)),!0===o.enableDamping?o.target.addScaledVector(m,o.dampingFactor):o.target.add(m),t.setFromSpherical(l),t.applyQuaternion(i),e.copy(o.target).add(t),o.object.lookAt(o.target),!0===o.enableDamping?(h.theta*=1-o.dampingFactor,h.phi*=1-o.dampingFactor,m.multiplyScalar(1-o.dampingFactor)):(h.set(0,0,0),m.set(0,0,0)),u=1,!!(d||p.distanceToSquared(o.object.position)>r||8*(1-E.dot(o.object.quaternion))>r)&&(o.dispatchEvent(n),p.copy(o.object.position),E.copy(o.object.quaternion),d=!1,!0)}}(),this.dispose=function(){o.domElement.removeEventListener("contextmenu",W,!1),o.domElement.removeEventListener("pointerdown",z,!1),o.domElement.removeEventListener("wheel",Z,!1),o.domElement.removeEventListener("touchstart",H,!1),o.domElement.removeEventListener("touchend",q,!1),o.domElement.removeEventListener("touchmove",_,!1),o.domElement.ownerDocument.removeEventListener("pointermove",X,!1),o.domElement.ownerDocument.removeEventListener("pointerup",F,!1),o.domElement.removeEventListener("keydown",U,!1)};var o=this,n={type:"change"},a={type:"start"},i={type:"end"},s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},c=s.NONE,r=1e-6,l=new O.r,h=new O.r,u=1,m=new O.u,d=!1,p=new O.t,E=new O.t,f=new O.t,v=new O.t,b=new O.t,y=new O.t,I=new O.t,g=new O.t,P=new O.t;function w(){return Math.pow(.95,o.zoomSpeed)}function T(e){h.theta-=e}function V(e){h.phi-=e}var L=function(){var e=new O.u;return function(t,o){e.setFromMatrixColumn(o,0),e.multiplyScalar(-t),m.add(e)}}(),x=function(){var e=new O.u;return function(t,n){!0===o.screenSpacePanning?e.setFromMatrixColumn(n,1):(e.setFromMatrixColumn(n,0),e.crossVectors(o.object.up,e)),e.multiplyScalar(t),m.add(e)}}(),S=function(){var e=new O.u;return function(t,n){var a=o.domElement;if(o.object.isPerspectiveCamera){var i=o.object.position;e.copy(i).sub(o.target);var s=e.length();s*=Math.tan(o.object.fov/2*Math.PI/180),L(2*t*s/a.clientHeight,o.object.matrix),x(2*n*s/a.clientHeight,o.object.matrix)}else o.object.isOrthographicCamera?(L(t*(o.object.right-o.object.left)/o.object.zoom/a.clientWidth,o.object.matrix),x(n*(o.object.top-o.object.bottom)/o.object.zoom/a.clientHeight,o.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),o.enablePan=!1)}}();function k(e){o.object.isPerspectiveCamera?u/=e:o.object.isOrthographicCamera?(o.object.zoom=Math.max(o.minZoom,Math.min(o.maxZoom,o.object.zoom*e)),o.object.updateProjectionMatrix(),d=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),o.enableZoom=!1)}function M(e){o.object.isPerspectiveCamera?u*=e:o.object.isOrthographicCamera?(o.object.zoom=Math.max(o.minZoom,Math.min(o.maxZoom,o.object.zoom/e)),o.object.updateProjectionMatrix(),d=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),o.enableZoom=!1)}function j(e){p.set(e.clientX,e.clientY)}function N(e){v.set(e.clientX,e.clientY)}function D(e){if(1===e.touches.length)p.set(e.touches[0].pageX,e.touches[0].pageY);else{var t=.5*(e.touches[0].pageX+e.touches[1].pageX),o=.5*(e.touches[0].pageY+e.touches[1].pageY);p.set(t,o)}}function B(e){if(1===e.touches.length)v.set(e.touches[0].pageX,e.touches[0].pageY);else{var t=.5*(e.touches[0].pageX+e.touches[1].pageX),o=.5*(e.touches[0].pageY+e.touches[1].pageY);v.set(t,o)}}function Y(e){var t=e.touches[0].pageX-e.touches[1].pageX,o=e.touches[0].pageY-e.touches[1].pageY,n=Math.sqrt(t*t+o*o);I.set(0,n)}function A(e){if(1===e.touches.length)E.set(e.touches[0].pageX,e.touches[0].pageY);else{var t=.5*(e.touches[0].pageX+e.touches[1].pageX),n=.5*(e.touches[0].pageY+e.touches[1].pageY);E.set(t,n)}f.subVectors(E,p).multiplyScalar(o.rotateSpeed);var a=o.domElement;T(2*Math.PI*f.x/a.clientHeight),V(2*Math.PI*f.y/a.clientHeight),p.copy(E)}function R(e){if(1===e.touches.length)b.set(e.touches[0].pageX,e.touches[0].pageY);else{var t=.5*(e.touches[0].pageX+e.touches[1].pageX),n=.5*(e.touches[0].pageY+e.touches[1].pageY);b.set(t,n)}y.subVectors(b,v).multiplyScalar(o.panSpeed),S(y.x,y.y),v.copy(b)}function C(e){var t=e.touches[0].pageX-e.touches[1].pageX,n=e.touches[0].pageY-e.touches[1].pageY,a=Math.sqrt(t*t+n*n);g.set(0,a),P.set(0,Math.pow(g.y/I.y,o.zoomSpeed)),k(P.y),I.copy(g)}function z(e){if(!1!==o.enabled)switch(e.pointerType){case"mouse":case"pen":!function(e){var t;switch(e.preventDefault(),o.domElement.focus?o.domElement.focus():window.focus(),e.button){case 0:t=o.mouseButtons.LEFT;break;case 1:t=o.mouseButtons.MIDDLE;break;case 2:t=o.mouseButtons.RIGHT;break;default:t=-1}switch(t){case O.g.DOLLY:if(!1===o.enableZoom)return;!function(e){I.set(e.clientX,e.clientY)}(e),c=s.DOLLY;break;case O.g.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===o.enablePan)return;N(e),c=s.PAN}else{if(!1===o.enableRotate)return;j(e),c=s.ROTATE}break;case O.g.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===o.enableRotate)return;j(e),c=s.ROTATE}else{if(!1===o.enablePan)return;N(e),c=s.PAN}break;default:c=s.NONE}c!==s.NONE&&(o.domElement.ownerDocument.addEventListener("pointermove",X,!1),o.domElement.ownerDocument.addEventListener("pointerup",F,!1),o.dispatchEvent(a))}(e);break;default:console.log("Unhandled key: ".concat(e))}}function X(e){if(!1!==o.enabled)switch(e.pointerType){case"mouse":case"pen":!function(e){if(!1===o.enabled)return;switch(e.preventDefault(),c){case s.ROTATE:if(!1===o.enableRotate)return;!function(e){E.set(e.clientX,e.clientY),f.subVectors(E,p).multiplyScalar(o.rotateSpeed);var t=o.domElement;T(2*Math.PI*f.x/t.clientHeight),V(2*Math.PI*f.y/t.clientHeight),p.copy(E),o.update()}(e);break;case s.DOLLY:if(!1===o.enableZoom)return;!function(e){g.set(e.clientX,e.clientY),P.subVectors(g,I),P.y>0?k(w()):P.y<0&&M(w()),I.copy(g),o.update()}(e);break;case s.PAN:if(!1===o.enablePan)return;!function(e){b.set(e.clientX,e.clientY),y.subVectors(b,v).multiplyScalar(o.panSpeed),S(y.x,y.y),v.copy(b),o.update()}(e);break;default:console.log("Unhandled key: ".concat(e.keyCode))}}(e);break;default:console.log("Unhandled key: ".concat(e))}}function F(e){switch(e.pointerType){case"mouse":case"pen":!function(e){if(o.domElement.ownerDocument.removeEventListener("pointermove",X,!1),o.domElement.ownerDocument.removeEventListener("pointerup",F,!1),!1===o.enabled)return;o.dispatchEvent(i),c=s.NONE}();break;default:console.log("Unhandled key: ".concat(e))}}function Z(e){!1===o.enabled||!1===o.enableZoom||c!==s.NONE&&c!==s.ROTATE||(e.preventDefault(),e.stopPropagation(),o.dispatchEvent(a),function(e){e.deltaY<0?M(w()):e.deltaY>0&&k(w()),o.update()}(e),o.dispatchEvent(i))}function U(e){!1!==o.enabled&&!1!==o.enableKeys&&!1!==o.enablePan&&function(e){var t=!1;switch(e.keyCode){case o.keys.UP:S(0,o.keyPanSpeed),t=!0;break;case o.keys.BOTTOM:S(0,-o.keyPanSpeed),t=!0;break;case o.keys.LEFT:S(o.keyPanSpeed,0),t=!0;break;case o.keys.RIGHT:S(-o.keyPanSpeed,0),t=!0;break;default:console.log("Unhandled key: ".concat(e.keyCode))}t&&(e.preventDefault(),o.update())}(e)}function H(e){if(!1!==o.enabled){switch(e.preventDefault(),e.touches.length){case 1:switch(o.touches.ONE){case O.s.ROTATE:if(!1===o.enableRotate)return;D(e),c=s.TOUCH_ROTATE;break;case O.s.PAN:if(!1===o.enablePan)return;B(e),c=s.TOUCH_PAN;break;default:c=s.NONE}break;case 2:switch(o.touches.TWO){case O.s.DOLLY_PAN:if(!1===o.enableZoom&&!1===o.enablePan)return;!function(e){o.enableZoom&&Y(e),o.enablePan&&B(e)}(e),c=s.TOUCH_DOLLY_PAN;break;case O.s.DOLLY_ROTATE:if(!1===o.enableZoom&&!1===o.enableRotate)return;!function(e){o.enableZoom&&Y(e),o.enableRotate&&D(e)}(e),c=s.TOUCH_DOLLY_ROTATE;break;default:c=s.NONE}break;default:c=s.NONE}c!==s.NONE&&o.dispatchEvent(a)}}function _(e){if(!1!==o.enabled)switch(e.preventDefault(),e.stopPropagation(),c){case s.TOUCH_ROTATE:if(!1===o.enableRotate)return;A(e),o.update();break;case s.TOUCH_PAN:if(!1===o.enablePan)return;R(e),o.update();break;case s.TOUCH_DOLLY_PAN:if(!1===o.enableZoom&&!1===o.enablePan)return;!function(e){o.enableZoom&&C(e),o.enablePan&&R(e)}(e),o.update();break;case s.TOUCH_DOLLY_ROTATE:if(!1===o.enableZoom&&!1===o.enableRotate)return;!function(e){o.enableZoom&&C(e),o.enableRotate&&A(e)}(e),o.update();break;default:c=s.NONE}}function q(e){!1!==o.enabled&&(o.dispatchEvent(i),c=s.NONE)}function W(e){!1!==o.enabled&&e.preventDefault()}o.domElement.addEventListener("contextmenu",W,!1),o.domElement.addEventListener("pointerdown",z,!1),o.domElement.addEventListener("wheel",Z,!1),o.domElement.addEventListener("touchstart",H,!1),o.domElement.addEventListener("touchend",q,!1),o.domElement.addEventListener("touchmove",_,!1),o.domElement.addEventListener("keydown",U,!1),this.update()};(g.prototype=Object.create(O.d.prototype)).constructor=g;var P=function(e,t){g.call(this,e,t),this.screenSpacePanning=!1,this.mouseButtons.LEFT=O.g.PAN,this.mouseButtons.RIGHT=O.g.ROTATE,this.touches.ONE=O.s.PAN,this.touches.TWO=O.s.DOLLY_ROTATE};(P.prototype=Object.create(O.d.prototype)).constructor=P;const w=Object.freeze({POSITIVE:{X:"x",Y:"y",Z:"z"},NEGATIVE:{X:"-x",Y:"-y",Z:"-z"}}),T=Object.freeze({[w.POSITIVE.X]:new O.u(1,0,0),[w.POSITIVE.Y]:new O.u(0,1,0),[w.POSITIVE.Z]:new O.u(0,0,1),[w.NEGATIVE.X]:new O.u(-1,0,0),[w.NEGATIVE.Y]:new O.u(0,-1,0),[w.NEGATIVE.Z]:new O.u(0,0,-1)}),V=Object.freeze({SOLUTION_START:"start",SOLUTION_END:"end"}),L=Object.freeze({NONE:"none",ROTATION:"rotation",CUBIE:"cubie"}),x=Object.freeze({u:"U",d:"D",f:"F",b:"B",r:"R",l:"L",m:"M",e:"E",s:"S",x:"X",y:"Y",z:"Z",U:"U'",D:"D'",F:"F'",B:"B'",R:"R'",L:"L'",M:"M'",E:"E'",S:"S'",X:"X'",Y:"Y'",Z:"Z'",wu:"u",wd:"d",wf:"f",wb:"b",wr:"r",wl:"l",wU:"u'",wD:"d'",wF:"f'",wB:"b'",wR:"r'",wL:"l'"});const S=[function(e){const t=new O.h;return t.set(1,0,0,0,Math.cos(e),-Math.sin(e),0,Math.sin(e),Math.cos(e)),t},function(e){const t=new O.h;return t.set(Math.cos(e),0,Math.sin(e),0,1,0,-Math.sin(e),0,Math.cos(e)),t},function(e){const t=new O.h;return t.set(Math.cos(e),-Math.sin(e),0,Math.sin(e),Math.cos(e),0,0,0,1),t}],k=Object.freeze({[w.POSITIVE.X]:0,[w.POSITIVE.Y]:1,[w.POSITIVE.Z]:2});function M(e,t){return S[k[e]](t)}const j=new O.p,N=.925;j.moveTo(0,.1),j.lineTo(0,0+N-.1),j.quadraticCurveTo(0,0+N,.1,0+N),j.lineTo(0+N-.1,0+N),j.quadraticCurveTo(0+N,0+N,0+N,0+N-.1),j.lineTo(0+N,.1),j.quadraticCurveTo(0+N,0,0+N-.1,0),j.lineTo(.1,0),j.quadraticCurveTo(0,0,0,.1);const D=new O.q(j);D.center();var B=class{constructor(e,t,o,n,a){this.positionVector=new O.u(e,t,o),this.fixedPositionVector=new O.u(e,t,o),this.facingVector=n,this.fixedFacingVector=new O.u(n.x,n.y,n.z);const i=document.createElement("video");i.crossOrigin="anonymous",i.src=a,i.load(),i.muted=!0,i.loop=!0,i.play().catch(e=>console.error("Autoplay was prevented:",e));const s=new O.v(i);s.minFilter=O.f,s.magFilter=O.f,s.format=O.m,this.material=new O.j({map:s,side:O.c}),this.mesh=new O.i(D,this.material),this.updatePosition(this.fixedPositionVector,this.fixedFacingVector),this.mesh.rotation.y=.5*Math.PI*Math.abs(this.facingVector.x),this.mesh.rotation.x=.5*Math.PI*Math.abs(this.facingVector.y)}updatePosition(e,t){this.mesh.position.x=e.x+.5*t.x,this.mesh.position.y=e.y+.5*t.y,this.mesh.position.z=e.z+.5*t.z,this.mesh.position.x+=this.mesh.position.x>0?.001:-.001,this.mesh.position.y+=this.mesh.position.y>0?.001:-.001,this.mesh.position.z+=this.mesh.position.z>0?.001:-.001;const o=Object.values(w.POSITIVE);o.forEach(n=>{if(e[n]===t[n]&&1===Math.abs(e[n]))for(const t of o.filter(e=>e!==n))1===e[t]?this.mesh.position[t]-=.025:-1===e[t]&&(this.mesh.position[t]+=.025)})}lockPosition(){const e=Math.round(this.fixedPositionVector.x),t=Math.round(this.fixedPositionVector.y),o=Math.round(this.fixedPositionVector.z);this.positionVector=new O.u(e,t,o),this.fixedPositionVector=new O.u(e,t,o),this.facingVector=new O.u(Math.round(this.fixedFacingVector.x),Math.round(this.fixedFacingVector.y),Math.round(this.fixedFacingVector.z)),this.fixedFacingVector=new O.u(this.facingVector.x,this.facingVector.y,this.facingVector.z),this.mesh.rotation.y=.5*Math.PI*Math.abs(this.facingVector.x),this.mesh.rotation.x=.5*Math.PI*Math.abs(this.facingVector.y),this.mesh.rotation.z=0}turn(e,t){var o=M(e,t*Math.PI*.5);this.fixedFacingVector.applyMatrix3(o),this.fixedPositionVector.applyMatrix3(o),this.lockPosition(),this.updatePosition(this.fixedPositionVector,this.fixedFacingVector),this.mesh.rotation.y=.5*Math.PI*Math.abs(this.facingVector.x),this.mesh.rotation.x=.5*Math.PI*Math.abs(this.facingVector.y)}rotate(e,t){var o=M(e,t);this.facingVector.applyMatrix3(o),this.positionVector.applyMatrix3(o),this.updatePosition(this.positionVector,this.facingVector),this.mesh.rotateOnWorldAxis(T[e],t)}};const Y=new O.p,A=1e-5;Y.absarc(A,A,A,-Math.PI/2,-Math.PI,!0),Y.absarc(A,.90002,A,Math.PI,Math.PI/2,!0),Y.absarc(.90002,.90002,A,Math.PI/2,0,!0),Y.absarc(.90002,A,A,0,-Math.PI/2,!0);const R=new O.e(Y,{depth:.9,bevelEnabled:!0,bevelSegments:32,steps:1,bevelSize:.04999,bevelThickness:.05,curveSegments:16});R.center();const C=new O.j({color:0});var z=class{constructor(e,t,o,n){this.angle=0,this.animating=!1,this.animateAxis=null,this.animateDir=0,this.positionVector=new O.u(e,t,o),this.fixedPositionVector=new O.u(e,t,o),this.mesh=new O.i(R,C),this.stickers=[];let a=0;-1===e?this.stickers.push(new B(e,t,o,new O.u(-1,0,0),n[a++])):1===e&&this.stickers.push(new B(e,t,o,new O.u(1,0,0),n[a++])),-1===t?this.stickers.push(new B(e,t,o,new O.u(0,-1,0),n[a++])):1===t&&this.stickers.push(new B(e,t,o,new O.u(0,1,0),n[a++])),-1===o?this.stickers.push(new B(e,t,o,new O.u(0,0,-1),n[a++])):1===o&&this.stickers.push(new B(e,t,o,new O.u(0,0,1),n[a++])),this.updatePosition(this.fixedPositionVector)}updatePosition(e){this.mesh.position.x=e.x,this.mesh.position.y=e.y,this.mesh.position.z=e.z}lockPosition(){const e=Math.round(this.fixedPositionVector.x),t=Math.round(this.fixedPositionVector.y),o=Math.round(this.fixedPositionVector.z);this.positionVector=new O.u(e,t,o),this.fixedPositionVector=new O.u(e,t,o),this.mesh.position.x=e,this.mesh.position.y=t,this.mesh.position.z=o,this.stickers.forEach(e=>{e.lockPosition()})}turn(e,t){var o=M(e,t*Math.PI*.5);this.fixedPositionVector.applyMatrix3(o),this.lockPosition(),this.updatePosition(this.fixedPositionVector),this.mesh.rotation.x=0,this.mesh.rotation.y=0,this.mesh.rotation.z=0,this.stickers.forEach(o=>{o.turn(e,t)})}rotate(e,t){const o=M(e,t);this.positionVector.applyMatrix3(o),this.updatePosition(this.positionVector),this.mesh.rotation[e]+=t,this.stickers.forEach(o=>{o.rotate(e,t)})}};var X=class{constructor(e,t){this.cubies=[],this.meshes=[],this.stickersMap=new Map,this.videoURLs=t;let o=0;for(let n=-1;n<=1;n++)for(let e=-1;e<=1;e++)for(let t=-1;t<=1;t++)if(0!==n||0!==e||0!==t){const a=this.videoURLs.slice(o,o+3);this.cubies.push(new z(n,e,t,a)),o+=3}this.cubies.forEach(t=>{e.add(t.mesh),this.meshes.push(t.mesh),t.stickers.forEach(t=>{e.add(t.mesh),this.meshes.push(t.mesh),this.stickersMap.set(t.mesh.uuid,t)})})}forEach(e){this.cubies.forEach(t=>{e(t)})}repr(){const e=[[["B","B","B"],["B","B","B"],["B","B","B"]],[["B","B","B"],["B","B","B"],["B","B","B"]],[["B","B","B"],["B","B","B"],["B","B","B"]],[["B","B","B"],["B","B","B"],["B","B","B"]],[["B","B","B"],["B","B","B"],["B","B","B"]],[["B","B","B"],["B","B","B"],["B","B","B"]]];this.cubies.forEach(t=>{1===t.positionVector.y&&t.stickers.forEach(t=>{1===t.facingVector.y&&(e[0][t.fixedPositionVector.z+1][t.fixedPositionVector.x+1]=t.getColor())}),-1===t.positionVector.y&&t.stickers.forEach(t=>{-1===t.facingVector.y&&(e[1][-1*t.fixedPositionVector.z+1][t.fixedPositionVector.x+1]=t.getColor())}),1===t.positionVector.z&&t.stickers.forEach(t=>{1===t.facingVector.z&&(e[2][-1*t.fixedPositionVector.y+1][t.fixedPositionVector.x+1]=t.getColor())}),-1===t.positionVector.z&&t.stickers.forEach(t=>{-1===t.facingVector.z&&(e[3][-1*t.fixedPositionVector.y+1][-1*t.fixedPositionVector.x+1]=t.getColor())}),1===t.positionVector.x&&t.stickers.forEach(t=>{1===t.facingVector.x&&(e[4][-1*t.fixedPositionVector.y+1][-1*t.fixedPositionVector.z+1]=t.getColor())}),-1===t.positionVector.x&&t.stickers.forEach(t=>{-1===t.facingVector.x&&(e[5][-1*t.fixedPositionVector.y+1][t.fixedPositionVector.z+1]=t.getColor())})});let t="";return e.forEach(e=>{e.forEach(e=>{t+=e.join("")})}),t}move(e){switch(e){case"U":return void this.moveLayer(w.POSITIVE.Y,1,1);case"U'":return void this.moveLayer(w.POSITIVE.Y,1,-1);case"u":return this.moveLayer(w.POSITIVE.Y,1,1),void this.moveLayer(w.POSITIVE.Y,0,-1);case"u'":return this.moveLayer(w.POSITIVE.Y,1,-1),void this.moveLayer(w.POSITIVE.Y,0,1);case"D":return void this.moveLayer(w.POSITIVE.Y,-1,1);case"D'":return void this.moveLayer(w.POSITIVE.Y,-1,-1);case"d":return this.moveLayer(w.POSITIVE.Y,-1,1),void this.moveLayer(w.POSITIVE.Y,0,1);case"d'":return this.moveLayer(w.POSITIVE.Y,-1,-1),void this.moveLayer(w.POSITIVE.Y,0,-1);case"F":return void this.moveLayer(w.POSITIVE.Z,1,1);case"F'":return void this.moveLayer(w.POSITIVE.Z,1,-1);case"f":return this.moveLayer(w.POSITIVE.Z,1,1),void this.moveLayer(w.POSITIVE.Z,0,1);case"f'":return this.moveLayer(w.POSITIVE.Z,1,-1),void this.moveLayer(w.POSITIVE.Z,0,-1);case"B":return void this.moveLayer(w.POSITIVE.Z,-1,1);case"B'":return void this.moveLayer(w.POSITIVE.Z,-1,-1);case"b":return this.moveLayer(w.POSITIVE.Z,-1,1),void this.moveLayer(w.POSITIVE.Z,0,-1);case"b'":return this.moveLayer(w.POSITIVE.Z,-1,-1),void this.moveLayer(w.POSITIVE.Z,0,1);case"R":return void this.moveLayer(w.POSITIVE.X,1,1);case"R'":return void this.moveLayer(w.POSITIVE.X,1,-1);case"r":return this.moveLayer(w.POSITIVE.X,1,1),void this.moveLayer(w.POSITIVE.X,0,-1);case"r'":return this.moveLayer(w.POSITIVE.X,1,-1),void this.moveLayer(w.POSITIVE.X,0,1);case"L":return void this.moveLayer(w.POSITIVE.X,-1,1);case"L'":return void this.moveLayer(w.POSITIVE.X,-1,-1);case"l":return this.moveLayer(w.POSITIVE.X,-1,1),void this.moveLayer(w.POSITIVE.X,0,1);case"l'":return this.moveLayer(w.POSITIVE.X,-1,-1),void this.moveLayer(w.POSITIVE.X,0,-1);case"M":return void this.moveLayer(w.POSITIVE.X,0,1);case"M'":return void this.moveLayer(w.POSITIVE.X,0,-1);case"E":return void this.moveLayer(w.POSITIVE.Y,0,1);case"E'":return void this.moveLayer(w.POSITIVE.Y,0,-1);case"S":return void this.moveLayer(w.POSITIVE.Z,0,1);case"S'":return void this.moveLayer(w.POSITIVE.Z,0,-1);case"x":case"X":return this.moveLayer(w.POSITIVE.X,-1,-1),this.moveLayer(w.POSITIVE.X,0,-1),void this.moveLayer(w.POSITIVE.X,1,1);case"x'":case"X'":return this.moveLayer(w.POSITIVE.X,-1,1),this.moveLayer(w.POSITIVE.X,0,1),void this.moveLayer(w.POSITIVE.X,1,-1);case"y":case"Y":return this.moveLayer(w.POSITIVE.Y,-1,-1),this.moveLayer(w.POSITIVE.Y,0,-1),void this.moveLayer(w.POSITIVE.Y,1,1);case"y'":case"Y'":return this.moveLayer(w.POSITIVE.Y,-1,1),this.moveLayer(w.POSITIVE.Y,0,1),void this.moveLayer(w.POSITIVE.Y,1,-1);case"z":case"Z":return this.moveLayer(w.POSITIVE.Z,-1,-1),this.moveLayer(w.POSITIVE.Z,0,1),void this.moveLayer(w.POSITIVE.Z,1,1);case"z'":case"Z'":return this.moveLayer(w.POSITIVE.Z,-1,1),this.moveLayer(w.POSITIVE.Z,0,-1),void this.moveLayer(w.POSITIVE.Z,1,-1);default:console.warn("Unhandled move: ".concat(e))}}moveLayer(e,t,o){let n=o;0!==t?n*=-1*t:e===w.POSITIVE.Z&&(n*=-1),this.cubies.forEach(o=>{o.positionVector[e]===t&&(o.animating=!0,o.angle=0,o.animateAxis=e,o.animateDir=n)})}};function F(e){let t=!1;const o=new O.t,n=new O.t,a=new O.n,i=()=>.95*window.innerHeight;let s=[],c=!1,r=!1;const l=document.getElementById("three"),h=new O.o;h.background=new O.b(16119285);const u=new O.k(75,window.innerWidth/i(),.1,1e3);u.position.set(4,4,6);const m=new O.w({antialias:!0});m.setPixelRatio(window.devicePixelRatio),m.setSize(window.innerWidth,i()),l.appendChild(m.domElement);const d=new g(u,m.domElement);d.minDistance=5,d.maxDistance=15,d.enablePan=!1,d.enableRotate=!1,d.update();const p=new X(h,e);let E;const f=()=>{const e=window.innerWidth/2;p.cubies.forEach(t=>{if(1===t.fixedPositionVector.x&&-1===t.fixedPositionVector.y&&1===t.fixedPositionVector.z){const o=t.fixedPositionVector.clone();o.project(u),E=o.x*e+e}})};f(),d.addEventListener("change",f);const v=new O.a,b=()=>{const e=v.getDelta();if(!c&&s.length>0){const e=s.shift();e===V.SOLUTION_END?(r=!1,c=!1):e===V.SOLUTION_START?(console.log("Cube solving functionality has been disabled."),r=!1):(p.move(e),c=!0)}p.forEach(t=>{t.animating&&(t.angle>=.5*Math.PI?(t.angle=0,t.animating=!1,t.turn(t.animateAxis,t.animateDir),t.lockPosition(),c=!1):(t.rotate(t.animateAxis,t.animateDir*e*12.5),t.angle+=12.5*e))})},y=()=>{requestAnimationFrame(y),b(),m.render(h,u)};y();document.addEventListener("keypress",e=>{if(r)return;const o=t?"w"+e.key:e.key;void 0!==x[o]?s.push(x[o]):"Enter"===e.key?(r=!0,s.push(V.SOLUTION_START)):"w"!==e.key&&"W"!==e.key||(t=!0)},!1);document.addEventListener("keyup",e=>{"w"!==e.key&&"W"!==e.key||(t=!1)},!1);window.addEventListener("resize",()=>{u.aspect=window.innerWidth/i(),u.updateProjectionMatrix(),m.setSize(window.innerWidth,i()),f()},!1);document.addEventListener("touchstart",e=>{e.offsetX=e.touches[0].clientX,e.offsetY=e.touches[0].clientY-0,k(e)},!1);document.addEventListener("touchend",e=>{M(e)},!1);document.addEventListener("touchmove",e=>{e.offsetX=e.touches[0].clientX,e.offsetY=e.touches[0].clientY-0,j(e)},!1);let I=null,P=0,T=L.NONE,S=!1;const k=e=>{if("canvas"!==e.target.tagName.toLowerCase())return;S=!0,o.x=e.offsetX/window.innerWidth*2-1,o.y=-e.offsetY/i()*2+1,a.setFromCamera(o.clone(),u);const t=a.intersectObjects(p.meshes,!0);T=0!==t.length?p.stickersMap.has(t[0].object.uuid)?t[0]:L.CUBIE:L.ROTATION};document.addEventListener("pointerdown",k,!1);const M=e=>{S=!1,T=L.NONE,I=null,P=0};document.addEventListener("pointerup",M,!1);const j=e=>{if(!S||null!==I||r)return;if(T===L.CUBIE)return;if(n.x=e.offsetX/window.innerWidth*2-1-o.x,n.y=-e.offsetY/i()*2+1-o.y,n.length()<=(window.innerWidth<=500?.1:.05))return;if(Math.abs(n.x)>Math.abs(n.y)?(I=w.POSITIVE.X,P=n.x>0?1:-1):(I=w.POSITIVE.Y,P=n.y>0?1:-1),T===L.ROTATION)return void(I===w.POSITIVE.X?-1===P?s.push("y"):1===P&&s.push("y'"):I===w.POSITIVE.Y&&(e.offsetX<E?-1===P?s.push("x'"):1===P&&s.push("x"):-1===P?s.push("z"):1===P&&s.push("z'")));const t=p.stickersMap.get(T.object.uuid);if(I===w.POSITIVE.X)if(1===t.fixedFacingVector.y)switch(t.fixedPositionVector.z){case-1:-1*P===-1?s.push("B'"):-1*P===1&&s.push("B");break;case 0:-1===P?s.push("S'"):1===P&&s.push("S");break;case 1:-1===P?s.push("F'"):1===P&&s.push("F")}else switch(t.fixedPositionVector.y){case-1:-1===P?s.push("D'"):1===P&&s.push("D");break;case 0:-1===P?s.push("E'"):1===P&&s.push("E");break;case 1:-1*P===-1?s.push("U'"):-1*P===1&&s.push("U")}else if(I===w.POSITIVE.Y)if(1===t.fixedFacingVector.x)switch(t.fixedPositionVector.z){case-1:-1===P?s.push("B'"):1===P&&s.push("B");break;case 0:-1*P===-1?s.push("S'"):-1*P===1&&s.push("S");break;case 1:-1*P===-1?s.push("F'"):-1*P===1&&s.push("F")}else switch(t.fixedPositionVector.x){case-1:-1*P===-1?s.push("L'"):-1*P===1&&s.push("L");break;case 0:-1*P===-1?s.push("M'"):-1*P===1&&s.push("M");break;case 1:-1===P?s.push("R'"):1===P&&s.push("R")}S=!1};document.addEventListener("pointermove",j,!1)}const Z="https://vujade-site-bd6c94750c62.herokuapp.com",U=a.a.memo(e=>{let{src:t,videoID:o,onVideoClick:i}=e;const s=Object(n.useRef)(null),{ref:c,inView:r}=Object(y.a)({triggerOnce:!0,rootMargin:"50px 0px"}),l=Object(n.useCallback)(()=>{!I.isMobile&&s.current&&s.current.play().catch(e=>console.error("Play was interrupted.",e))},[]),h=Object(n.useCallback)(()=>{!I.isMobile&&s.current&&s.current.pause()},[]);return Object(n.useEffect)(()=>{I.isMobile&&r&&s.current&&s.current.play().catch(e=>console.log("Autoplay was prevented.",e))},[r]),a.a.createElement("div",{ref:c,style:{width:"100%",height:"auto"}},r&&a.a.createElement("video",{ref:s,src:t,loop:!0,muted:!0,playsInline:!0,onClick:()=>{console.log("Video clicked: ".concat(o)),i(o)},onMouseEnter:l,onMouseLeave:h,style:{width:"100%",height:"auto"}}))},(e,t)=>e.videoID===t.videoID&&e.src===t.src);function H(e){for(let t=e.length-1;t>0;t--){const o=Math.floor(Math.random()*(t+1));[e[t],e[o]]=[e[o],e[t]]}return e}const _=a.a.memo((function(e){let{scenes:t,uniqueVideoIDs:o}=e;const i=Object(u.o)(),{videoID:s}=Object(u.q)(),c=Object(u.m)(),{openModal:r,currentVideoID:l}=p(),[h,m]=Object(n.useState)([]);Object(n.useEffect)(()=>{m(H([...t]))},[t]),Object(n.useEffect)(()=>{s&&t.some(e=>e.videoID===s)&&l!==s&&(console.log("Effect to open modal for videoID: ".concat(s)),r(s))},[s,t,r,l]);const d=Object(n.useCallback)(e=>{const t="/welcome"===c.pathname,o=()=>{t&&c.pathname==="/".concat(e)||i("/".concat(e)),r(e)};t?(window.scrollTo({top:document.documentElement.clientHeight,behavior:"smooth"}),setTimeout(()=>{i("/"),console.log("Preparing to open modal for videoID: ".concat(e)),o()},600)):o()},[r,i,c.pathname]);return a.a.createElement("div",{id:"videos-section",className:"App"},a.a.createElement("div",{className:"video-menu"},o.map((e,t)=>a.a.createElement("div",{key:"".concat(e.videoID,"-").concat(t),onClick:()=>d(e.videoID),className:"video-menu-item"},e.videoName))),a.a.createElement("div",{className:"video-grid"},h.map(e=>a.a.createElement(U,{key:e.sceneURL,src:e.sceneURL,videoID:e.videoID,onVideoClick:d}))))}));function q(e){let{scenes:t,uniqueVideoIDs:o}=e;const i=Object(u.o)(),s=Object(u.m)(),c=Object(n.useRef)(!0),[r,l]=Object(n.useState)("/welcome"===s.pathname),m=Object(n.useRef)(0),d=Object(n.useCallback)(()=>{const e=1*window.innerHeight,t=window.scrollY>e;"/welcome"===s.pathname&&t&&r&&(m.current=window.scrollY,i("/",{replace:!0}),l(!1))},[i,s.pathname,r]);Object(n.useEffect)(()=>(window.addEventListener("scroll",d),()=>window.removeEventListener("scroll",d)),[d]),Object(n.useEffect)(()=>{r||(console.log("Scroll position before navigation: ".concat(m.current)),window.scrollTo(0,m.current),console.log("Scroll position after splash screen hidden, restored to previous state"))},[r]),Object(n.useEffect)(()=>{c.current?c.current=!1:l("/welcome"===s.pathname)},[s.pathname]);const p=r?{}:{display:"none"};return a.a.createElement(a.a.Fragment,null,a.a.createElement("div",{style:p},a.a.createElement(h,null)),a.a.createElement(_,{scenes:t,uniqueVideoIDs:o}))}function W(){const[e,t]=Object(n.useState)([]);return Object(n.useEffect)(()=>{(async()=>{try{const e=H((await c.a.get("".concat(Z,"/api/scenes"))).data.map(e=>e.sceneURL));t(e)}catch(e){console.error("Error fetching cube videos: ",e)}})()},[]),Object(n.useEffect)(()=>{e.length>0&&F(e)},[e]),a.a.createElement("div",{id:"cube-container"})}var G=function(){const[e,t]=Object(n.useState)([]),[o,i]=Object(n.useState)([]);Object(n.useEffect)(()=>{(async()=>{try{const e=await c.a.get("".concat(Z,"/api/scenes"));t(e.data);const o=await c.a.get("".concat(Z,"/api/videos"));i(b.a.uniqBy(o.data,"videoID")),console.log("Fetched scenes:",e.data),console.log("Fetched videos:",o.data)}catch(e){console.error("Error fetching content: ",e)}})()},[]);const s=Object(n.useMemo)(()=>e,[e]),r=Object(n.useMemo)(()=>o,[o]);return a.a.createElement(m.a,null,a.a.createElement(n.Suspense,{fallback:a.a.createElement("div",null,"Loading...")},a.a.createElement(E,null,a.a.createElement(u.c,null,a.a.createElement(u.a,{path:"/welcome",element:a.a.createElement(q,{scenes:s,uniqueVideoIDs:r})}),a.a.createElement(u.a,{path:"/cube-master",element:a.a.createElement(W,null)}),a.a.createElement(u.a,{path:"/",element:a.a.createElement(q,{scenes:s,uniqueVideoIDs:r})}),a.a.createElement(u.a,{path:"/:videoID",element:a.a.createElement(a.a.Fragment,null,a.a.createElement(q,{scenes:s,uniqueVideoIDs:r}),a.a.createElement(f,null))})))))};var K=e=>{e&&e instanceof Function&&o.e(3).then(o.bind(null,37)).then(t=>{let{getCLS:o,getFID:n,getFCP:a,getLCP:i,getTTFB:s}=t;o(e),n(e),a(e),i(e),s(e)})};s.a.createRoot(document.getElementById("root")).render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(E,null,a.a.createElement(G,null)))),K()}},[[18,1,2]]]);
//# sourceMappingURL=main.40e965f6.chunk.js.map