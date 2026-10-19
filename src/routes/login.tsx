import {createFileRoute} from '@tanstack/react-router';
import {AuthForm} from '@/components/auth/AuthForm';
import {safeNext} from '@/lib/auth';
export const Route=createFileRoute('/login')({
 validateSearch:(s:Record<string,unknown>)=>({next:safeNext(s['next'])}),
 head:()=>({meta:[{title:'Sign In — DRIPWEAR'},{name:'description',content:'Sign In for your DRIPWEAR streetwear account.'},{property:'og:title',content:'Sign In — DRIPWEAR'},{property:'og:description',content:'Your style. Your DRIPWEAR account.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 component:Page
});
function Page(){const {next}=Route.useSearch();return <AuthForm mode="login" next={next}/>}
