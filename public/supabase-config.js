// Ti Kanè m — Supabase public client configuration.
// Configuration only. Never put a service_role / secret key here.
window.TIKANE_SUPABASE = {
  url: 'https://bhuqtrrxmfmmroctecgd.supabase.co',
  anonKey: 'sb_publishable_9fu_AWUDljxRit42M6yUDg_23nZEe7O'
};

// Emergency-safe routing: the welcome buttons must still work even if
// another script is delayed. The main app's go() remains authoritative.
(function(){
  const routes = new Set(['welcome','login','register','home','plans','fixed','detail','order','market','sell','chat','profile','orders','settings']);
  function route(page){
    if(!routes.has(page)) return;
    if(typeof window.go === 'function') { window.go(page); return; }
    location.hash = page;
  }
  function wire(){
    document.addEventListener('click', function(e){
      const b=e.target.closest('button');
      if(!b) return;
      const text=(b.textContent||'').trim();
      if(text==='Konekte' || text==='Enskri'){
        e.preventDefault();
        e.stopImmediatePropagation();
        route(text==='Konekte'?'login':'register');
      }
    }, true);
    const page=decodeURIComponent((location.hash||'').slice(1)).split('?')[0];
    if(routes.has(page)) setTimeout(()=>route(page),50);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',wire,{once:true});
  else wire();
})();
