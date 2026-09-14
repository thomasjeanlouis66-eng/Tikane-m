// Ti Kanè m — Supabase public client configuration.
// This key is a publishable/anon key. NEVER put a service_role key here.
window.TIKANE_SUPABASE={url:'https://bhuqtrrxmfmmroctecgd.supabase.co',anonKey:'sb_publishable_9fu_AWUDljxRit42M6yUDg_23nZE7'};

(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const toastMsg=m=>{const t=$('toast');if(t){t.textContent=m;t.style.display='block';setTimeout(()=>t.style.display='none',2600)}};
  let client=null;
  try{ if(window.supabase && window.TIKANE_SUPABASE) client=window.supabase.createClient(window.TIKANE_SUPABASE.url,window.TIKANE_SUPABASE.anonKey); }catch(e){ console.error(e); }

  function fallbackLogin(){
    return `<section class="screen fade"><header class="hero"><div class="topbar"><button class="iconbtn" onclick="go('welcome')">‹</button><div class="brand"><div class="logo-mark">TM</div><div><b>Ti Kanè m</b><small>Sere jodi, bati demen.</small></div></div><span></span></div><h1 class="title" style="color:#fff">Byenveni tounen !</h1><div style="opacity:.85">Konekte ak kont ou</div></header><div class="content"><div class="card"><h2 class="title">Konekte</h2><p class="muted">Antre enfòmasyon kont ou.</p><label>Imèl<input id="loginEmail" class="input" type="email" placeholder="egzanp@email.com" autocomplete="email"></label><label>Modpas<input id="loginPass" class="input" type="password" placeholder="••••••••" autocomplete="current-password"></label><button class="btn blue" onclick="doLogin()">Konekte</button><button class="btn ghost" onclick="go('register')">Kreye yon kont</button></div></div></section>`;
  }
  function fallbackRegister(){
    return `<section class="screen fade"><header class="hero"><div class="topbar"><button class="iconbtn" onclick="go('welcome')">‹</button><div class="brand"><div class="logo-mark">TM</div><div><b>Ti Kanè m</b><small>Sere jodi, bati demen.</small></div></div><span></span></div><h1 class="title" style="color:#fff">Kreye kont</h1><div style="opacity:.85">Enskri pou kòmanse</div></header><div class="content"><div class="card"><h2 class="title">Nou kontan wè w</h2><label>Non konplè<input id="regName" class="input" placeholder="Non ou" autocomplete="name"></label><label>Imèl<input id="regEmail" class="input" type="email" placeholder="egzanp@email.com" autocomplete="email"></label><label>Telefòn<input id="regPhone" class="input" placeholder="+509 ..." autocomplete="tel"></label><label>Modpas<input id="regPass" class="input" type="password" placeholder="Omwen 6 karaktè" autocomplete="new-password"></label><button class="btn primary" onclick="doRegister()">Kreye kont</button><button class="btn ghost" onclick="go('login')">Mwen deja gen kont</button></div></div></section>`;
  }
  function fallbackWelcome(){
    return `<section class="welcome fade"><div><div class="brand"><div class="logo-mark">TM</div><div><b>Ti Kanè m</b><small>Sere jodi, bati demen.</small></div></div></div><div class="welcome-main"><div class="welcome-art">🧑🏾‍💼</div><h1>Kòmanse bati<br><strong>pwòjè w</strong></h1><p>Sere jodi, bati demen. Chwazi plan ki mache ak objektif ou.</p><div class="paybox"><b>Metòd peman</b><div class="payrow"><div class="pay">💳<br>NatCash</div><div class="pay">💳<br>MonCash</div><div class="pay">💵<br>Cash</div></div></div></div><div><button class="btn primary" onclick="go('login')">Konekte</button><button class="btn light" onclick="go('register')">Enskri</button></div></section>`;
  }
  function fallbackHome(name){
    return `<section class="screen fade"><header class="hero"><div class="topbar"><span></span><div class="brand"><div class="logo-mark">TM</div><div><b>Ti Kanè m</b><small>Sere jodi, bati demen.</small></div></div><button class="iconbtn" onclick="go('login')">↪</button></div></header><div class="content"><div class="card"><small>☀️ Bonjou</small><h2>${esc(name||'Vizitè')}</h2><p class="muted">Ou konekte avèk siksè.</p></div><div class="banner"><b>Byenveni sou Ti Kanè m</b><span>Sere jodi, bati demen.</span></div></div></section>`;
  }
  window.go=function(route){
    try{ if(typeof window[route]==='function' && route!=='go'){ window[route](); return; } }catch(e){ console.error(e); }
    const target=route==='welcome'?fallbackWelcome():route==='login'?fallbackLogin():route==='register'?fallbackRegister():fallbackHome();
    const app=$('app'); if(app) app.innerHTML=target;
    window.scrollTo(0,0);
  };
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
    else {toastMsg('Kont la kreye. Verifye imèl ou an pou aktive li.');window.go('login');}
  };
  // Capture navigation clicks before the main app script. This keeps the two welcome buttons working even if a later script fails to parse.
  document.addEventListener('click',function(e){
    const el=e.target.closest && e.target.closest('[onclick]');
    if(!el)return;
    const code=el.getAttribute('onclick')||'';
    const m=code.match(/^go\(['\"]([^'\"]+)['\"]\)$/);
    if(m){e.preventDefault();e.stopImmediatePropagation();window.go(m[1]);}
  },true);
})();
