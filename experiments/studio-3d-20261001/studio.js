import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {GLTFExporter} from './vendor/GLTFExporter.js';
const stage=document.querySelector('#stage');
const error=document.querySelector('#error');
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.12;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
stage.prepend(renderer.domElement);
const scene=new THREE.Scene(); scene.background=new THREE.Color('#0b1925');
const camera=new THREE.PerspectiveCamera(48,16/9,.05,100);camera.name='cam_preview';
const controls=new OrbitControls(camera,renderer.domElement); controls.enableDamping=true;controls.minDistance=.4;controls.maxDistance=24;controls.maxPolarAngle=Math.PI*.495;
let design,original,materials={},root,night=true,tourStart=null,activeCamera='angle';
const geometryCache=new Map();
const editable=new Map();
const lights=new Map();
function roundedBox(size,bevel){
  const [w,h,d]=size,r=Math.min(bevel,w/3,h/3,d/3),shape=new THREE.Shape();
  const x=-w/2+r,y=-h/2+r,X=w/2-r,Y=h/2-r;
  shape.moveTo(x+r,y);shape.lineTo(X-r,y);shape.quadraticCurveTo(X,y,X,y+r);shape.lineTo(X,Y-r);shape.quadraticCurveTo(X,Y,X-r,Y);shape.lineTo(x+r,Y);shape.quadraticCurveTo(x,Y,x,Y-r);shape.lineTo(x,y+r);shape.quadraticCurveTo(x,y,x+r,y);
  const geom=new THREE.ExtrudeGeometry(shape,{depth:d-2*r,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:r,bevelThickness:r,curveSegments:3});
  geom.translate(0,0,-d/2+r);geom.computeVertexNormals();return geom;
}
function geometry(spec){
 const key=JSON.stringify([spec.type,spec.size,spec.bevel,spec.radius,spec.height,spec.radiusTop,spec.points,spec.tube]);
 if(geometryCache.has(key))return geometryCache.get(key);
 let g;
 if(spec.type==='box')g=spec.bevel?roundedBox(spec.size,spec.bevel):new THREE.BoxGeometry(...spec.size);
 if(spec.type==='cylinder')g=new THREE.CylinderGeometry(spec.radiusTop??spec.radius,spec.radius,spec.height,24);
 if(spec.type==='torus')g=new THREE.TorusGeometry(spec.radius,spec.tube,8,32);
 if(spec.type==='tube')g=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(spec.points.map(p=>new THREE.Vector3(...p))),Math.max(8,spec.points.length*6),spec.radius,8,false);
 if(!g)throw new Error('Unknown shape '+spec.type);
 geometryCache.set(key,g);return g;
}
function make(spec){
 let object;
 if(spec.type==='group'){object=new THREE.Group();for(const child of spec.children)object.add(make(child));}
 else if(spec.type==='text'){
  const c=document.createElement('canvas');c.width=1024;c.height=128;
  const ctx=c.getContext('2d');ctx.fillStyle=materials[spec.material].color;ctx.font='600 72px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(spec.text,512,64,990);
  const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;
  object=new THREE.Mesh(new THREE.PlaneGeometry(...spec.size),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));
 }else object=new THREE.Mesh(geometry(spec),new THREE.MeshStandardMaterial({...materials[spec.material],side:THREE.DoubleSide}));
 object.name=spec.id;object.userData={label:spec.label||spec.id};
 if(spec.position)object.position.fromArray(spec.position);if(spec.rotation)object.rotation.fromArray([...spec.rotation,'XYZ']);
 if(object.isMesh){object.castShadow=!['text','glass'].includes(spec.type)&&spec.material!=='glass';object.receiveShadow=true;}
 return object;
}
function build(){
 if(root){root.traverse(o=>{if(o.material){o.material.map?.dispose();o.material.dispose();}});scene.remove(root);}
 root=new THREE.Group();root.name='HQ_Floor_01';scene.add(root);editable.clear();lights.clear();
 for(const spec of design.objects){const o=make(spec);root.add(o);if(spec.editable)editable.set(spec.id,{object:o,spec});}
 for(const anchor of design.anchors){const a=new THREE.Object3D();a.name=anchor.id;a.position.fromArray(anchor.position);root.add(a);}
 for(const s of design.lights){
  let l;
  if(s.type==='hemisphere')l=new THREE.HemisphereLight(s.color,s.groundColor,s.intensity);
  if(s.type==='point')l=new THREE.PointLight(s.color,s.intensity,s.distance,2);
  if(s.type==='directional'){
   l=new THREE.DirectionalLight(s.color,s.intensity);l.target.position.fromArray(s.target);root.add(l.target);l.castShadow=!!s.shadow;
   l.shadow.mapSize.set(2048,2048);Object.assign(l.shadow.camera,{left:-5,right:5,top:5,bottom:-5,near:.1,far:15});l.shadow.bias=-.0005;l.shadow.normalBias=.02;
  }
  if(s.position)l.position.fromArray(s.position);l.name=s.id;root.add(l);lights.set(s.id,l);
 }
 for(const s of design.cameras){const c=new THREE.PerspectiveCamera(s.fov,16/9,.05,100);c.position.fromArray(s.position);c.lookAt(new THREE.Vector3(...s.target));c.name='cam_'+s.id;root.add(c);}
 document.querySelector('#object').replaceChildren(...[...editable.values()].map(({spec})=>{const option=document.createElement('option');option.value=spec.id;option.textContent=spec.label;return option;}));
 chooseObject();setCamera(activeCamera);setLighting(night);
}
function setCutaway(enabled){
 for(const spec of design.objects){const o=root.getObjectByName(spec.id);if(spec.cutaway)o.visible=!enabled;}
 for(const name of ['wall_east','acoustic_3_0','acoustic_3_1','acoustic_3_2','oak_rail_3','skirting_3'])root.getObjectByName(name).visible=!enabled;
}
function setCamera(id){
 const s=design.cameras.find(c=>c.id===id);if(!s)return;
 tourStart=null;controls.enabled=true;activeCamera=id;setCutaway(!!s.cutaway);
 camera.position.fromArray(s.position);camera.fov=s.fov;camera.updateProjectionMatrix();controls.target.fromArray(s.target);controls.update();
 for(const b of document.querySelectorAll('[data-camera]'))b.classList.toggle('active',b.dataset.camera===id);
 document.querySelector('#tour').classList.remove('active');
}
function setLighting(value){
 night=value;
 const dayScale={light_window:1.9,light_ambient:1.26,light_key:1.16,light_lamp:.385};
 for(const spec of design.lights)lights.get(spec.id).intensity=spec.intensity*(night?1:(dayScale[spec.id]??1));
 const sky=root.getObjectByName('night_sky').material;sky.color.set(night?'#203c57':'#6e91b0');sky.emissive.copy(sky.color);
 document.querySelector('#lighting').textContent=night?'夜の照明':'昼の照明';
}
function chooseObject(){const selected=editable.get(document.querySelector('#object').value);if(!selected)return;for(const axis of ['x','y','z']){const value=selected.object.position[axis];document.querySelector('#'+axis).value=value;document.querySelector('#o'+axis).value=value.toFixed(2)+' m';}}
function currentDesign(){
 const d=structuredClone(design);
 for(const spec of d.objects){const o=root.getObjectByName(spec.id);spec.position=o.position.toArray();}
 // Preserve current daytime settings as editable lighting/material configuration.
 // Light values stay the canonical night settings; the preview preset is separate.
 d.materials=structuredClone(materials);d.materials.sky={...d.materials.sky,color:night?'#203c57':'#6e91b0',emissive:night?'#203c57':'#6e91b0'};
 d.previewLighting=night?'night':'day';return d;
}
function download(content,name,type){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
async function exportGLB(){
 // Export full architecture, regardless of the temporary overview cutaway.
 const hidden=[];root.traverse(o=>{if(!o.visible){hidden.push(o);o.visible=true;}});
 try{return await new GLTFExporter().parseAsync(root,{binary:true,onlyVisible:true});}finally{hidden.forEach(o=>o.visible=false);}
}
document.querySelectorAll('[data-camera]').forEach(b=>b.onclick=()=>setCamera(b.dataset.camera));
document.querySelector('#lighting').onclick=()=>setLighting(!night);
document.querySelector('#guide').onclick=()=>{const g=document.querySelector('.caption-guide');const show=g.style.display!=='flex';g.style.display=show?'flex':'none';document.querySelector('#guide').classList.toggle('active',show);};
document.querySelector('#object').onchange=chooseObject;
for(const axis of ['x','y','z'])document.querySelector('#'+axis).oninput=e=>{editable.get(document.querySelector('#object').value).object.position[axis]=Number(e.target.value);chooseObject();};
document.querySelector('#reset').onclick=()=>{design=structuredClone(original);night=true;materials=structuredClone(original.materials);build();};
async function saveLocal(kind,data){const response=await fetch('/save/'+kind,{method:'POST',body:data});if(!response.ok)throw new Error('保存に失敗しました。サーバーを確認してください。');const saved=await response.json();error.textContent=saved.file+' に保存しました。';}
document.querySelector('#json').onclick=async()=>{try{await saveLocal('json',JSON.stringify(currentDesign(),null,2));}catch(e){error.textContent=e.message;}};
document.querySelector('#glb').onclick=async()=>{error.textContent='保存用の3Dデータを準備しています…';try{await saveLocal('glb',await exportGLB());}catch(e){error.textContent=e.message;}};
document.querySelector('#load').onchange=async e=>{try{const d=JSON.parse(await e.target.files[0].text());if(d.version!==1||!Array.isArray(d.objects)||!Array.isArray(d.lights)||!Array.isArray(d.cameras)||!Array.isArray(d.anchors)||!d.materials)throw new Error('この試作で保存した設定JSONを選んでください。');design=d;materials=d.materials;night=d.previewLighting!=='day';build();error.textContent='設定を読み込みました。';}catch(e){error.textContent=e.message;}};
document.querySelector('#tour').onclick=()=>{setCamera('entry');tourStart=performance.now();controls.enabled=false;document.querySelector('#tour').classList.add('active');};
function resize(){const {width,height}=stage.getBoundingClientRect();renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();}
new ResizeObserver(resize).observe(stage);
function render(now){
 if(tourStart!==null){const p=Math.min(1,(now-tourStart)/(design.tour.duration*1000)),t=p*p*(3-2*p);camera.position.lerpVectors(new THREE.Vector3(...design.tour.from),new THREE.Vector3(...design.tour.to),t);controls.target.fromArray(design.tour.target);camera.lookAt(controls.target);if(p===1){tourStart=null;controls.enabled=true;document.querySelector('#tour').classList.remove('active');}}
 else controls.update();renderer.render(scene,camera);requestAnimationFrame(render);
}
try{
 [design,materials]=await Promise.all([fetch('./scene.json').then(r=>r.json()),fetch('./materials.json').then(r=>r.json())]);original=structuredClone({...design,materials});build();resize();document.querySelector('#status').remove();requestAnimationFrame(render);
 window.studio={ready:true,setCamera,exportGLB,currentDesign,renderer,scene,camera,controls,editable,setLighting,setCutaway};
}catch(e){document.querySelector('#status').textContent='表示できませんでした：'+e.message;throw e;}
