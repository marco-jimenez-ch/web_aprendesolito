function esPasswordFuerte(pw) {
  const minLen = /.{8,}/;
  const mayus = /[A-Z]/;
  const numero = /[0-9]/;
  const especial = /[^A-Za-z0-9]/;
  return minLen.test(pw) && mayus.test(pw) && numero.test(pw) && especial.test(pw);
}

function setError(id, msg, errores) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg || '';
  if (msg && errores) errores.push(msg);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-registro');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    const errores = [];

    // limpiar mensajes anteriores
    document.querySelectorAll('.error-inline').forEach(el => el.textContent = '');
    const alert = document.getElementById('alert-errores');
    alert.classList.add('d-none');
    alert.textContent = '';

    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const email = document.getElementById('email').value.trim();
    const pw1 = document.getElementById('password').value;
    const pw2 = document.getElementById('password2').value;

    if (!nombre) setError('error-nombre', 'El nombre es obligatorio.', errores);
    if (!apellido) setError('error-apellido', 'El apellido es obligatorio.', errores);

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) setError('error-email', 'Ingresa un correo válido.', errores);

    if (!esPasswordFuerte(pw1)) setError('error-password', 'Contraseña débil: mín. 8, 1 mayúscula, 1 número y 1 especial.', errores);
    if (pw1 !== pw2) setError('error-password2', 'Las contraseñas no coinciden.', errores);

    if (errores.length) {
      e.preventDefault();
      alert.classList.remove('d-none');
      alert.textContent = 'Por favor corrige: ' + errores.join(' · ');
      // foco al primer error
      const firstError = document.querySelector('.error-inline:not(:empty)');
      if (firstError) {
        const control = firstError.previousElementSibling?.previousElementSibling || firstError.previousElementSibling;
        (control && control.focus) && control.focus();
      }
    } else {
        
    }
  });
});
