window.Catalogue={page:1,perPage:60,ft:'',
 all:function(){var out=[];for(var br in Database.data)for(var mo in Database.data[br])for(var yr in Database.data[br][mo])for(var en in Database.data[br][mo][yr]){var d=Database.data[br][mo][yr][en];out.push({brand:br,model:mo,years:yr,engine:en,power:d.power,cyl:d.cyl,energy:d.energy});}return out.sort(function(a,b){return a.brand.localeCompare(b.brand);});},
 render:function(){var items=this.all();if(this.ft){var t=this.ft.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');items=items.filter(function(i){return JSON.stringify(i).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').indexOf(t)>-1;});}
  document.getElementById('catCount').textContent=items.length+' motorisations · page '+this.page;
  var total=Math.max(1,Math.ceil(items.length/this.perPage));if(this.page>total)this.page=total;
  var pg=items.slice((this.page-1)*this.perPage,this.page*this.perPage);
  document.getElementById('catalogueGrid').innerHTML=pg.map(function(i){return '<div class="catalogue-item"><div class="brand-line">'+i.brand+'</div><div>'+i.model+'</div><div class="engine-line">'+i.engine+' · '+i.years+'</div><div class="power-line"><span>⚡ '+i.power+' ch</span><span>🔋 '+i.energy+'</span><span>⚙ '+i.cyl+' cm³</span></div></div>';}).join('');
  document.getElementById('catPagination').innerHTML='<button type="button" class="btn-sm" onclick="Catalogue.prev()">← Préc</button><span class="muted" style="padding:0 12px">Page '+this.page+' / '+total+'</span><button type="button" class="btn-sm" onclick="Catalogue.next()">Suiv →</button>';},
 filter:function(v){this.ft=v;this.page=1;this.render();},
 next:function(){this.page++;this.render();},prev:function(){if(this.page>1)this.page--;this.render();},
 exportAll:function(){var blob=new Blob([JSON.stringify(this.all(),null,2)],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='catalogue_'+new Date().toISOString().slice(0,10)+'.json';a.click();}
};
