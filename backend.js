/* Aither Backend client — optional, secure, and GitHub Pages friendly. */
(() => {
  const STORAGE_KEY = 'aither-backend-url';
  const api = window.AitherBackend = {};

  const normalize = (value) => {
    const raw = String(value || '').trim();
    if (!raw) return '';
    return raw.replace(/\/+$/, '');
  };

  api.getUrl = () => normalize(localStorage.getItem(STORAGE_KEY) || '');
  api.setUrl = (value) => {
    const url = normalize(value);
    if (url) localStorage.setItem(STORAGE_KEY, url);
    else localStorage.removeItem(STORAGE_KEY);
    return url;
  };
  api.clearUrl = () => localStorage.removeItem(STORAGE_KEY);

  api.request = async (path, options = {}) => {
    const base = api.getUrl();
    if (!base) throw new Error('Backend URL is not configured.');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeout || 7000);
    try {
      const response = await fetch(`${base}${path}`, {
        ...options,
        signal: controller.signal,
        credentials: options.credentials || 'include',
        headers: { Accept: 'application/json', ...(options.headers || {}) },
        cache: 'no-store'
      });
      if (!response.ok) throw new Error(`Backend returned HTTP ${response.status}.`);
      return response.json();
    } finally {
      clearTimeout(timeout);
    }
  };

  api.health = () => api.request('/api/health');
  api.version = () => api.request('/api/version');
  api.config = () => api.request('/api/config');
})();
