// Ti Kanè m — Supabase public client configuration.
// This key is a publishable/anon key.
// NEVER put a service_role key here.

window.TIKANE_SUPABASE = {
  url: 'https://bhuqtrrxmfmmroctecgd.supabase.co',
  anonKey: 'sb_publishable_9fu_AWUDljxRit42M6yUDg_23nZE7'
};

(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const toastMsg=m=>{const t=$('toast');if(t){t.textContent=m;t.style.display='block';setTimeout(()=>t.style.display='none',2600)}};
  let client=null;
  try{ if(window.supabase && window.TIKANE_SUPABASE) client=window.supabase.createClient(window.TIKANE_SUPABASE.url,window.TIKANE_SUPABASE.anonKey); }catch(e){ console.error(e); }
  function fallbackHome(name){
    return `<section class="screen fade"><header class="hero"><div class="topbar"><span></span><div class="brand"><div class="logo-mark">TM</div><div><b>Ti Kanè m</b><small>Sere jodi, bati demen.</small></div></div><a class="iconbtn" href="./">⌂</a></div></header><div class="content"><div class="card"><small>☀️ Bonjou</small><h2>${esc(name||'Itilizatè')}</h2><p class="muted">Ou konekte avèk siksè.</p><a class="btn primary" href="./">Ale nan Akèy</a></div></div></section>`;
  }
  window.doLogin=async function(){
    const email=($('loginEmail')?.value||'').trim(),password=$('loginPass')?.value||'';
    if(!email||!password){toastMsg('Tanpri ranpli imèl ak modpas la.');return;}
    if(!client){toastMsg('Koneksyon ak sèvè a pa disponib.');return;}
    const btn=document.querySelector('[onclick="doLogin()"]');if(btn){btn.disabled=true;btn.textContent='Konekte...';}
    const {data,error}=await client.auth.signInWithPassword({email,password});
    if(error){toastMsg(error.message||'Imèl oswa modpas la pa kòrèk.');if(btn){btn.disabled=false;btn.textContent='Konekte';}return;}
    window.__tikaneSession=data.session||null;toastMsg('Koneksyon reyisi.');
    const app=$('app');if(app)app.innerHTML=fallbackHome(data.user?.user_metadata?.full_name||'Itilizatè');
  };
  window.doRegister=async function(){
    const name=($('regName')?.value||'').trim(),email=($('regEmail')?.value||'').trim(),phone=($('regPhone')?.value||'').trim(),password=$('regPass')?.value||'';
    if(!name||!email||!password){toastMsg('Tanpri ranpli non, imèl ak modpas la.');return;}
    if(password.length<6){toastMsg('Modpas la dwe gen omwen 6 karaktè.');return;}
    if(!client){toastMsg('Koneksyon ak sèvè a pa disponib.');return;}
    const btn=document.querySelector('[onclick="doRegister()"]');if(btn){btn.disabled=true;btn.textContent='Kreyasyon...';}
    const {data,error}=await client.auth.signUp({email,password,options:{data:{full_name:name,phone:phone}}});
    if(error){toastMsg(error.message||'Enskripsyon an echwe.');if(btn){btn.disabled=false;btn.textContent='Kreye kont';}return;}
    if(data.session){window.__tikaneSession=data.session;toastMsg('Kont la kreye avèk siksè.');const app=$('app');if(app)app.innerHTML=fallbackHome(name);}
    else {toastMsg('Kont la kreye. Verifye imèl ou an pou aktive li.');window.location.href='login.html';}
  };
  // Welcome buttons use real HTML pages. This avoids depending on the SPA JavaScript for the first navigation.
  document.addEventListener('click',function(e){
    const el=e.target.closest && e.target.closest('[onclick]');
    if(!el)return;
    const code=el.getAttribute('onclick')||'';
    const m=code.match(/^go\(['\"](login|register)['\"]\)$/);
    if(m){e.preventDefault();e.stopImmediatePropagation();window.location.href=m[1]+'.html';}
  },true);
})();
;

(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const toastMsg=m=>{const t=$('toast');if(t){t.textContent=m;t.style.display='block';setTimeout(()=>t.style.display='none',2600)}};
  let client=null;
  try{ if(window.supabase && window.TIKANE_SUPABASE) client=window.supabase.createClient(window.TIKANE_SUPABASE.url,window.TIKANE_SUPABASE.anonKey); }catch(e){ console.error(e); }
  function fallbackHome(name){
    return `<section class="screen fade"><header class="hero"><div class="topbar"><span></span><div class="brand"><div class="logo-mark">TM</div><div><b>Ti Kanè m</b><small>Sere jodi, bati demen.</small></div></div><a class="iconbtn" href="./">⌂</a></div></header><div class="content"><div class="card"><small>☀️ Bonjou</small><h2>${esc(name||'Itilizatè')}</h2><p class="muted">Ou konekte avèk siksè.</p><a class="btn primary" href="./">Ale nan Akèy</a></div></div></section>`;
  }
  window.doLogin=async function(){
    const email=($('loginEmail')?.value||'').trim(),password=$('loginPass')?.value||'';
    if(!email||!password){toastMsg('Tanpri ranpli imèl ak modpas la.');return;}
    if(!client){toastMsg('Koneksyon ak sèvè a pa disponib.');return;}
    const btn=document.querySelector('[onclick="doLogin()"]');if(btn){btn.disabled=true;btn.textContent='Konekte...';}
    const {data,error}=await client.auth.signInWithPassword({email,password});
    if(error){toastMsg(error.message||'Imèl oswa modpas la pa kòrèk.');if(btn){btn.disabled=false;btn.textContent='Konekte';}return;}
    window.__tikaneSession=data.session||null;toastMsg('Koneksyon reyisi.');
    const app=$('app');if(app)app.innerHTML=fallbackHome(data.user?.user_metadata?.full_name||'Itilizatè');
  };
  window.doRegister=async function(){
    const name=($('regName')?.value||'').trim(),email=($('regEmail')?.value||'').trim(),phone=($('regPhone')?.value||'').trim(),password=$('regPass')?.value||'';
    if(!name||!email||!password){toastMsg('Tanpri ranpli non, imèl ak modpas la.');return;}
    if(password.length<6){toastMsg('Modpas la dwe gen omwen 6 karaktè.');return;}
    if(!client){toastMsg('Koneksyon ak sèvè a pa disponib.');return;}
    const btn=document.querySelector('[onclick="doRegister()"]');if(btn){btn.disabled=true;btn.textContent='Kreyasyon...';}
    const {data,error}=await client.auth.signUp({email,password,options:{data:{full_name:name,phone:phone}}});
    if(error){toastMsg(error.message||'Enskripsyon an echwe.');if(btn){btn.disabled=false;btn.textContent='Kreye kont';}return;}
    if(data.session){window.__tikaneSession=data.session;toastMsg('Kont la kreye avèk siksè.');const app=$('app');if(app)app.innerHTML=fallbackHome(name);}
    else {toastMsg('Kont la kreye. Verifye imèl ou an pou aktive li.');window.location.href='login.html';}
  };
  // Welcome buttons use real HTML pages. This avoids depending on the SPA JavaScript for the first navigation.
  document.addEventListener('click',function(e){
    const el=e.target.closest && e.target.closest('[onclick]');
    if(!el)return;
    const code=el.getAttribute('onclick')||'';
    const m=code.match(/^go\(['\"](login|register)['\"]\)$/);
    if(m){e.preventDefault();e.stopImmediatePropagation();window.location.href=m[1]+'.html';}
  },true);
})();
