window.Importer = {
  pending: null,
  
  init() {
    const zone = document.getElementById('dropZone');
    const inp = document.getElementById('importFile');
    
    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      this.processFiles(e.dataTransfer.files);
    });
    inp.addEventListener('change', () => this.processFiles(inp.files));
  },
  
  async processFiles(files) {
    let total = 0;
    for (const file of files) {
      try {
        const data = await this.parseFile(file);
        total += Object.keys(data).length;
        Database.merge(data);
      } catch (e) {
        alert(`✗ Erreur ${file.name}: ${e.message}`);
      }
    }
    if (total > 0) {
      Storage.save();
      Diag.init();
      Catalogue.render();
      TSB.render();
      alert(`✓ ${total} entrée(s) fusionnée(s)`);
    }
  },
  
  async parseFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    const content = await file.text();
    switch (ext) {
      case 'json': return this.parseJSON(content);
      case 'csv': return this.parseCSV(content);
      case 'xml': return this.parseXML(content);
      case 'txt': return this.parseTXT(content);
      default: throw new Error(`Format ${ext} non supporté`);
    }
  },
  
  parseJSON(text) {
    try { return JSON.parse(text); }
    catch { throw new Error('JSON invalide'); }
  },
  
  parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) throw new Error('CSV vide');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const data = {};
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(',').map(v => v.trim());
      const row = {};
      headers.forEach((h, j) => row[h] = vals[j] || '');
      const b = row.brand || row.marque;
      const m = row.model || row.modele;
      if (b && m) {
        if (!data[b]) data[b] = {};
        if (!data[b][m]) data[b][m] = {};
        const y = row.year || row.annee || '2020-2024';
        if (!data[b][m][y]) data[b][m][y] = {};
        const e = row.engine || row.moteur || 'Unknown';
        data[b][m][y][e] = {
          power: parseInt(row.power || row.puissance) || 0,
          cyl: parseInt(row.cyl || row.cylindree) || 0,
          energy: row.energy || row.energie || 'Essence',
          faults: row.faults ? [{ title: row.faults, severity: row.severity || 'medium', nature: row.nature || 'Panne', ref: row.ref || 'N/A', symptoms: row.symptoms || '' }] : [],
          tsb: [],
          dtc: [],
          maintenance: []
        };
      }
    }
    return data;
  },
  
  parseXML(text) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/xml');
    const data = {};
    for (const v of doc.getElementsByTagName('vehicle')) {
      const b = v.getAttribute('brand');
      const m = v.getAttribute('model');
      if (b && m) {
        if (!data[b]) data[b] = {};
        if (!data[b][m]) data[b][m] = {};
        const y = v.getAttribute('year') || '2020-2024';
        if (!data[b][m][y]) data[b][m][y] = {};
        const e = v.getAttribute('engine') || 'Unknown';
        data[b][m][y][e] = {
          power: parseInt(v.getAttribute('power')) || 0,
          faults: [], tsb: [], dtc: [], maintenance: []
        };
      }
    }
    return data;
  },
  
  parseTXT(text) {
    const data = {};
    let b, m, y, e;
    for (const line of text.split('\n')) {
      const t = line.trim();
      if (t.startsWith('BRAND:')) { b = t.replace('BRAND:', '').trim(); data[b] = data[b] || {}; }
      else if (t.startsWith('MODEL:')) { m = t.replace('MODEL:', '').trim(); data[b][m] = data[b][m] || {}; }
      else if (t.startsWith('YEAR:')) { y = t.replace('YEAR:', '').trim(); data[b][m][y] = data[b][m][y] || {}; }
      else if (t.startsWith('ENGINE:')) {
        e = t.replace('ENGINE:', '').trim();
        data[b][m][y][e] = { power: 0, faults: [], tsb: [], dtc: [], maintenance: [] };
      }
    }
    return data;
  },
  
  fromText() {
    const text = document.getElementById('importText').value.trim();
    if (!text) { alert('Texte vide'); return; }
    try {
      const data = this.parseJSON(text);
      this.pending = data;
      this.showPreview(data);
    } catch (e) {
      alert('JSON invalide: ' + e.message);
    }
  },
  
  showPreview(data) {
    const count = Object.keys(data).length;
    document.getElementById('previewCount').textContent = count;
    document.getElementById('previewContent').textContent = JSON.stringify(data, null, 2).slice(0, 2000);
    document.getElementById('importPreview').classList.remove('hidden');
  },
  
  confirm() {
    if (!this.pending) return;
    Database.merge(this.pending);
    Storage.save();
    Diag.init();
    Catalogue.render();
    TSB.render();
    document.getElementById('importPreview').classList.add('hidden');
    document.getElementById('importText').value = '';
    this.pending = null;
    alert('✓ Fusion effectuée');
  },
  
  cancel() {
    this.pending = null;
    document.getElementById('importPreview').classList.add('hidden');
  }
};
