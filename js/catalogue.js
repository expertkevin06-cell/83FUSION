window.Catalogue = {
  page: 1,
  perPage: 50,
  filterText: '',
  
  init() {
    this.render();
  },
  
  getAll() {
    const all = [];
    for (const [brand, models] of Object.entries(Database.data)) {
      for (const [model, years] of Object.entries(models)) {
        for (const [yr, engines] of Object.entries(years)) {
          for (const [eng, data] of Object.entries(engines)) {
            all.push({
              brand, model, years: yr,
              engine: eng, ...data
            });
          }
        }
      }
    }
    return all.sort((a, b) => a.brand.localeCompare(b.brand));
  },
  
  render() {
    let items = this.getAll();
    if (this.filterText) {
      const t = this.filterText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      items = items.filter(i => 
        JSON.stringify(i).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(t)
      );
    }
    document.getElementById('catCount').textContent = `${items.length} motorisations`;
    const total = Math.ceil(items.length / this.perPage);
    const page = items.slice((this.page - 1) * this.perPage, this.page * this.perPage);
    
    document.getElementById('catalogueGrid').innerHTML = page.map(i => `
      <div class="catalogue-item">
        <div class="brand-line">${i.brand}</div>
        <div class="model-line">${i.model}</div>
        <div class="engine-line">${i.engine} · ${i.years}</div>
        <div class="power-line">
          <span>⚡ ${i.power} ch</span>
          <span>🔋 ${i.energy}</span>
          <span>⚙ ${i.cyl} cm³</span>
        </div>
      </div>
    `).join('');
    
    document.getElementById('catPagination').innerHTML = `
      <button class="btn-sm" ${this.page === 1 ? 'disabled' : ''} onclick="Catalogue.prev()">← Préc</button>
      <span style="padding: 8px 16px; color: var(--muted)">Page ${this.page} / ${total || 1}</span>
      <button class="btn-sm" ${this.page >= total ? 'disabled' : ''} onclick="Catalogue.next()">Suiv →</button>
    `;
  },
  
  filter() {
    this.filterText = document.getElementById('catSearch').value;
    this.page = 1;
    this.render();
  },
  
  next() { this.page++; this.render(); },
  prev() { this.page--; this.render(); },
  
  export() {
    const data = this.getAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `catalogue_motorisations_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  }
};
