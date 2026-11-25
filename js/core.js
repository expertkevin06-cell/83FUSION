/* ═══ BOOT DE L'APPLICATION ═══ */
window.App={
  init:function(){
    try{
      var s=Storage.load();
      if(s&&s.db)Database.merge(s.db);
      var st=Database.stats();
      document.getElementById('loginStats').textContent=st.brands+'+ marques · '+st.models+'+ modèles · '+st.engines+'+ motorisations · '+st.faults+'+ fiches';
      Animations.init();
      UI.init();
      Importer.init();
      Manager.init();
      console.log('✓ MECADATA v7.2 démarré — '+st.engines+' motorisations');
    }catch(e){
      console.error('BOOT ERROR:',e);
      alert('Erreur au démarrage : '+e.message);
    }
  }
};

document.addEventListener('DOMContentLoaded',function(){App.init();});
