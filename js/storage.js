window.Storage = {
  KEY: 'mecadata_v7',
  BACKUP_KEY: 'mecadata_backups',
  SETTINGS_KEY: 'mecadata_settings',
  AUTO_SAVE_MS: 30000,
  timer: null,
  
  save() {
    try {
      const data = {
        version: '7.0',
        timestamp: Date.now(),
        db: window.Database.data,
        stats: window.Database.stats()
      };
      localStorage.setItem(this.KEY, JSON.stringify(data));
      console.log('✓ Sauvegarde locale OK');
      this.updateStatus(true);
      return true;
    } catch (e) {
      console.error('✗ Erreur save:', e);
      this.updateStatus(false);
      return false;
    }
  },
  
  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      console.log(`✓ DB chargée du ${new Date(data.timestamp).toLocaleString()}`);
      return data;
    } catch (e) {
      return null;
    }
  },
  
  startAutoSave() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => this.save(), this.AUTO_SAVE_MS);
  },
  
  stopAutoSave() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  },
  
  backup() {
    const data = this.load();
    if (!data) { alert('Aucune donnée à sauvegarder'); return; }
    let backups = JSON.parse(localStorage.getItem(this.BACKUP_KEY) || '[]');
    backups.push({ ...data, backupTime: Date.now() });
    if (backups.length > 10) backups.shift();
    localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backups));
    alert(`✓ Backup créé (${backups.length}/10)`);
  },
  
  restore() {
    const backups = JSON.parse(localStorage.getItem(this.BACKUP_KEY) || '[]');
    if (!backups.length) { alert('Aucun backup disponible'); return; }
    const last = backups[backups.length - 1];
    if (confirm(`Restaurer le backup du ${new Date(last.backupTime).toLocaleString()} ?`)) {
      localStorage.setItem(this.KEY, JSON.stringify(last));
      location.reload();
    }
  },
  
  clear() {
    localStorage.removeItem(this.KEY);
    alert('✓ Données effacées');
    location.reload();
  },
  
  size() {
    const raw = localStorage.getItem(this.KEY);
    return raw ? new Blob([raw]).size : 0;
  },
  
  updateStatus(ok) {
    const el = document.getElementById('saveStatus');
    if (el) el.textContent = ok ? '✓ OK' : '✗ Erreur';
  },
  
  getSettings() {
    return JSON.parse(localStorage.getItem(this.SETTINGS_KEY) || '{}');
  },
  
  saveSettings(s) {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(s));
  }
};
