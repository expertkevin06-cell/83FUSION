// Gestion de l'authentification
const CREDENTIALS = {
    admin: "Kevin83600",
    tiers: "expert83"
};

let currentRole = null;
let expectedRole = null;

function showPasswordPrompt(role) {
    expectedRole = role;
    document.getElementById('modal-title').innerText = 
        role === 'admin' ? 'Authentification Administrateur' : 'Accès Tiers';
    document.getElementById('password-modal').classList.remove('hidden');
    
    const input = document.getElementById('password-input');
    input.value = '';
    input.focus();
}

function closeModal() {
    document.getElementById('password-modal').classList.add('hidden');
    expectedRole = null;
}

function checkPassword() {
    const input = document.getElementById('password-input').value;
    
    if (input === CREDENTIALS[expectedRole]) {
        currentRole = expectedRole;
        closeModal();
        loadDashboard();
    } else {
        alert("Mot de passe incorrect. Le mot de passe résiduel est effacé à chaque lancement.");
        document.getElementById('password-input').value = '';
    }
}

function loadDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    
    const badge = document.getElementById('user-badge');
    const adminControls = document.getElementById('admin-controls');
    
    if (currentRole === 'admin') {
        badge.innerText = 'ADMINISTRATEUR';
        badge.className = 'badge badge-admin';
        adminControls.classList.remove('hidden');
    } else {
        badge.innerText = 'TIERS';
        badge.className = 'badge badge-tiers';
        adminControls.classList.add('hidden');
    }
    
    populateBrands();
    
    // Démarrer la sauvegarde automatique
    window.storage.startAutoSave(manualSave);
}

function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        currentRole = null;
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('login-screen').classList.remove('hidden');
        
        // Réinitialiser les sélecteurs
        document.getElementById('select-brand').innerHTML = '<option value="">Marque</option>';
        document.getElementById('select-model').innerHTML = '<option value="">Modèle</option>';
        document.getElementById('select-year').innerHTML = '<option value="">Année</option>';
        document.getElementById('select-engine').innerHTML = '<option value="">Motorisation</option>';
        
        document.getElementById('vehicle-data').classList.add('hidden');
        document.getElementById('no-data-msg').classList.remove('hidden');
        
        // Arrêter la sauvegarde automatique
        window.storage.stopAutoSave();
    }
}

// Gestion de la touche Entrée
document.getElementById('password-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkPassword();
});

window.auth = {
    showPasswordPrompt,
    closeModal,
    checkPassword,
    logout,
    getCurrentRole: () => currentRole
};
