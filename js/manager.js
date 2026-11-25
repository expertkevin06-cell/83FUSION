window.Manager={auto:true,interval:24,url:'',timer:null,lastCheck:null,
 init:function(){var s=Storage.getSettings();this.auto=s.auto!==false;this.interval=s.interval||24;this.url=s.url||'https://expertkevin06-cell.github.io/V2newprojet2026/data/';this.lastCheck=s.lastCheck||null;
  var au=document.getElementById('autoUpdate');if(au)au.checked=this.auto;
  var ui=document.getElementById('updateInterval');if(ui)ui.value=this.interval;
  var uu=document.getElementById('updateUrl');if(uu)uu.value=this.url;
  var lc=document.getElementById('lastCheck');if(lc)lc.textContent=this.lastCheck||'Jamais';
  this.stats();this.schedule();},
 persist:function(){Storage.saveSettings({auto:this.auto,interval:this.interval,url:this.url,lastCheck:this.lastCheck});},
 setAutoUpdate:function(v){this.auto=!!v;this.persist();this.schedule();},
 setIntervalH:function(v){this.interval=Math.max(1,Math.min(168,parseInt(v,10)||24));this.persist();this.schedule();},
 setUrl:function(v){this.url=v;this.persist();},
 schedule:function(){if(this.timer)clearInterval(this.timer);if(this.auto)this.timer=setInterval(function(){Manager.checkNow();},this.interval*3600000);},
 checkNow:function(){this.lastCheck=new Date().toLocaleString('fr-FR');var lc=document.getElementById('lastCheck');if(lc)lc.textContent=this.lastCheck;this.persist();
  fetch(this.url+'update.json',{cache:'no-cache'}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}).then(function(j){if(j&&j.database){Database.merge(j.database);Storage.save();alert('✓ MAJ distante fusionnée');try{Diag.init();Catalogue.render();}catch(e){}}else alert('✓ Base à jour');}).catch(function(e){alert('⚠ Hors ligne / serveur injoignable — base locale conservée ('+e.message+')');});},
 exportFull:function(){var apk={version:'7.2.0',build:Date.now(),database:Database.data,settings:Storage.getSettings(),requests:Storage.getRequests()};var blob=new Blob([JSON.stringify(apk,null,2)],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='mecadata_expert_v7_'+new Date().toISOString().slice(0,10)+'.json';a.click();alert('✓ APK exportée');},
 importAPK:function(){var inp=document.createElement('input');inp.type='file';inp.accept='.json';inp.onchange=function(){var f=inp.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var apk=JSON.parse(r.result);if(!apk.database)throw new Error('Format APK invalide');if(!confirm('Importer APK v'+(apk.version||'?')+' ?'))return;Database.data=apk.database;Storage.save();alert('✓ APK importée');location.reload();}catch(e){alert('✗ '+e.message);}};r.readAsText(f);};inp.click();},
 createBackup:function(){Storage.backup();this.stats();},
 restoreBackup:function(){Storage.restore();},
 stats:function(){var sz=Storage.size();var su=document.getElementById('storageUsed');if(su)su.textContent=sz>1048576?(sz/1048576).toFixed(2)+' Mo':(sz/1024).toFixed(1)+' Ko';
  var b=[];try{b=JSON.parse(Storage.raw.getItem('mecadata_backups')||'[]');}catch(e){}
  var bc=document.getElementById('backupCount');if(bc)bc.textContent=b.length;
  var lb=document.getElementById('lastBackup');if(lb)lb.textContent=b.length?new Date(b[b.length-1].backupTime).toLocaleString('fr-FR'):'Jamais';},
 resetAll:function(){if(!Auth.isAdmin()){alert('Réservé administrateur');return;}if(!confirm('⚠ TOUT réinitialiser ?'))return;Storage.clearAll();location.reload();},
 purgeCache:function(){if('caches'in window)caches.keys().then(function(n){n.forEach(function(x){caches.delete(x);});});alert('✓ Cache purgé');},
 revokeAll:function(){if(!Auth.isAdmin())return;if(!confirm('Révoquer tous les tiers ?'))return;Storage.setRequests([]);UI.renderTiers();}
};
