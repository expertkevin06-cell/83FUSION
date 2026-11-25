// Base de données massive complète (extrait représentatif)
const MEGA_DATABASE = {
    "Abarth": {
        "124 Spider": { "2017-2020": { "1.4 MultiAir 140": { pw: "140 ch", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}},
        "595": { "2017-2024": { "1.4 T-Jet 145": { pw: "145 ch", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}}
    },
    "Acura": {
        "MDX": { "2017-2024": { "3.5 V6 294": { pw: "294 ch", fl: [], tb: [], mt: ["Vidange 12000km/1an"] }}}
    },
    "Aixam": {
        "City": { "2017-2027": { "0.5 DCI 8": { pw: "8 ch", fl: [], tb: [], mt: ["Vidange 10000km/1an"] }}}
    },
    "Alfa Romeo": {
        "Giulia": { 
            "2017-2027": { 
                "2.0 Turbo 200": { pw: "200 ch", fl: [{d: "Consommation huile", s: "M", r: "TSB-AR-01"}], tb: [], mt: ["Vidange 15000km/1an"] },
                "2.9 V6 QV 510": { pw: "510 ch", fl: [{d: "Chaîne distribution", s: "H", r: "Rappel-AR-02"}], tb: ["TSB distribution"], mt: ["Vidange 10000km/1an"] }
            }
        },
        "Giulietta": { "2017-2020": { "1.4 TB 120": { pw: "120 ch", fl: [], tb: [], mt: ["Vidange 20000km/2ans"] }}}
    },
    "Aston Martin": {
        "DB11": { "2017-2023": { "4.0 V8 510": { pw: "510 ch", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}}
    },
    "Audi": {
        "A1": { "2018-2024": { "1.0 TFSI 95": { pw: "95 ch", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}},
        "A3": { 
            "2020-2024": { 
                "1.5 TFSI 150": { pw: "150 ch", fl: [{d: "Pompe à eau", s: "M", r: "TSB-A3-01"}], tb: [], mt: ["Vidange 15000km/1an"] },
                "2.0 TDI 150": { pw: "150 ch", fl: [], tb: [], mt: ["Vidange 30000km/2ans"] }
            }
        },
        "A4": { "2019-2024": { "2.0 TDI 150": { pw: "150 ch", fl: [], tb: [], mt: ["Vidange 30000km/2ans"] }}},
        "Q3": { "2018-2024": { "1.5 TFSI 150": { pw: "150 ch", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}},
        "Q5": { "2017-2024": { "2.0 TDI 190": { pw: "190 ch", fl: [], tb: [], mt: ["Vidange 30000km/2ans"] }}}
    },
    "BMW": {
        "Série 1": { "2019-2024": { "118i 140": { pw: "140 ch", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}},
        "Série 3": { 
            "2019-2024": { 
                "320d 190": { pw: "190 ch", fl: [{d: "Volant moteur", s: "H", r: "Rappel-BMW-01"}], tb: ["Remplacement volant moteur"], mt: ["Vidange 15000km/1an"] },
                "330e 292": { pw: "292 ch", fl: [], tb: [], mt: ["Vidange 15000km/1an", "Contrôle HV 2ans"] }
            }
        },
        "X1": { "2022-2024": { "sDrive18d 150": { pw: "150 ch", fl: [], tb: [], mt: ["Vidange 30000km/2ans"] }}},
        "X3": { "2017-2024": { "xDrive20d 190": { pw: "190 ch", fl: [], tb: [], mt: ["Vidange 30000km/2ans"] }}},
        "X5": { "2019-2024": { "xDrive40i 340": { pw: "340 ch", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}}
    },
    "BYD": {
        "Atto 3": { "2023-2024": { "204ch": { pw: "204 ch Électrique", fl: [{d: "Erreur multimédia", s: "L", r: "TSB-BYD-01"}], tb: ["MAJ logicielle"], mt: ["Filtre habitacle 1an"] }}},
        "Seal": { "2023-2024": { "530ch AWD": { pw: "530 ch Électrique", fl: [], tb: [], mt: ["Liquide frein 2ans"] }}}
    },
    "Citroën": {
        "C3": { "2020-2024": { "1.2 PureTech 110": { pw: "110 ch", fl: [{d: "Courroie humide", s: "H", r: "Rappel-C3-01"}], tb: ["Inspection courroie"], mt: ["Vidange 15000km/1an (0W30)"] }}},
        "C5 Aircross": { "2018-2024": { "1.5 BlueHDi 130": { pw: "130 ch", fl: [], tb: [], mt: ["Vidange 30000km/2ans"] }}}
    },
    "Dacia": {
        "Duster": { "2021-2024": { "1.0 TCe 110": { pw: "110 ch", fl: [], tb: [], mt: ["Vidange 20000km/1an"] }}},
        "Sandero": { "2020-2024": { "1.0 TCe 90": { pw: "90 ch", fl: [], tb: [], mt: ["Vidange 20000km/1an"] }}}
    },
    "DS": {
        "DS 3 Crossback": { "2019-2024": { "1.2 PureTech 130": { pw: "130 ch", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}},
        "DS 7": { "2022-2024": { "E-Tense 225": { pw: "225 ch Hybride", fl: [], tb: [], mt: ["Vidange 15000km/1an", "Contrôle HV 2ans"] }}}
    },
    "Ferrari": {
        "F8 Tributo": { "2019-2023": { "3.9 V8 720": { pw: "720 ch", fl: [], tb: [], mt: ["Vidange 20000km/1an"] }}},
        "Roma": { "2020-2024": { "3.9 V8 620": { pw: "620 ch", fl: [], tb: [], mt: ["Vidange 20000km/1an"] }}}
    },
    "Fiat": {
        "500e": { "2020-2024": { "118ch": { pw: "118 ch Électrique", fl: [{d: "Perte BMS", s: "M", r: "TSB-500e-01"}], tb: ["MAJ BMS"], mt: ["Filtre habitacle 1an"] }}},
        "Panda": { "2017-2024": { "1.0 Hybrid 70": { pw: "70 ch", fl: [], tb: [], mt: ["Vidange 20000km/1an"] }}}
    },
    "Ford": {
        "Fiesta": { "2017-2023": { "1.0 EcoBoost 100": { pw: "100 ch", fl: [], tb: [], mt: ["Vidange 20000km/1an"] }}},
        "Focus": { "2018-2024": { "1.5 EcoBoost 150": { pw: "150 ch", fl: [], tb: [], mt: ["Vidange 20000km/1an"] }}},
        "Kuga": { 
            "2020-2024": { 
                "1.5 EcoBoost 150": { pw: "150 ch", fl: [], tb: [], mt: ["Vidange 20000km/1an"] },
                "2.5 PHEV 225": { pw: "225 ch", fl: [{d: "Batterie HV incendie", s: "H", r: "Rappel-Kuga-01"}], tb: ["Remplacement batterie"], mt: ["Vidange 20000km/1an"] }
            }
        },
        "Puma": { "2020-2024": { "1.0 EcoBoost 125": { pw: "125 ch", fl: [{d: "Volant moteur", s: "H", r: "Rappel-Puma-01"}], tb: ["Contrôle volant moteur"], mt: ["Vidange 20000km/1an"] }}},
        "Mustang Mach-E": { "2021-2024": { "GT 487ch": { pw: "487 ch Électrique", fl: [], tb: [], mt: ["Liquide frein 3ans"] }}}
    },
    "Honda": {
        "Civic": { "2022-2024": { "1.5 VTEC Turbo 182": { pw: "182 ch", fl: [{d: "Dilution huile", s: "M", r: "TSB-Civic-01"}], tb: ["MAJ gestion moteur"], mt: ["Vidange 15000km/1an"] }}},
        "HR-V": { "2021-2024": { "e:HEV 131": { pw: "131 ch Hybride", fl: [], tb: [], mt: ["Vidange 20000km/1an"] }}}
    },
    "Hyundai": {
        "i20": { "2020-2024": { "1.0 T-GDI 100": { pw: "100 ch", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}},
        "Tucson": { 
            "2021-2024": { 
                "1.6 T-GDI 150": { pw: "150 ch", fl: [{d: "Module ABS incendie", s: "H", r: "Rappel-Tucson-01"}], tb: ["Remplacement ABS"], mt: ["Vidange 15000km/1an"] },
                "1.6 CRDi 136": { pw: "136 ch", fl: [{d: "Turbo géométrie variable", s: "M", r: "TSB-Tucson-02"}], tb: ["Contrôle turbo"], mt: ["Vidange 15000km/1an"] }
            }
        },
        "Kona Electric": { "2018-2024": { "204ch": { pw: "204 ch Électrique", fl: [{d: "Batterie incendie", s: "H", r: "Rappel-Kona-01"}], tb: ["Remplacement batterie"], mt: ["Liquide refroidissement 4ans"] }}}
    },
    "Jaguar": {
        "F-Pace": { "2020-2024": { "2.0 D200 204": { pw: "204 ch", fl: [], tb: [], mt: ["Vidange 34000km/2ans"] }}},
        "I-Pace": { "2018-2024": { "400ch": { pw: "400 ch Électrique", fl: [], tb: [], mt: ["Liquide frein 3ans"] }}}
    },
    "Jeep": {
        "Compass": { "2017-2024": { "1.3 T4 150": { pw: "150 ch", fl: [], tb: [], mt: ["Vidange 20000km/1an"] }}},
        "Wrangler": { "2018-2024": { "2.0 Turbo 272": { pw: "272 ch", fl: [], tb: [], mt: ["Vidange 12000km/1an"] }}}
    },
    "Kia": {
        "Ceed": { "2018-2024": { "1.0 T-GDI 120": { pw: "120 ch", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}},
        "Sportage": { "2022-2024": { "1.6 T-GDI 150": { pw: "150 ch", fl: [{d: "Module ABS incendie", s: "H", r: "Rappel-Sportage-01"}], tb: ["Remplacement ABS"], mt: ["Vidange 15000km/1an"] }}},
        "EV6": { "2021-2024": { "325ch": { pw: "325 ch Électrique", fl: [], tb: [], mt: ["Liquide refroidissement 4ans"] }}}
    },
    "Lamborghini": {
        "Huracán": { "2017-2023": { "5.2 V10 640": { pw: "640 ch", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}},
        "Urus": { "2018-2024": { "4.0 V8 650": { pw: "650 ch", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}}
    },
    "Land Rover": {
        "Defender": { "2020-2024": { "2.0 P300 300": { pw: "300 ch", fl: [], tb: [], mt: ["Vidange 34000km/2ans"] }}},
        "Range Rover": { "2022-2024": { "3.0 D300 300": { pw: "300 ch", fl: [], tb: [], mt: ["Vidange 34000km/2ans"] }}}
    },
    "Maserati": {
        "Ghibli": { "2017-2024": { "3.0 V6 350": { pw: "350 ch", fl: [], tb: [], mt: ["Vidange 20000km/1an"] }}},
        "Grecale": { "2022-2024": { "2.0 300": { pw: "300 ch", fl: [], tb: [], mt: ["Vidange 20000km/1an"] }}}
    },
    "Mazda": {
        "CX-5": { "2017-2024": { "2.0 Skyactiv-G 165": { pw: "165 ch", fl: [{d: "Ressort soupape", s: "H", r: "Rappel-CX5-01"}], tb: ["Remplacement ressort"], mt: ["Vidange 20000km/1an"] }}},
        "MX-5": { "2015-2024": { "2.0 Skyactiv-G 184": { pw: "184 ch", fl: [], tb: [], mt: ["Vidange 20000km/1an"] }}}
    },
    "McLaren": {
        "570S": { "2017-2021": { "3.8 V8 570": { pw: "570 ch", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}},
        "Artura": { "2022-2024": { "3.0 V6 680": { pw: "680 ch Hybride", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}}
    },
    "Mercedes-Benz": {
        "Classe A": { "2018-2024": { "A 200 d 150": { pw: "150 ch", fl: [{d: "Chaîne distribution", s: "H", r: "Rappel-A-01"}], tb: ["Remplacement chaîne"], mt: ["Vidange 20000km/1an"] }}},
        "Classe C": { "2021-2024": { "C 220 d 194": { pw: "194 ch", fl: [], tb: [], mt: ["Vidange 25000km/1an"] }}},
        "GLC": { "2019-2024": { "GLC 220 d 194": { pw: "194 ch", fl: [], tb: [], mt: ["Vidange 25000km/1an"] }}},
        "EQC": { "2019-2023": { "408ch": { pw: "408 ch Électrique", fl: [], tb: [], mt: ["Liquide refroidissement 4ans"] }}}
    },
    "MG": {
        "MG4": { "2022-2024": { "170ch": { pw: "170 ch Électrique", fl: [{d: "Court-circuit batterie", s: "H", r: "Rappel-MG4-01"}], tb: ["Remplacement connecteur"], mt: ["Filtre habitacle 1an"] }}},
        "ZS EV": { "2019-2024": { "143ch": { pw: "143 ch Électrique", fl: [], tb: [], mt: ["Filtre habitacle 1an"] }}}
    },
    "Mini": {
        "Cooper": { "2018-2024": { "1.5 136": { pw: "136 ch", fl: [], tb: [], mt: ["Vidange 20000km/1an"] }}},
        "Countryman": { "2017-2024": { "2.0 192": { pw: "192 ch", fl: [], tb: [], mt: ["Vidange 20000km/1an"] }}}
    },
    "Mitsubishi": {
        "Outlander": { "2021-2024": { "2.4 PHEV 224": { pw: "224 ch", fl: [], tb: [], mt: ["Vidange 20000km/1an"] }}},
        "ASX": { "2019-2024": { "1.6 117": { pw: "117 ch", fl: [], tb: [], mt: ["Vidange 20000km/1an"] }}}
    },
    "Nissan": {
        "Qashqai": { "2021-2024": { "1.3 DIG-T 140": { pw: "140 ch", fl: [{d: "Roulement roue AR", s: "L", r: "TSB-Qashqai-01"}], tb: ["Remplacement roulement"], mt: ["Vidange 15000km/1an"] }}},
        "Leaf": { "2017-2024": { "150ch": { pw: "150 ch Électrique", fl: [{d: "Dégradation batterie", s: "M", r: "Panne-Leaf-01"}], tb: ["Contrôle SOH"], mt: ["Liquide refroidissement 8ans"] }}},
        "Ariya": { "2022-2024": { "394ch": { pw: "394 ch Électrique", fl: [], tb: [], mt: ["Liquide refroidissement 4ans"] }}}
    },
    "Opel": {
        "Corsa": { "2019-2024": { "1.2 100": { pw: "100 ch", fl: [{d: "Consommation huile", s: "M", r: "TSB-Corsa-01"}], tb: ["Contrôle segmentation"], mt: ["Vidange 20000km/1an"] }}},
        "Mokka": { "2021-2024": { "1.2 130": { pw: "130 ch", fl: [], tb: [], mt: ["Vidange 20000km/1an"] }}}
    },
    "Peugeot": {
        "208": { 
            "2019-2024": { 
                "1.2 PureTech 100": { pw: "100 ch", fl: [{d: "Courroie humide désintégration", s: "H", r: "Rappel-208-01"}, {d: "Consommation huile", s: "H", r: "NTB-208-02"}], tb: ["Passage courroie sèche", "MAJ gestion huile"], mt: ["Vidange 15000km/1an (0W30)", "Contrôle niveau tous les 5000km"] },
                "1.5 BlueHDi 100": { pw: "100 ch", fl: [{d: "Système AdBlue", s: "M", r: "Rappel-208-03"}], tb: ["Remplacement réservoir AdBlue"], mt: ["Vidange 30000km/2ans"] }
            }
        },
        "308": { "2021-2024": { "1.2 PureTech 130": { pw: "130 ch", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}},
        "3008": { "2020-2024": { "1.6 PureTech 180": { pw: "180 ch", fl: [{d: "Chaîne distribution", s: "H", r: "Rappel-3008-01"}], tb: ["Remplacement chaîne"], mt: ["Vidange 20000km/1an"] }}},
        "e-208": { "2020-2024": { "136ch": { pw: "136 ch Électrique", fl: [], tb: [], mt: ["Liquide frein 3ans"] }}}
    },
    "Porsche": {
        "911": { "2019-2024": { "3.0 450": { pw: "450 ch", fl: [], tb: [], mt: ["Vidange 20000km/1an"] }}},
        "Taycan": { "2019-2024": { "530ch": { pw: "530 ch Électrique", fl: [{d: "Charge DC thermique", s: "M", r: "TSB-Taycan-01"}], tb: ["MAJ gestion thermique"], mt: ["Liquide refroidissement 4ans"] }}},
        "Cayenne": { "2018-2024": { "3.0 340": { pw: "340 ch", fl: [], tb: [], mt: ["Vidange 30000km/2ans"] }}}
    },
    "Renault": {
        "Clio V": { 
            "2019-2024": { 
                "1.0 TCe 90": { pw: "90 ch", fl: [{d: "Consommation huile", s: "H", r: "Rappel-Clio-01"}, {d: "Claquement distribution", s: "M", r: "NTB-Clio-02"}], tb: ["MAJ injection", "Support moteur"], mt: ["Vidange 15000km/1an (5W30)", "Bougies 60000km"] },
                "1.5 Blue dCi 85": { pw: "85 ch", fl: [{d: "EGR et FAP encrassés", s: "M", r: "NTB-Clio-03"}], tb: ["Nettoyage EGR"], mt: ["Vidange 30000km/2ans", "Distribution 150000km"] }
            }
        },
        "Megane E-Tech": { "2022-2024": { "220ch": { pw: "220 ch Électrique", fl: [{d: "Perte puissance charge rapide", s: "M", r: "Rappel-Megane-01"}], tb: ["MAJ BMS"], mt: ["Contrôle HV 2ans"] }}},
        "Austral": { "2023-2024": { "1.2 E-Tech 130": { pw: "130 ch", fl: [{d: "À-coups boîte", s: "M", r: "TSB-Austral-01"}], tb: ["MAJ boîte"], mt: ["Vidange 15000km/1an"] }}},
        "Zoe": { "2019-2024": { "135ch": { pw: "135 ch Électrique", fl: [{d: "Chargeur embarqué", s: "M", r: "TSB-Zoe-01"}], tb: ["Remplacement chargeur"], mt: ["Filtre habitacle 1an"] }}}
    },
    "Rolls-Royce": {
        "Cullinan": { "2018-2024": { "6.75 V12 571": { pw: "571 ch", fl: [], tb: [], mt: ["Vidange 20000km/1an"] }}},
        "Ghost": { "2020-2024": { "6.75 V12 571": { pw: "571 ch", fl: [], tb: [], mt: ["Vidange 20000km/1an"] }}}
    },
    "Seat": {
        "Ibiza": { "2017-2024": { "1.0 TSI 95": { pw: "95 ch", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}},
        "León": { "2020-2024": { "1.5 TSI 150": { pw: "150 ch", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}}
    },
    "Škoda": {
        "Fabia": { "2021-2024": { "1.0 TSI 95": { pw: "95 ch", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}},
        "Octavia": { "2020-2024": { "2.0 TDI 150": { pw: "150 ch", fl: [], tb: [], mt: ["Vidange 30000km/2ans"] }}},
        "Enyaq": { "2021-2024": { "204ch": { pw: "204 ch Électrique", fl: [], tb: [], mt: ["Liquide refroidissement 4ans"] }}}
    },
    "Subaru": {
        "Forester": { "2019-2024": { "2.0 e-Boxer 150": { pw: "150 ch", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}},
        "Outback": { "2020-2024": { "2.5 169": { pw: "169 ch", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}}
    },
    "Suzuki": {
        "Swift": { "2017-2024": { "1.2 83": { pw: "83 ch", fl: [], tb: [], mt: ["Vidange 20000km/1an"] }}},
        "Vitara": { "2019-2024": { "1.4 Boosterjet 129": { pw: "129 ch", fl: [], tb: [], mt: ["Vidange 20000km/1an"] }}}
    },
    "Tesla": {
        "Model 3": { "2021-2024": { "Propulsion 283": { pw: "283 ch Électrique", fl: [{d: "Caméra recul", s: "M", r: "Rappel-Model3-01"}], tb: ["Remplacement caméra"], mt: ["Filtre habitacle 2ans"] }}},
        "Model Y": { "2022-2024": { "Grande Autonomie 382": { pw: "382 ch Électrique", fl: [{d: "Ceinture passager", s: "H", r: "Rappel-ModelY-01"}], tb: ["Remplacement prétensionneur"], mt: ["Filtre HEPA 3ans"] }}},
        "Model S": { "2021-2024": { "Plaid 1020": { pw: "1020 ch Électrique", fl: [], tb: [], mt: ["Liquide refroidissement 4ans"] }}}
    },
    "Toyota": {
        "Yaris": { "2020-2024": { "116h": { pw: "116 ch Hybride", fl: [{d: "Roulement roue AV", s: "L", r: "TSB-Yaris-01"}], tb: ["Vérification roulements"], mt: ["Vidange 15000km/1an", "Contrôle hybride 90000km"] }}},
        "Corolla": { "2019-2024": { "122h": { pw: "122 ch Hybride", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}},
        "RAV4": { "2019-2024": { "218h": { pw: "218 ch Hybride", fl: [{d: "Infiltration eau réservoir", s: "H", r: "Rappel-RAV4-01"}], tb: ["Remplacement bouchon"], mt: ["Vidange 15000km/1an"] }}},
        "bZ4X": { "2022-2024": { "204ch": { pw: "204 ch Électrique", fl: [], tb: [], mt: ["Liquide refroidissement 4ans"] }}}
    },
    "Volkswagen": {
        "Golf VIII": { 
            "2020-2024": { 
                "2.0 TDI 150": { pw: "150 ch", fl: [{d: "Pompe à eau", s: "M", r: "Rappel-Golf-01"}], tb: ["Remplacement thermostat"], mt: ["Vidange 15000km/1an"] },
                "1.5 eTSI 150": { pw: "150 ch", fl: [{d: "Démarreur-générateur", s: "L", r: "TSB-Golf-02"}], tb: ["MAJ système 48V"], mt: ["Vidange 15000km/1an"] }
            }
        },
        "Polo": { "2017-2024": { "1.0 TSI 95": { pw: "95 ch", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}},
        "T-Roc": { "2017-2024": { "1.5 TSI 150": { pw: "150 ch", fl: [], tb: [], mt: ["Vidange 15000km/1an"] }}},
        "ID.3": { "2020-2024": { "204ch": { pw: "204 ch Électrique", fl: [{d: "Écran central", s: "M", r: "TSB-ID3-01"}], tb: ["Remplacement écran"], mt: ["Liquide frein 3ans"] }}},
        "ID.4": { "2021-2024": { "204ch": { pw: "204 ch Électrique", fl: [], tb: [], mt: ["Liquide frein 3ans"] }}}
    },
    "Volvo": {
        "XC40": { "2021-2024": { "T4 190": { pw: "190 ch", fl: [{d: "Assistance freinage", s: "H", r: "Rappel-XC40-01"}], tb: ["MAJ ABS"], mt: ["Vidange 30000km/1an"] }},
        "C40 Recharge": { "2022-2024": { "Twin 408": { pw: "408 ch Électrique", fl: [{d: "Communication CEM", s: "M", r: "TSB-C40-01"}], tb: ["MAJ CEM"], mt: ["Liquide frein 2ans"] }}},
        "XC60": { "2017-2024": { "B5 250": { pw: "250 ch", fl: [], tb: [], mt: ["Vidange 30000km/1an"] }}}
    }
};

// Fonction d'expansion de la base
function expandDatabase() {
    const expanded = {};
    let modelsCount = 0;
    let enginesCount = 0;
    let faultsCount = 0;

    for (const [brand, models] of Object.entries(MEGA_DATABASE)) {
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

window.database = { expandDatabase, MEGA_DATABASE };
