import {describe,it,expect} from 'vitest';
import {validArtwork, zoneView, printAreas, designKey, type Design} from './design';
describe('Design integrity',()=>{
  it('keeps back name and number on the back',()=>{expect(zoneView('back-name')).toBe('back');expect(zoneView('back-number')).toBe('back')});
  it('keeps left and right sleeve assignments independent',()=>{expect(zoneView('left-sleeve')).toBe('left');expect(zoneView('right-sleeve')).toBe('right')});
  it('accepts PNG/JPG only, within 5 MB',()=>{expect(validArtwork({type:'image/png',size:5_000_000})).toBe(true);expect(validArtwork({type:'image/jpeg',size:5_000_001})).toBe(false);expect(validArtwork({type:'image/svg+xml',size:100})).toBe(false)});
  it('charges a print area once even for several layers',()=>{expect(printAreas([{zone:'back-name'},{zone:'back-number'}] as Parameters<typeof printAreas>[0])).toEqual(['back'])});
  it('separates cart designs by positions, not only text',()=>{const a:Design={productId:'volt-jersey',color:'ink',size:'M',qty:1,layers:[{id:'1',kind:'text',value:'10',zone:'back-number',x:50,y:50,width:20,rotation:0,color:'light',font:'Archivo'}]}; expect(designKey(a)).not.toBe(designKey({...a,layers:[{...a.layers[0],x:60}] as Design['layers']}))});
});