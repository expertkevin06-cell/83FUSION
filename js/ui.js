/* ═══ INTERFACE v7.3 — CHAQUE ÉTAPE ISOLÉE (un crash n'arrête plus rien) ═══ */
function $i(id) { return document.getElementById(id); }

window.UI = {
  tierStatus: 'all',

  safe: function(name, fn) {
    try { fn(); }
    catch (e) {
      console.error(name + ':', e);
      var b = $i('errBanner');
      if (b) { b.innerHTML += '<br>⚠ ' + name + ' : ' + e.message; b.style.display = 'block'; }
    }
  },

  init: function() {
    Array.prototype.forEach.call(document.querySelectorAll('.tab'), function(btn) {
      btn.addEventListener('click', function() { UI.showPanel(btn.getAttribute('data-tab')); });
    });
  },

  showPanel: function(n) {
    var btn = document.querySelector('.tab[data-tab="' + n + '"]');
    if (btn && btn.classList.contains('hidden')) { alert('Accès réservé administrateur'); return; }
    Array.prototype.forEach.call(document.querySelectorAll('.tab'), function(b) { b.classList.remove('active'); });
    Array.prototype.forEach.call(document.querySelectorAll('.tab-content'), function(c) { c.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    var p = $i('tab-' + n);
    if (p) p.classList.add('active');
  },

  loadDashboard: function() {
    /* 1. Bascule d'écran EN PREMIER, inconditionnelle */
    var ls = $i('loginScreen'), db = $i('dashboard');
    if (ls) ls.classList.remove('active');
    if (db) db.classList.add('active');

    /* 2. Badge rôle */
    var badge = $i('userBadge');
    if (badge) {
      if (Auth.isAdmin()) { badge.textContent = 'ADMINISTRATEUR'; badge.className = 'badge badge-admin'; }
      else { badge.textContent = 'TIERS'; badge.className = 'badge badge-tiers'; }
    }

    /* 3. Panneau admin */
    var ap = $i('adminPanel');
    if (ap) { if (Auth.isAdmin()) ap.classList.remove('hidden'); else ap.classList.add('hidden'); }
    Array.prototype.forEach.call(document.querySelectorAll('.admin-only'), function(el) {
      if (Auth.isAdmin()) el.classList.remove('hidden'); else el.classList.add('hidden');
    });

    /* 4. Statistiques (tolérantes) */
    this.safe('stats', function() {
      var s = Database.stats();
      var map = { sBrands: s.brands, sModels: s.models, sEngines: s.engines, sFaults: s.faults, sDtc: s.dtc };
      for (var k in map) { var el = $i(k); if (el) el.textContent = map[k]; }
      var sz = $i('sSize'); if (sz) sz.textContent = (Storage.size() / 1024).toFixed(1) + ' Ko';
      var it = $i('integrityStatus'); if (it) it.textContent = s.engines + ' motorisations ✓';
      var sh = $i('sessionHash'); if (sh) sh.textContent = Math.random().toString(36).slice(2, 14);
      var lsy = $i('lastSync'); if (lsy) lsy.textContent = new Date().toLocaleString('fr-FR');
      var st = $i('storageType'); if (st) st.textContent = Storage.type;
    });

    /* 5. Sauvegarde auto */
    this.safe('autosave', function() { Storage.startAutoSave(); });

    /* 6. Modules — chacun isolé */
    this.safe('Diag', function() { Diag.init(); });
    this.safe('Catalogue', function() { Catalogue.render(); });
    this.safe('TSB', function() { TSB.chips(); TSB.render(); });
    this.safe('Domains', function() { Domains.init(); });
    this.safe('Tiers', function() { UI.renderTiers(); });
  },

  renderTiers: function() {
    var rs = Storage.getRequests();
    var f = this.tierStatus;
    var list = f === 'all' ? rs : rs.filter(function(r) { return r.status === f; });
    var el = $i('tiersList');
    if (!el) return;
    el.innerHTML = list.length ? list.map(function(r) {
      var i = rs.indexOf(r);
      return '<div class="tier-item"><div><strong>' + r.name + '</strong><br><small class="muted">Demandé le ' +
        new Date(r.time).toLocaleString('fr-FR') + '</small></div>' +
        '<span class="tag tag-' + (r.status === 'approved' ? 'info' : r.status === 'denied' ? 'critical' : 'medium') + '">' +
        r.status.toUpperCase() + '</span><div class="tier-actions">' +
        (r.status === 'pending' ? '<button type="button" class="tier-btn approve" onclick="UI.tierAction(' + i + ',\'approved\')">✓</button><button type="button" class="tier-btn deny" onclick="UI.tierAction(' + i + ',\'denied\')">✗</button>' : '') +
        (r.status === 'approved' ? '<button type="button" class="tier-btn revoke" onclick="UI.tierAction(' + i + ',\'revoked\')">Révoquer</button>' : '') +
        '</div></div>';
    }).join('') : '<div class="info-card glass"><p>Aucune demande.</p></div>';
  },

  tierFilter: function(s, el) {
    this.tierStatus = s;
    Array.prototype.forEach.call(document.querySelectorAll('.filter-btn'), function(b) { b.classList.remove('active'); });
    if (el) el.classList.add('active');
    this.renderTiers();
  },

  tierAction: function(i, st) {
    var rs = Storage.getRequests();
    if (rs[i]) { rs[i].status = st; Storage.setRequests(rs); this.renderTiers(); }
  }
};
