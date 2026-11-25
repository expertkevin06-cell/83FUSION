// Gestion de la sauvegarde locale (localStorage)
class LocalStorage {
    constructor() {
        this.STORAGE_KEY = 'mecadata_expert_v5';
        this.AUTO_SAVE_INTERVAL = 30000; // 30 secondes
        this.autoSaveTimer = null;
    }

    save(data) {
        try {
            const saveData = {
                timestamp: Date.now(),
                version: '5.0',
                data: data
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(saveData));
            console.log('✓ Sauvegarde locale effectuée');
            return true;
        } catch (error) {
            console.error('✗ Erreur de sauvegarde:', error);
            return false;
        }
    }

    load() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (!saved) return null;
            
            const parsed = JSON.parse(saved);
            console.log(`✓ Données chargées depuis sauvegarde locale (${new Date(parsed.timestamp).toLocaleString()})`);
            return parsed.data;
        } catch (error) {
            console.error('✗ Erreur de chargement:', error);
            return null;
        }
    }

    startAutoSave(saveFunction) {
        this.autoSaveTimer = setInterval(() => {
            saveFunction();
        }, this.AUTO_SAVE_INTERVAL);
        console.log(`✓ Sauvegarde automatique activée (toutes les ${this.AUTO_SAVE_INTERVAL / 1000}s)`);
    }

    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }

    clear() {
        localStorage.removeItem(this.STORAGE_KEY);
        console.log('✓ Sauvegarde locale effacée');
    }

    getStats() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (!saved) return { size: 0, lastSave: null };
        
        return {
            size: new Blob([saved]).size,
            lastSave: new Date(JSON.parse(saved).timestamp)
        };
    }
}

// Instance globale
window.storage = new LocalStorage();
