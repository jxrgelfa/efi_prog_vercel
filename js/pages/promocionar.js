import { renderNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { auth } from '../services/auth.js';
import { dataService } from '../services/dataService.js';
import { PROMOTION_PACKAGES, ACTIVE_PROMOTIONS } from '../data/promotions.js';
import { formatCurrency } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  if (!auth.requireAuth(['feriante'], '../login.html')) return;

  renderNavbar();
  renderFooter();

  const activeContainer = document.getElementById('active-promos-container');
  const packagesGrid = document.getElementById('packages-cards-grid');

  // Render promociones activas
  if (ACTIVE_PROMOTIONS.length > 0) {
    activeContainer.innerHTML = ACTIVE_PROMOTIONS.map(p => `
      <div class="p-4 rounded-2xl bg-[#E2EBF1] dark:bg-slate-800/60 border border-sand/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent text-white uppercase">Activa</span>
            <span class="font-bold text-sm text-[#1E2B55] dark:text-[#A7BFD4] font-heading">Paquete: ${p.packageId}</span>
          </div>
          <p class="text-xs text-ink-muted dark:text-slate-400">Vigencia: ${p.startDate} al ${p.endDate} · <strong>${p.daysRemaining} días restantes</strong></p>
        </div>

        <div class="flex items-center gap-6 text-xs text-ink dark:text-slate-200">
          <div>
            <span class="text-ink-light block text-[10px]">Visitas antes / durante</span>
            <span class="font-bold">${p.stats.viewsBefore} → <strong class="text-accent">${p.stats.viewsDuring}</strong></span>
          </div>
          <div>
            <span class="text-ink-light block text-[10px]">Consultas WhatsApp</span>
            <span class="font-bold">${p.stats.ordersBefore} → <strong class="text-emerald-600">${p.stats.ordersDuring}</strong></span>
          </div>
        </div>
      </div>
    `).join('');
  } else {
    activeContainer.innerHTML = '<p class="text-xs text-ink-muted">No tenés promociones contratadas actualmente.</p>';
  }

  // Render paquetes para contratar
  packagesGrid.innerHTML = PROMOTION_PACKAGES.map(pkg => `
    <article class="card-surface p-6 flex flex-col justify-between border border-sand/40 hover:shadow-lg transition-all space-y-6">
      <div class="space-y-3">
        <span class="text-xs font-bold text-accent uppercase tracking-wider block">Paquete de Visibilidad</span>
        <h3 class="text-xl font-black text-[#1E2B55] dark:text-[#A7BFD4] font-heading">${pkg.name}</h3>
        <p class="text-xs text-ink-muted dark:text-slate-300 leading-relaxed">${pkg.tagline}</p>
        
        <ul class="space-y-2 text-xs text-ink dark:text-slate-200 pt-2 border-t border-sand/20">
          ${pkg.features.map(f => `
            <li class="flex items-center gap-2">
              <svg class="w-3.5 h-3.5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>${f}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div class="space-y-3 pt-4 border-t border-sand/30">
        <label class="block text-xs font-bold text-ink dark:text-white">Duración y Precio</label>
        <select class="pkg-duration-select w-full px-3.5 py-2 rounded-xl border border-sand/60 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs">
          ${pkg.durations.map(d => `<option value="${d.days}" data-price="${d.price}">${d.days} días — ${formatCurrency(d.price)}</option>`).join('')}
        </select>

        <button data-pkg="${pkg.name}" class="hire-promo-btn btn-accent w-full text-xs py-2.5 font-bold shadow-sm cursor-pointer">
          Contratar Paquete (Simulado)
        </button>
      </div>
    </article>
  `).join('');

  document.querySelectorAll('.hire-promo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pkgName = btn.getAttribute('data-pkg');
      const select = btn.previousElementSibling;
      const days = select.value;
      const price = select.selectedOptions[0].getAttribute('data-price');

      btn.innerHTML = `
        <span class="inline-flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Contratado</span>
        </span>
      `;
      btn.disabled = true;
      btn.classList.replace('btn-accent', 'btn-outline');

      showToast(`¡Contrataste "${pkgName}" por ${days} días (${formatCurrency(price)})! Tu producto ya cuenta con prioridad.`, 'success');
    });
  });
});
