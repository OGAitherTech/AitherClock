/* Aither Clock account integration — uses AitherBackend session auth. */
(() => {
  const $ = (id) => document.getElementById(id);
  const css = `
    .account-btn{border:1px solid var(--line);background:var(--card);color:var(--text);border-radius:12px;min-height:44px;padding:10px 13px;cursor:pointer}
    .account-modal{position:fixed;inset:0;z-index:100;display:grid;place-items:center;padding:18px;background:#0008;backdrop-filter:blur(10px)}
    .account-modal[hidden]{display:none}.account-card{width:min(430px,100%);background:var(--card);color:var(--text);border:1px solid var(--line);border-radius:22px;padding:20px;box-shadow:0 25px 80px #0008}
    .account-head{display:flex;justify-content:space-between;align-items:center;gap:12px}.account-head h2{margin:0;font-size:20px}.account-close{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:10px;min-width:42px;min-height:42px;font-size:20px}
    .account-tabs{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:16px 0}.account-tabs button,.account-submit{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:11px;min-height:44px;padding:10px;font:inherit}.account-tabs .active,.account-submit{background:var(--text);color:var(--bg);font-weight:700}
    .account-form{display:grid;gap:10px}.account-form[hidden]{display:none}.account-form label{display:grid;gap:6px;color:var(--muted);font-size:13px}.account-form input{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:11px;padding:12px;min-height:46px;width:100%}.account-status{min-height:20px;margin:4px 0 0;color:var(--muted);font-size:12px}.account-status[data-state=success]{color:#55d69a}.account-status[data-state=error]{color:#ff7b8f}.account-user{display:grid;gap:10px}.account-user strong{font-size:18px}.account-user p{margin:0;color:var(--muted);font-size:13px}.account-logout{border:1px solid var(--line);background:var(--card2);color:var(--text);border-radius:11px;min-height:44px;padding:10px;font:inherit}
    @media(max-width:430px){.account-btn{padding:9px 10px}.account-card{padding:16px;border-radius:18px}}
  `;
  function init() {
    if (!window.AitherBackend) return;
    const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
    const top = document.querySelector('.top-actions');
    if (!top || $('accountBtn')) return;
    const btn = document.createElement('button'); btn.type='button'; btn.id='accountBtn'; btn.className='account-btn'; btn.textContent='Account'; top.prepend(btn);
    const modal = document.createElement('div'); modal.className='account-modal'; modal.id='accountModal'; modal.hidden=true; modal.innerHTML = `
      <div class="account-card" role="dialog" aria-modal="true" aria-labelledby="accountTitle">
        <div class="account-head"><h2 id="accountTitle">Aither Account</h2><button type="button" class="account-close" id="accountClose" aria-label="Close">×</button></div>
        <div class="account-tabs"><button type="button" id="loginTab" class="active">Log in</button><button type="button" id="registerTab">Create account</button></div>
        <form id="loginForm" class="account-form"><label>Email<input id="loginEmail" type="email" autocomplete="email" required></label><label>Password<input id="loginPassword" type="password" autocomplete="current-password" required></label><button class="account-submit" type="submit">Log in</button></form>
        <form id="registerForm" class="account-form" hidden><label>Name<input id="registerName" type="text" autocomplete="name" maxlength="80" required></label><label>Email<input id="registerEmail" type="email" autocomplete="email" required></label><label>Password<input id="registerPassword" type="password" autocomplete="new-password" minlength="8" maxlength="200" required><small>At least 8 characters.</small></label><button class="account-submit" type="submit">Create account</button></form>
        <div id="accountUser" class="account-user" hidden></div><p id="accountStatus" class="account-status" aria-live="polite"></p>
      </div>`;
    document.body.appendChild(modal);
    const status = (text, state='') => { const el=$('accountStatus'); el.textContent=text; el.dataset.state=state; };
    const show = () => { modal.hidden=false; status(''); refreshSession(); };
    const close = () => { modal.hidden=true; };
    const setMode = (register) => { $('loginForm').hidden=register; $('registerForm').hidden=!register; $('loginTab').classList.toggle('active',!register); $('registerTab').classList.toggle('active',register); status(''); };
    function showUser(user) {
      $('loginForm').hidden=true; $('registerForm').hidden=true; $('loginTab').hidden=true; $('registerTab').hidden=true; $('accountUser').hidden=false;
      $('accountUser').innerHTML=`<strong>Signed in as ${escapeHtml(user.name)}</strong><p>${escapeHtml(user.email)}</p><button type="button" class="account-logout" id="accountLogout">Log out</button>`;
      btn.textContent=user.name ? `Account: ${user.name}` : 'Account';
      $('accountLogout').onclick=async()=>{try{await window.AitherBackend.request('/api/auth/logout',{method:'POST'});status('Logged out.','success');setTimeout(()=>{setMode(false);$('accountUser').hidden=true;$('loginTab').hidden=false;$('registerTab').hidden=false;btn.textContent='Account'},350)}catch(e){status(e.message||'Could not log out.','error')}};
    }
    function resetForms(){ $('accountUser').hidden=true; $('loginTab').hidden=false; $('registerTab').hidden=false; setMode(false); }
    async function refreshSession(){
      resetForms(); const url=window.AitherBackend.getUrl(); if(!url){status('Set your Aither Backend URL in Settings first.','error');return;}
      try{const data=await window.AitherBackend.request('/api/auth/session'); if(data?.authenticated&&data.user) showUser(data.user); else status('Not signed in.');}catch(e){status('Could not reach Aither Backend. Test the connection in Settings.','error');}
    }
    async function submit(path, payload, form){
      const submitBtn=form.querySelector('button[type=submit]'); submitBtn.disabled=true; submitBtn.textContent=path.endsWith('register')?'Creating…':'Logging in…'; status('Connecting to Aither Backend…');
      try{const data=await window.AitherBackend.request(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}); if(data?.authenticated&&data.user){showUser(data.user);status(path.endsWith('register')?'Account created and signed in.':'Signed in successfully.','success');}else throw new Error('The backend did not return an authenticated session.');}
      catch(e){let msg=e.message||'Request failed.'; if(msg.includes('HTTP 409'))msg='An account with this email already exists.'; if(msg.includes('HTTP 401'))msg='Invalid email or password.'; status(msg,'error');}
      finally{submitBtn.disabled=false;submitBtn.textContent=path.endsWith('register')?'Create account':'Log in';}
    }
    $('loginForm').onsubmit=e=>{e.preventDefault();submit('/api/auth/login',{email:$('loginEmail').value,password:$('loginPassword').value},e.currentTarget)};
    $('registerForm').onsubmit=e=>{e.preventDefault();submit('/api/auth/register',{name:$('registerName').value,email:$('registerEmail').value,password:$('registerPassword').value},e.currentTarget)};
    $('loginTab').onclick=()=>setMode(false); $('registerTab').onclick=()=>setMode(true); btn.onclick=show; $('accountClose').onclick=close; modal.addEventListener('click',e=>{if(e.target===modal)close()}); document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)close()});
    function escapeHtml(value){return String(value??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}
    window.AitherAccount={refresh:refreshSession,open:show};
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();
