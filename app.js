(function(){
'use strict';
var BUILD='2026.10.03-v10';
var K='dresden26:';
var errors=[];
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function setText(id,v){var e=$(id);if(e)e.textContent=v||'—'}
function closeMenu(){var m=$('#appMenu');if(m)m.open=false}
function showStatus(id,msg,ok){var e=$(id);if(!e)return;e.textContent=msg;e.className='statusMessage '+(ok?'ok':'err')}
function hideStatus(id){var e=$(id);if(e)e.classList.add('hidden')}
function safeInit(name,fn){try{fn()}catch(e){errors.push(name+': '+(e&&e.message?e.message:e));console.error(name,e);renderDiagnostics()}}
function renderDiagnostics(){
  setText('#diagVersion',BUILD);
  setText('#diagNetwork',navigator.onLine?'online':'offline');
  setText('#diagQr',typeof window.qrcode==='function'?'OK':'chyba / nenačteno');
  var pd=loadPrivateRaw();
  setText('#diagPrivate',pd&&Object.keys(pd).some(function(k){return !!pd[k]})?'načtena':'nejsou');
  var de=$('#diagErrors');if(de)de.textContent=errors.length?errors.join(' | '):'';
}
function loadPrivateRaw(){try{return JSON.parse(localStorage.getItem(K+'private')||'{}')}catch(e){return {}}}
function savePrivateRaw(d){localStorage.setItem(K+'private',JSON.stringify(d||{}))}
function privateMap(){return {address:'pAddress',booking:'pBooking',hostName:'pHostName',phone:'pPhone',checkIn:'pCheckIn',checkOut:'pCheckOut',trainOut:'pTrainOut',trainBack:'pTrainBack',notes:'pNotes'}}
function readPrivateForm(){var d={};var map=privateMap();Object.keys(map).forEach(function(k){var e=$('#'+map[k]);d[k]=e?e.value.trim():''});return d}
function fillPrivateForm(d){d=d||{};var map=privateMap();Object.keys(map).forEach(function(k){var e=$('#'+map[k]);if(e)e.value=d[k]||''})}
function hasPrivate(d){return d&&Object.keys(d).some(function(k){return String(d[k]||'').trim()!==''})}
function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function renderPrivate(d){
  d=d||{};
  var summary=$('#privateSummary');
  if(summary)summary.classList.toggle('hidden',!hasPrivate(d));
  setText('#sumAddress',d.address);
  var addressMap=$('#sumAddressMap');
  if(addressMap){if(d.address){addressMap.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(d.address);addressMap.classList.remove('hidden')}else{addressMap.removeAttribute('href');addressMap.classList.add('hidden')}}
  var stay=[d.checkIn&&('Check-in: '+d.checkIn),d.checkOut&&('Checkout: '+d.checkOut)].filter(Boolean).join(' · ');
  setText('#sumStay',stay);
  setText('#sumHost',[d.hostName,d.phone].filter(Boolean).join(' · '));
  setText('#sumBooking',d.booking?('Kód: '+d.booking):'');
  setText('#sumTrainOut',d.trainOut);
  setText('#sumTrainBack',d.trainBack);
  function inline(id,html){var e=$(id);if(!e)return;e.innerHTML=html;e.classList.toggle('hidden',!html)}
  inline('#outboundPrivate',d.trainOut?('<b>Moje údaje:</b> '+escapeHtml(d.trainOut)):'');
  var stayHtml=[];
  if(d.address)stayHtml.push('<b>Adresa:</b> '+escapeHtml(d.address)+' <a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(d.address)+'">Navigovat ↗</a>');
  if(d.checkIn)stayHtml.push('<b>Check-in:</b> '+escapeHtml(d.checkIn));
  if(d.hostName||d.phone)stayHtml.push('<b>Hostitel:</b> '+escapeHtml([d.hostName,d.phone].filter(Boolean).join(' · ')));
  inline('#stayPrivate',stayHtml.join('<br>'));
  inline('#checkoutPrivate',d.checkOut?('<b>Checkout:</b> '+escapeHtml(d.checkOut)):'');
  inline('#returnPrivate',d.trainBack?('<b>Moje údaje:</b> '+escapeHtml(d.trainBack)):'');
  renderDiagnostics();
}
function migratePrivate(){
  var d=loadPrivateRaw();
  if(hasPrivate(d))return d;
  var legacy={address:localStorage.getItem(K+'pAddress')||'',booking:localStorage.getItem(K+'pBooking')||'',phone:localStorage.getItem(K+'pPhone')||'',notes:localStorage.getItem(K+'pNotes')||''};
  if(hasPrivate(legacy)){savePrivateRaw(legacy);return legacy}
  return {};
}
function initNav(){
  $$('.nav button,[data-go]').forEach(function(b){
    b.addEventListener('click',function(){
      var id=b.getAttribute('data-go');if(!id)return;
      var t=document.getElementById(id);if(t)t.scrollIntoView({behavior:'smooth'});
      $$('.nav button').forEach(function(x){x.classList.toggle('active',x.getAttribute('data-go')===id)});
    });
  });
  $$('.daytabs button').forEach(function(b){
    b.addEventListener('click',function(){
      $$('.daytabs button').forEach(function(x){x.classList.toggle('active',x===b)});
      $('#sat').classList.toggle('hidden',b.getAttribute('data-day')!=='sat');
      $('#sun').classList.toggle('hidden',b.getAttribute('data-day')!=='sun');
    });
  });
}
function initCountdown(){
  function update(){var d=new Date('2026-12-05T08:31:00+01:00')-new Date();var e=$('#countdown');if(!e)return;if(d<=0){e.textContent='Výlet právě běží nebo už proběhl';return}var days=Math.floor(d/864e5),h=Math.floor(d%864e5/36e5);e.textContent='Odjezd za '+days+' dní a '+h+' h'}
  update();setInterval(update,3600000);
}
function initProgress(){
  $$('.event').forEach(function(e){
    var id=e.getAttribute('data-id'),b=$('.check',e);
    function render(){var done=localStorage.getItem(K+'event:'+id)==='1';e.classList.toggle('done',done);if(b){b.textContent=done?'✓ Splněno':'○ Hotovo';b.setAttribute('aria-pressed',done?'true':'false')}}
    render();
    if(b)b.addEventListener('click',function(){var done=localStorage.getItem(K+'event:'+id)==='1';localStorage.setItem(K+'event:'+id,done?'0':'1');render()});
  });
  function markNow(){var n=Date.now();$$('.event').forEach(function(e){e.classList.toggle('now',n>=Date.parse(e.getAttribute('data-start'))&&n<Date.parse(e.getAttribute('data-end')))})}
  markNow();setInterval(markNow,60000);
  var reset=$('#resetProgress');if(reset)reset.addEventListener('click',function(){if(confirm('Resetovat všechna označení Hotovo?')){$$('.event').forEach(function(e){localStorage.removeItem(K+'event:'+e.getAttribute('data-id'))});closeMenu();initProgressStateOnly()}});
}
function initProgressStateOnly(){$$('.event').forEach(function(e){var done=localStorage.getItem(K+'event:'+e.getAttribute('data-id'))==='1';e.classList.toggle('done',done);var b=$('.check',e);if(b){b.textContent=done?'✓ Splněno':'○ Hotovo';b.setAttribute('aria-pressed',done?'true':'false')}})}
function initChecklist(){
  $$('#checklist input').forEach(function(c){var key=K+'c:'+c.getAttribute('data-c');c.checked=localStorage.getItem(key)==='1';c.addEventListener('change',function(){localStorage.setItem(key,c.checked?'1':'0')})});
}
function showPrivateSection(){
  var section=$('#private');if(!section)return;
  section.classList.remove('hidden');closeMenu();
  requestAnimationFrame(function(){section.scrollIntoView({behavior:'smooth',block:'start'})});
}
function hidePrivateSection(){
  var section=$('#private');if(!section)return;
  section.classList.add('hidden');
}
function initPrivateAccess(){
  var fromMenu=$('#openPrivateMenu');if(fromMenu)fromMenu.addEventListener('click',showPrivateSection);
  var fromSummary=$('#openPrivateSummary');if(fromSummary)fromSummary.addEventListener('click',showPrivateSection);
  var hide=$('#hidePrivate');if(hide)hide.addEventListener('click',hidePrivateSection);
}
function initPrivate(){
  var d=migratePrivate();fillPrivateForm(d);renderPrivate(d);
  var form=$('#privateForm');
  if(form)form.addEventListener('submit',function(e){e.preventDefault();var x=readPrivateForm();savePrivateRaw(x);renderPrivate(x);showStatus('#privateStatus','✓ Uloženo do tohoto telefonu.',true);$('#privateStatus').classList.remove('hidden')});
  var exportBtn=$('#exportJson');if(exportBtn)exportBtn.addEventListener('click',function(){var x=readPrivateForm();savePrivateRaw(x);renderPrivate(x);$('#jsonArea').value=JSON.stringify({version:1,trip:'drazdany2026',privateData:x},null,2);showStatus('#jsonStatus','✓ JSON připraven pro přenos.',true);$('#jsonStatus').classList.remove('hidden')});
  var copy=$('#copyJson');if(copy)copy.addEventListener('click',function(){var ta=$('#jsonArea');if(!ta.value){var x=readPrivateForm();ta.value=JSON.stringify({version:1,trip:'drazdany2026',privateData:x},null,2)};if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(ta.value).then(function(){showStatus('#jsonStatus','✓ JSON zkopírován.',true);$('#jsonStatus').classList.remove('hidden')}).catch(function(){ta.focus();ta.select()})}else{ta.focus();ta.select()}});
  var imp=$('#importJson');if(imp)imp.addEventListener('click',function(){
    try{
      var raw=$('#jsonArea').value.trim();if(!raw)throw new Error('Pole JSON je prázdné.');
      var obj=JSON.parse(raw);
      if(obj.trip&&obj.trip!=='drazdany2026')throw new Error('JSON je určen pro jiný výlet.');
      var x=obj.privateData||obj;
      if(!x||typeof x!=='object'||Array.isArray(x))throw new Error('Chybí objekt privateData.');
      fillPrivateForm(x);savePrivateRaw(x);renderPrivate(x);
      var count=Object.keys(privateMap()).filter(function(k){return String(x[k]||'').trim()!==''}).length;
      showStatus('#jsonStatus','✓ Načteno a uloženo '+count+' údajů. Změny jsou vidět nahoře v kartě „Moje cesta“ a v itineráři.',true);
      $('#jsonStatus').classList.remove('hidden');
    }catch(e){showStatus('#jsonStatus','Chyba: '+e.message,false);$('#jsonStatus').classList.remove('hidden')}
  });
  var qrBtn=$('#makeQr');if(qrBtn)qrBtn.addEventListener('click',function(){
    try{
      if(typeof window.qrcode!=='function')throw new Error('QR knihovna není načtená.');
      var x=readPrivateForm();savePrivateRaw(x);renderPrivate(x);
      var payload=JSON.stringify({version:1,trip:'drazdany2026',privateData:x});
      window.qrcode.stringToBytes=window.qrcode.stringToBytesFuncs['UTF-8'];
      var qr=window.qrcode(0,'M');qr.addData(payload);qr.make();
      var out=$('#qrOut');out.innerHTML=qr.createSvgTag({cellSize:4,margin:8,scalable:true,alt:'QR kód s privátními daty'});out.classList.remove('hidden');
      $('#qrHint').textContent='✓ QR vytvořen lokálně. Obsahuje '+new Blob([payload]).size+' B dat.';
    }catch(e){$('#qrHint').textContent='QR chyba: '+e.message}
  });
  var clear=$('#clearPrivateMenu');if(clear)clear.addEventListener('click',function(){if(confirm('Smazat soukromá data z tohoto telefonu?')){localStorage.removeItem(K+'private');fillPrivateForm({});renderPrivate({});var out=$('#qrOut');if(out){out.innerHTML='';out.classList.add('hidden')}closeMenu()}});
}
function initInvitation(){
  function show(){var o=$('#introOverlay');if(o){o.classList.remove('hidden');document.body.style.overflow='hidden'}closeMenu()}
  function hide(){var o=$('#introOverlay');if(o){o.classList.add('hidden');document.body.style.overflow=''}localStorage.setItem(K+'introSeen:v6','1')}
  var showBtn=$('#showInvite');if(showBtn)showBtn.addEventListener('click',show);
  var enter=$('#enterApp');if(enter)enter.addEventListener('click',hide);
  if(localStorage.getItem(K+'introSeen:v6')!=='1')show();
}
function initMenu(){
  function net(){setText('#diagNetwork',navigator.onLine?'online':'offline')}net();addEventListener('online',net);addEventListener('offline',net);
  var fu=$('#forceUpdate');if(fu)fu.addEventListener('click',async function(){closeMenu();try{if('serviceWorker'in navigator){var regs=await navigator.serviceWorker.getRegistrations();await Promise.all(regs.map(function(r){return r.unregister()}))}if('caches'in window){var ks=await caches.keys();await Promise.all(ks.map(function(k){return caches.delete(k)}))}location.replace('./?refresh='+Date.now())}catch(e){location.reload()}});
}
function initInstall(){
  var promptEvent=null;
  addEventListener('beforeinstallprompt',function(e){e.preventDefault();promptEvent=e;var b=$('#install');if(b)b.classList.remove('hidden')});
  var b=$('#install');if(b)b.addEventListener('click',async function(){if(!promptEvent)return;closeMenu();promptEvent.prompt();await promptEvent.userChoice;promptEvent=null;b.classList.add('hidden')});
}
function initServiceWorker(){
  if(!('serviceWorker'in navigator)){setText('#diagSw','nepodporován');return}
  navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(function(reg){setText('#diagSw','aktivní');reg.update().catch(function(){})}).catch(function(e){setText('#diagSw','chyba');errors.push('SW: '+e.message);renderDiagnostics()});
}
document.addEventListener('DOMContentLoaded',function(){
  safeInit('menu',initMenu);
  safeInit('navigation',initNav);
  safeInit('countdown',initCountdown);
  safeInit('itinerary',initProgress);
  safeInit('checklist',initChecklist);
  safeInit('private-access',initPrivateAccess);
  safeInit('private-data',initPrivate);
  safeInit('invitation',initInvitation);
  safeInit('install',initInstall);
  safeInit('service-worker',initServiceWorker);
  renderDiagnostics();
});
})();