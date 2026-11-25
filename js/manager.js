window.Manager = {
  autoUpdate: true,
  interval: 24,
  url: 'https://expertkevin06-cell.github.io/V2newprojet2026/data/',
  timer: null,
  
  init() {
    const s = Storage.getSettings();
    this.autoUpdate = s.autoUpdate ?? true;
    this.interval = s.interval ?? 24;
    this.url = s.url ?? this.url;
    
    document.getElementById('autoUpdate').checked = this.autoUpdate;
    document.getElementById('updateInterval').value = this.interval;
    document.getElementById('updateUrl').value = this.url;
    
    this.updateStats();
    this.scheduleAuto();
  },
  
  save() {
    Storage.saveSettings({
      autoUpdate: this.autoUpdate,
      interval: this.interval,
      url: this.url,
      lastCheck: this.lastCheck
    });
  },
  
  setAutoUpdate() {
    this.autoUpdate = document.getElementById('autoUpdate').checked;
    this.save();
    this.scheduleAuto();
  },
  
  setInterval() {
    this.interval = Math.max(1, Math.min(168, parseInt(document.getElementById('updateInterval').value) || 24));
    this.save();
    this.scheduleAuto();
  },
  
  setUrl() {
    this.url = document.getElementById('updateUrl').value;
    this.save();
  },
  
  scheduleAuto() {
    if (this.timer) clearInterval(this.timer);
    if (this.autoUpdate) {
      this.timer = setInterval(() => this.checkNow(), this.interval * 3600 * 1000);
    }
  },
  
  async checkNow() {
    console.log('🔍 Vérification MAJ...');
    this.lastCheck = new Date().toLocaleString('fr-FR');
    document.getElementById('lastCheck').textContent = this.lastCheck;
    try {
      // Tentative de fetch
      const r = await fetch(this.url + 'update.json', { cache: 'no-cache' });
      if (r.ok) {
        const data = await r.json();
        if (data.version && data.version !== '7.0') {
          if (confirm(`Mise à jour v${data.version} disponible. Installer ?`)) {
            Database.merge(data.database || {});
            Storage.save();
            alert('✓ MAJ appliquée');
            location.reload();
          }
        } else {
          alert('✓ Base à jour');
        }
      } else {
        alert('Base locale à jour (serveur distant indisponible)');
      }
    } catch (e) {
      alert('⚠ Mode hors ligne — base locale utilisée');
    }
    this.save();
  },
  
  exportFull() {
    const apk = {
      version: '7.0.0',
      build: Date.now(),
      database: Database.data,
      settings: Storage.getSettings(),
      requests: JSON.parse(localStorage.getItem('mecadata_requests') || '[]')
    };
    const blob = new Blob([JSON.stringify(apk, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `mecadata_expert_v7_${new Date().toISOString().slice(0,10)}.apk.json`;
    a.click();
    alert('✓ APK exportée');
  },
  
  importAPK() {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = '.json';
    inp.onchange = async () => {
      const file = inp.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const apk = JSON.parse(text);
        if (!apk.database) throw new Error('Format APK invalide');
        if (!confirm(`Importer APK v${apk.version || '?'} ?`)) return;
        Database.data = apk.database;
        Storage.save();
        alert('✓ APK importée');
        location.reload();
      } catch (e) {
        alert('✗ ' + e.message);
      }
    };
    inp.click();
  },
  
  createBackup() { Storage.backup(); this.updateStats(); },
  restoreBackup() { Storage.restore(); },
  
  updateStats() {
    const size = Storage.size();
    document.getElementById('storageUsed').textContent = 
      size > 1024*1024 ? `${(size/1024/1024).toFixed(2)} Mo` : `${(size/1024).toFixed(1)} Ko`;
    const backups = JSON.parse(localStorage.getItem('mecadata_backups') || '[]');
    document.getElementById('backupCount').textContent = backups.length;
    document.getElementById('lastBackup').textContent = 
      backups.length ? new Date(backups[backups.length-1].backupTime).toLocaleString('fr-FR') : 'Jamais';
    document.getElementById('buildDate').textContent = new Date().toISOString().slice(0, 10);
  },
  
  resetAll() {
    if (!Auth.isAdmin()) { alert('Réservé à l\'administrateur'); return; }
    if (!confirm('⚠ Tout réinitialiser (DB + paramètres + sauvegardes) ?')) return;
    localStorage.clear();
    alert('✓ Tout réinitialisé');
    location.reload();
  },
  
  purgeCache() {
    if ('caches' in window) {
      caches.keys().then(names => names.forEach(n => caches.delete(n)));
    }
    alert('✓ Cache purgé');
  },
  
  revokeAll() {
    if (!Auth.isAdmin()) return;
    if (!confirm('Révoquer tous les tiers ?')) return;
    localStorage.setItem('mecadata_requests', '[]');
    UI.renderTiers();
  }
};
