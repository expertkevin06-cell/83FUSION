window.Auth = {
  CREDS: { admin: "Kevin83600", tiers: "expert83" },
  current: null,
  expected: null,
  
  prompt(role) {
    this.expected = role;
    document.getElementById('pwdTitle').textContent =
      role === 'admin' ? '🔒 Administrateur' : '👁 Accès Tiers';
    document.getElementById('pwdModal').classList.add('active');
    const inp = document.getElementById('pwdInput');
    inp.value = '';
    setTimeout(() => inp.focus(), 100);
  },
  
  close() {
    document.getElementById('pwdModal').classList.remove('active');
    this.expected = null;
  },
  
  validate() {
    const input = document.getElementById('pwdInput').value;
    if (input === this.CREDS[this.expected]) {
      this.current = this.expected;
      this.close();
      UI.loadDashboard();
    } else {
      alert('✗ Mot de passe incorrect');
      document.getElementById('pwdInput').value = '';
    }
  },
  
  logout() {
    if (!confirm('Déconnexion ?')) return;
    this.current = null;
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('loginScreen').classList.add('active');
    Storage.stopAutoSave();
  },
  
  showRequestForm() {
    document.getElementById('requestModal').classList.add('active');
    document.getElementById('reqName').focus();
  },
  
  closeRequest() {
    document.getElementById('requestModal').classList.remove('active');
  },
  
  submitRequest() {
    const name = document.getElementById('reqName').value.trim();
    if (name.length < 2 || name.length > 24) {
      alert('Prénom invalide (2-24 lettres)'); return;
    }
    const requests = JSON.parse(localStorage.getItem('mecadata_requests') || '[]');
    requests.push({
      name, time: Date.now(),
      status: 'pending'
    });
    localStorage.setItem('mecadata_requests', JSON.stringify(requests));
    alert(`✓ Demande envoyée à l'administrateur\nRéponse en temps réel`);
    this.closeRequest();
  },
  
  isAdmin() { return this.current === 'admin'; },
  isTiers() { return this.current === 'tiers'; }
};

// Touche Entrée
document.addEventListener('keypress', e => {
  if (e.key === 'Enter' && document.getElementById('pwdModal').classList.contains('active')) {
    Auth.validate();
  }
});
