import { storage } from '../services/storage.js';

const STORAGE_KEY = 'fz_theme';

/**
 * Inicializa y sincroniza todos los botones de alternancia de tema (Desktop y Mobile)
 */
export function initThemeToggle() {
  const buttons = document.querySelectorAll('#theme-toggle-btn, #mobile-theme-toggle-btn, .theme-toggle-btn');
  if (!buttons.length) return;

  function syncAllButtons(isDark) {
    buttons.forEach(btn => {
      btn.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      btn.setAttribute('title', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');

      const sunIcons = btn.querySelectorAll('.sun-icon');
      const moonIcons = btn.querySelectorAll('.moon-icon');

      sunIcons.forEach(icon => {
        if (isDark) icon.classList.remove('hidden');
        else icon.classList.add('hidden');
      });

      moonIcons.forEach(icon => {
        if (isDark) icon.classList.add('hidden');
        else icon.classList.remove('hidden');
      });
    });
  }

  const isDarkInitial = document.documentElement.classList.contains('dark');
  syncAllButtons(isDarkInitial);

  buttons.forEach(btn => {
    // Evitar listeners duplicados si se llama más de una vez
    if (btn.dataset.themeBound === 'true') return;
    btn.dataset.themeBound = 'true';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isCurrentlyDark = document.documentElement.classList.contains('dark');
      const willBeDark = !isCurrentlyDark;

      if (willBeDark) {
        document.documentElement.classList.add('dark');
        storage.set(STORAGE_KEY, 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        storage.set(STORAGE_KEY, 'light');
      }

      syncAllButtons(willBeDark);
    });
  });
}
