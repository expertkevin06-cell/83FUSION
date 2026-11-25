window.UI = {
  init() {
    document.querySelectorAll('.tab').forEach(btn => {
      btn.addEventListener('click', () => this.showPanel(btn.dataset.tab));
    });
  },
  
  showPanel(name) {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector(`[data-tab="${name}"]`)?.classList.add('active');
    document.getElementById('tab-' + name)?.classList.add('active');
  },
  
  loadDashboard() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('dashboard').classList.add('active');
    
    const badge = document.getElementById('userBadge');
    if (Auth.isAdmin()) {
      badge.textContent = 'ADMINISTRATEUR';
      badge.className = 'badge badge-admin';
      document.getElementById('adminPanel').classList.remove('hidden');
      document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
    } else {
      badge.textContent = 'TIERS';
      badge.className = 'badge badge-tiers';
      document.getElementById('adminPanel').classList.add('hidden');
      document.querySelectorAll('.admin-only').forEach(el => el.classList.add('hidden'));
    }
    
    const stats = Database.stats();
    document.getElementById('sBrands').textContent = stats.brands;
    document.getElementById('sModels').textContent = stats.models;
    document.getElementById('sEngines').textContent = stats.engines;
    document.getElementById('sFaults').textContent = stats.faults;
    document.getElementById('sDtc').textContent = stats.dtc;
    document.getElementById('sSize').textContent = 
      (Storage.size() / 1024).toFixed(1) + ' Ko';
    document.getElementById('sessionHash').textContent = 
      Math.random().toString(36).slice(2, 14);
    document.getElementById('lastSync').textContent = new Date().toLocaleString('fr-FR');
    
    Storage.startAutoSave();
    Diag.init();
    Catalogue.init();
    TSB.init();
    Domains.init();
    this.renderTiers();
  },
  
  renderTiers() {
    const requests = JSON.parse(localStorage.getItem('mecadata_requests') || '[]');
    document.getElementById('tiersList').innerHTML = requests.length ?
      requests.reverse().map((r, i) => `
        <div class="tier-item">
          <div class="tier-info">
            <strong>${r.name}</strong>
            <small>Demandé le ${new Date(r.time).toLocaleString('fr-FR')}</small>
          </div>
          <span class="tag tag-${r.status === 'approved' ? 'info' : (r.status === 'denied' ? 'critical' : 'medium')}">
            ${r.status}
          </span>
          <div class="tier-actions">
            ${r.status === 'pending' ? `
              <button class="tier-btn approve" onclick="UI.tierAction(${requests.length-1-i}, 'approved')">✓</button>
              <button class="tier-btn deny" onclick="UI.tierAction(${requests.length-1-i}, 'denied')">✗</button>
            ` : ''}
            ${r.status === 'approved' ? `
              <button class="tier-btn revoke" onclick="UI.tierAction(${requests.length-1-i}, 'revoked')">Révoquer</button>
            ` : ''}
          </div>
        </div>
      `).join('') :
      '<div class="info-card glass"><p>Aucune demande.</p></div>';
  },
  
  tierAction(i, status) {
    const requests = JSON.parse(localStorage.getItem('mecadata_requests') || '[]');
    requests[i].status = status;
    localStorage.setItem('mecadata_requests', JSON.stringify(requests));
    this.renderTiers();
  }
};
