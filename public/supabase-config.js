// Ti Kanè m — Supabase public client configuration.
// This file must contain configuration only.
// NEVER put a service_role / secret key here.

window.TIKANE_SUPABASE = {
  url: 'https://bhuqtrrxmfmmroctecgd.supabase.co',
  anonKey: 'sb_publishable_9fu_AWUDljxRit42M6yUDg_23nZEe7O'
};

// Keep legacy URLs working while the app uses the single index.html router.
(function(){
  const routes = new Set(['welcome','login','register','home','plans','fixed','detail','order','market','sell','chat','profile','orders','settings']);
  function routeFromHash(){
    const page = decodeURIComponent((location.hash || '').slice(1)).split('?')[0];
    if(routes.has(page) && typeof window.go === 'function') window.go(page);
  }
  window.addEventListener('DOMContentLoaded', function(){ setTimeout(routeFromHash, 0); }, {once:true});
  window.addEventListener('hashchange', routeFromHash);
})();
