import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import type { Design } from './design';

export async function saveDesign(design: Design, name: string, userId: string, id?: string) {
  const layers = await Promise.all(design.layers.map(async layer => {
    if (layer.kind !== 'image' || layer.assetPath) return layer;
    const blob = await (await fetch(layer.value)).blob();
    const path = `${userId}/${crypto.randomUUID()}.${blob.type === 'image/png' ? 'png' : 'jpg'}`;
    const {error} = await supabase.storage.from('design-artwork').upload(path, blob);
    if(error) throw error;
    return {...layer,assetPath:path,value:''};
  }));
  const row = {user_id:userId,name,configuration:{...design,layers} as unknown as Json,updated_at:new Date().toISOString()};
  const result = id ? await supabase.from('saved_designs').update(row).eq('id',id).eq('user_id',userId).select('id').single() : await supabase.from('saved_designs').insert(row).select('id').single();
  if(result.error) throw result.error;
  return result.data.id;
}
export async function loadDesign(id: string): Promise<Design> {
  const {data,error}=await supabase.from('saved_designs').select('configuration').eq('id',id).single();
  if(error) throw error;
  const design=data.configuration as unknown as Design;
  if(!design || !Array.isArray(design.layers)) throw new Error('This design cannot be opened.');
  const layers=await Promise.all(design.layers.map(async layer=>{
    if(!layer.assetPath)return layer;
    const {data,error}=await supabase.storage.from('design-artwork').createSignedUrl(layer.assetPath,3600);
    if(error)throw error;
    return {...layer,value:data.signedUrl};
  }));
  return {...design,layers};
}