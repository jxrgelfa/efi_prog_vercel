import { dataService } from '../services/dataService.js';

/**
 * Componente Carrusel de Feriantes Destacados estilo "Instagram Stories"
 * Adaptado a la pantalla de cualquier celular (Mobile First) y expandido para Desktop.
 */
export function renderFeaturedMerchants(containerId = 'featured-merchants-container') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isInsidePages = window.location.pathname.includes('/pages/');
  const isDeepLevel = window.location.pathname.includes('/usuario/') || 
                      window.location.pathname.includes('/feriante/') || 
                      window.location.pathname.includes('/organizador/');
  
  const rootPrefix = isDeepLevel ? '../../' : isInsidePages ? '../' : './';
  const pagesPrefix = isDeepLevel ? '../' : isInsidePages ? './' : './pages/';

  // Obtener emprendedores registrados sin repetir ninguno
  const allMerchants = dataService.getMerchants();
  const priorityIds = ['emp-feriando-ando', 'emp-feria-root', 'emp-festival-chic', 'emp-croca-cafe'];

  // Priorizar los feriantes insignia y sumar el resto sin duplicaciones
  const displayList = [
    ...allMerchants.filter(m => priorityIds.includes(m.id)),
    ...allMerchants.filter(m => !priorityIds.includes(m.id))
  ].map(m => {
    const avatar = m.avatar.startsWith('http') 
      ? m.avatar 
      : `${rootPrefix}${m.avatar.replace(/^\.\//, '')}`;
    const fallback = `${rootPrefix}images/logo.png`;
    return {
      id: m.id,
      name: m.name,
      avatar,
      fallback
    };
  });

  const itemsHtml = displayList.map((m) => `
    <a 
      href="${pagesPrefix}emprendimiento.html?id=${m.id}" 
      class="flex-shrink-0 flex flex-col items-center group cursor-pointer text-center select-none w-16 sm:w-20 md:w-24"
      aria-label="Ver perfil de ${m.name}"
    >
      <!-- Anillo exterior con degradado estilo Instagram Story -->
      <div class="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full p-[2.5px] bg-gradient-to-tr from-accent via-sand to-accent group-hover:from-accent group-hover:to-sand-dark transition-all duration-200 shadow-xs group-hover:shadow-md group-hover:scale-105 active:scale-95">
        
        <!-- Contenedor interior con overflow oculto para garantizar la circunferencia perfecta -->
        <div class="w-full h-full rounded-full overflow-hidden bg-white dark:bg-slate-800 p-0.5">
          <img 
            src="${m.avatar}" 
            alt="${m.name}" 
            class="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
            onerror="this.onerror=null; this.src='${m.fallback}';"
            loading="lazy"
          >
        </div>

      </div>

      <!-- Nombre del Feriante (acotado al ancho de la circunferencia) -->
      <span class="mt-1.5 text-[11px] sm:text-xs md:text-sm font-bold text-ink dark:text-slate-100 group-hover:text-accent transition-colors w-full truncate block leading-tight px-0.5">
        ${m.name}
      </span>
    </a>
  `).join('');

  const html = `
  <div class="space-y-3 sm:space-y-4">
    <!-- Encabezado de Sección -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl sm:text-2xl md:text-3xl font-black text-[#1E2B55] dark:text-[#A7BFD4] font-heading tracking-tight">
        Feriantes Destacados
      </h2>
      
      <!-- Controles Desktop para Scroll suave -->
      <div class="hidden sm:flex items-center gap-2">
        <button id="stories-scroll-left" class="w-8 h-8 rounded-full border border-sand/40 dark:border-slate-700 flex items-center justify-center text-ink-muted dark:text-slate-300 hover:text-accent hover:border-accent transition-colors cursor-pointer" aria-label="Desplazar a la izquierda">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <button id="stories-scroll-right" class="w-8 h-8 rounded-full border border-sand/40 dark:border-slate-700 flex items-center justify-center text-ink-muted dark:text-slate-300 hover:text-accent hover:border-accent transition-colors cursor-pointer" aria-label="Desplazar a la derecha">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Carrusel Horizontal Adaptativo a Celulares (Instagram Stories) -->
    <div 
      id="stories-track"
      class="flex items-center gap-3.5 sm:gap-6 md:gap-7 overflow-x-auto py-2 px-1 scroll-smooth no-scrollbar"
      style="-webkit-overflow-scrolling: touch;"
    >
      ${itemsHtml}
    </div>
  </div>
  `;

  container.innerHTML = html;

  // Manejadores para flechas en desktop
  const track = document.getElementById('stories-track');
  document.getElementById('stories-scroll-left')?.addEventListener('click', () => {
    track?.scrollBy({ left: -260, behavior: 'smooth' });
  });
  document.getElementById('stories-scroll-right')?.addEventListener('click', () => {
    track?.scrollBy({ left: 260, behavior: 'smooth' });
  });
}
