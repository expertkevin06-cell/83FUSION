window.TSB = {
  domain: null,
  
  init() {
    this.renderDomains();
    this.render();
  },
  
  renderDomains() {
    const chips = document.getElementById('domainChips');
    chips.innerHTML = `<div class="domain-chip active" onclick="TSB.setDomain(null)">Tous</div>` +
      DOMAINS.map(d => `<div class="domain-chip" onclick="TSB.setDomain('${d}')">${d}</div>`).join('');
  },
  
  setDomain(d) {
    this.domain = d;
    document.querySelectorAll('.domain-chip').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');
    this.render();
  },
  
  getAll() {
    const all = [];
    for (const [brand, models] of Object.entries(Database.data)) {
      for (const [model, years] of Object.entries(models)) {
        for (const [yr, engines] of Object.entries(years)) {
          for (const [eng, data] of Object.entries(engines)) {
            (data.faults || []).forEach(f => {
              all.push({ brand, model, years: yr, engine: eng, ...f });
            });
            (data.tsb || []).forEach(t => {
              all.push({ brand, model, years: yr, engine: eng, ...t, nature: 'TSB', severity: 'info' });
            });
          }
        }
      }
    }
    return all;
  },
  
  render() {
    let items = this.getAll();
    if (this.domain) {
      // Filtrer par domaine (via protocoles)
      items = items.filter(i => 
        (i.symptoms || '').includes(this.domain) ||
        (i.title || '').includes(this.domain)
      );
    }
    document.getElementById('tsbList').innerHTML = items.length ?
      items.slice(0, 200).map(i => `
        <div class="tsb-card">
          <h4>${i.title}</h4>
          <div class="tsb-meta">
            <span class="tag tag-${i.severity || 'info'}">${(i.severity || 'info').toUpperCase()}</span>
            <span class="tag-nature tag-${(i.nature || 'TSB').toLowerCase()}">${i.nature || 'TSB'}</span>
            <span class="muted">${i.brand} · ${i.model} · ${i.engine} · ${i.years}</span>
          </div>
          ${i.symptoms ? `<div class="tsb-symptoms">${i.symptoms}</div>` : ''}
          ${i.ref ? `<small style="color: var(--muted)">Réf: ${i.ref}</small>` : ''}
        </div>
      `).join('') :
      '<div class="info-card glass"><p>Aucune fiche pour ce domaine.</p></div>';
  }
};

window.Domains = {
  init() {
    const grid = document.getElementById('domainsGrid');
    const all = TSB.getAll();
    grid.innerHTML = DOMAINS.map(d => {
      const count = all.filter(i => 
        (i.symptoms || '').includes(d) || (i.title || '').includes(d)
      ).length;
      return `
        <div class="domain-card" onclick="UI.showPanel('tsb'); TSB.setDomain('${d}')">
          <div class="count">${count}</div>
          <div class="name">${d}</div>
        </div>
      `;
    }).join('');
  }
};
