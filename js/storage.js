window.Storage=(function(){
  var mem={},ok=true;
  try{localStorage.setItem('__t','1');localStorage.removeItem('__t');}catch(e){ok=false;}
  var store=ok?localStorage:{getItem:function(k){return mem[k]||null;},setItem:function(k,v){mem[k]=String(v);},removeItem:function(k){delete mem[k];}};
  var KEY='mecadata_v7',BKEY='mecadata_backups',SKEY='mecadata_settings',timer=null;
  return{
    type:ok?'localStorage':'mémoire (WebView restrictif)',
    save:function(){try{store.setItem(KEY,JSON.stringify({version:'7.2',timestamp:Date.now(),db:Database.data}));this.status(true);return true;}catch(e){this.status(false);console.error('Save:',e);return false;}},
    load:function(){try{var r=store.getItem(KEY);return r?JSON.parse(r):null;}catch(e){return null;}},
    startAutoSave:function(){var self=this;if(timer)clearInterval(timer);timer=setInterval(function(){self.save();},30000);},
    stopAutoSave:function(){if(timer){clearInterval(timer);timer=null;}},
    backup:function(){var d=this.load();if(!d){alert('Aucune donnée');return;}var b=[];try{b=JSON.parse(store.getItem(BKEY)||'[]');}catch(e){}b.push({db:d.db,backupTime:Date.now()});if(b.length>10)b.shift();store.setItem(BKEY,JSON.stringify(b));alert('✓ Backup créé ('+b.length+'/10)');},
    restore:function(){var b=[];try{b=JSON.parse(store.getItem(BKEY)||'[]');}catch(e){}if(!b.length){alert('Aucun backup');return;}if(confirm('Restaurer le backup du '+new Date(b[b.length-1].backupTime).toLocaleString('fr-FR')+' ?')){store.setItem(KEY,JSON.stringify({version:'7.2',timestamp:Date.now(),db:b[b.length-1].db}));location.reload();}},
    clearAll:function(){try{store.removeItem(KEY);store.removeItem(BKEY);store.removeItem(SKEY);}catch(e){}},
    size:function(){try{var r=store.getItem(KEY);return r?new Blob([r]).size:0;}catch(e){return 0;}},
    status:function(v){var el=document.getElementById('saveStatus');if(el)el.textContent=v?'✓ OK':'✗ Erreur';},
    getSettings:function(){try{return JSON.parse(store.getItem(SKEY)||'{}');}catch(e){return{};}},
    saveSettings:function(s){try{store.setItem(SKEY,JSON.stringify(s));}catch(e){}},
    getRequests:function(){try{return JSON.parse(store.getItem('mecadata_requests')||'[]');}catch(e){return[];}},
    setRequests:function(r){try{store.setItem('mecadata_requests',JSON.stringify(r));}catch(e){}},
    raw:store
  };
})();
