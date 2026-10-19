import {createFileRoute} from '@tanstack/react-router';
import {AuthForm} from '@/components/auth/AuthForm';
import {safeNext} from '@/lib/auth';
export const Route=createFileRoute('/forgot-password')({
 validateSearch:(s:Record<string,unknown>)=>({next:safeNext(s['next'])}),
 head:()=>({meta:[{title:'Forgot Password — DRIPWEAR'},{name:'description',content:'Forgot Password for your DRIPWEAR streetwear account.'},{property:'og:title',content:'Forgot Password — DRIPWEAR'},{property:'og:description',content:'Your style. Your DRIPWEAR account.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 component:Page
});
function Page(){const {next}=Route.useSearch();return <AuthForm mode="forgot" next={next}/>}
