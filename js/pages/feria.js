import { renderNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { dataService } from '../services/dataService.js';
import { formatDate } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();

  const container = document.getElementById('fair-detail-container');
  const urlParams = new URLSearchParams(window.location.search);
  const fairId = urlParams.get('id') || 'feria-1';

  const fair = dataService.getFairById(fairId);

  if (!fair) {
    container.innerHTML = `
      <div class="card-surface p-12 text-center space-y-4 max-w-xl mx-auto">
        <h2 class="text-2xl font-bold text-[#1E2B55] dark:text-[#A7BFD4] font-heading">Feria no encontrada</h2>
        <a href="./ferias.html" class="btn-accent inline-block">Volver a ferias</a>
      </div>
    `;
    return;
  }

  document.title = `${fair.name} — FeriaZone`;

  // Resolver rutas de imágenes para páginas ubicadas dentro de /pages/
  const resolveImg = (src, fallback = '../imagenes/banner.jpg') => {
    if (!src) return fallback;
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:') || src.startsWith('blob:')) {
      return src;
    }
    if (src.startsWith('../')) return src;
    return `../${src.replace(/^\.\//, '')}`;
  };

  const coverImgSrc = resolveImg(fair.coverImage, '../imagenes/banner.jpg');
  const merchantsInFair = dataService.getMerchants().filter(m => m.regularFairId === fair.id);
  const fairReviews = dataService.getReviews().fairs.filter(r => r.fairId === fair.id);

  container.innerHTML = `
    <!-- Cabecera -->
    <div class="card-surface overflow-hidden border border-sand/40">
      <div class="h-64 sm:h-80 w-full relative overflow-hidden bg-sand/30">
        <img 
          src="${coverImgSrc}" 
          alt="${fair.name}" 
          class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onerror="this.onerror=null; this.src='../imagenes/banner.jpg';"
        >
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent"></div>
        <div class="absolute bottom-6 left-6 right-6 text-white space-y-2">
          <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent shadow-xs">
            ${fair.zone}
          </span>
          <h1 class="text-2xl sm:text-4xl font-black font-heading text-white !text-white drop-shadow-md">${fair.name}</h1>
          <p class="text-sm sm:text-base text-white/90 drop-shadow-sm">${fair.tagline}</p>
        </div>
      </div>

      <!-- Datos clave -->
      <div class="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div class="space-y-1">
          <span class="text-xs text-ink-light dark:text-slate-400 font-bold uppercase tracking-wider">Ubicación</span>
          <p class="text-sm font-semibold text-ink dark:text-white">${fair.locationName}</p>
        </div>

        <div class="space-y-1">
          <span class="text-xs text-ink-light dark:text-slate-400 font-bold uppercase tracking-wider">Días y Horarios</span>
          <p class="text-sm font-semibold text-accent">${fair.schedule}</p>
        </div>

        <div class="space-y-1">
          <span class="text-xs text-ink-light dark:text-slate-400 font-bold uppercase tracking-wider">Capacidad de Puestos</span>
          <p class="text-sm font-semibold text-ink dark:text-white">${fair.registeredCount} / ${fair.capacity} ocupados</p>
        </div>

      </div>

      <!-- Descripción y servicios -->
      <div class="px-6 pb-6 sm:px-8 sm:pb-8 space-y-4 border-t border-sand/20 pt-4">
        <div>
          <h3 class="text-sm font-bold text-[#1E2B55] dark:text-[#A7BFD4] font-heading uppercase tracking-wider mb-2">Sobre esta feria</h3>
          <p class="text-sm text-ink-muted dark:text-slate-300 leading-relaxed">${fair.description}</p>
        </div>

        <div>
          <h3 class="text-xs font-bold text-[#1E2B55] dark:text-[#A7BFD4] font-heading uppercase tracking-wider mb-2">Servicios disponibles</h3>
          <div class="flex flex-wrap gap-2">
            ${fair.services.map(s => `
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sand/30 dark:bg-slate-800 text-xs text-ink dark:text-sand-light font-medium">
                <svg class="w-3.5 h-3.5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>${s}</span>
              </span>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- MAPA LEAFLET DE LA FERIA -->
    <div class="mt-8 card-surface p-6 space-y-4 border border-sand/40">
      <h3 class="text-xl font-bold text-[#1E2B55] dark:text-[#A7BFD4] font-heading">Ubicación en el Mapa</h3>
      <div id="fair-single-map" class="h-72 sm:h-96 rounded-2xl overflow-hidden z-10 border border-sand/30"></div>
    </div>

    <!-- EMPRENDEDORES PRESENTES -->
    <section class="mt-12 space-y-6">
      <div>
        <h3 class="text-2xl font-bold text-[#1E2B55] dark:text-[#A7BFD4] font-heading">
          Emprendedores inscriptos en esta feria (${merchantsInFair.length})
        </h3>
        <p class="text-xs text-ink-muted dark:text-slate-400">Puestos y artesanos que podés encontrar en este espacio.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        ${merchantsInFair.map(m => {
          const avatarSrc = resolveImg(m.avatar, '../imagenes/logo.png');
          return `
          <div class="card-surface p-4 flex items-center space-x-3 border border-sand/30">
            <img 
              src="${avatarSrc}" 
              alt="${m.name}" 
              class="w-12 h-12 rounded-xl object-cover border border-sand flex-shrink-0"
              onerror="this.onerror=null; this.src='../imagenes/logo.png';"
            >
            <div class="flex-grow">
              <h4 class="font-bold text-sm text-[#1E2B55] dark:text-[#A7BFD4] font-heading leading-tight">${m.name}</h4>
              <span class="text-xs text-accent">${m.category}</span>
              <a href="./emprendimiento.html?id=${m.id}" class="text-[11px] text-primary dark:text-sand-light hover:underline block mt-1">Ver productos →</a>
            </div>
          </div>
          `;
        }).join('')}
      </div>
    </section>

    <!-- RESEÑAS DE LA FERIA -->
    <section class="mt-12 space-y-6">
      <h3 class="text-2xl font-bold text-[#1E2B55] dark:text-[#A7BFD4] font-heading">Reseñas del evento</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${fairReviews.map(r => `
          <div class="card-surface p-4 space-y-2 border border-sand/30">
            <div class="flex items-center justify-between">
              <span class="font-bold text-sm text-ink dark:text-white">${r.author}</span>
              <span class="inline-flex items-center gap-1 text-xs text-accent font-bold">
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span>${r.rating} / 5</span>
              </span>
            </div>
            <p class="text-xs text-ink-muted dark:text-slate-300 leading-relaxed">${r.comment}</p>
            <span class="text-[10px] text-ink-light dark:text-slate-400 block">${formatDate(r.date)}</span>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  // Inicializar Leaflet si la librería cargó
  if (window.L) {
    const map = L.map('fair-single-map').setView([fair.lat, fair.lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(map);

    L.marker([fair.lat, fair.lng])
      .addTo(map)
      .bindPopup(`<b>${fair.name}</b><br>${fair.locationName}`)
      .openPopup();
  }
});
