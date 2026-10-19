export type View = 'front' | 'back' | 'left' | 'right';
export type Zone = 'front' | 'left-chest' | 'right-chest' | 'front-number' | 'left-shoulder' | 'right-shoulder' | 'left-sleeve' | 'right-sleeve' | 'back' | 'back-name' | 'back-number';
export interface DesignLayer { id: string; kind: 'text' | 'image'; value: string; assetPath?: string; zone: Zone; x: number; y: number; width: number; rotation: number; color: string; font: string; }
export interface Design { productId: string; color: string; size: string; qty: number; layers: DesignLayer[]; }
export const ZONES: { id: Zone; label: string; view: View; x: number; y: number }[] = [
  {id:'front',label:'Center chest',view:'front',x:50,y:42},
  {id:'left-chest',label:'Left chest',view:'front',x:62,y:32},
  {id:'right-chest',label:'Right chest',view:'front',x:38,y:32},
  {id:'front-number',label:'Front number',view:'front',x:50,y:60},
  {id:'left-shoulder',label:'Left shoulder',view:'front',x:68,y:20},
  {id:'right-shoulder',label:'Right shoulder',view:'front',x:32,y:20},
  {id:'left-sleeve',label:'Left sleeve',view:'left',x:50,y:42},
  {id:'right-sleeve',label:'Right sleeve',view:'right',x:50,y:42},
  {id:'back',label:'Center back',view:'back',x:50,y:50},
  {id:'back-name',label:'Back name',view:'back',x:50,y:30},
  {id:'back-number',label:'Back number',view:'back',x:50,y:55},
];
export const zoneView = (zone: Zone): View => ZONES.find(z => z.id === zone)?.view ?? 'front';
export const printAreas = (layers: DesignLayer[]) => [...new Set(layers.map(l => { const view = zoneView(l.zone); return view === 'left' || view === 'right' ? 'sleeve' : view; }))];
export function designKey(design: Design): string { return JSON.stringify({...design, qty:1}); }
export const MAX_UPLOAD_BYTES = 5_000_000;
export function validArtwork(file: {type: string; size: number}) { return ['image/png','image/jpeg'].includes(file.type) && file.size <= MAX_UPLOAD_BYTES; }