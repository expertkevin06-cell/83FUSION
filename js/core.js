/* ═══ BOOT v7.3 — CONTRÔLE DE COHÉRENCE DES VERSIONS ═══ */
window.App = {
  BUILD: '7.3',

  init: function() {
    /* Contrôle : index.html et js/ doivent être de la MÊME version */
    var m = document.querySelector('meta[name="mecadata-build"]');
    var htmlVer = m ? m.content : 'absent';
    if (htmlVer !== this.BUILD) {
      var b = document.getElementById('errBanner');
      var msg = '⚠ VERSIONS MÉLANGÉES : index.html = "' + htmlVer + '" mais js/ = "' + this.BUILD +
                '". Remplacez TOUS les fichiers du pack v7.3 (index.html + css/ + js/), puis npx cap sync android.';
      if (b) { b.innerHTML = msg; b.style.display = 'block'; }
      console.error(msg);
    }

    /* Chargement base sauvegardée */
    try {
      var s = Storage.load();
      if (s && s.db) Database.merge(s.db);
    } catch (e) { console.error('load:', e); }

    /* Stats login */
    try {
      var st = Database.stats();
      var el = document.getElementById('loginStats');
      if (el) el.textContent = st.brands + '+ marques · ' + st.models + '+ modèles · ' + st.engines + '+ motorisations · ' + st.faults + '+ fiches';
    } catch (e) { console.error('stats:', e); }

    /* Inits isolées */
    try { Animations.init(); } catch (e) { console.error('anim:', e); }
    try { UI.init(); } catch (e) { console.error('ui:', e); }
    try { Importer.init(); } catch (e) { console.error('import:', e); }
    try { Manager.init(); } catch (e) { console.error('manager:', e); }

    console.log('✓ MECADATA v' + this.BUILD + ' démarré');
  }
};

document.addEventListener('DOMContentLoaded', function() { App.init(); });
