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
  window.addEventListener('DOMContentLoaded', function(){
    setTimeout(routeFromHash, 0);

    // Fallback for the welcome-screen buttons. This keeps Konekte/Enskri
    // working even if an inline onclick is not executed by the browser.
    document.addEventListener('click', function(event){
      const button = event.target.closest('button');
      if(!button || !button.closest('.welcome')) return;
      const text = button.textContent.trim();
      if(text === 'Konekte' || text === 'Enskri'){
        event.preventDefault();
        event.stopImmediatePropagation();
        if(typeof window.go === 'function') window.go(text === 'Konekte' ? 'login' : 'register');
      }
    }, true);
  }, {once:true});
  window.addEventListener('hashchange', routeFromHash);
})();
