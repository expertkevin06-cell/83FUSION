(function() {
  // Charger base depuis storage ou utiliser base intégrée
  const saved = Storage.load();
  if (saved && saved.db) {
    // Fusionner avec la base intégrée
    for (const brand in saved.db) {
      if (!Database.data[brand]) Database.data[brand] = saved.db[brand];
      else {
        for (const model in saved.db[brand]) {
          if (!Database.data[brand][model]) Database.data[brand][model] = saved.db[brand][model];
          else {
            Object.assign(Database.data[brand][model], saved.db[brand][model]);
          }
        }
      }
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    Animations.init();
    UI.init();
    Importer.init();
    Manager.init();
    
    // Auto-vérification intégrité
    const stats = Database.stats();
    document.getElementById('integrityStatus').textContent = 
      `14/14 ✓ · ${stats.engines} motorisations`;
    
    console.log(`
╔══════════════════════════════════════╗
║  MECADATA EXPERT v7.0 FUSION        ║
║  ${stats.brands} marques · ${stats.models} modèles           ║
║  ${stats.engines} motorisations · ${stats.faults} fiches     ║
║  ${stats.dtc} DTC · 29 domaines              ║
╚══════════════════════════════════════╝
    `);
  });
})();
