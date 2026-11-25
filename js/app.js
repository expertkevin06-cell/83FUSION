// Application principale
function initApp() {
    console.log('🚀 MECADATA Expert v6.0 - Initialisation...');
    
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
    
    // Stats admin
    document.getElementById('db-entries').innerText = result.stats.engines || 0;
    document.getElementById('last-update').innerText = new Date().toLocaleDateString('fr-FR');
    
    const stats = window.storage.getStats();
    document.getElementById('db-size').innerText = Math.round(stats.size / 1024) + ' Ko';
    
    console.log('✓ Application initialisée avec succès');
}

// Fonctions d'importation
async function handleImport(input) {
    const files = input.files;
    if (!files || files.length === 0) return;

    let totalImported = 0;
    
    for (let file of files) {
        try {
            const importedData = await window.dataImporter.importFile(file);
            vehicleDatabase = window.dataImporter.mergeWithDatabase(vehicleDatabase, importedData);
            totalImported++;
        } catch (error) {
            console.error(`Erreur lors de l'import de ${file.name}:`, error);
            alert(`Erreur lors de l'import de ${file.name}: ${error.message}`);
        }
    }

    if (totalImported > 0) {
        window.storage.save(vehicleDatabase);
        alert(`✓ ${totalImported} fichier(s) importé(s) avec succès !`);
        populateBrands();
    }
    
    input.value = '';
}

async function handleImportModal(input) {
    const file = input.files[0];
    if (!file) return;

    try {
        const importedData = await window.dataImporter.importFile(file);
        vehicleDatabase = window.dataImporter.mergeWithDatabase(vehicleDatabase, importedData);
        window.storage.save(vehicleDatabase);
        
        alert('✓ Importation réussie !');
        closeImportModal();
        populateBrands();
    } catch (error) {
        alert('✗ Erreur : ' + error.message);
    }
    
    input.value = '';
}

function importFromText() {
    const text = document.getElementById('import-text').value.trim();
    if (!text) {
        alert('Veuillez coller des données JSON');
        return;
    }

    try {
        const data = JSON.parse(text);
        vehicleDatabase = window.dataImporter.mergeWithDatabase(vehicleDatabase, data);
        window.storage.save(vehicleDatabase);
        
        alert('✓ Importation depuis texte réussie !');
        closeImportModal();
        populateBrands();
        document.getElementById('import-text').value = '';
    } catch (error) {
        alert('✗ JSON invalide : ' + error.message);
    }
}

// Fonctions d'exportation
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

function exportCatalogue() {
    exportData();
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
        const hash = Math.random().toString(36).substring(2, 15);
        document.getElementById('session-hash').innerText = hash;
        document.getElementById('last-sync').innerText = new Date().toLocaleString();
        
        const stats = window.storage.getStats();
        document.getElementById('db-stats').innerText = `${stats.size} bytes`;
    }
}

function resetDatabase() {
    if (auth.getCurrentRole() !== 'admin') return;
    
    if (confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser la base de données ?\nCette action est irréversible.')) {
        window.storage.clear();
        alert('✓ Base de données réinitialisée. Rechargez la page.');
        location.reload();
    }
}

// Fonctions du gestionnaire APK
function toggleAutoUpdate() {
    const enabled = document.getElementById('auto-update-toggle').checked;
    window.apkManager.toggleAutoUpdate(enabled);
}

function updateInterval() {
    const hours = parseInt(document.getElementById('update-interval').value);
    window.apkManager.setInterval(hours);
}

function backupDatabase() {
    window.apkManager.backupDatabase();
}

function restoreBackup() {
    window.apkManager.restoreBackup();
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});
