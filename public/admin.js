/* Ti Kanè m — Admin + payment + plan tracking enhancement */
(function(){
  function planCode(id){ return String(id||'').split('-').pop(); }
  function planInfo(code){
    const x={
      '5G':{mode:'progressive',days:100,daily:5},'10G':{mode:'progressive',days:100,daily:10},'25G':{mode:'progressive',days:100,daily:25},
      '50G':{mode:'progressive',days:50,daily:50},'100G':{mode:'progressive',days:50,daily:100},
      '250G':{mode:'fixed',days:100,daily:250},'500G':{mode:'fixed',days:100,daily:500},'1000G':{mode:'fixed',days:100,daily:1000}
    }; return x[code]||null;
  }
  function css(){
    if(document.getElementById('tk-admin-css'))return;
    const s=document.createElement('style');s.id='tk-admin-css';s.textContent=`
      .admin-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-bottom:14px}.admin-stat{padding:15px;border-radius:16px;background:#fff;box-shadow:0 5px 18px #0754c814}.admin-stat b{display:block;font-size:24px;color:#0754c8}.admin-stat small{color:#71809a}.admin-list{display:flex;flex-direction:column;gap:9px}.admin-row{background:#fff;border-radius:14px;padding:12px;box-shadow:0 4px 14px #0754c810}.admin-row .muted{font-size:12px;color:#71809a}.admin-badge{display:inline-block;border-radius:20px;padding:4px 9px;font-size:11px;font-weight:800;background:#eef5ff;color:#0754c8}.admin-badge.paid{background:#e8fff2;color:#087443}.admin-badge.pending{background:#fff6d8;color:#8a6200}.admin-actions{display:flex;gap:7px;margin-top:9px}.admin-actions input{flex:1;min-width:0}.progress-wrap{height:9px;background:#edf1f7;border-radius:20px;overflow:hidden;margin:8px 0}.progress-bar{height:100%;background:#0754c8;border-radius:20px}.pay-form{display:grid;gap:8px}.pay-form select,.pay-form input{width:100%;box-sizing:border-box}.admin-title{display:flex;align-items:center;justify-content:space-between;gap:8px}.section-label{font-weight:900;margin:16px 0 8px}`;document.head.appendChild(s);
  }
  async function getPlansForUser(uid){
    const r=await sb.from('customer_plans').select('*').eq('user_id',uid).order('created_at',{ascending:false}); return r.data||[];
  }
  async function trackingCard(o){
    const code=planCode(o.plan_id), info=planInfo(code);
    const r=await sb.from('payment_records').select('day_number,status,payment_date,cycle_number').eq('user_id',o.user_id).eq('plan_id',code).order('day_number');
    const rows=r.data||[], paid=rows.filter(x=>x.status==='Peye').length, total=info?.days||100, pct=Math.min(100,Math.round(paid/total*100));
    return `<div class="card"><div class="admin-title"><b>${safe(o.plan_id)}</b><span class="admin-badge ${paid?'paid':'pending'}">${paid}/${total} jou peye</span></div><div class="progress-wrap"><div class="progress-bar" style="width:${pct}%"></div></div><small>${pct}% konplete • Kòmanse: ${safe(o.start_date||'—')}</small><div style="margin-top:8px;font-size:12px;color:#71809a">${paid?('Dènye jou peye: '+safe(rows.filter(x=>x.status==='Peye').slice(-1)[0]?.day_number||'—')):'Pa gen jou peye ankò'}</div></div>`;
  }
  async function enhancedProfile(){
    if(!session)return '<section class="screen">'+top('Pwofil','Kont mwen',true)+'<div class="content"><div class="card"><p>Konekte pou wè plan ou yo.</p><button class="btn full" onclick="go(\'login\')">Konekte</button></div></div></section>';
    const plans=await getPlansForUser(session.user.id);let cards='';for(const o of plans)cards+=await trackingCard(o);
    return '<section class="screen">'+top('Pwofil','Kont mwen',true)+'<div class="profile-head"><div class="profile-info"><div class="big-avatar">'+safe(userName().charAt(0))+'</div><div><h2 style="margin:0">'+safe(userName())+'</h2><div class="online">● Aktif</div><small>'+safe(session.user.email||'')+'</small></div></div><div class="stats"><div class="stat"><b>'+plans.length+'</b><small>Plan</small></div><div class="stat"><b>'+plans.filter(Boolean).length+'</b><small>Kòmand</small></div><div class="stat"><b>✓</b><small>Kont</small></div></div></div><div class="content"><div class="section-label">Suivi plan mwen yo</div>'+(cards||'<div class="card"><p>Ou poko gen plan.</p><button class="btn yellow" onclick="go(\'plans\')">Chwazi yon plan</button></div>')+'<div class="card" style="margin-top:12px"><div class="menurow">📋 <button onclick="go(\'orders\')">Kòmand mwen yo</button></div><div class="menurow">⚙️ <button onclick="go(\'settings\')">Anviwònman</button></div><div class="menurow">🚪 <button onclick="logout()">Dekonekte</button></div></div></div>'+nav('profile')+'</section>';
  }
  async function enhancedOrders(){
    if(!session){toast('Konekte pou wè kòmand yo');return}
    const plans=await getPlansForUser(session.user.id);let body='';for(const o of plans)body+=await trackingCard(o);
    return '<section class="screen">'+top('Kòmand mwen yo','Suivi peman ak pwogrè',true)+'<div class="content">'+(body||'<div class="card"><p>Pa gen kòmand pou kounye a.</p></div>')+'</div></section>';
  }
  async function enhancedAdmin(){
    if(!session){toast('Konekte kòm admin');return go('login')}
    const role=await sb.from('user_roles').select('role,is_blocked').eq('user_id',session.user.id).maybeSingle();
    if(role.data?.role!=='admin')return '<section class="screen">'+top('Admin','Aksè limite',true)+'<div class="content"><div class="card"><b>Aksè refize</b><p>Kont sa a pa gen wòl admin.</p></div></div></section>';
    const [cp,pr,tx,users]=await Promise.all([
      sb.from('customer_plans').select('*').order('created_at',{ascending:false}),
      sb.from('payment_records').select('user_id,plan_id,day_number,status,payment_date,cycle_number').order('created_at',{ascending:false}).limit(500),
      sb.from('payment_transactions').select('id,user_id,plan_id,cycle_number,amount,received_at,note,created_at,remaining_amount').order('created_at',{ascending:false}).limit(100),
      sb.from('user_roles').select('user_id,email,role,is_blocked').order('created_at',{ascending:false})
    ]);
    const plans=cp.data||[], records=pr.data||[], transactions=tx.data||[], ur=users.data||[];
    const paid=records.filter(x=>x.status==='Peye').length, pending=records.filter(x=>x.status==='Pa peye').length;
    const totalReceived=transactions.reduce((s,x)=>s+Number(x.amount||0),0);
    let rows=plans.slice(0,30).map(o=>{const code=planCode(o.plan_id), mine=records.filter(r=>r.user_id===o.user_id&&r.plan_id===code), p=mine.filter(r=>r.status==='Peye').length;return `<div class="admin-row"><div class="admin-title"><b>${safe(o.full_name||'Itilizatè')}</b><span class="admin-badge">${safe(code)}</span></div><div class="muted">${safe(o.phone||'')} • ${safe(o.start_date||'—')}</div><div class="progress-wrap"><div class="progress-bar" style="width:${Math.min(100,Math.round(p/(planInfo(code)?.days||100)*100))}%"></div></div><small>${p}/${planInfo(code)?.days||100} jou peye</small><div class="admin-actions"><input id="amt-${o.id}" inputmode="decimal" placeholder="Kantite G"><button class="btn yellow" onclick="receivePayment('${o.user_id}','${code}',${o.id})">Resevwa</button></div></div>`}).join('');
    const txRows=transactions.slice(0,12).map(x=>`<div class="admin-row"><b>${safe(x.plan_id)}</b> <span class="admin-badge paid">${safe(x.amount)} G</span><div class="muted">${safe(x.received_at)} • ${safe(x.note||'Peman')}</div></div>`).join('');
    return '<section class="screen">'+top('Admin','Jesyon plan ak peman',true)+'<div class="content"><div class="admin-grid"><div class="admin-stat"><b>'+plans.length+'</b><small>Kòmand plan</small></div><div class="admin-stat"><b>'+ur.length+'</b><small>Itilizatè</small></div><div class="admin-stat"><b>'+paid+'</b><small>Jou peye</small></div><div class="admin-stat"><b>'+pending+'</b><small>Jou pa peye</small></div></div><div class="card"><div class="admin-title"><b>Total peman resevwa</b><strong>'+totalReceived.toLocaleString()+' G</strong></div><small>Admin sèlman ka valide peman.</small></div><div class="section-label">Kliyan ak plan yo</div><div class="admin-list">'+(rows||'<div class="card">Pa gen kòmand.</div>')+'</div><div class="section-label">Dènye peman yo</div><div class="admin-list">'+(txRows||'<div class="card">Pa gen tranzaksyon.</div>')+'</div></div></section>';
  }
  window.receivePayment=async function(uid,code,rowId){
    const input=document.getElementById('amt-'+rowId), amount=Number(input?.value||0);if(!amount){toast('Mete kantite peman an');return}
    const {data,error}=await sb.rpc('admin_apply_received_amount',{p_user_id:uid,p_plan_id:code,p_cycle_number:1,p_amount:amount,p_received_at:new Date().toISOString().slice(0,10)});
    if(error){toast(error.message);return}toast('Peman anrejistre ✔ '+(data?.days_paid||0)+' jou valide');go('admin');
  };
  window.addEventListener('load',function(){css();window.profile=enhancedProfile;window.orders=enhancedOrders;window.admin=enhancedAdmin;});
})();
