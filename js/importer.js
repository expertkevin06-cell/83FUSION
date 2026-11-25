window.Importer={pending:null,
 init:function(){
  var z=document.getElementById('dropZone'),inp=document.getElementById('importFile');
  if(!z)return;
  z.addEventListener('dragover',function(e){e.preventDefault();});
  z.addEventListener('drop',function(e){e.preventDefault();Importer.process(e.dataTransfer.files);});
  inp.addEventListener('change',function(){Importer.process(inp.files);inp.value='';});
 },
 process:function(files){var done=0,total=0;Array.prototype.forEach.call(files,function(f){var r=new FileReader();r.onload=function(){try{var d=Importer.parse(f.name,r.result);var n=Object.keys(d).length;total+=n;Database.merge(d);}catch(e){alert(f.name+' : '+e.message);}done++;if(done===files.length&&total>0){Storage.save();try{Diag.init();Catalogue.render();TSB.render();}catch(e){}alert('✓ '+total+' entrée(s) fusionnée(s)');}};r.readAsText(f);});},
 parse:function(name,text){var ext=name.split('.').pop().toLowerCase();
  if(ext==='json')return JSON.parse(text);
  if(ext==='csv')return this.csv(text);
  if(ext==='xml')return this.xml(text);
  if(ext==='txt')return this.txt(text);
  throw new Error('Format .'+ext+' non supporté');},
 csv:function(t){var L=t.trim().split('\n');if(L.length<2)throw new Error('CSV vide');var H=L[0].split(',').map(function(h){return h.trim().toLowerCase();});var d={};for(var i=1;i<L.length;i++){var v=L[i].split(','),r={};H.forEach(function(h,j){r[h]=(v[j]||'').trim();});var b=r.brand||r.marque,m=r.model||r.modele;if(!b||!m)continue;d[b]=d[b]||{};d[b][m]=d[b][m]||{};var y=r.year||r.annee||'2020-2024';d[b][m][y]=d[b][m][y]||{};var e=r.engine||r.moteur||'Unknown';d[b][m][y][e]={power:parseInt(r.power||r.puissance,10)||0,cyl:parseInt(r.cyl||r.cylindree,10)||0,energy:r.energy||r.energie||'Essence',faults:r.faults?[{title:r.faults,severity:r.severity||'medium',nature:r.nature||'Panne',ref:r.ref||'N/A',symptoms:r.symptoms||''}]:[],tsb:[],dtc:[],maintenance:[]};}return d;},
 xml:function(t){var doc=new DOMParser().parseFromString(t,'text/xml'),d={},vs=doc.getElementsByTagName('vehicle');for(var i=0;i<vs.length;i++){var v=vs[i],b=v.getAttribute('brand'),m=v.getAttribute('model');if(!b||!m)continue;d[b]=d[b]||{};d[b][m]=d[b][m]||{};var y=v.getAttribute('year')||'2020-2024';d[b][m][y]=d[b][m][y]||{};var e=v.getAttribute('engine')||'Unknown';d[b][m][y][e]={power:parseInt(v.getAttribute('power'),10)||0,faults:[],tsb:[],dtc:[],maintenance:[]};}return d;},
 txt:function(t){var d={},b,m,y,e;var L=t.split('\n');for(var i=0;i<L.length;i++){var s=L[i].trim();if(s.indexOf('BRAND:')===0){b=s.slice(6).trim();d[b]=d[b]||{};}else if(s.indexOf('MODEL:')===0&&b){m=s.slice(6).trim();d[b][m]=d[b][m]||{};}else if(s.indexOf('YEAR:')===0&&b&&m){y=s.slice(5).trim();d[b][m][y]=d[b][m][y]||{};}else if(s.indexOf('ENGINE:')===0&&b&&m&&y){e=s.slice(7).trim();d[b][m][y][e]={power:0,faults:[],tsb:[],dtc:[],maintenance:[]};}}return d;},
 fromText:function(){var t=(document.getElementById('importText').value||'').trim();if(!t){alert('Texte vide');return;}try{var d=JSON.parse(t);this.pending=d;this.preview(d);}catch(e){alert('JSON invalide : '+e.message);}},
 preview:function(d){document.getElementById('previewCount').textContent=Object.keys(d).length;document.getElementById('previewContent').textContent=JSON.stringify(d,null,2).slice(0,2000);document.getElementById('importPreview').classList.remove('hidden');},
 confirm:function(){if(!this.pending)return;Database.merge(this.pending);Storage.save();try{Diag.init();Catalogue.render();TSB.render();}catch(e){}document.getElementById('importPreview').classList.add('hidden');document.getElementById('importText').value='';this.pending=null;alert('✓ Fusion effectuée');},
 cancel:function(){this.pending=null;document.getElementById('importPreview').classList.add('hidden');}
};
