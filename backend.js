/* Aither Backend client — shared across Aither apps. */
(() => {
  const STORAGE_KEY='aither-backend-url';
  const LEGACY_URL='https://aither-backend.onrender.com';
  const DEFAULT_URL='https://aitherbackend.onrender.com';
  const api=window.AitherBackend={};
  const normalize=v=>String(v||'').trim().replace(/\/+$/,'');
  api.getUrl=()=>{const stored=normalize(localStorage.getItem(STORAGE_KEY));if(stored===LEGACY_URL){localStorage.removeItem(STORAGE_KEY);return DEFAULT_URL}return stored||DEFAULT_URL};
  api.setUrl=v=>{const u=normalize(v);if(!u||u===DEFAULT_URL)localStorage.removeItem(STORAGE_KEY);else localStorage.setItem(STORAGE_KEY,u);return u||DEFAULT_URL};
  api.clearUrl=()=>localStorage.removeItem(STORAGE_KEY);
  api.request=async(path,options={})=>{const base=api.getUrl();const c=new AbortController();const t=setTimeout(()=>c.abort(),options.timeout||10000);const token=localStorage.getItem('aither-session-token');try{const headers={Accept:'application/json',...(options.headers||{})};if(token&&!headers.Authorization)headers.Authorization=`Bearer ${token}`;const r=await fetch(base+path,{...options,signal:c.signal,credentials:'include',headers,cache:'no-store'});if(!r.ok)throw Error(`Backend returned HTTP ${r.status}.`);return r.json()}catch(err){if(err.name==='AbortError')throw Error('Aither Backend took too long to respond.');throw err}finally{clearTimeout(t)}};
  api.health=()=>api.request('/api/health');api.version=()=>api.request('/api/version');api.config=()=>api.request('/api/config');
})();