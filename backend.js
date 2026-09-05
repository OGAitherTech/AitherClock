/* Aither Backend client — shared across Aither apps. */
(() => {
  const STORAGE_KEY='aither-backend-url';
  const DEFAULT_URL='https://aither-backend.onrender.com';
  const api=window.AitherBackend={};
  const normalize=v=>String(v||'').trim().replace(/\/+$/,'');
  api.getUrl=()=>normalize(localStorage.getItem(STORAGE_KEY)||DEFAULT_URL);
  api.setUrl=v=>{const u=normalize(v);if(u)localStorage.setItem(STORAGE_KEY,u);else localStorage.removeItem(STORAGE_KEY);return u};
  api.clearUrl=()=>localStorage.removeItem(STORAGE_KEY);
  api.request=async(path,options={})=>{const base=api.getUrl();const c=new AbortController();const t=setTimeout(()=>c.abort(),options.timeout||7000);try{const r=await fetch(base+path,{...options,signal:c.signal,credentials:'include',headers:{Accept:'application/json',...(options.headers||{})},cache:'no-store'});if(!r.ok)throw Error(`Backend returned HTTP ${r.status}.`);return r.json()}finally{clearTimeout(t)}};
  api.health=()=>api.request('/api/health');api.version=()=>api.request('/api/version');api.config=()=>api.request('/api/config');
})();