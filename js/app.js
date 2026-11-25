// Application principale
function initApp() {
    console.log('🚀 MECADATA Expert v5.0 - Initialisation...');
    
    // Charger depuis la sauvegarde locale ou utiliser la base compressée
    const savedData = window.storage.load();
    let result;
    
    if (savedData) {
        vehicleDatabase = savedData;
        result = { database: savedData, stats: { brands: 0, models: 0, engines: 0, faults: 0 } };
    } else {
        result = window.database.expandDatabase();
        vehicleDatabase = result.database;
        window.storage.save(vehicleDatabase);
    }
    
    // Mettre à jour les statistiques
    document.getElementById('stat-brands').innerText = result.stats.brands || Object.keys(vehicleDatabase).length;
    document.getElementById('stat-models').innerText = result.stats.models || 'N/A';
    document.getElementById('stat-engines').innerText = result.stats.engines || 'N/A';
    document.getElementById('stat-faults').innerText = result.stats.faults || 'N/A';
    
    console.log('✓ Application initialisée avec succès');
}

// Fonctions administrateur
function exportData() {
    if (auth.getCurrentRole() !== 'admin') return;
    
    const dataStr = JSON.stringify(vehicleDatabase, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mecadata_megabase_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert("✓ Mega Base exportée avec succès.");
}

function importData(input) {
    if (auth.getCurrentRole() !== 'admin') return;
    
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            vehicleDatabase = window.database.mergeDatabases(vehicleDatabase, importedData);
            window.storage.save(vehicleDatabase);
            
            alert("✓ Importation réussie ! La Mega Base a été enrichie.");
            ui.populateBrands();
        } catch (err) {
            alert("✗ Erreur lors de l'importation : fichier JSON invalide.");
        }
    };
    reader.readAsText(file);
    input.value = '';
}

function resetDatabase() {
    if (auth.getCurrentRole() !== 'admin') return;
    
    if (confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser la base de données ?\nCette action est irréversible.')) {
        window.storage.clear();
        alert('✓ Base de données réinitialisée. Rechargez la page.');
        location.reload();
    }
}

function manualSave() {
    if (auth.getCurrentRole() !== 'admin') {
        alert('Sauvegarde réservée à l\'administrateur.');
        return;
    }
    
    if (window.storage.save(vehicleDatabase)) {
        alert('✓ Sauvegarde effectuée avec succès.');
    } else {
        alert('✗ Erreur lors de la sauvegarde.');
    }
}

function showHiddenData() {
    const panel = document.getElementById('hidden-data-panel');
    panel.classList.toggle('hidden');
    
    if (!panel.classList.contains('hidden')) {
        // Générer des données fictives pour l'affichage
        const hash = Math.random().toString(36).substring(2, 15);
        document.getElementById('session-hash').innerText = hash;
        document.getElementById('last-sync').innerText = new Date().toLocaleString();
        
        const stats = window.storage.getStats();
        document.getElementById('db-stats').innerText = `${stats.size} bytes`;
    }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});
