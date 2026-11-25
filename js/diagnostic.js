window.Diag = {
  expandedDB: null,
  
  init() {
    this.expandedDB = window.Database.expand();
    this.populateBrands();
    this.bindResultTabs();
  },
  
  populateBrands() {
    const sel = document.getElementById('selBrand');
    sel.innerHTML = '<option value="">Toutes les marques</option>';
    Object.keys(this.expandedDB).sort().forEach(b => {
      sel.innerHTML += `<option value="${b}">${b}</option>`;
    });
  },
  
  onBrand() {
    const brand = document.getElementById('selBrand').value;
    const sel = document.getElementById('selModel');
    sel.innerHTML = '<option value="">Choisir...</option>';
    document.getElementById('selYear').innerHTML = '<option value="">Toutes</option>';
    document.getElementById('selEngine').innerHTML = '<option value="">Toutes</option>';
    document.getElementById('selPower').innerHTML = '<option value="">Toutes</option>';
    if (brand && this.expandedDB[brand]) {
      Object.keys(this.expandedDB[brand]).sort().forEach(m => {
        sel.innerHTML += `<option value="${m}">${m}</option>`;
      });
    }
    this.run();
  },
  
  onModel() {
    const b = document.getElementById('selBrand').value;
    const m = document.getElementById('selModel').value;
    const sel = document.getElementById('selYear');
    sel.innerHTML = '<option value="">Toutes</option>';
    document.getElementById('selEngine').innerHTML = '<option value="">Toutes</option>';
    document.getElementById('selPower').innerHTML = '<option value="">Toutes</option>';
    if (b && m && this.expandedDB[b][m]) {
      Object.keys(this.expandedDB[b][m]).sort().forEach(y => {
        sel.innerHTML += `<option value="${y}">${y}</option>`;
      });
    }
    this.run();
  },
  
  onYear() {
    const b = document.getElementById('selBrand').value;
    const m = document.getElementById('selModel').value;
    const y = document.getElementById('selYear').value;
    const sel = document.getElementById('selEngine');
    sel.innerHTML = '<option value="">Toutes</option>';
    document.getElementById('selPower').innerHTML = '<option value="">Toutes</option>';
    if (b && m && y && this.expandedDB[b][m][y]) {
      Object.keys(this.expandedDB[b][m][y]).sort().forEach(e => {
        sel.innerHTML += `<option value="${e}">${e}</option>`;
      });
    }
    this.run();
  },
  
  onEngine() {
    const b = document.getElementById('selBrand').value;
    const m = document.getElementById('selModel').value;
    const y = document.getElementById('selYear').value;
    const e = document.getElementById('selEngine').value;
    const sel = document.getElementById('selPower');
    sel.innerHTML = '<option value="">Toutes</option>';
    if (b && m && y && e && this.expandedDB[b][m][y][e]) {
      const d = this.expandedDB[b][m][y][e];
      sel.innerHTML += `<option value="${d.power}">${d.power} ch (${Math.round(d.power*0.7457)} kW)</option>`;
    }
    this.run();
  },
  
  run() {
    const b = document.getElementById('selBrand').value;
    const m = document.getElementById('selModel').value;
    const y = document.getElementById('selYear').value;
    const e = document.getElementById('selEngine').value;
    const p = document.getElementById('selPower').value;
    
    const results = document.getElementById('resultsArea');
    const noRes = document.getElementById('noResults');
    
    if (!b || !m || !y || !e || !p) {
      results.classList.remove('active');
      noRes.classList.remove('hidden');
      return;
    }
    
    results.classList.add('active');
    noRes.classList.add('hidden');
    
    const data = this.expandedDB[b][m][y][e];
    const fSev = document.getElementById('fSeverity').value;
    const fNat = document.getElementById('fNature').value;
    const fSort = document.getElementById('fSort').value;
    
    // Filtrer pannes
    let faults = data.faults || [];
    if (fSev) faults = faults.filter(f => f.severity === fSev);
    if (fNat) faults = faults.filter(f => f.nature === fNat);
    
    // Trier
    if (fSort === 'severity') {
      const order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
      faults.sort((a, b) => order[a.severity] - order[b.severity]);
    } else if (fSort === 'alpha') {
      faults.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    // Afficher pannes
    document.getElementById('listFaults').innerHTML = faults.length ? 
      faults.map(f => `
        <li class="${f.severity}">
          <span class="tag tag-${f.severity}">${f.severity.toUpperCase()}</span>
          <span class="tag-nature tag-${f.nature.toLowerCase()}">${f.nature}</span>
          <strong>${f.title}</strong><br>
          <small>${f.symptoms || ''}</small><br>
          <small style="color: var(--muted)">Réf: ${f.ref} · ${f.source || ''} ${f.years || ''}</small>
        </li>
      `).join('') :
      '<li class="info">✅ Aucune panne répertoriée pour cette configuration.</li>';
    
    // Afficher TSB
    const tsb = data.tsb || [];
    document.getElementById('listTsb').innerHTML = tsb.length ?
      tsb.map(t => `
        <li>
          <span class="tag tag-tsb">TSB</span>
          <strong>${t.title}</strong><br>
          <small>${t.scope || ''}</small><br>
          <small style="color: var(--muted)">Réf: ${t.ref}</small>
        </li>
      `).join('') :
      '<li class="info">Aucun TSB enregistré.</li>';
    
    // DTC
    const dtcs = data.dtc || [];
    document.getElementById('dtcDecoder').innerHTML = dtcs.length ?
      `<div style="margin-bottom: 12px"><strong>Codes DTC corrélés :</strong></div>` +
      dtcs.map(d => `<span class="dtc-chip">${d}</span>`).join('') +
      `<div style="margin-top: 16px"><small>Cliquez sur OBD-Codes dans les sources officielles pour décoder.</small></div>` :
      '<p class="muted">Aucun DTC spécifique enregistré pour cette motorisation.</p>';
    
    // Maintenance
    const maint = data.maintenance || [];
    document.getElementById('listMaint').innerHTML = maint.length ?
      maint.map(m => `
        <li>
          <strong>${m.item}</strong><br>
          <small>
            ${m.km ? `📏 ${m.km.toLocaleString()} km` : ''} 
            ${m.months ? `📅 ${m.months} mois` : ''}
            ${m.spec ? `· 🔧 ${m.spec}` : ''}
          </small>
        </li>
      `).join('') :
      '<li class="info">Se référer au carnet constructeur.</li>';
    
    // Update counts
    document.getElementById('countFaults').textContent = faults.length;
    document.getElementById('countTsb').textContent = tsb.length;
    document.getElementById('countDtc').textContent = dtcs.length;
    document.getElementById('countMaint').textContent = maint.length;
  },
  
  clear() {
    document.getElementById('selBrand').value = '';
    document.getElementById('selModel').innerHTML = '<option value="">Choisir...</option>';
    document.getElementById('selYear').innerHTML = '<option value="">Toutes</option>';
    document.getElementById('selEngine').innerHTML = '<option value="">Toutes</option>';
    document.getElementById('selPower').innerHTML = '<option value="">Toutes</option>';
    document.getElementById('fSeverity').value = '';
    document.getElementById('fNature').value = '';
    this.run();
  },
  
  bindResultTabs() {
    document.querySelectorAll('.r-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.r-tab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.r-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('r-' + btn.dataset.rtab).classList.add('active');
      });
    });
  }
};
