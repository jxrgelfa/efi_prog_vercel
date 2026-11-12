import { renderNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { auth } from '../services/auth.js';
import { showToast } from '../components/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();

  let selectedRole = 'usuario'; // Rol por defecto: "Quiero comprar"

  const cards = document.querySelectorAll('[data-role-card]');

  function updateCardSelection(role) {
    selectedRole = role;

    cards.forEach((card) => {
      const cardRole = card.getAttribute('data-role-card');
      const isSelected = cardRole === selectedRole;
      const indicator = card.querySelector('.radio-indicator');
      const dot = card.querySelector('.radio-dot');

      card.setAttribute('aria-checked', isSelected);

      if (isSelected) {
        card.className = 'role-card bg-white/95 dark:bg-slate-800 border-2 border-primary ring-2 ring-primary/30 rounded-2xl p-4 sm:p-4.5 flex items-center justify-between cursor-pointer transition-all duration-200 select-none shadow-sm';
        if (indicator) {
          indicator.className = 'radio-indicator flex-shrink-0 w-6 h-6 rounded-full border-2 border-primary bg-white flex items-center justify-center transition-all';
        }
        if (dot) dot.classList.remove('hidden');
      } else {
        card.className = 'role-card bg-[#E2EBF1]/60 dark:bg-slate-800/80 hover:bg-[#E2EBF1] dark:hover:bg-slate-800 border-2 border-transparent rounded-2xl p-4 sm:p-4.5 flex items-center justify-between cursor-pointer transition-all duration-200 select-none shadow-2xs';
        if (indicator) {
          indicator.className = 'radio-indicator flex-shrink-0 w-6 h-6 rounded-full border-2 border-slate-400 bg-white flex items-center justify-center transition-all';
        }
        if (dot) dot.classList.add('hidden');
      }
    });
  }

  // Inicializar estado visual con "usuario" seleccionado
  updateCardSelection('usuario');

  // Asignar listeners a cada tarjeta
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const role = card.getAttribute('data-role-card');
      if (role) updateCardSelection(role);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const role = card.getAttribute('data-role-card');
        if (role) updateCardSelection(role);
      }
    });
  });

  // Toggle de campos personalizados
  const toggleBtn = document.getElementById('toggle-custom-fields-btn');
  const customFields = document.getElementById('custom-fields');
  if (toggleBtn && customFields) {
    toggleBtn.addEventListener('click', () => {
      customFields.classList.toggle('hidden');
    });
  }

  // Manejar acción "Continuar"
  document.getElementById('btn-continuar')?.addEventListener('click', () => {
    const customName = document.getElementById('reg-custom-name')?.value?.trim();
    const customEmail = document.getElementById('reg-custom-email')?.value?.trim();

    const roleTitles = {
      usuario: 'Vecino Comprador',
      feriante: 'Feriante Productor',
      organizador: 'Organizador de Ferias'
    };

    const res = auth.register({
      role: selectedRole,
      name: customName || undefined,
      email: customEmail || undefined
    });

    if (res.success) {
      showToast(`¡Cuenta creada con éxito como ${roleTitles[selectedRole]}!`, 'success');

      setTimeout(() => {
        if (selectedRole === 'usuario') {
          window.location.href = './usuario/index.html';
        } else if (selectedRole === 'feriante') {
          window.location.href = './feriante/index.html';
        } else if (selectedRole === 'organizador') {
          window.location.href = './organizador/index.html';
        } else {
          window.location.href = '../index.html';
        }
      }, 500);
    }
  });
});
