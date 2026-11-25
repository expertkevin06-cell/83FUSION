// Gestionnaire APK et mises à jour
class APKManager {
    constructor() {
        this.autoUpdateEnabled = true;
        this.updateInterval = 24; // heures
        this.lastCheck = null;
        this.timerId = null;
        
        this.loadSettings();
        this.initAutoUpdate();
    }

    loadSettings() {
        const settings = localStorage.getItem('apk_settings');
        if (settings) {
            const parsed = JSON.parse(settings);
            this.autoUpdateEnabled = parsed.autoUpdateEnabled ?? true;
            this.updateInterval = parsed.updateInterval ?? 24;
            this.lastCheck = parsed.lastCheck ?? null;
        }
    }

    saveSettings() {
        const settings = {
            autoUpdateEnabled: this.autoUpdateEnabled,
            updateInterval: this.updateInterval,
            lastCheck: this.lastCheck
        };
        localStorage.setItem('apk_settings', JSON.stringify(settings));
    }

    initAutoUpdate() {
        if (this.timerId) {
            clearInterval(this.timerId);
        }

        if (this.autoUpdateEnabled) {
            const intervalMs = this.updateInterval * 60 * 60 * 1000;
            this.timerId = setInterval(() => {
                this.checkForUpdates();
            }, intervalMs);
            
            console.log(`✓ Mise à jour automatique activée (toutes les ${this.updateInterval}h)`);
        }
    }

    toggleAutoUpdate(enabled) {
        this.autoUpdateEnabled = enabled;
        this.saveSettings();
        this.initAutoUpdate();
        
        const status = enabled ? '✓ Activée' : '✗ Désactivée';
        const statusElement = document.getElementById('auto-update-status');
        if (statusElement) statusElement.textContent = status;
    }

    setInterval(hours) {
        this.updateInterval = Math.max(1, Math.min(168, hours));
        this.saveSettings();
        this.initAutoUpdate();
    }

    async checkForUpdates() {
        console.log('🔍 Vérification des mises à jour...');
        this.lastCheck = new Date();
        this.saveSettings();

        try {
            // Simulation de vérification (en production, appel API réel)
            const hasUpdates = await this.fetchUpdates();
            
            if (hasUpdates) {
                this.showUpdateNotification();
            }

            this.updateLastCheckDisplay();
        } catch (error) {
            console.error('Erreur lors de la vérification :', error);
        }
    }

    async fetchUpdates() {
        // Simulation - en production, appel à un serveur
        // return await fetch('https://api.mecadata.com/updates').then(r => r.json());
        return false; // Pas de mise à jour disponible
    }

    showUpdateNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('MECADATA Expert', {
                body: 'Une mise à jour est disponible',
                icon: '/icon.png'
            });
        } else {
            alert('Une mise à jour est disponible !');
        }
    }

    updateLastCheckDisplay() {
        const element = document.getElementById('last-check-time');
        if (element && this.lastCheck) {
            element.textContent = new Date(this.lastCheck).toLocaleString('fr-FR');
        }
    }

    exportAPK() {
        const data = {
            version: '6.0.0',
            timestamp: Date.now(),
            database: window.vehicleDatabase,
            settings: {
                autoUpdateEnabled: this.autoUpdateEnabled,
                updateInterval: this.updateInterval
            }
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mecadata_expert_v6_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('✓ APK exportée avec succès');
    }

    async importAPK(file) {
        const content = await file.text();
        try {
            const data = JSON.parse(content);
            
            if (!data.database) {
                throw new Error('Format APK invalide');
            }

            window.vehicleDatabase = data.database;
            window.storage.save(window.vehicleDatabase);

            if (data.settings) {
                this.autoUpdateEnabled = data.settings.autoUpdateEnabled ?? this.autoUpdateEnabled;
                this.updateInterval = data.settings.updateInterval ?? this.updateInterval;
                this.saveSettings();
            }

            alert('✓ APK importée avec succès');
            location.reload();
        } catch (error) {
            alert('✗ Erreur lors de l\'import : ' + error.message);
        }
    }

    backupDatabase() {
        const backup = {
            timestamp: Date.now(),
            version: '6.0.0',
            database: window.vehicleDatabase
        };

        const backups = JSON.parse(localStorage.getItem('mecadata_backups') || '[]');
        backups.push(backup);
        
        // Garder seulement les 5 dernières sauvegardes
        if (backups.length > 5) {
            backups.shift();
        }

        localStorage.setItem('mecadata_backups', JSON.stringify(backups));
        alert('✓ Sauvegarde créée avec succès');
    }

    restoreBackup() {
        const backups = JSON.parse(localStorage.getItem('mecadata_backups') || '[]');
        
        if (backups.length === 0) {
            alert('Aucune sauvegarde disponible');
            return;
        }

        const lastBackup = backups[backups.length - 1];
        
        if (confirm(`Restaurer la sauvegarde du ${new Date(lastBackup.timestamp).toLocaleString('fr-FR')} ?`)) {
            window.vehicleDatabase = lastBackup.database;
            window.storage.save(window.vehicleDatabase);
            alert('✓ Sauvegarde restaurée');
            location.reload();
        }
    }
}

window.apkManager = new APKManager();
