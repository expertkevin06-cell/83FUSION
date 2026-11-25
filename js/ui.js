// Gestion de l'interface utilisateur
let vehicleDatabase = {};

function populateBrands() {
    const brandSelect = document.getElementById('select-brand');
    Object.keys(vehicleDatabase).sort().forEach(brand => {
        const opt = document.createElement('option');
        opt.value = brand;
        opt.innerText = brand;
        brandSelect.appendChild(opt);
    });
}

function updateModels() {
    const brand = document.getElementById('select-brand').value;
    const modelSelect = document.getElementById('select-model');
    modelSelect.innerHTML = '<option value="">Modèle</option>';
    resetDownstreamSelectors();
    
    if (brand && vehicleDatabase[brand]) {
        Object.keys(vehicleDatabase[brand]).sort().forEach(model => {
            const opt = document.createElement('option');
            opt.value = model;
            opt.innerText = model;
            modelSelect.appendChild(opt);
        });
    }
}

function updateYears() {
    const brand = document.getElementById('select-brand').value;
    const model = document.getElementById('select-model').value;
    const yearSelect = document.getElementById('select-year');
    yearSelect.innerHTML = '<option value="">Année</option>';
    resetDownstreamSelectors(true);
    
    if (brand && model && vehicleDatabase[brand][model]) {
        Object.keys(vehicleDatabase[brand][model]).sort().forEach(year => {
            const opt = document.createElement('option');
            opt.value = year;
            opt.innerText = year;
            yearSelect.appendChild(opt);
        });
    }
}

function updateEngines() {
    const brand = document.getElementById('select-brand').value;
    const model = document.getElementById('select-model').value;
    const year = document.getElementById('select-year').value;
    const engineSelect = document.getElementById('select-engine');
    engineSelect.innerHTML = '<option value="">Motorisation</option>';
    resetDownstreamSelectors(false, true);
    
    if (brand && model && year && vehicleDatabase[brand][model][year]) {
        Object.keys(vehicleDatabase[brand][model][year]).sort().forEach(engine => {
            const opt = document.createElement('option');
            opt.value = engine;
            opt.innerText = engine;
            engineSelect.appendChild(opt);
        });
    }
}

function resetDownstreamSelectors(resetYear = true, resetEngine = true) {
    if (resetYear) {
        document.getElementById('select-year').innerHTML = '<option value="">Année</option>';
    }
    if (resetEngine) {
        document.getElementById('select-engine').innerHTML = '<option value="">Motorisation</option>';
        document.getElementById('vehicle-data').classList.add('hidden');
        document.getElementById('no-data-msg').classList.remove('hidden');
    }
}

function displayVehicleData() {
    const brand = document.getElementById('select-brand').value;
    const model = document.getElementById('select-model').value;
    const year = document.getElementById('select-year').value;
    const engine = document.getElementById('select-engine').value;

    if (!brand || !model || !year || !engine) return;

    const data = vehicleDatabase[brand][model][year][engine];
    
    document.getElementById('no-data-msg').classList.add('hidden');
    document.getElementById('vehicle-data').classList.remove('hidden');

    // Motorisation
    document.getElementById('info-engine').innerHTML = `
        <li><strong>Marque :</strong> ${brand}</li>
        <li><strong>Modèle :</strong> ${model}</li>
        <li><strong>Année de fabrication :</strong> ${year}</li>
        <li><strong>Motorisation :</strong> ${engine}</li>
        <li><strong>Puissance réelle :</strong> ${data.power}</li>
    `;

    // Pannes
    let faultsHtml = '';
    if (data.faults && data.faults.length > 0) {
        data.faults.forEach(f => {
            const tagClass = f.severity === 'high' ? 'tag-red' : 
                           (f.severity === 'medium' ? 'tag-yellow' : 'tag-green');
            const severityText = f.severity === 'high' ? 'CRITIQUE' : 
                               (f.severity === 'medium' ? 'MOYEN' : 'MINEUR');
            faultsHtml += `<li><span class="tag ${tagClass}">${severityText}</span> 
                          ${f.desc}<br><small style="color:#64748b; margin-left:42px;">Réf: ${f.ref}</small></li>`;
        });
    } else {
        faultsHtml = '<li style="color:#10b981;">✅ Aucune panne majeure répertoriée.</li>';
    }
    document.getElementById('info-faults').innerHTML = faultsHtml;

    // TSB
    let tsbHtml = '';
    if (data.tsb && data.tsb.length > 0) {
        data.tsb.forEach(t => {
            tsbHtml += `<li>📄 ${t}</li>`;
        });
    } else {
        tsbHtml = '<li>Aucun TSB spécifique enregistré.</li>';
    }
    document.getElementById('info-tsb').innerHTML = tsbHtml;

    // Entretien
    let maintHtml = '';
    if (data.maintenance && data.maintenance.length > 0) {
        data.maintenance.forEach(m => {
            maintHtml += `<li>✅ ${m}</li>`;
        });
    } else {
        maintHtml = '<li>Se référer au carnet d\'entretien constructeur standard.</li>';
    }
    document.getElementById('info-maintenance').innerHTML = maintHtml;
}

window.ui = {
    populateBrands,
    updateModels,
    updateYears,
    updateEngines,
    displayVehicleData
};
