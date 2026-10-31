import { firebaseConfig, adminEmail } from './firebase-config.js';
const $=s=>document.querySelector(s);
const status=$('#authStatus');
const setStatus=(message,type='')=>{if(status){status.textContent=message;status.className=type==='error'?'error-msg':type==='success'?'success-msg':'';}};
const configured=!!(firebaseConfig.apiKey&&firebaseConfig.authDomain&&firebaseConfig.projectId&&firebaseConfig.appId);
let auth=null,db=null,services=null;
if(!configured){
  const gate=$('#adminGateText');if(gate)gate.textContent='Firebase is not connected yet. Add your Firebase Web App keys in assets/js/firebase-config.js and deploy again.';
  if(status)setStatus('Account features are not activated yet. The administrator must connect Firebase first.','error');
} else {
  try{
    const appSdk=await import('https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js');
    const authSdk=await import('https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js');
    const fsSdk=await import('https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js');
    const app=appSdk.initializeApp(firebaseConfig);auth=authSdk.getAuth(app);db=fsSdk.getFirestore(app);
    services={...authSdk,...fsSdk};window.smarttoolsFirebase={app,auth,db,services,adminEmail};
    const updatesEl=$('#homeUpdates');if(updatesEl){fsSdk.getDocs(fsSdk.query(fsSdk.collection(db,'announcements'),fsSdk.orderBy('createdAt','desc'),fsSdk.limit(4))).then(snap=>{if(!snap.empty)updatesEl.innerHTML=snap.docs.map(d=>`<div class="update-item"><span class="update-dot"></span><div>${escapeHtml(d.data().title||'Update')}<small>${escapeHtml(d.data().details||'')}${d.data().createdAt?.toDate?.()?` · ${d.data().createdAt.toDate().toLocaleDateString()}`:''}</small></div></div>`).join('');}).catch(()=>{});}
    authSdk.onAuthStateChanged(auth,async user=>{
      let isAdmin=false;if(user){await user.reload().catch(()=>{});isAdmin=(user.email||'').toLowerCase()===adminEmail.toLowerCase()&&user.emailVerified;}
      window.smarttoolsUser=user||null;window.smarttoolsIsAdmin=isAdmin;
      const nav=$('#authNavLink');if(nav){nav.textContent=user?'Sign out':'Sign in';nav.href=user?'#signout':'auth.html';nav.onclick=user?(ev=>{ev.preventDefault();authSdk.signOut(auth).then(()=>location.href='index.html');}):null;}
      const signupLink=document.querySelector('.nav-actions a[href="auth.html?mode=signup"]');if(signupLink)signupLink.hidden=!!user;
      const label=$('#topAuthLabel');if(label)label.textContent=user?(isAdmin?'Verified administrator':'Signed in'):'Online tools for everyone';
      window.dispatchEvent(new CustomEvent('smarttools-auth',{detail:{user,isAdmin}}));
    });
    setupForms(auth,authSdk);
  }catch(e){console.error(e);setStatus('Firebase could not initialize. Check your Firebase configuration and network.','error');const g=$('#adminGateText');if(g)g.textContent='Firebase could not initialize. Check the configuration file and network.';}
}
function setupForms(auth,sdk){
  const tabs=[...document.querySelectorAll('[data-auth-tab]')],signIn=$('#signInForm'),signUp=$('#signUpForm');
  if(new URLSearchParams(location.search).get('mode')==='signup')tabs.find(b=>b.dataset.authTab==='signup')?.classList.add('active');if(new URLSearchParams(location.search).get('mode')==='signup'){if(signIn)signIn.hidden=true;if(signUp)signUp.hidden=false;tabs.forEach(b=>b.classList.toggle('active',b.dataset.authTab==='signup'));}
  tabs.forEach(b=>b.addEventListener('click',()=>{tabs.forEach(x=>x.classList.toggle('active',x===b));const signup=b.dataset.authTab==='signup';if(signIn)signIn.hidden=signup;if(signUp)signUp.hidden=!signup;setStatus('');}));
  signIn?.addEventListener('submit',async e=>{e.preventDefault();setStatus('Signing in…');try{await sdk.signInWithEmailAndPassword(auth,$('#signInEmail').value.trim(),$('#signInPassword').value);setStatus('Signed in successfully.','success');setTimeout(()=>location.href='index.html',700);}catch(err){setStatus(err.message,'error');}});
  signUp?.addEventListener('submit',async e=>{e.preventDefault();setStatus('Creating your account…');try{const cred=await sdk.createUserWithEmailAndPassword(auth,$('#signUpEmail').value.trim(),$('#signUpPassword').value);if($('#signUpName').value.trim())await sdk.updateProfile(cred.user,{displayName:$('#signUpName').value.trim()});await sdk.sendEmailVerification(cred.user);setStatus('Account created. Please verify your email using the link we sent before using account features.','success');}catch(err){setStatus(err.message,'error');}});
  $('#resetPassword')?.addEventListener('click',async()=>{const email=$('#signInEmail').value.trim();if(!email)return setStatus('Enter your email address first.','error');try{await sdk.sendPasswordResetEmail(auth,email);setStatus('Password reset email sent.','success');}catch(err){setStatus(err.message,'error');}});
}

function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
