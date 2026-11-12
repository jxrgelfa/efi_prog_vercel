import { renderNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { auth } from '../services/auth.js';
import { showToast } from '../components/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();

  // Redirigir según rol
  function redirectByRole(role) {
    if (role === 'usuario') window.location.href = './usuario/index.html';
    else if (role === 'feriante') window.location.href = './feriante/index.html';
    else if (role === 'organizador') window.location.href = './organizador/index.html';
    else window.location.href = '../index.html';
  }

  // Demo Vecino
  document.getElementById('demo-user-btn')?.addEventListener('click', () => {
    const res = auth.loginAsDemo('usuario');
    if (res.success) {
      showToast(`Sesión iniciada como Vecino (${res.user.name})`, 'success');
      setTimeout(() => redirectByRole('usuario'), 400);
    }
  });

  // Demo Feriante
  document.getElementById('demo-merchant-btn')?.addEventListener('click', () => {
    const res = auth.loginAsDemo('feriante');
    if (res.success) {
      showToast(`Sesión iniciada como Feriante (${res.user.name})`, 'success');
      setTimeout(() => redirectByRole('feriante'), 400);
    }
  });

  // Demo Organizador
  document.getElementById('demo-org-btn')?.addEventListener('click', () => {
    const res = auth.loginAsDemo('organizador');
    if (res.success) {
      showToast(`Sesión iniciada como Organizador (${res.user.name})`, 'success');
      setTimeout(() => redirectByRole('organizador'), 400);
    }
  });

  // Login manual
  document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const res = auth.login(email);
    if (res.success) {
      showToast(`Bienvenido de nuevo, ${res.user.name}`, 'success');
      setTimeout(() => redirectByRole(res.user.role), 400);
    } else {
      showToast('Correo no registrado en la demo. Usá los botones de acceso rápido.', 'error');
    }
  });

  // Olvidaste tu contraseña
  document.getElementById('forgot-pass-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    if (email) {
      showToast(`Enlace de restablecimiento enviado a ${email}`, 'info');
    } else {
      showToast('Ingresá tu correo arriba para recuperar el acceso.', 'info');
    }
  });
});
