// Gestionnaire d'importation multi-format
class DataImporter {
    constructor() {
        this.supportedFormats = ['json', 'csv', 'xml', 'txt'];
    }

    async importFile(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        
        if (!this.supportedFormats.includes(extension)) {
            throw new Error(`Format non supporté : ${extension}`);
        }

        const content = await this.readFile(file);
        
        switch(extension) {
            case 'json':
                return this.parseJSON(content);
            case 'csv':
                return this.parseCSV(content);
            case 'xml':
                return this.parseXML(content);
            case 'txt':
                return this.parseTXT(content);
            default:
                throw new Error(`Parseur non disponible pour : ${extension}`);
        }
    }

    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    parseJSON(content) {
        try {
            const data = JSON.parse(content);
            return this.normalizeData(data);
        } catch (error) {
            throw new Error('JSON invalide : ' + error.message);
        }
    }

    parseCSV(content) {
        const lines = content.trim().split('\n');
        if (lines.length < 2) throw new Error('CSV vide ou invalide');

        const headers = lines[0].split(',').map(h => h.trim());
        const data = {};

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const row = {};
            
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });

            // Structure hiérarchique
            const brand = row.brand || row.marque || row.Brand;
            const model = row.model || row.modèle || row.Model;
            
            if (brand && model) {
                if (!data[brand]) data[brand] = {};
                if (!data[brand][model]) data[brand][model] = {};
                
                const year = row.year || row.annee || row.Year || '2020-2024';
                if (!data[brand][model][year]) data[brand][model][year] = {};
                
                const engine = row.engine || row.moteur || row.Engine || 'Unknown';
                data[brand][model][year][engine] = {
                    pw: row.power || row.puissance || row.Power || 'N/A',
                    fl: row.faults ? [{d: row.faults, s: row.severity || 'M', r: row.ref || 'N/A'}] : [],
                    tb: row.tsb ? [row.tsb] : [],
                    mt: row.maintenance ? [row.maintenance] : []
                };
            }
        }

        return data;
    }

    parseXML(content) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, 'text/xml');
        const data = {};

        const vehicles = xmlDoc.getElementsByTagName('vehicle');
        for (let vehicle of vehicles) {
            const brand = vehicle.getAttribute('brand') || vehicle.getElementsByTagName('brand')[0]?.textContent;
            const model = vehicle.getAttribute('model') || vehicle.getElementsByTagName('model')[0]?.textContent;
            
            if (brand && model) {
                if (!data[brand]) data[brand] = {};
                if (!data[brand][model]) data[brand][model] = {};
                
                const year = vehicle.getAttribute('year') || '2020-2024';
                if (!data[brand][model][year]) data[brand][model][year] = {};
                
                const engine = vehicle.getAttribute('engine') || 'Unknown';
                data[brand][model][year][engine] = {
                    pw: vehicle.getAttribute('power') || 'N/A',
                    fl: [],
                    tb: [],
                    mt: []
                };

                // Parse pannes
                const faults = vehicle.getElementsByTagName('fault');
                for (let fault of faults) {
                    data[brand][model][year][engine].fl.push({
                        d: fault.textContent,
                        s: fault.getAttribute('severity') || 'M',
                        r: fault.getAttribute('ref') || 'N/A'
                    });
                }

                // Parse TSB
                const tsbs = vehicle.getElementsByTagName('tsb');
                for (let tsb of tsbs) {
                    data[brand][model][year][engine].tb.push(tsb.textContent);
                }

                // Parse maintenance
                const maints = vehicle.getElementsByTagName('maintenance');
                for (let maint of maints) {
                    data[brand][model][year][engine].mt.push(maint.textContent);
                }
            }
        }

        return data;
    }

    parseTXT(content) {
        // Format texte structuré
        const data = {};
        const lines = content.trim().split('\n');
        let currentBrand = null;
        let currentModel = null;
        let currentYear = null;
        let currentEngine = null;

        for (let line of lines) {
            line = line.trim();
            
            if (line.startsWith('BRAND:')) {
                currentBrand = line.replace('BRAND:', '').trim();
                if (!data[currentBrand]) data[currentBrand] = {};
            } else if (line.startsWith('MODEL:')) {
                currentModel = line.replace('MODEL:', '').trim();
                if (!data[currentBrand][currentModel]) data[currentBrand][currentModel] = {};
            } else if (line.startsWith('YEAR:')) {
                currentYear = line.replace('YEAR:', '').trim();
                if (!data[currentBrand][currentModel][currentYear]) data[currentBrand][currentModel][currentYear] = {};
            } else if (line.startsWith('ENGINE:')) {
                currentEngine = line.replace('ENGINE:', '').trim();
                data[currentBrand][currentModel][currentYear][currentEngine] = {
                    pw: 'N/A',
                    fl: [],
                    tb: [],
                    mt: []
                };
            } else if (line.startsWith('POWER:')) {
                data[currentBrand][currentModel][currentYear][currentEngine].pw = line.replace('POWER:', '').trim();
            } else if (line.startsWith('FAULT:')) {
                data[currentBrand][currentModel][currentYear][currentEngine].fl.push({
                    d: line.replace('FAULT:', '').trim(),
                    s: 'M',
                    r: 'N/A'
                });
            } else if (line.startsWith('TSB:')) {
                data[currentBrand][currentModel][currentYear][currentEngine].tb.push(line.replace('TSB:', '').trim());
            } else if (line.startsWith('MAINT:')) {
                data[currentBrand][currentModel][currentYear][currentEngine].mt.push(line.replace('MAINT:', '').trim());
            }
        }

        return data;
    }

    normalizeData(data) {
        // Assurer que la structure est cohérente
        if (typeof data !== 'object' || data === null) {
            throw new Error('Structure de données invalide');
        }
        return data;
    }

    mergeWithDatabase(database, newData) {
        const merged = {...database};
        
        for (const brand in newData) {
            if (!merged[brand]) merged[brand] = {};
            
            for (const model in newData[brand]) {
                if (!merged[brand][model]) merged[brand][model] = {};
                
                for (const year in newData[brand][model]) {
                    if (!merged[brand][model][year]) merged[brand][model][year] = {};
                    
                    Object.assign(merged[brand][model][year], newData[brand][model][year]);
                }
            }
        }
        
        return merged;
    }
}

window.dataImporter = new DataImporter();
