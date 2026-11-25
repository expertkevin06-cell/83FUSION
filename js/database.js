// Base de données compressée (même structure que V2newprojet2026)
const COMPRESSED_MEGA_DB = {
    "Renault": {
        "Clio V": {
            "2019-2024": {
                "1.0 TCe 90": {
                    pw: "90 ch (66 kW)",
                    fl: [
                        {d: "Consommation d'huile moteur élevée", s: "H", r: "Rappel R20A"},
                        {d: "Claquement distribution à froid", s: "M", r: "NTB-20-045"}
                    ],
                    tb: [
                        "MAJ calculateur injection (symptôme : ralenti instable)",
                        "Remplacement support moteur droit (vibrations)"
                    ],
                    mt: [
                        "Vidange 15 000 km/1an (5W30 RN0720)",
                        "Bougies d'allumage 60 000 km",
                        "Liquide de frein 3 ans"
                    ]
                },
                "1.5 Blue dCi 85": {
                    pw: "85 ch (63 kW)",
                    fl: [
                        {d: "Encrassement vanne EGR et FAP", s: "M", r: "NTB-21-012"}
                    ],
                    tb: [
                        "Nettoyage système EGR et MAJ logiciel gestion moteur"
                    ],
                    mt: [
                        "Vidange 30 000 km/2ans (5W30 RN0720)",
                        "Distribution 150 000 km/6 ans",
                        "Filtre à carburant 30 000 km"
                    ]
                }
            }
        },
        "Megane E-Tech": {
            "2022-2024": {
                "E-Tech 220ch (60kWh)": {
                    pw: "220 ch (160 kW) Électrique",
                    fl: [
                        {d: "Perte de puissance en charge rapide répétée", s: "M", r: "Rappel E-23"}
                    ],
                    tb: [
                        "MAJ module de gestion batterie (BMS) pour optimiser la thermique"
                    ],
                    mt: [
                        "Contrôle système haute tension tous les 2 ans",
                        "Liquide de frein 3 ans",
                        "Filtre d'habitacle 1 an"
                    ]
                }
            }
        }
    },
    "Peugeot": {
        "208 II": {
            "2019-2024": {
                "1.2 PureTech 100": {
                    pw: "100 ch (74 kW)",
                    fl: [
                        {d: "Désintégration courroie de distribution dans l'huile", s: "H", r: "Rappel R21B"},
                        {d: "Consommation d'huile anormale", s: "H", r: "NTB-21-088"}
                    ],
                    tb: [
                        "Passage à la courroie sèche (kit modification) pour certains V.I.N.",
                        "MAJ gestion pression d'huile"
                    ],
                    mt: [
                        "Vidange 15 000 km/1an (0W30 spécifique courroie humide)",
                        "Contrôle niveau huile impératif tous les 5 000 km"
                    ]
                }
            }
        }
    },
    "Volkswagen": {
        "Golf VIII": {
            "2020-2024": {
                "2.0 TDI 150": {
                    pw: "150 ch (110 kW)",
                    fl: [
                        {d: "Défaut de pompe à eau / boîtier thermostat", s: "M", r: "Rappel VAG-2021"}
                    ],
                    tb: [
                        "Remplacement préventif du boîtier de gestion thermique"
                    ],
                    mt: [
                        "Vidange 15 000 km/1an (5W30 LongLife)",
                        "Filtre à carburant 30 000 km",
                        "Liquide de refroidissement 3 ans"
                    ]
                }
            }
        }
    },
    "Toyota": {
        "Yaris IV": {
            "2020-2024": {
                "116h Hybride": {
                    pw: "116 ch (85 kW) Système hybride",
                    fl: [
                        {d: "Bruit de roulement de roue AV", s: "L", r: "TSB-TY-2022"}
                    ],
                    tb: [
                        "Vérification et graissage des roulements de roue avant"
                    ],
                    mt: [
                        "Vidange moteur 15 000 km/1an",
                        "Contrôle système hybride 90 000 km/5 ans",
                        "Liquide de refroidissement inverter 160 000 km"
                    ]
                }
            }
        }
    }
};

// Expansion de la base de données
function expandDatabase() {
    const expanded = {};
    let modelsCount = 0;
    let enginesCount = 0;
    let faultsCount = 0;

    for (const [brand, models] of Object.entries(COMPRESSED_MEGA_DB)) {
        expanded[brand] = {};
        for (const [model, years] of Object.entries(models)) {
            expanded[brand][model] = {};
            modelsCount++;
            
            for (const [yearRange, engines] of Object.entries(years)) {
                const [startYear, endYear] = yearRange.split('-').map(Number);
                for (let y = startYear; y <= (endYear || startYear); y++) {
                    const yearStr = y.toString();
                    expanded[brand][model][yearStr] = {};
                    
                    for (const [engine, data] of Object.entries(engines)) {
                        expanded[brand][model][yearStr][engine] = {
                            power: data.pw,
                            faults: data.fl.map(f => ({
                                desc: f.d,
                                severity: f.s === 'H' ? 'high' : (f.s === 'M' ? 'medium' : 'low'),
                                ref: f.r
                            })),
                            tsb: data.tb.map(t => `TSB: ${t}`),
                            maintenance: data.mt
                        };
                        enginesCount++;
                        faultsCount += data.fl.length + data.tb.length;
                    }
                }
            }
        }
    }

    return {
        database: expanded,
        stats: {
            brands: Object.keys(expanded).length,
            models: modelsCount,
            engines: enginesCount,
            faults: faultsCount
        }
    };
}

// Fusion avec données importées
function mergeDatabases(baseDB, importedData) {
    const merged = {...baseDB};
    
    for (const brand in importedData) {
        if (!merged[brand]) merged[brand] = {};
        for (const model in importedData[brand]) {
            if (!merged[brand][model]) merged[brand][model] = {};
            Object.assign(merged[brand][model], importedData[brand][model]);
        }
    }
    
    return merged;
}

window.database = {
    expandDatabase,
    mergeDatabases
};
