// ===== Utilidades de validación =====
function esPasswordFuerte(pw) {
  const minLen = /.{8,}/;
  const mayus  = /[A-Z]/;
  const numero = /[0-9]/;
  const especial = /[^A-Za-z0-9]/;
  return minLen.test(pw) && mayus.test(pw) && numero.test(pw) && especial.test(pw);
}
function setError(id, msg, errores) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg || '';
  if (msg && errores) errores.push(msg);
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ===== Registro =====
function initRegistro(){
  const form = document.getElementById('form-registro');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    const errores = [];
    // limpiar
    document.querySelectorAll('.error-inline').forEach(el => el.textContent = '');
    const alert = document.getElementById('alert-errores');
    alert.classList.add('d-none'); alert.textContent = '';

    const nombre   = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email    = document.getElementById('email').value.trim();
    const pw1      = document.getElementById('password').value;
    const pw2      = document.getElementById('password2').value;

    if (!nombre)   setError('error-nombre', 'El nombre es obligatorio.', errores);
    if (!apellido) setError('error-apellido', 'El apellido es obligatorio.', errores);
    if (!EMAIL_RE.test(email)) setError('error-email', 'Ingresa un correo válido.', errores);
    if (!esPasswordFuerte(pw1)) setError('error-password', 'Contraseña débil: mín. 8, 1 mayúscula, 1 número y 1 especial.', errores);
    if (pw1 !== pw2) setError('error-password2', 'Las contraseñas no coinciden.', errores);

    if (errores.length) {
      e.preventDefault();
      alert.classList.remove('d-none');
      alert.textContent = 'Por favor corrige: ' + errores.join(' · ');
      // Foco al primer control con error
      const first = document.querySelector('.error-inline:not(:empty)');
      const control = first?.previousElementSibling?.previousElementSibling || first?.previousElementSibling;
      (control && control.focus) && control.focus();
      return;
    }
    
    // localStorage.setItem('usuario', JSON.stringify({ nombre, apellido, email }));
  });
}

// ===== Recuperar contraseña =====
function initRecuperar(){
  const form = document.getElementById('form-recuperar');
  if (!form) return;

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    document.getElementById('error-rec-email').textContent = '';
    const alertErr  = document.getElementById('alert-recuperar');
    const alertOk   = document.getElementById('alert-exito-recuperar');
    alertErr.classList.add('d-none'); alertErr.textContent='';
    alertOk.classList.add('d-none');

    const email = document.getElementById('rec-email').value.trim();
    const errores = [];
    if (!EMAIL_RE.test(email)) {
      setError('error-rec-email', 'Correo inválido.', errores);
    }

    if (errores.length){
      alertErr.classList.remove('d-none');
      alertErr.textContent = 'Por favor corrige: ' + errores.join(' · ');
      return;
    }

    // éxito
    alertOk.classList.remove('d-none');
    form.reset();
  });
}

// ===== Perfil (edición) =====
function initPerfil(){
  const form = document.getElementById('form-perfil');
  if (!form) return;

  // Pre-cargar si hay datos guardados
  try {
    const saved = JSON.parse(localStorage.getItem('usuarioPerfil') || '{}');
    if (saved?.nombre) document.getElementById('pf-nombre').value = saved.nombre;
    if (saved?.apellido) document.getElementById('pf-apellido').value = saved.apellido;
    if (saved?.email) document.getElementById('pf-email').value = saved.email;
  } catch {}

  form.addEventListener('submit', (e)=>{
    e.preventDefault();

    // limpiar
    ['pf-nombre','pf-apellido','pf-email','pf-pass','pf-pass2'].forEach(id=>{
      const span = document.getElementById('error-'+id);
      if (span) span.textContent = '';
    });
    const alertErr = document.getElementById('alert-perfil');
    const alertOk  = document.getElementById('alert-exito-perfil');
    alertErr.classList.add('d-none'); alertErr.textContent='';
    alertOk.classList.add('d-none');

    // valores
    const nombre   = document.getElementById('pf-nombre').value.trim();
    const apellido = document.getElementById('pf-apellido').value.trim();
    const email    = document.getElementById('pf-email').value.trim();
    const pass     = document.getElementById('pf-pass').value;
    const pass2    = document.getElementById('pf-pass2').value;

    const errores = [];
    if (!nombre)   setError('error-pf-nombre','El nombre es obligatorio.', errores);
    if (!apellido) setError('error-pf-apellido','El apellido es obligatorio.', errores);
    if (!EMAIL_RE.test(email)) setError('error-pf-email','Correo inválido.', errores);

    // Cambio de password opcional
    const cambiarPw = pass.length > 0 || pass2.length > 0;
    if (cambiarPw){
      if (!esPasswordFuerte(pass)) setError('error-pf-pass','Contraseña débil: mín. 8, 1 mayúscula, 1 número y 1 especial.', errores);
      if (pass !== pass2) setError('error-pf-pass2','Las contraseñas no coinciden.', errores);
    }

    if (errores.length){
      alertErr.classList.remove('d-none');
      alertErr.textContent = 'Por favor corrige: ' + errores.join(' · ');
      return;
    }

    // Guardar cambios
    localStorage.setItem('usuarioPerfil', JSON.stringify({ nombre, apellido, email }));

    alertOk.classList.remove('d-none');
    document.getElementById('pf-pass').value = '';
    document.getElementById('pf-pass2').value = '';
  });
}

// ===== Inicialización global =====
document.addEventListener('DOMContentLoaded', ()=>{
  initRegistro();
  initRecuperar();
  initPerfil();
});
