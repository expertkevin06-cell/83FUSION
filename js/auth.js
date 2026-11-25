window.Auth={
  CREDS:{admin:'Kevin83600',tiers:'expert83'},
  current:null,expected:null,fails:0,
  prompt:function(role){
    this.expected=role;
    document.getElementById('pwdTitle').textContent=role==='admin'?'🔒 Administrateur':'👁 Accès Tiers';
    document.getElementById('pwdError').textContent='';
    document.getElementById('pwdModal').classList.add('active');
    var i=document.getElementById('pwdInput');
    i.value='';
    setTimeout(function(){i.focus();},120);
  },
  close:function(){
    document.getElementById('pwdModal').classList.remove('active');
    this.expected=null;
  },
  validate:function(){
    var inp=document.getElementById('pwdInput');
    var val=(inp.value||'').trim();
    var role=this.expected;
    if(!role){this.close();return;}
    if(val===this.CREDS[role]){
      this.current=role;this.fails=0;this.close();
      console.log('✓ Auth OK → '+role);
      try{UI.loadDashboard();}catch(e){console.error('loadDashboard:',e);alert('Erreur : '+e.message);}
    }else{
      this.fails++;
      document.getElementById('pwdError').textContent='✗ Mot de passe incorrect (essai '+this.fails+'). Vérifiez majuscules/espaces.';
      inp.value='';inp.focus();
    }
  },
  logout:function(){
    if(!confirm('Déconnexion ?'))return;
    this.current=null;
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('loginScreen').classList.add('active');
    Storage.stopAutoSave();
  },
  showRequestForm:function(){
    document.getElementById('requestModal').classList.add('active');
    setTimeout(function(){document.getElementById('reqName').focus();},120);
  },
  closeRequest:function(){document.getElementById('requestModal').classList.remove('active');},
  submitRequest:function(){
    var n=(document.getElementById('reqName').value||'').trim();
    if(n.length<2||n.length>24){alert('Prénom invalide (2-24 lettres)');return;}
    var r=Storage.getRequests();
    r.push({name:n,time:Date.now(),status:'pending'});
    Storage.setRequests(r);
    alert('✓ Demande envoyée à l\'administrateur');
    this.closeRequest();
  },
  isAdmin:function(){return this.current==='admin';}
};

/* Touche Entrée dans modal */
document.addEventListener('keydown',function(e){
  if(e.key==='Enter'&&document.getElementById('pwdModal').classList.contains('active')){
    e.preventDefault();Auth.validate();
  }
});
