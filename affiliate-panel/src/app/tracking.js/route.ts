import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const script = `(()=>{const model=${JSON.stringify(env.ATTRIBUTION_MODEL)};const name="pokisky_affiliate";const read=()=>{try{const raw=document.cookie.split("; ").find(x=>x.startsWith(name+"="))?.slice(name.length+1)||"";const value=decodeURIComponent(raw);return /^[a-z0-9_-]{4,32}$/i.test(value)?value.toUpperCase():""}catch{return""}};const write=value=>{document.cookie=name+"="+encodeURIComponent(value)+"; Max-Age=2592000; Path=/; SameSite=Lax"+(location.protocol==="https:"?"; Secure":"")};const params=new URLSearchParams(location.search);const code=params.get("ref");const marker=params.get("aff_visit")==="1";if(code&&/^[a-z0-9_-]{4,32}$/i.test(code)){if(model==="last"||!read())write(code.toUpperCase());if(!marker){fetch(${JSON.stringify(`${env.APP_ORIGIN}/api/tracking`)},{method:"POST",mode:"cors",credentials:"omit",keepalive:true,headers:{"Content-Type":"application/json"},body:JSON.stringify({code:code.toUpperCase(),page:location.pathname})}).then(response=>{if(!response.ok)console.warn("Affiliate tracking was rejected",response.status)}).catch(error=>console.warn("Affiliate tracking failed",error));}params.delete("ref");params.delete("aff_visit");const query=params.toString();history.replaceState(null,"",location.pathname+(query?"?"+query:"")+location.hash);}window.PokiSkyAffiliate={getCode:read};})();`;
  return new Response(script, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": env.BLOG_ORIGIN,
      "Cross-Origin-Resource-Policy": "cross-origin",
    },
  });
}
