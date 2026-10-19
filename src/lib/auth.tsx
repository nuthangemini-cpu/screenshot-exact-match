import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
const AuthContext = createContext<{user:User|null;ready:boolean}>({user:null,ready:false});
export function AuthProvider({children}:{children:ReactNode}) {
  const [user,setUser] = useState<User|null>(null);
  const [ready,setReady] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({data})=>{setUser(data.session?.user ?? null);setReady(true)});
    const {data} = supabase.auth.onAuthStateChange((_event,session)=>{setUser(session?.user ?? null);setReady(true)});
    return ()=>data.subscription.unsubscribe();
  },[]);
  return <AuthContext.Provider value={{user,ready}}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
export function safeNext(value:unknown) { return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') && !value.includes('\\') ? value : '/account'; }