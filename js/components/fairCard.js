export function renderFairCard(fair) {
  const isInsidePages = window.location.pathname.includes('/pages/');
  const isDeepLevel = window.location.pathname.includes('/usuario/') || 
                      window.location.pathname.includes('/feriante/') || 
                      window.location.pathname.includes('/organizador/');
  
  const rootPrefix = isDeepLevel ? '../../' : isInsidePages ? '../' : './';
  const pagesPrefix = isDeepLevel ? '../' : isInsidePages ? './' : './pages/';

  const imgSrc = fair.coverImage.startsWith('http') 
    ? fair.coverImage 
    : `${rootPrefix}${fair.coverImage.replace(/^\.\//, '')}`;

  const timeText = fair.time || '16:00';
  const dateText = fair.nextDate ? '17/10' : '17/10';
  const locationText = fair.locationName || 'Rio Cuarto, Cordoba';
  const priceText = fair.price || '10.000$';

  return `
  <article class="bg-white dark:bg-[#182238] rounded-2xl sm:rounded-3xl border border-sand/30 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-200 group">
    <!-- Portada de la Feria -->
    <div class="relative h-44 sm:h-52 w-full overflow-hidden bg-sand/20">
      <img 
        src="${imgSrc}" 
        alt="${fair.name}" 
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        onerror="this.onerror=null; this.src='${rootPrefix}imagenes/banner.jpg';"
      >
      <div class="absolute top-3 right-3 z-10">
        <span class="px-2.5 py-1 text-[11px] font-bold rounded-full bg-slate-900/70 text-white backdrop-blur-xs shadow-xs">
          ${fair.zone || 'Río Cuarto'}
        </span>
      </div>
    </div>

    <!-- Contenido y Metadatos de la Feria -->
    <div class="p-4 sm:p-5 flex-grow flex flex-col justify-between space-y-3">
      <div>
        <h3 class="text-base sm:text-lg font-bold text-[#1E2B55] dark:text-[#A7BFD4] group-hover:text-accent transition-colors font-heading leading-snug">
          <a href="${pagesPrefix}feria.html?id=${fair.id}">
            ${fair.name}
          </a>
        </h3>

        <!-- Fila de iconos: Horario, Fecha, Ubicación -->
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted dark:text-slate-300 mt-2">
          <span class="inline-flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke-width="2"></circle>
              <polyline points="12 6 12 12 16 14" stroke-width="2"></polyline>
            </svg>
            <span>${timeText}</span>
          </span>

          <span class="inline-flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6" stroke-width="2"></line>
              <line x1="8" y1="2" x2="8" y2="6" stroke-width="2"></line>
              <line x1="3" y1="10" x2="21" y2="10" stroke-width="2"></line>
            </svg>
            <span>${dateText}</span>
          </span>

          <span class="inline-flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span>${locationText}</span>
          </span>
        </div>
      </div>

      <!-- Fila inferior: Precio y enlace a ver feriantes -->
      <div class="pt-3 border-t border-sand/30 dark:border-slate-700/60 flex items-center justify-between">
        <span class="text-base sm:text-lg font-black text-[#1E2B55] dark:text-[#A7BFD4] font-heading">
          ${priceText}
        </span>
        <a href="${pagesPrefix}feria.html?id=${fair.id}" class="text-xs sm:text-sm font-bold text-accent hover:text-accent-hover inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          <span>Ver feriantes</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </a>
      </div>
    </div>
  </article>
  `;
}
