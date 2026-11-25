window.Diag={db:null,
 init:function(){this.db=Database.expand();this.fillBrands();this.bindTabs();},
 fillBrands:function(){var s=document.getElementById('selBrand');s.innerHTML='<option value="">Toutes les marques</option>';Object.keys(this.db).sort().forEach(function(b){s.innerHTML+='<option value="'+b+'">'+b+'</option>';});},
 quick:function(v){var t=(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''),s=document.getElementById('selBrand');Array.prototype.forEach.call(s.options,function(o){if(!o.value)return;o.style.display=(!t||o.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').indexOf(t)>-1)?'':'none';});},
 onBrand:function(){var b=document.getElementById('selBrand').value,s=document.getElementById('selModel');s.innerHTML='<option value="">Choisir…</option>';this.resetDown();if(b&&this.db[b])Object.keys(this.db[b]).sort().forEach(function(m){s.innerHTML+='<option value="'+m+'">'+m+'</option>';});this.run();},
 onModel:function(){var b=document.getElementById('selBrand').value,m=document.getElementById('selModel').value,s=document.getElementById('selYear');s.innerHTML='<option value="">Toutes</option>';this.resetDown(true);if(b&&m&&this.db[b][m])Object.keys(this.db[b][m]).sort().forEach(function(y){s.innerHTML+='<option value="'+y+'">'+y+'</option>';});this.run();},
 onYear:function(){var b=document.getElementById('selBrand').value,m=document.getElementById('selModel').value,y=document.getElementById('selYear').value,s=document.getElementById('selEngine');s.innerHTML='<option value="">Toutes</option>';this.resetDown(false,true);if(b&&m&&y&&this.db[b][m][y])Object.keys(this.db[b][m][y]).sort().forEach(function(e){s.innerHTML+='<option value="'+e+'">'+e+'</option>';});this.run();},
 onEngine:function(){var b=document.getElementById('selBrand').value,m=document.getElementById('selModel').value,y=document.getElementById('selYear').value,e=document.getElementById('selEngine').value,s=document.getElementById('selPower');s.innerHTML='<option value="">Toutes</option>';if(b&&m&&y&&e&&this.db[b][m][y][e]){var d=this.db[b][m][y][e];s.innerHTML+='<option value="'+d.power+'">'+d.power+' ch ('+Math.round(d.power*0.7457)+' kW) · '+d.energy+'</option>';}this.run();},
 resetDown:function(y,e2){if(y)document.getElementById('selYear').innerHTML='<option value="">Toutes</option>';if(e2){document.getElementById('selEngine').innerHTML='<option value="">Toutes</option>';document.getElementById('selPower').innerHTML='<option value="">Toutes</option>';}},
 run:function(){
  var b=document.getElementById('selBrand').value,m=document.getElementById('selModel').value,y=document.getElementById('selYear').value,e=document.getElementById('selEngine').value,p=document.getElementById('selPower').value;
  var ra=document.getElementById('resultsArea'),nr=document.getElementById('noResults');
  if(!b||!m||!y||!e||!p){ra.classList.add('hidden');nr.classList.remove('hidden');return;}
  ra.classList.remove('hidden');nr.classList.add('hidden');
  var d=this.db[b][m][y][e],sev=document.getElementById('fSeverity').value,nat=document.getElementById('fNature').value,sort=document.getElementById('fSort').value;
  var faults=(d.faults||[]).slice();
  if(sev)faults=faults.filter(function(f){return f.severity===sev;});
  if(nat)faults=faults.filter(function(f){return f.nature===nat;});
  var ord={critical:0,high:1,medium:2,low:3,info:4};
  if(sort==='severity')faults.sort(function(a,b2){return ord[a.severity]-ord[b2.severity];});
  if(sort==='alpha')faults.sort(function(a,b2){return a.title.localeCompare(b2.title);});
  document.getElementById('listFaults').innerHTML=faults.length?faults.map(function(f){return '<li class="'+f.severity+'"><span class="tag tag-'+f.severity+'">'+f.severity.toUpperCase()+'</span><span class="tag-nature tag-'+(f.nature||'panne').toLowerCase()+'">'+(f.nature||'Panne')+'</span><strong>'+f.title+'</strong><br><small>'+(f.symptoms||'')+'</small><br><small class="muted">Réf: '+f.ref+' · '+(f.source||'')+'</small></li>';}).join(''):'<li class="info">✅ Aucune panne répertoriée pour cette configuration.</li>';
  var tsb=d.tsb||[];
  document.getElementById('listTsb').innerHTML=tsb.length?tsb.map(function(t){return '<li><span class="tag tag-tsb">TSB</span><strong>'+t.title+'</strong><br><small>'+(t.scope||'')+'</small><br><small class="muted">Réf: '+t.ref+'</small></li>';}).join(''):'<li class="info">Aucun TSB enregistré.</li>';
  var dtcs=d.dtc||[];
  document.getElementById('dtcDecoder').innerHTML=dtcs.length?'<p style="margin-bottom:10px"><strong>Codes DTC corrélés :</strong></p>'+dtcs.map(function(c){return '<span class="dtc-chip">'+c+'</span>';}).join(''):'<p class="muted">Aucun DTC spécifique.</p>';
  var mt=d.maintenance||[];
  document.getElementById('listMaint').innerHTML=mt.length?mt.map(function(x){return '<li><strong>'+x.item+'</strong><br><small>'+(x.km?'📏 '+x.km.toLocaleString('fr-FR')+' km ':'')+(x.months?'📅 '+x.months+' mois ':'')+(x.spec?'· 🔧 '+x.spec:'')+'</small></li>';}).join(''):'<li class="info">Se référer au carnet constructeur.</li>';
  document.getElementById('countFaults').textContent=faults.length;document.getElementById('countTsb').textContent=tsb.length;document.getElementById('countDtc').textContent=dtcs.length;document.getElementById('countMaint').textContent=mt.length;
 },
 clear:function(){document.getElementById('selBrand').value='';document.getElementById('selModel').innerHTML='<option value="">Choisir…</option>';this.resetDown();this.resetDown(true,true);document.getElementById('quickSearch').value='';this.quick('');this.run();},
 bindTabs:function(){Array.prototype.forEach.call(document.querySelectorAll('.r-tab'),function(btn){btn.addEventListener('click',function(){Array.prototype.forEach.call(document.querySelectorAll('.r-tab'),function(b){b.classList.remove('active');});Array.prototype.forEach.call(document.querySelectorAll('.r-pane'),function(p){p.classList.remove('active');});btn.classList.add('active');document.getElementById('r-'+btn.getAttribute('data-rtab')).classList.add('active');});});}
};
