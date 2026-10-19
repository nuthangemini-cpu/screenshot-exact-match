import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { zoneView, type Design, type View } from '@/lib/design';

export default function GarmentViewer({design,view,onView}:{design:Design;view:View;onView:(v:View)=>void}) {
 const host=useRef<HTMLDivElement>(null);
 const state=useRef<{renderer:THREE.WebGLRenderer;scene:THREE.Scene;camera:THREE.PerspectiveCamera;controls:OrbitControls;materials:THREE.MeshStandardMaterial[]}|null>(null);
 const [error,setError]=useState(false);
 useEffect(()=>{
  if(!host.current)return;
  const el=host.current;
  let renderer:THREE.WebGLRenderer;
  try {renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch{setError(true);return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)); el.appendChild(renderer.domElement);
  const scene=new THREE.Scene(); const camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(0,.1,5.5);
  const controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.minDistance=3;controls.maxDistance=8;controls.target.set(0,0,0);
  scene.add(new THREE.HemisphereLight(0xffffff,0x777777,3));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(3,4,5);scene.add(light);
  const shape=new THREE.Shape();shape.moveTo(-.7,-1.1);shape.lineTo(.7,-1.1);shape.lineTo(.74,.65);shape.lineTo(.46,1);shape.lineTo(.25,1);shape.quadraticCurveTo(0,.72,-.25,1);shape.lineTo(-.46,1);shape.lineTo(-.74,.65);shape.closePath();
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:.32,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.07,bevelThickness:.07});geometry.translate(0,0,-.16);
  const body=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color:0x222222,roughness:.85}));scene.add(body);
  const front=new THREE.MeshStandardMaterial({transparent:true,roughness:.95,side:THREE.DoubleSide});const back=front.clone();const left=front.clone();const right=front.clone();
  const faceGeometry=new THREE.PlaneGeometry(1.4,2.1);
  const f=new THREE.Mesh(faceGeometry,front);f.position.set(0,-.04,.24);scene.add(f);
  const b=new THREE.Mesh(faceGeometry,back);b.position.set(0,-.04,-.24);b.rotation.y=Math.PI;scene.add(b);
  [-1,1].forEach((sign,i)=>{const sleeve=new THREE.Mesh(new THREE.CylinderGeometry(.28,.32,.9,24,1,true),body.material);sleeve.rotation.z=sign*.9;sleeve.position.set(sign*.93,.65,0);scene.add(sleeve);const decal=new THREE.Mesh(new THREE.PlaneGeometry(.55,.65),i===0?right:left);decal.position.set(sign*1.13,.64,0);decal.rotation.y=sign*Math.PI/2;scene.add(decal)});
  if(design.productId.includes('hoodie')){const hood=new THREE.Mesh(new THREE.SphereGeometry(.42,24,16),body.material);hood.scale.set(1,1.15,.8);hood.position.set(0,1.1,-.12);scene.add(hood)}
  state.current={renderer,scene,camera,controls,materials:[front,back,left,right]};
  const resize=()=>{const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()}; const observer=new ResizeObserver(resize);observer.observe(el);resize();
  let frame=0;const draw=()=>{frame=requestAnimationFrame(draw);controls.update();renderer.render(scene,camera)};draw();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();controls.dispose();scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>{if(m instanceof THREE.MeshStandardMaterial)m.map?.dispose();m.dispose()})}});renderer.dispose();el.replaceChildren();state.current=null};
 },[design.productId]);
 useEffect(()=>{
  const s=state.current;if(!s)return;
  let disposed=false;
  s.scene.traverse(o=>{if(o instanceof THREE.Mesh && o.geometry instanceof THREE.ExtrudeGeometry || o instanceof THREE.Mesh && (o.geometry instanceof THREE.CylinderGeometry || o.geometry instanceof THREE.SphereGeometry)){if(o instanceof THREE.Mesh && o.material instanceof THREE.MeshStandardMaterial)o.material.color.set(getComputedStyle(document.documentElement).getPropertyValue(`--garment-${design.color}`).trim()||'#222222')}});
  (['front','back','left','right'] as View[]).forEach(async(v,index)=>{
   const canvas=document.createElement('canvas');canvas.width=768;canvas.height=1024;const ctx=canvas.getContext('2d');if(!ctx)return;
   for(const layer of design.layers.filter(l=>zoneView(l.zone)===v)){
    ctx.save();ctx.translate(layer.x/100*768,layer.y/100*1024);ctx.rotate(layer.rotation*Math.PI/180);
    const width=layer.width/100*768;
    if(layer.kind==='text'){ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue(`--print-${layer.color}`).trim()||'#ffffff';ctx.font=`900 ${width/Math.max(layer.value.length*.58,1)}px ${layer.font}`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(layer.value,0,0)}
    else{const img=new Image();img.src=layer.value;await new Promise(resolve=>{img.onload=resolve;img.onerror=resolve});if(img.naturalWidth)ctx.drawImage(img,-width/2,-width*img.height/img.width/2,width,width*img.height/img.width)}ctx.restore();
   }
   if(disposed)return;const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const mat=s.materials[index];if(mat){mat.map?.dispose();mat.map=texture;mat.needsUpdate=true}
  });return()=>{disposed=true};
 },[design]);
 useEffect(()=>{const s=state.current;if(!s)return;const angle={front:0,back:Math.PI,left:Math.PI/2,right:-Math.PI/2}[view];s.camera.position.set(Math.sin(angle)*5.5,.1,Math.cos(angle)*5.5);s.controls.update()},[view,design.productId]);
 const zoom=(factor:number)=>{const s=state.current;if(s){s.camera.position.multiplyScalar(factor);s.controls.update()}};
 return <div><div ref={host} className="h-[380px] w-full touch-none sm:h-[480px]" aria-label="Interactive 3D garment" />{error&&<p role="alert" className="text-sm text-destructive">3D preview unavailable on this device. Use the design canvas.</p>}<div className="flex flex-wrap justify-center gap-1">{(['front','back','left','right'] as View[]).map(v=><Button key={v} size="sm" variant={view===v?'default':'ghost'} onClick={()=>onView(v)} className="capitalize">{v}</Button>)}<Button variant="ghost" size="icon" aria-label="Zoom in" title="Zoom in" onClick={()=>zoom(.85)}><ZoomIn/></Button><Button variant="ghost" size="icon" aria-label="Zoom out" title="Zoom out" onClick={()=>zoom(1.15)}><ZoomOut/></Button><Button variant="ghost" size="icon" aria-label="Reset view" title="Reset view" onClick={()=>{onView('front');const s=state.current;if(s){s.camera.position.set(0,.1,5.5);s.controls.update()}}}><RotateCcw/></Button></div><p className="mt-3 text-center text-xs text-muted-foreground">Drag to rotate and preview your design.</p><p className="mt-1 text-center text-xs text-muted-foreground">Generic 3D garment — final fit and print placement require production models.</p></div>;
}
