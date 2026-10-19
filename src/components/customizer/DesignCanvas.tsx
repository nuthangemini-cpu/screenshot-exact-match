import { useEffect, useRef } from 'react';
import { Canvas, FabricImage, Textbox } from 'fabric';
import { zoneView, type DesignLayer, type View } from '@/lib/design';
export default function DesignCanvas({layers,view,onChange,onSelect}:{layers:DesignLayer[];view:View;onChange:(layers:DesignLayer[])=>void;onSelect:(id:string|null)=>void}){
 const element=useRef<HTMLCanvasElement>(null);const instance=useRef<Canvas|null>(null);const callback=useRef(onChange);callback.current=onChange;
 useEffect(()=>{if(!element.current)return;const c=new Canvas(element.current,{width:500,height:600,backgroundColor:'transparent',preserveObjectStacking:true});instance.current=c;
 c.on('object:modified',e=>{const object=e.target;if(!object)return;const id=(object as typeof object & {layerId?:string}).layerId;if(!id)return;callback.current(layers.map(l=>l.id===id?{...l,x:Math.min(85,Math.max(15,(object.left??0)/5)),y:Math.min(85,Math.max(15,(object.top??0)/6)),width:Math.min(70,Math.max(5,object.getScaledWidth()/5)),rotation:object.angle??0}:l))});
 c.on('selection:created',e=>onSelect((e.selected[0] as typeof e.selected[0] & {layerId?:string})?.layerId??null));c.on('selection:updated',e=>onSelect((e.selected[0] as typeof e.selected[0] & {layerId?:string})?.layerId??null));
 let cancelled=false;
 (async()=>{for(const l of layers.filter(l=>zoneView(l.zone)===view)){let obj;const common={left:l.x*5,top:l.y*6,originX:'center' as const,originY:'center' as const,angle:l.rotation};if(l.kind==='text'){obj=new Textbox(l.value,{...common,width:l.width*5,fontFamily:l.font,fontSize:l.width*5/Math.max(l.value.length*.58,1),fontWeight:900,textAlign:'center',fill:getComputedStyle(document.documentElement).getPropertyValue(`--print-${l.color}`).trim()})}else{try{obj=await FabricImage.fromURL(l.value);obj.set(common);obj.scaleToWidth(l.width*5)}catch{continue}}if(cancelled)return;Object.assign(obj,{layerId:l.id});c.add(obj)}c.renderAll()})();
 return()=>{cancelled=true;void c.dispose();instance.current=null};
 },[layers,view,onSelect]);
 return <div className="design-canvas mx-auto aspect-[5/6] w-full max-w-[500px] overflow-hidden rounded-lg border border-dashed border-accent/40 bg-surface"><canvas ref={element} aria-label="Design canvas"/></div>;
}
