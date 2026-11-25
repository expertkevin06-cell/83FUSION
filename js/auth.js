/* ═══ AUTHENTIFICATION v7.3 — PLUS AUCUN RETOUR ARRIÈRE POSSIBLE ═══ */
window.Auth = {
  CREDS: { admin: 'Kevin83600', tiers: 'expert83' },
  current: null,
  expected: null,
  fails: 0,

  prompt: function(role) {
    this.expected = role;
    var t = document.getElementById('pwdTitle');
    if (t) t.textContent = role === 'admin' ? '🔒 Administrateur' : '👁 Accès Tiers';
    var e = document.getElementById('pwdError');
    if (e) e.textContent = '';
    var m = document.getElementById('pwdModal');
    if (m) m.classList.add('active');
    var i = document.getElementById('pwdInput');
    if (i) { i.value = ''; setTimeout(function(){ i.focus(); }, 120); }
  },

  close: function() {
    var m = document.getElementById('pwdModal');
    if (m) m.classList.remove('active');
  },

  validate: function() {
    var inp = document.getElementById('pwdInput');
    var val = (inp && inp.value || '').trim();
    var role = this.expected;

    /* Cas 2 corrigé : plus de fermeture silencieuse */
    if (!role) {
      var e0 = document.getElementById('pwdError');
      if (e0) e0.textContent = '✗ Session expirée — recliquez sur ADMINISTRATEUR ou TIERS.';
      this.prompt(this.current ? this.current : 'admin');
      return;
    }

    if (val === this.CREDS[role]) {
      this.current = role;
      this.fails = 0;
      this.close();
      this.enterDashboard();
    } else {
      this.fails++;
      var e = document.getElementById('pwdError');
      if (e) e.textContent = '✗ Mot de passe incorrect (essai ' + this.fails + ').';
      if (inp) { inp.value = ''; inp.focus(); }
    }
  },

  /* ═══ ENTRÉE AU DASHBOARD : GARANTIE, MÊME EN CAS DE CRASH ═══ */
  enterDashboard: function() {
    var ls = document.getElementById('loginScreen');
    var db = document.getElementById('dashboard');
    if (ls) ls.classList.remove('active');
    if (db) db.classList.add('active');

    /* Si ui.js est absent/incompatible : mode secours */
    if (!window.UI || typeof UI.loadDashboard !== 'function') {
      this.banner('⚠ ui.js manquant ou incompatible — mode secours activé. Remplacez tous les fichiers du pack v7.3.');
      return;
    }

    try {
      UI.loadDashboard();
    } catch (e) {
      console.error('loadDashboard:', e);
      /* Cas 1 corrigé : on RESTE dans le dashboard, on affiche l'erreur */
      this.banner('⚠ Dashboard chargé partiellement : ' + e.message + '<br><small>Causes probables : fichiers de versions mélangées (index.html vs js/). Remplacez TOUS les fichiers du pack v7.3, puis npx cap sync android.</small>');
    }
  },

  banner: function(html) {
    var b = document.getElementById('errBanner');
    if (b) { b.innerHTML = html; b.style.display = 'block'; }
    else alert(html.replace(/<[^>]+>/g, ' '));
  },

  logout: function() {
    if (!confirm('Déconnexion ?')) return;
    this.current = null;
    this.expected = null;
    var db = document.getElementById('dashboard');
    var ls = document.getElementById('loginScreen');
    if (db) db.classList.remove('active');
    if (ls) ls.classList.add('active');
    try { Storage.stopAutoSave(); } catch (e) {}
  },

  showRequestForm: function() {
    var m = document.getElementById('requestModal');
    if (m) m.classList.add('active');
    setTimeout(function(){ var r = document.getElementById('reqName'); if (r) r.focus(); }, 120);
  },
  closeRequest: function() {
    var m = document.getElementById('requestModal');
    if (m) m.classList.remove('active');
  },
  submitRequest: function() {
    var n = (document.getElementById('reqName').value || '').trim();
    if (n.length < 2 || n.length > 24) { alert('Prénom invalide (2-24 lettres)'); return; }
    try {
      var r = Storage.getRequests();
      r.push({ name: n, time: Date.now(), status: 'pending' });
      Storage.setRequests(r);
    } catch (e) {}
    alert('✓ Demande envoyée à l\'administrateur');
    this.closeRequest();
  },
  isAdmin: function() { return this.current === 'admin'; }
};

/* Touche Entrée */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && document.getElementById('pwdModal') &&
      document.getElementById('pwdModal').classList.contains('active')) {
    e.preventDefault();
    Auth.validate();
  }
});
