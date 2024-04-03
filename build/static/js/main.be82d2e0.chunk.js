(this["webpackJsonpvujade-site"]=this["webpackJsonpvujade-site"]||[]).push([[0],{14:function(e,t,o){e.exports=o.p+"static/media/splashcube.9243f971.gif"},18:function(e,t,o){e.exports=o(35)},26:function(e,t,o){},27:function(e,t,o){},35:function(e,t,o){"use strict";o.r(t);var n={};o.r(n);var a=o(0),i=o.n(a),s=o(13),c=o.n(s),r=(o(26),o(36)),l=(o(27),o(14)),h=o.n(l);var u=function(){return i.a.createElement("div",{id:"splash-section",className:"splash-screen"},i.a.createElement("div",{className:"splash-screen"},i.a.createElement("div",{className:"splash-content"},i.a.createElement("img",{src:h.a,alt:"Splash GIF",className:"splash-image"}),i.a.createElement("div",{className:"splash-text"},i.a.createElement("p",null,"The Rubik\u2019s Cube has 43,000,000,000,000,000,000 possible combinations... and ",i.a.createElement("i",null,"one")," solution."),i.a.createElement("p",null,"It's easy to appreciate the puzzle in its solved form: a universe of possibility reduced to six harmonic faces. But ",i.a.createElement("i",null,"leaving")," it solved would squander all that potential."),i.a.createElement("p",null,i.a.createElement("b",null,"VU JA DE")," exists to scramble \u201csolved\u201d arrangements of cultural ephemera. To flip the switch from ",i.a.createElement("i",{style:{color:"blue"}},"solving")," to ",i.a.createElement("i",{style:{color:"blue"}},"playing.")," From ",i.a.createElement("i",{style:{color:"blue"}},"I've been here before")," to ",i.a.createElement("i",{style:{color:"blue"}},"I've never seen this before.")," From ",i.a.createElement("i",{style:{color:"blue"}},"d\xe9j\xe0 vu")," to ",i.a.createElement("i",{style:{color:"blue"}},"vuj\xe0 de.")),i.a.createElement("p",null,"Like the 43 quintillion permutations of the Rubik's Cube, these stories are starting points, not resolutions. They're not made for an algorithmic feed or a distracted scroll, which is why they come to your email. Explore on your own time, at your own pace, with nobody trying to sell you something in the process."),i.a.createElement("div",{className:"splash-embed",style:{display:"flex",justifyContent:"center"}},i.a.createElement("iframe",{src:"https://vujadeworld.substack.com/embed",width:"480",height:"150",style:{border:"0px solid #EEE",background:"white"},title:"VUJADE Substack"})),i.a.createElement("p",{style:{textAlign:"center"}},i.a.createElement("span",{role:"img","aria-label":"Rolling Eyes Emoji"},"\ud83d\ude44"),i.a.createElement("b",null," Keep scrolling to enter "),i.a.createElement("span",{role:"img","aria-label":"Pointing Down Emoji"},"\ud83d\udc47"))))))},m=o(4),d=o(12);const p=Object(a.createContext)(),E=()=>Object(a.useContext)(p),f=e=>{let{children:t}=e;const[o,n]=Object(a.useState)(!1),[s,c]=Object(a.useState)(null),r=Object(a.useCallback)(e=>{console.log("Opening modal for videoID: ".concat(e)),n(!0),c(e)},[]),l=Object(a.useCallback)(()=>{console.log("Closing modal"),n(!1),c(null)},[]),h=Object(a.useMemo)(()=>({isModalOpen:o,currentVideoID:s,openModal:r,closeModal:l}),[o,s,r,l]);return i.a.createElement(p.Provider,{value:h},t)};var v=function(){const e=Object(m.o)(),t=Object(m.m)(),{isModalOpen:o,currentVideoID:n,closeModal:s}=E(),[c,l]=Object(a.useState)(null),[h,u]=Object(a.useState)(!1),d=Object(a.useRef)(null),p=Object(a.useCallback)(e=>{const t=e.split("vimeo.com/")[1].split("/")[0];return"https://player.vimeo.com/video/".concat(t)},[]);Object(a.useEffect)(()=>{const e=t.pathname.split("/")[1];!e||e===n&&c||(u(!0),r.a.get("".concat("https://vujade-site-bd6c94750c62.herokuapp.com","/api/video_info/").concat(e)).then(e=>{l(e.data),u(!1)}).catch(e=>{console.error("Error fetching video info: ",e),u(!1)}))},[t.pathname,n,c]);const f=Object(a.useCallback)(()=>{s(),e("/")},[s,e]),v=Object(a.useMemo)(()=>c?p(c.URL):null,[c,p]);return h||!c?i.a.createElement("div",null,"Loading..."):i.a.createElement("div",{className:"modal-backdrop ".concat(o?"open":""),onClick:f,ref:d},i.a.createElement("div",{className:"modal",onClick:e=>e.stopPropagation()},i.a.createElement("div",{className:"modal-content"},i.a.createElement("span",{className:"close",onClick:f},"\xd7"),i.a.createElement(i.a.Fragment,null,i.a.createElement("h2",null,c?c.videoName:"Loading..."),i.a.createElement("div",{className:"embed-container"},c&&i.a.createElement("iframe",{src:v,allow:"autoplay; fullscreen",allowFullScreen:!0,title:c?c.videoName:""})),c&&i.a.createElement("div",{dangerouslySetInnerHTML:{__html:c.Description}})))))},b=o(15),y=o.n(b),I=o(16),O=o(10),g=o(3),P=function(e,t){void 0===t&&console.warn('THREE.OrbitControls: The second parameter "domElement" is now mandatory.'),t===document&&console.error('THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.'),this.object=e,this.domElement=t,this.enabled=!0,this.target=new g.u,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.autoRotate=!1,this.autoRotateSpeed=2,this.enableKeys=!0,this.keys={LEFT:37,UP:38,RIGHT:39,BOTTOM:40},this.mouseButtons={LEFT:g.g.ROTATE,MIDDLE:g.g.DOLLY,RIGHT:g.g.PAN},this.touches={ONE:g.s.ROTATE,TWO:g.s.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=function(){return l.phi},this.getAzimuthalAngle=function(){return l.theta},this.saveState=function(){o.target0.copy(o.target),o.position0.copy(o.object.position),o.zoom0=o.object.zoom},this.reset=function(){o.target.copy(o.target0),o.object.position.copy(o.position0),o.object.zoom=o.zoom0,o.object.updateProjectionMatrix(),o.dispatchEvent(n),o.update(),c=s.NONE},this.update=function(){var t=new g.u,a=(new g.l).setFromUnitVectors(e.up,new g.u(0,1,0)),i=a.clone().invert(),p=new g.u,E=new g.l,f=2*Math.PI;return function(){var e=o.object.position;t.copy(e).sub(o.target),t.applyQuaternion(a),l.setFromVector3(t),o.autoRotate&&c===s.NONE&&T(2*Math.PI/60/60*o.autoRotateSpeed),o.enableDamping?(l.theta+=h.theta*o.dampingFactor,l.phi+=h.phi*o.dampingFactor):(l.theta+=h.theta,l.phi+=h.phi);var v=o.minAzimuthAngle,b=o.maxAzimuthAngle;return isFinite(v)&&isFinite(b)&&(v<-Math.PI?v+=f:v>Math.PI&&(v-=f),b<-Math.PI?b+=f:b>Math.PI&&(b-=f),l.theta=v<=b?Math.max(v,Math.min(b,l.theta)):l.theta>(v+b)/2?Math.max(v,l.theta):Math.min(b,l.theta)),l.phi=Math.max(o.minPolarAngle,Math.min(o.maxPolarAngle,l.phi)),l.makeSafe(),l.radius*=u,l.radius=Math.max(o.minDistance,Math.min(o.maxDistance,l.radius)),!0===o.enableDamping?o.target.addScaledVector(m,o.dampingFactor):o.target.add(m),t.setFromSpherical(l),t.applyQuaternion(i),e.copy(o.target).add(t),o.object.lookAt(o.target),!0===o.enableDamping?(h.theta*=1-o.dampingFactor,h.phi*=1-o.dampingFactor,m.multiplyScalar(1-o.dampingFactor)):(h.set(0,0,0),m.set(0,0,0)),u=1,!!(d||p.distanceToSquared(o.object.position)>r||8*(1-E.dot(o.object.quaternion))>r)&&(o.dispatchEvent(n),p.copy(o.object.position),E.copy(o.object.quaternion),d=!1,!0)}}(),this.dispose=function(){o.domElement.removeEventListener("contextmenu",W,!1),o.domElement.removeEventListener("pointerdown",C,!1),o.domElement.removeEventListener("wheel",Z,!1),o.domElement.removeEventListener("touchstart",H,!1),o.domElement.removeEventListener("touchend",q,!1),o.domElement.removeEventListener("touchmove",_,!1),o.domElement.ownerDocument.removeEventListener("pointermove",X,!1),o.domElement.ownerDocument.removeEventListener("pointerup",F,!1),o.domElement.removeEventListener("keydown",U,!1)};var o=this,n={type:"change"},a={type:"start"},i={type:"end"},s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},c=s.NONE,r=1e-6,l=new g.r,h=new g.r,u=1,m=new g.u,d=!1,p=new g.t,E=new g.t,f=new g.t,v=new g.t,b=new g.t,y=new g.t,I=new g.t,O=new g.t,P=new g.t;function w(){return Math.pow(.95,o.zoomSpeed)}function T(e){h.theta-=e}function V(e){h.phi-=e}var L=function(){var e=new g.u;return function(t,o){e.setFromMatrixColumn(o,0),e.multiplyScalar(-t),m.add(e)}}(),x=function(){var e=new g.u;return function(t,n){!0===o.screenSpacePanning?e.setFromMatrixColumn(n,1):(e.setFromMatrixColumn(n,0),e.crossVectors(o.object.up,e)),e.multiplyScalar(t),m.add(e)}}(),S=function(){var e=new g.u;return function(t,n){var a=o.domElement;if(o.object.isPerspectiveCamera){var i=o.object.position;e.copy(i).sub(o.target);var s=e.length();s*=Math.tan(o.object.fov/2*Math.PI/180),L(2*t*s/a.clientHeight,o.object.matrix),x(2*n*s/a.clientHeight,o.object.matrix)}else o.object.isOrthographicCamera?(L(t*(o.object.right-o.object.left)/o.object.zoom/a.clientWidth,o.object.matrix),x(n*(o.object.top-o.object.bottom)/o.object.zoom/a.clientHeight,o.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),o.enablePan=!1)}}();function M(e){o.object.isPerspectiveCamera?u/=e:o.object.isOrthographicCamera?(o.object.zoom=Math.max(o.minZoom,Math.min(o.maxZoom,o.object.zoom*e)),o.object.updateProjectionMatrix(),d=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),o.enableZoom=!1)}function k(e){o.object.isPerspectiveCamera?u*=e:o.object.isOrthographicCamera?(o.object.zoom=Math.max(o.minZoom,Math.min(o.maxZoom,o.object.zoom/e)),o.object.updateProjectionMatrix(),d=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),o.enableZoom=!1)}function j(e){p.set(e.clientX,e.clientY)}function N(e){v.set(e.clientX,e.clientY)}function D(e){if(1==e.touches.length)p.set(e.touches[0].pageX,e.touches[0].pageY);else{var t=.5*(e.touches[0].pageX+e.touches[1].pageX),o=.5*(e.touches[0].pageY+e.touches[1].pageY);p.set(t,o)}}function B(e){if(1==e.touches.length)v.set(e.touches[0].pageX,e.touches[0].pageY);else{var t=.5*(e.touches[0].pageX+e.touches[1].pageX),o=.5*(e.touches[0].pageY+e.touches[1].pageY);v.set(t,o)}}function A(e){var t=e.touches[0].pageX-e.touches[1].pageX,o=e.touches[0].pageY-e.touches[1].pageY,n=Math.sqrt(t*t+o*o);I.set(0,n)}function Y(e){if(1==e.touches.length)E.set(e.touches[0].pageX,e.touches[0].pageY);else{var t=.5*(e.touches[0].pageX+e.touches[1].pageX),n=.5*(e.touches[0].pageY+e.touches[1].pageY);E.set(t,n)}f.subVectors(E,p).multiplyScalar(o.rotateSpeed);var a=o.domElement;T(2*Math.PI*f.x/a.clientHeight),V(2*Math.PI*f.y/a.clientHeight),p.copy(E)}function R(e){if(1==e.touches.length)b.set(e.touches[0].pageX,e.touches[0].pageY);else{var t=.5*(e.touches[0].pageX+e.touches[1].pageX),n=.5*(e.touches[0].pageY+e.touches[1].pageY);b.set(t,n)}y.subVectors(b,v).multiplyScalar(o.panSpeed),S(y.x,y.y),v.copy(b)}function z(e){var t=e.touches[0].pageX-e.touches[1].pageX,n=e.touches[0].pageY-e.touches[1].pageY,a=Math.sqrt(t*t+n*n);O.set(0,a),P.set(0,Math.pow(O.y/I.y,o.zoomSpeed)),M(P.y),I.copy(O)}function C(e){if(!1!==o.enabled)switch(e.pointerType){case"mouse":case"pen":!function(e){var t;switch(e.preventDefault(),o.domElement.focus?o.domElement.focus():window.focus(),e.button){case 0:t=o.mouseButtons.LEFT;break;case 1:t=o.mouseButtons.MIDDLE;break;case 2:t=o.mouseButtons.RIGHT;break;default:t=-1}switch(t){case g.g.DOLLY:if(!1===o.enableZoom)return;!function(e){I.set(e.clientX,e.clientY)}(e),c=s.DOLLY;break;case g.g.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===o.enablePan)return;N(e),c=s.PAN}else{if(!1===o.enableRotate)return;j(e),c=s.ROTATE}break;case g.g.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===o.enableRotate)return;j(e),c=s.ROTATE}else{if(!1===o.enablePan)return;N(e),c=s.PAN}break;default:c=s.NONE}c!==s.NONE&&(o.domElement.ownerDocument.addEventListener("pointermove",X,!1),o.domElement.ownerDocument.addEventListener("pointerup",F,!1),o.dispatchEvent(a))}(e)}}function X(e){if(!1!==o.enabled)switch(e.pointerType){case"mouse":case"pen":!function(e){if(!1===o.enabled)return;switch(e.preventDefault(),c){case s.ROTATE:if(!1===o.enableRotate)return;!function(e){E.set(e.clientX,e.clientY),f.subVectors(E,p).multiplyScalar(o.rotateSpeed);var t=o.domElement;T(2*Math.PI*f.x/t.clientHeight),V(2*Math.PI*f.y/t.clientHeight),p.copy(E),o.update()}(e);break;case s.DOLLY:if(!1===o.enableZoom)return;!function(e){O.set(e.clientX,e.clientY),P.subVectors(O,I),P.y>0?M(w()):P.y<0&&k(w()),I.copy(O),o.update()}(e);break;case s.PAN:if(!1===o.enablePan)return;!function(e){b.set(e.clientX,e.clientY),y.subVectors(b,v).multiplyScalar(o.panSpeed),S(y.x,y.y),v.copy(b),o.update()}(e)}}(e)}}function F(e){switch(e.pointerType){case"mouse":case"pen":!function(e){if(o.domElement.ownerDocument.removeEventListener("pointermove",X,!1),o.domElement.ownerDocument.removeEventListener("pointerup",F,!1),!1===o.enabled)return;o.dispatchEvent(i),c=s.NONE}()}}function Z(e){!1===o.enabled||!1===o.enableZoom||c!==s.NONE&&c!==s.ROTATE||(e.preventDefault(),e.stopPropagation(),o.dispatchEvent(a),function(e){e.deltaY<0?k(w()):e.deltaY>0&&M(w()),o.update()}(e),o.dispatchEvent(i))}function U(e){!1!==o.enabled&&!1!==o.enableKeys&&!1!==o.enablePan&&function(e){var t=!1;switch(e.keyCode){case o.keys.UP:S(0,o.keyPanSpeed),t=!0;break;case o.keys.BOTTOM:S(0,-o.keyPanSpeed),t=!0;break;case o.keys.LEFT:S(o.keyPanSpeed,0),t=!0;break;case o.keys.RIGHT:S(-o.keyPanSpeed,0),t=!0}t&&(e.preventDefault(),o.update())}(e)}function H(e){if(!1!==o.enabled){switch(e.preventDefault(),e.touches.length){case 1:switch(o.touches.ONE){case g.s.ROTATE:if(!1===o.enableRotate)return;D(e),c=s.TOUCH_ROTATE;break;case g.s.PAN:if(!1===o.enablePan)return;B(e),c=s.TOUCH_PAN;break;default:c=s.NONE}break;case 2:switch(o.touches.TWO){case g.s.DOLLY_PAN:if(!1===o.enableZoom&&!1===o.enablePan)return;!function(e){o.enableZoom&&A(e),o.enablePan&&B(e)}(e),c=s.TOUCH_DOLLY_PAN;break;case g.s.DOLLY_ROTATE:if(!1===o.enableZoom&&!1===o.enableRotate)return;!function(e){o.enableZoom&&A(e),o.enableRotate&&D(e)}(e),c=s.TOUCH_DOLLY_ROTATE;break;default:c=s.NONE}break;default:c=s.NONE}c!==s.NONE&&o.dispatchEvent(a)}}function _(e){if(!1!==o.enabled)switch(e.preventDefault(),e.stopPropagation(),c){case s.TOUCH_ROTATE:if(!1===o.enableRotate)return;Y(e),o.update();break;case s.TOUCH_PAN:if(!1===o.enablePan)return;R(e),o.update();break;case s.TOUCH_DOLLY_PAN:if(!1===o.enableZoom&&!1===o.enablePan)return;!function(e){o.enableZoom&&z(e),o.enablePan&&R(e)}(e),o.update();break;case s.TOUCH_DOLLY_ROTATE:if(!1===o.enableZoom&&!1===o.enableRotate)return;!function(e){o.enableZoom&&z(e),o.enableRotate&&Y(e)}(e),o.update();break;default:c=s.NONE}}function q(e){!1!==o.enabled&&(o.dispatchEvent(i),c=s.NONE)}function W(e){!1!==o.enabled&&e.preventDefault()}o.domElement.addEventListener("contextmenu",W,!1),o.domElement.addEventListener("pointerdown",C,!1),o.domElement.addEventListener("wheel",Z,!1),o.domElement.addEventListener("touchstart",H,!1),o.domElement.addEventListener("touchend",q,!1),o.domElement.addEventListener("touchmove",_,!1),o.domElement.addEventListener("keydown",U,!1),this.update()};(P.prototype=Object.create(g.d.prototype)).constructor=P;var w=function(e,t){P.call(this,e,t),this.screenSpacePanning=!1,this.mouseButtons.LEFT=g.g.PAN,this.mouseButtons.RIGHT=g.g.ROTATE,this.touches.ONE=g.s.PAN,this.touches.TWO=g.s.DOLLY_ROTATE};(w.prototype=Object.create(g.d.prototype)).constructor=w;const T=Object.freeze({POSITIVE:{X:"x",Y:"y",Z:"z"},NEGATIVE:{X:"-x",Y:"-y",Z:"-z"}}),V=Object.freeze({[T.POSITIVE.X]:new g.u(1,0,0),[T.POSITIVE.Y]:new g.u(0,1,0),[T.POSITIVE.Z]:new g.u(0,0,1),[T.NEGATIVE.X]:new g.u(-1,0,0),[T.NEGATIVE.Y]:new g.u(0,-1,0),[T.NEGATIVE.Z]:new g.u(0,0,-1)}),L=Object.freeze({SOLUTION_START:"start",SOLUTION_END:"end"}),x=Object.freeze({NONE:"none",ROTATION:"rotation",CUBIE:"cubie"}),S=Object.freeze({u:"U",d:"D",f:"F",b:"B",r:"R",l:"L",m:"M",e:"E",s:"S",x:"X",y:"Y",z:"Z",U:"U'",D:"D'",F:"F'",B:"B'",R:"R'",L:"L'",M:"M'",E:"E'",S:"S'",X:"X'",Y:"Y'",Z:"Z'",wu:"u",wd:"d",wf:"f",wb:"b",wr:"r",wl:"l",wU:"u'",wD:"d'",wF:"f'",wB:"b'",wR:"r'",wL:"l'"});const M=[function(e){const t=new g.h;return t.set(1,0,0,0,Math.cos(e),-Math.sin(e),0,Math.sin(e),Math.cos(e)),t},function(e){const t=new g.h;return t.set(Math.cos(e),0,Math.sin(e),0,1,0,-Math.sin(e),0,Math.cos(e)),t},function(e){const t=new g.h;return t.set(Math.cos(e),-Math.sin(e),0,Math.sin(e),Math.cos(e),0,0,0,1),t}],k=Object.freeze({[T.POSITIVE.X]:0,[T.POSITIVE.Y]:1,[T.POSITIVE.Z]:2});function j(e,t){return M[k[e]](t)}const N="https://vujade.s3.us-west-1.amazonaws.com/HowToBeatTheAlgorithm_Processed/HowToBeatTheAlgorithm_Scene_10.mp4";function D(e){const t=document.createElement("video");t.crossOrigin="anonymous",t.src=e,t.loop=!0,t.muted=!0,t.setAttribute("playsinline",""),t.load();const o=new g.v(t);o.minFilter=g.f,o.magFilter=g.f,o.format=g.m;return o.repeat.set(.5625,1),o.offset.set(.21875,0),t.oncanplay=()=>t.play(),o}const B=D(N),A=new g.p,Y=.925;A.moveTo(0,.1),A.lineTo(0,0+Y-.1),A.quadraticCurveTo(0,0+Y,.1,0+Y),A.lineTo(0+Y-.1,0+Y),A.quadraticCurveTo(0+Y,0+Y,0+Y,0+Y-.1),A.lineTo(0+Y,.1),A.quadraticCurveTo(0+Y,0,0+Y-.1,0),A.lineTo(.1,0),A.quadraticCurveTo(0,0,0,.1);const R=new g.q(A);R.center();var z=class{constructor(e,t,o,n){this.positionVector=new g.u(e,t,o),this.fixedPositionVector=new g.u(e,t,o),this.facingVector=n,this.fixedFacingVector=new g.u(n.x,n.y,n.z),B?this.createMaterialAndMesh():D(N)}createMaterialAndMesh(){this.material=new g.j({map:B,side:g.c}),this.mesh=new g.i(R,this.material),this.updatePosition(this.fixedPositionVector,this.fixedFacingVector),this.mesh.rotation.y=.5*Math.PI*Math.abs(this.facingVector.x),this.mesh.rotation.x=.5*Math.PI*Math.abs(this.facingVector.y)}updatePosition(e,t){this.mesh.position.x=e.x+.5*t.x,this.mesh.position.y=e.y+.5*t.y,this.mesh.position.z=e.z+.5*t.z,this.mesh.position.x+=this.mesh.position.x>0?.001:-.001,this.mesh.position.y+=this.mesh.position.y>0?.001:-.001,this.mesh.position.z+=this.mesh.position.z>0?.001:-.001;const o=Object.values(T.POSITIVE);o.forEach(n=>{if(e[n]===t[n]&&1===Math.abs(e[n]))for(const t of o.filter(e=>e!==n))1===e[t]?this.mesh.position[t]-=.025:-1===e[t]&&(this.mesh.position[t]+=.025)})}lockPosition(){const e=Math.round(this.fixedPositionVector.x),t=Math.round(this.fixedPositionVector.y),o=Math.round(this.fixedPositionVector.z);this.positionVector=new g.u(e,t,o),this.fixedPositionVector=new g.u(e,t,o),this.facingVector=new g.u(Math.round(this.fixedFacingVector.x),Math.round(this.fixedFacingVector.y),Math.round(this.fixedFacingVector.z)),this.fixedFacingVector=new g.u(this.facingVector.x,this.facingVector.y,this.facingVector.z),this.mesh.rotation.y=.5*Math.PI*Math.abs(this.facingVector.x),this.mesh.rotation.x=.5*Math.PI*Math.abs(this.facingVector.y),this.mesh.rotation.z=0}turn(e,t){var o=j(e,t*Math.PI*.5);this.fixedFacingVector.applyMatrix3(o),this.fixedPositionVector.applyMatrix3(o),this.lockPosition(),this.updatePosition(this.fixedPositionVector,this.fixedFacingVector),this.mesh.rotation.y=.5*Math.PI*Math.abs(this.facingVector.x),this.mesh.rotation.x=.5*Math.PI*Math.abs(this.facingVector.y)}rotate(e,t){var o=j(e,t);this.facingVector.applyMatrix3(o),this.positionVector.applyMatrix3(o),this.updatePosition(this.positionVector,this.facingVector),this.mesh.rotateOnWorldAxis(V[e],t)}};const C=new g.p,X=1e-5;C.absarc(X,X,X,-Math.PI/2,-Math.PI,!0),C.absarc(X,.90002,X,Math.PI,Math.PI/2,!0),C.absarc(.90002,.90002,X,Math.PI/2,0,!0),C.absarc(.90002,X,X,0,-Math.PI/2,!0);const F=new g.e(C,{depth:.9,bevelEnabled:!0,bevelSegments:32,steps:1,bevelSize:.04999,bevelThickness:.05,curveSegments:16});F.center();const Z=new g.j({color:0});var U=class{constructor(e,t,o){this.angle=0,this.animating=!1,this.animateAxis=null,this.animateDir=0,this.positionVector=new g.u(e,t,o),this.fixedPositionVector=new g.u(e,t,o),this.mesh=new g.i(F,Z),this.stickers=[],-1===e?this.stickers.push(new z(e,t,o,new g.u(-1,0,0),65280)):1===e&&this.stickers.push(new z(e,t,o,new g.u(1,0,0),255)),-1===t?this.stickers.push(new z(e,t,o,new g.u(0,-1,0),16776960)):1===t&&this.stickers.push(new z(e,t,o,new g.u(0,1,0),16777215)),-1===o?this.stickers.push(new z(e,t,o,new g.u(0,0,-1),16750848)):1===o&&this.stickers.push(new z(e,t,o,new g.u(0,0,1),16711680)),this.updatePosition(this.fixedPositionVector)}updatePosition(e){this.mesh.position.x=e.x,this.mesh.position.y=e.y,this.mesh.position.z=e.z}lockPosition(){const e=Math.round(this.fixedPositionVector.x),t=Math.round(this.fixedPositionVector.y),o=Math.round(this.fixedPositionVector.z);this.positionVector=new g.u(e,t,o),this.fixedPositionVector=new g.u(e,t,o),this.mesh.position.x=e,this.mesh.position.y=t,this.mesh.position.z=o,this.stickers.forEach(e=>{e.lockPosition()})}turn(e,t){var o=j(e,t*Math.PI*.5);this.fixedPositionVector.applyMatrix3(o),this.lockPosition(),this.updatePosition(this.fixedPositionVector),this.mesh.rotation.x=0,this.mesh.rotation.y=0,this.mesh.rotation.z=0,this.stickers.forEach(o=>{o.turn(e,t)})}rotate(e,t){const o=j(e,t);this.positionVector.applyMatrix3(o),this.updatePosition(this.positionVector),this.mesh.rotation[e]+=t,this.stickers.forEach(o=>{o.rotate(e,t)})}};var H=class{constructor(e){this.cubies=[],this.meshes=[],this.stickersMap=new Map;for(let t=-1;t<=1;t++)for(let e=-1;e<=1;e++)for(let o=-1;o<=1;o++)0===t&&0===e&&0===o||this.cubies.push(new U(t,e,o));this.cubies.forEach(t=>{e.add(t.mesh),this.meshes.push(t.mesh),t.stickers.forEach(t=>{e.add(t.mesh),this.meshes.push(t.mesh),this.stickersMap.set(t.mesh.uuid,t)})})}forEach(e){this.cubies.forEach(t=>{e(t)})}repr(){const e=[[["B","B","B"],["B","B","B"],["B","B","B"]],[["B","B","B"],["B","B","B"],["B","B","B"]],[["B","B","B"],["B","B","B"],["B","B","B"]],[["B","B","B"],["B","B","B"],["B","B","B"]],[["B","B","B"],["B","B","B"],["B","B","B"]],[["B","B","B"],["B","B","B"],["B","B","B"]]];this.cubies.forEach(t=>{1===t.positionVector.y&&t.stickers.forEach(t=>{1===t.facingVector.y&&(e[0][t.fixedPositionVector.z+1][t.fixedPositionVector.x+1]=t.getColor())}),-1===t.positionVector.y&&t.stickers.forEach(t=>{-1===t.facingVector.y&&(e[1][-1*t.fixedPositionVector.z+1][t.fixedPositionVector.x+1]=t.getColor())}),1===t.positionVector.z&&t.stickers.forEach(t=>{1===t.facingVector.z&&(e[2][-1*t.fixedPositionVector.y+1][t.fixedPositionVector.x+1]=t.getColor())}),-1===t.positionVector.z&&t.stickers.forEach(t=>{-1===t.facingVector.z&&(e[3][-1*t.fixedPositionVector.y+1][-1*t.fixedPositionVector.x+1]=t.getColor())}),1===t.positionVector.x&&t.stickers.forEach(t=>{1===t.facingVector.x&&(e[4][-1*t.fixedPositionVector.y+1][-1*t.fixedPositionVector.z+1]=t.getColor())}),-1===t.positionVector.x&&t.stickers.forEach(t=>{-1===t.facingVector.x&&(e[5][-1*t.fixedPositionVector.y+1][t.fixedPositionVector.z+1]=t.getColor())})});let t="";return e.forEach(e=>{e.forEach(e=>{t+=e.join("")})}),t}move(e){switch(e){case"U":return void this.moveLayer(T.POSITIVE.Y,1,1);case"U'":return void this.moveLayer(T.POSITIVE.Y,1,-1);case"u":return this.moveLayer(T.POSITIVE.Y,1,1),void this.moveLayer(T.POSITIVE.Y,0,-1);case"u'":return this.moveLayer(T.POSITIVE.Y,1,-1),void this.moveLayer(T.POSITIVE.Y,0,1);case"D":return void this.moveLayer(T.POSITIVE.Y,-1,1);case"D'":return void this.moveLayer(T.POSITIVE.Y,-1,-1);case"d":return this.moveLayer(T.POSITIVE.Y,-1,1),void this.moveLayer(T.POSITIVE.Y,0,1);case"d'":return this.moveLayer(T.POSITIVE.Y,-1,-1),void this.moveLayer(T.POSITIVE.Y,0,-1);case"F":return void this.moveLayer(T.POSITIVE.Z,1,1);case"F'":return void this.moveLayer(T.POSITIVE.Z,1,-1);case"f":return this.moveLayer(T.POSITIVE.Z,1,1),void this.moveLayer(T.POSITIVE.Z,0,1);case"f'":return this.moveLayer(T.POSITIVE.Z,1,-1),void this.moveLayer(T.POSITIVE.Z,0,-1);case"B":return void this.moveLayer(T.POSITIVE.Z,-1,1);case"B'":return void this.moveLayer(T.POSITIVE.Z,-1,-1);case"b":return this.moveLayer(T.POSITIVE.Z,-1,1),void this.moveLayer(T.POSITIVE.Z,0,-1);case"b'":return this.moveLayer(T.POSITIVE.Z,-1,-1),void this.moveLayer(T.POSITIVE.Z,0,1);case"R":return void this.moveLayer(T.POSITIVE.X,1,1);case"R'":return void this.moveLayer(T.POSITIVE.X,1,-1);case"r":return this.moveLayer(T.POSITIVE.X,1,1),void this.moveLayer(T.POSITIVE.X,0,-1);case"r'":return this.moveLayer(T.POSITIVE.X,1,-1),void this.moveLayer(T.POSITIVE.X,0,1);case"L":return void this.moveLayer(T.POSITIVE.X,-1,1);case"L'":return void this.moveLayer(T.POSITIVE.X,-1,-1);case"l":return this.moveLayer(T.POSITIVE.X,-1,1),void this.moveLayer(T.POSITIVE.X,0,1);case"l'":return this.moveLayer(T.POSITIVE.X,-1,-1),void this.moveLayer(T.POSITIVE.X,0,-1);case"M":return void this.moveLayer(T.POSITIVE.X,0,1);case"M'":return void this.moveLayer(T.POSITIVE.X,0,-1);case"E":return void this.moveLayer(T.POSITIVE.Y,0,1);case"E'":return void this.moveLayer(T.POSITIVE.Y,0,-1);case"S":return void this.moveLayer(T.POSITIVE.Z,0,1);case"S'":return void this.moveLayer(T.POSITIVE.Z,0,-1);case"x":case"X":return this.moveLayer(T.POSITIVE.X,-1,-1),this.moveLayer(T.POSITIVE.X,0,-1),void this.moveLayer(T.POSITIVE.X,1,1);case"x'":case"X'":return this.moveLayer(T.POSITIVE.X,-1,1),this.moveLayer(T.POSITIVE.X,0,1),void this.moveLayer(T.POSITIVE.X,1,-1);case"y":case"Y":return this.moveLayer(T.POSITIVE.Y,-1,-1),this.moveLayer(T.POSITIVE.Y,0,-1),void this.moveLayer(T.POSITIVE.Y,1,1);case"y'":case"Y'":return this.moveLayer(T.POSITIVE.Y,-1,1),this.moveLayer(T.POSITIVE.Y,0,1),void this.moveLayer(T.POSITIVE.Y,1,-1);case"z":case"Z":return this.moveLayer(T.POSITIVE.Z,-1,-1),this.moveLayer(T.POSITIVE.Z,0,1),void this.moveLayer(T.POSITIVE.Z,1,1);case"z'":case"Z'":return this.moveLayer(T.POSITIVE.Z,-1,1),this.moveLayer(T.POSITIVE.Z,0,-1),void this.moveLayer(T.POSITIVE.Z,1,-1)}}moveLayer(e,t,o){let n=o;0!==t?n*=-1*t:e==T.POSITIVE.Z&&(n*=-1),this.cubies.forEach(o=>{o.positionVector[e]===t&&(o.animating=!0,o.angle=0,o.animateAxis=e,o.animateDir=n)})}};const _=()=>.95*window.innerHeight,q=[];let W=!1,G=!1;const K=document.getElementById("three"),J=document.getElementById("solve-button"),Q=new g.o;Q.background=new g.b(16119285);const $=new g.k(75,window.innerWidth/_(),.1,1e3);$.position.x=4,$.position.y=4,$.position.z=6;const ee=new g.w({antialias:!0});ee.setPixelRatio(window.devicePixelRatio),ee.setSize(window.innerWidth,_()),K.appendChild(ee.domElement);const te=new g.n,oe=new g.t,ne=new g.t,ae=new P($,ee.domElement);ae.minDistance=5,ae.maxDistance=15,ae.enablePan=!1,ae.enableRotate=!1,ae.update();const ie=new H(Q);let se;const ce=()=>{const e=window.innerWidth/2;ie.cubies.forEach(t=>{if(1===t.fixedPositionVector.x&&-1===t.fixedPositionVector.y&&1===t.fixedPositionVector.z){const o=t.fixedPositionVector.clone();o.project($),se=o.x*e+e}})};ce(),ae.addEventListener("change",ce);const re=new g.a,le=()=>{requestAnimationFrame(le),(()=>{const e=re.getDelta();if(!W&&q.length>0){const e=q.shift();e===L.SOLUTION_END?(G=!1,W=!1):e===L.SOLUTION_START||(ie.move(e),W=!0)}ie.forEach(t=>{t.animating&&(t.angle>=.5*Math.PI?(t.angle=0,t.animating=!1,t.turn(t.animateAxis,t.animateDir),t.lockPosition(),W=!1):(t.rotate(t.animateAxis,t.animateDir*e*12.5),t.angle+=12.5*e))})})(),ee.render(Q,$)};le(),window.scrollTo(0,0);let he=!1;document.addEventListener("keypress",e=>{if(G)return;const t=he?"w"+e.key:e.key;void 0!==S[t]?q.push(S[t]):"Enter"===e.key?(G=!0,q.push(L.SOLUTION_START)):"w"!==e.key&&"W"!==e.key||(he=!0)},!1);document.addEventListener("keyup",e=>{"w"!==e.key&&"W"!==e.key||(he=!1)},!1),J.onclick=()=>{G||(G=!0,q.push(L.SOLUTION_START))};window.addEventListener("resize",()=>{$.aspect=window.innerWidth/_(),$.updateProjectionMatrix(),ee.setSize(window.innerWidth,_()),ce()},!1);document.addEventListener("touchstart",e=>{e.offsetX=e.touches[0].clientX,e.offsetY=e.touches[0].clientY-0,Ee(e)},!1);document.addEventListener("touchend",e=>{fe(e)},!1);document.addEventListener("touchmove",e=>{e.offsetX=e.touches[0].clientX,e.offsetY=e.touches[0].clientY-0,ve(e)},!1);let ue=null,me=0,de=x.NONE,pe=!1;const Ee=e=>{if("canvas"!==e.target.tagName.toLowerCase())return;pe=!0,oe.x=e.offsetX/window.innerWidth*2-1,oe.y=-e.offsetY/_()*2+1,te.setFromCamera(oe.clone(),$);const t=te.intersectObjects(ie.meshes,!0);de=0!==t.length?ie.stickersMap.has(t[0].object.uuid)?t[0]:x.CUBIE:x.ROTATION};document.addEventListener("pointerdown",Ee,!1);const fe=e=>{pe=!1,de=x.NONE,ue=null,me=0};document.addEventListener("pointerup",fe,!1);const ve=e=>{if(!pe||null!==ue||G)return;if(de===x.CUBIE)return;if(ne.x=e.offsetX/window.innerWidth*2-1-oe.x,ne.y=-e.offsetY/_()*2+1-oe.y,ne.length()<=(window.innerWidth<=500?.1:.05))return;if(Math.abs(ne.x)>Math.abs(ne.y)?(ue=T.POSITIVE.X,me=ne.x>0?1:-1):(ue=T.POSITIVE.Y,me=ne.y>0?1:-1),de===x.ROTATION)return void(ue===T.POSITIVE.X?-1===me?q.push("y"):1===me&&q.push("y'"):ue===T.POSITIVE.Y&&(e.offsetX<se?-1===me?q.push("x'"):1===me&&q.push("x"):-1===me?q.push("z"):1===me&&q.push("z'")));const t=ie.stickersMap.get(de.object.uuid);if(ue===T.POSITIVE.X)if(1===t.fixedFacingVector.y)switch(t.fixedPositionVector.z){case-1:-1*me===-1?q.push("B'"):-1*me===1&&q.push("B");break;case 0:-1===me?q.push("S'"):1===me&&q.push("S");break;case 1:-1===me?q.push("F'"):1===me&&q.push("F")}else switch(t.fixedPositionVector.y){case-1:-1===me?q.push("D'"):1===me&&q.push("D");break;case 0:-1===me?q.push("E'"):1===me&&q.push("E");break;case 1:-1*me===-1?q.push("U'"):-1*me===1&&q.push("U")}else if(ue===T.POSITIVE.Y)if(1===t.fixedFacingVector.x)switch(t.fixedPositionVector.z){case-1:-1===me?q.push("B'"):1===me&&q.push("B");break;case 0:-1*me===-1?q.push("S'"):-1*me===1&&q.push("S");break;case 1:-1*me===-1?q.push("F'"):-1*me===1&&q.push("F")}else switch(t.fixedPositionVector.x){case-1:-1*me===-1?q.push("L'"):-1*me===1&&q.push("L");break;case 0:-1*me===-1?q.push("M'"):-1*me===1&&q.push("M");break;case 1:-1===me?q.push("R'"):1===me&&q.push("R")}pe=!1};document.addEventListener("pointermove",ve,!1);const{getHeaderSize:be,getHeight:ye,getTolerance:Ie,moveBuffer:Oe,animating:ge,solving:Pe,scene:we,camera:Te,renderer:Ve,raycaster:Le,mouse:xe,delta:Se,controls:Me,cube:ke,rotationPixelCutoff:je,updateRotationPixelCutoff:Ne,solveCube:De,clock:Be,update:Ae,animate:Ye,onKeyPress:Re,onKeyUp:ze,solveButton:Ce,onWindowResize:Xe,onTouchStart:Fe,onTouchEnd:Ze,onTouchMove:Ue,onDocumentMouseDown:He,onDocumentMouseUp:_e,onDocumentMouseMove:qe}=n,We="https://vujade-site-bd6c94750c62.herokuapp.com",Ge=i.a.memo(e=>{let{src:t,videoID:o,onVideoClick:n}=e;const s=Object(a.useRef)(null),{ref:c,inView:r}=Object(I.a)({triggerOnce:!0,rootMargin:"50px 0px"}),l=Object(a.useCallback)(()=>{!O.isMobile&&s.current&&s.current.play().catch(e=>console.error("Play was interrupted.",e))},[]),h=Object(a.useCallback)(()=>{!O.isMobile&&s.current&&s.current.pause()},[]);return Object(a.useEffect)(()=>{O.isMobile&&r&&s.current&&s.current.play().catch(e=>console.log("Autoplay was prevented.",e))},[r]),i.a.createElement("div",{ref:c,style:{width:"100%",height:"auto"}},r&&i.a.createElement("video",{ref:s,src:t,loop:!0,muted:!0,playsInline:!0,onClick:()=>{console.log("Video clicked: ".concat(o)),n(o)},onMouseEnter:l,onMouseLeave:h,style:{width:"100%",height:"auto"}}))},(e,t)=>e.videoID===t.videoID&&e.src===t.src);const Ke=i.a.memo((function(e){let{scenes:t,uniqueVideoIDs:o}=e;const n=Object(m.o)(),{videoID:s}=Object(m.q)(),c=Object(m.m)(),{openModal:r,currentVideoID:l}=E(),[h,u]=Object(a.useState)([]);Object(a.useEffect)(()=>{u(function(e){for(let t=e.length-1;t>0;t--){const o=Math.floor(Math.random()*(t+1));[e[t],e[o]]=[e[o],e[t]]}return e}([...t]))},[t]),Object(a.useEffect)(()=>{s&&t.some(e=>e.videoID===s)&&l!==s&&(console.log("Effect to open modal for videoID: ".concat(s)),r(s))},[s,t,r,l]);const d=Object(a.useCallback)(e=>{const t="/welcome"===c.pathname,o=()=>{t&&c.pathname==="/".concat(e)||n("/".concat(e)),r(e)};t?(window.scrollTo({top:document.documentElement.clientHeight,behavior:"smooth"}),setTimeout(()=>{n("/"),console.log("Preparing to open modal for videoID: ".concat(e)),o()},600)):o()},[r,n,c.pathname]);return i.a.createElement("div",{id:"videos-section",className:"App"},i.a.createElement("div",{className:"video-menu"},o.map((e,t)=>i.a.createElement("div",{key:"".concat(e.videoID,"-").concat(t),onClick:()=>d(e.videoID),className:"video-menu-item"},e.videoName))),i.a.createElement("div",{className:"video-grid"},h.map(e=>i.a.createElement(Ge,{key:e.sceneURL,src:e.sceneURL,videoID:e.videoID,onVideoClick:d}))))}));function Je(e){let{scenes:t,uniqueVideoIDs:o}=e;const n=Object(m.o)(),s=Object(m.m)(),c=Object(a.useRef)(!0),[r,l]=Object(a.useState)("/welcome"===s.pathname),h=Object(a.useRef)(0),d=Object(a.useCallback)(()=>{const e=1*window.innerHeight,t=window.scrollY>e;"/welcome"===s.pathname&&t&&r&&(h.current=window.scrollY,n("/",{replace:!0}),l(!1))},[n,s.pathname,r]);Object(a.useEffect)(()=>(window.addEventListener("scroll",d),()=>window.removeEventListener("scroll",d)),[d]),Object(a.useEffect)(()=>{r||(console.log("Scroll position before navigation: ".concat(h.current)),window.scrollTo(0,h.current),console.log("Scroll position after splash screen hidden, restored to previous state"))},[r]),Object(a.useEffect)(()=>{c.current?c.current=!1:l("/welcome"===s.pathname)},[s.pathname]);const p=r?{}:{display:"none"};return i.a.createElement(i.a.Fragment,null,i.a.createElement("div",{style:p},i.a.createElement(u,null)),i.a.createElement(Ke,{scenes:t,uniqueVideoIDs:o}))}var Qe=function(){const[e,t]=Object(a.useState)([]),[o,s]=Object(a.useState)([]);Object(a.useEffect)(()=>{(async()=>{try{const e=await r.a.get("".concat(We,"/api/scenes"));t(e.data);const o=await r.a.get("".concat(We,"/api/videos"));s(y.a.uniqBy(o.data,"videoID")),console.log("Fetched scenes:",e.data),console.log("Fetched videos:",o.data)}catch(e){console.error("Error fetching content: ",e)}})()},[]);const c=Object(a.useMemo)(()=>e,[e]),l=Object(a.useMemo)(()=>o,[o]);return i.a.createElement(d.a,null,i.a.createElement(a.Suspense,{fallback:i.a.createElement("div",null,"Loading...")},i.a.createElement(f,null,i.a.createElement(m.c,null,i.a.createElement(m.a,{path:"/welcome",element:i.a.createElement(Je,{scenes:c,uniqueVideoIDs:l})}),i.a.createElement(m.a,{path:"/cube-master",element:i.a.createElement(n,null)}),i.a.createElement(m.a,{path:"/",element:i.a.createElement(Je,{scenes:c,uniqueVideoIDs:l})}),i.a.createElement(m.a,{path:"/:videoID",element:i.a.createElement(i.a.Fragment,null,i.a.createElement(Je,{scenes:c,uniqueVideoIDs:l}),i.a.createElement(v,null))})))))};var $e=e=>{e&&e instanceof Function&&o.e(3).then(o.bind(null,37)).then(t=>{let{getCLS:o,getFID:n,getFCP:a,getLCP:i,getTTFB:s}=t;o(e),n(e),a(e),i(e),s(e)})};c.a.createRoot(document.getElementById("root")).render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(f,null,i.a.createElement(Qe,null)))),$e()}},[[18,1,2]]]);
//# sourceMappingURL=main.be82d2e0.chunk.js.map