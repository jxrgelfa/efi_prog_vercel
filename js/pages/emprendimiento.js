import { renderNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { dataService } from '../services/dataService.js';
import { cart } from '../services/cart.js';
import { showToast } from '../components/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Renderizar navbar desktop y pie de página
  renderNavbar('', { desktopOnly: true });
  renderFooter();

  // Sincronizar badges de carrito (desktop y mobile)
  const updateCartBadges = (count) => {
    document.querySelectorAll('#nav-cart-badge, #nav-cart-badge-mobile').forEach(badge => {
      badge.textContent = count;
      if (count > 0) badge.classList.remove('hidden');
      else badge.classList.add('hidden');
    });
  };
  updateCartBadges(cart.getCount());
  cart.onChange((_, count) => updateCartBadges(count));

  // Función para compartir perfil
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Enlace del emprendimiento copiado al portapapeles', 'info');
    } else {
      showToast('URL: ' + window.location.href, 'info');
    }
  };
  document.getElementById('btn-options-menu')?.addEventListener('click', handleShare);

  const container = document.getElementById('merchant-container');
  const urlParams = new URLSearchParams(window.location.search);
  const merchantId = urlParams.get('id') || 'emp-feriando-ando';

  const merchant = dataService.getMerchantById(merchantId);

  if (!merchant) {
    container.innerHTML = `
      <div class="card-surface p-12 text-center space-y-4 max-w-md mx-auto my-12">
        <h2 class="text-2xl font-bold text-[#1E2B55] dark:text-[#A7BFD4]">Emprendimiento no encontrado</h2>
        <p class="text-sm text-ink-muted dark:text-slate-400">El feriante seleccionado no está registrado o no se encuentra activo.</p>
        <a href="./tienda.html" class="btn-accent inline-block text-sm">Ver tienda general</a>
      </div>
    `;
    return;
  }

  // Actualizar título de la pestaña del navegador
  document.title = `${merchant.name} — FeriaZone`;

  // Paleta de marca del feriante
  const theme = merchant.theme || {
    bgBanner: '#FDF0DC',
    bgBody: '#BFE0E2',
    headerBg: '#BFE0E2',
    accent: '#B58120',
    textPrimary: '#1E2B55',
    textMuted: '#506580'
  };

  // En mobile, aplicamos el color de marca a la barra móvil personalizada
  const mobileHeader = document.getElementById('emprendimiento-header');
  if (mobileHeader && theme.headerBg) {
    mobileHeader.style.backgroundColor = theme.headerBg;
  }

  // Resolver rutas de imágenes locales o remotas
  const resolveImg = (src) => {
    if (!src) return '../images/logo.png';
    if (src.startsWith('http')) return src;
    return `../${src.replace(/^\.\//, '')}`;
  };

  const coverSrc = resolveImg(merchant.coverImage);
  const avatarSrc = resolveImg(merchant.avatar);

  // Obtener feria habitual si la tiene
  const fair = merchant.regularFairId ? dataService.getFairById(merchant.regularFairId) : null;

  // Obtener productos asociados a este emprendimiento
  let merchantProducts = dataService.getProducts().filter(p => p.merchantId === merchant.id);
  if (merchantProducts.length === 0) {
    merchantProducts = dataService.getProducts().slice(0, 4);
  }

  // Generar HTML de las tarjetas de producto
  const productsHtml = merchantProducts.map(p => {
    const pImg = resolveImg(p.image);
    return `
      <div class="product-card rounded-2xl overflow-hidden bg-white dark:bg-[#182238] border border-sand/40 dark:border-slate-700/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
        
        <!-- Imagen Cuadrada Superior con enlace a producto -->
        <a href="./producto.html?id=${p.id}" class="aspect-square w-full overflow-hidden bg-sand/10 block relative">
          <img 
            src="${pImg}" 
            alt="${p.name}" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onerror="this.onerror=null; this.src='../images/logo.png';"
          >
        </a>

        <!-- Barra Inferior de Información y Carrito -->
        <div class="p-3.5 bg-white dark:bg-[#182238] flex items-center justify-between gap-2 border-t border-sand/20 dark:border-slate-700/40">
          <div class="pr-1 overflow-hidden">
            <a href="./producto.html?id=${p.id}" class="hover:text-accent transition-colors block">
              <h3 class="font-bold text-xs sm:text-sm text-ink dark:text-white truncate block">
                ${p.name}
              </h3>
            </a>
            <span class="font-black text-xs sm:text-sm text-accent dark:text-sand-light block mt-0.5">
              $${p.price.toLocaleString('es-AR')}
            </span>
          </div>

          <!-- Botón Carrito con Icono SVG (0 emojis) -->
          <button 
            type="button"
            class="add-to-cart-btn flex-shrink-0 w-9 h-9 rounded-xl bg-sand/20 dark:bg-slate-700 text-ink dark:text-white hover:bg-accent hover:text-white active:scale-90 transition-all cursor-pointer flex items-center justify-center"
            data-product-id="${p.id}"
            aria-label="Agregar ${p.name} al carrito"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </button>
        </div>

      </div>
    `;
  }).join('');

  // Limpiar número de teléfono para enlace de WhatsApp
  const cleanPhone = (merchant.phone || '+54 9 358 412-3456').replace(/[^0-9]/g, '');
  const cleanInstagram = (merchant.instagram || '@feriandoando').replace('@', '');

  // Renderizar layout moderno, contenido y sin franjas laterales invasivas
  container.innerHTML = `
    <!-- 1. BREADCRUMBS -->
    <nav class="hidden sm:flex items-center space-x-2 text-xs text-ink-light dark:text-slate-400 mb-6 font-medium">
      <a href="../index.html" class="hover:text-accent transition-colors">Inicio</a>
      <span>/</span>
      <a href="./ferias.html" class="hover:text-accent transition-colors">Feriantes</a>
      <span>/</span>
      <span class="text-ink dark:text-white font-semibold truncate">${merchant.name}</span>
    </nav>

    <!-- 2. TARJETA PRINCIPAL DEL EMPRENDIMIENTO (HERO PROFILE CARD) -->
    <div class="card-surface overflow-hidden shadow-sm border border-sand/40 dark:border-slate-700/60 rounded-2xl sm:rounded-3xl mb-10">
      
      <!-- BANNER ILUSTRATIVO / DE MARCA (100% Despejado, sin elementos superpuestos que se pisen) -->
      <div class="w-full h-56 sm:h-68 md:h-76 flex items-center justify-center p-4 sm:p-6 transition-colors overflow-hidden" style="background-color: ${theme.bgBanner || '#FDF0DC'};">
        <img 
          src="${coverSrc}" 
          alt="${merchant.name}" 
          class="w-full h-full max-h-48 sm:max-h-56 md:max-h-64 ${merchant.theme?.bgBanner ? 'object-contain' : 'object-cover'} select-none transition-transform duration-300 hover:scale-105"
        >
      </div>

      <!-- INFORMACIÓN DEL FERIANTE Y BOTONES DE CONTACTO -->
      <div class="p-6 sm:p-8 bg-white dark:bg-[#182238] transition-colors">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          
          <!-- LADO IZQUIERDO: BADGES + IDENTIDAD + DETALLES -->
          <div class="space-y-2.5 text-center md:text-left flex-1">
            
            <!-- ETIQUETAS / BADGES (Fluyen naturalmente sin chocarse ni pisarse) -->
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
              <!-- Categoría -->
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sand/30 dark:bg-slate-800 text-ink dark:text-sand-light border border-sand/40">
                <svg class="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                <span>${merchant.category}</span>
              </span>

              <!-- Feria habitual si existe -->
              ${fair ? `
                <a href="./feria.html?id=${fair.id}" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent dark:text-sand-light hover:underline border border-accent/25 transition-colors">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>${fair.name}</span>
                </a>
              ` : ''}

              <!-- Estado Verificado -->
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                <span>Verificado</span>
              </span>
            </div>

            <!-- Título del Emprendimiento -->
            <h1 class="text-2xl sm:text-3xl font-black font-heading tracking-tight text-[#1E2B55] dark:text-[#A7BFD4]">
              ${merchant.name}
            </h1>

            <!-- Metadatos: Artesano, Barrio y Puntuación -->
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-xs sm:text-sm text-ink-muted dark:text-slate-400">
              ${merchant.artisanName ? `<span>Por <strong class="text-ink dark:text-slate-200">${merchant.artisanName}</strong></span>` : ''}
              ${merchant.artisanName && merchant.neighborhood ? `<span>•</span>` : ''}
              ${merchant.neighborhood ? `<span>Barrio ${merchant.neighborhood}</span>` : ''}
              <span>•</span>
              <div class="flex items-center gap-1 text-amber-500 font-bold">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <span>${merchant.rating.toFixed(1)}</span>
                <span class="text-ink-light dark:text-slate-500 font-normal">(${merchant.reviewsCount} reseñas)</span>
              </div>
            </div>

            <!-- Biografía / Descripción -->
            <p class="text-xs sm:text-sm text-ink-muted dark:text-slate-300 leading-relaxed pt-1 max-w-xl mx-auto md:mx-0">
              ${merchant.bio}
            </p>
          </div>

          <!-- LADO DERECHO: ACCIONES Y CONTACTO -->
          <div class="flex flex-col sm:flex-row md:flex-col items-center justify-center md:items-end gap-2.5 flex-shrink-0 w-full sm:w-auto pt-2 md:pt-0">
            <!-- WhatsApp -->
            <a 
              href="https://wa.me/${cleanPhone}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition-all"
            >
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.772.82 2.791.82 3.182 0 5.768-2.587 5.769-5.766.001-3.182-2.585-5.769-5.769-5.769zm3.39 8.163c-.143.404-.73.74-1.02.778-.29.038-.636.088-2.074-.509-1.724-.716-2.827-2.483-2.913-2.599-.086-.116-.7-1.018-.7-1.942 0-.924.475-1.381.65-1.571.175-.19.382-.238.51-.238.128 0 .257 0 .37.006.12.006.277-.046.434.331.157.377.538 1.312.585 1.408.047.095.078.209.016.333-.063.124-.094.201-.188.312-.094.111-.198.248-.282.333-.095.095-.194.199-.083.39.111.19.493.813 1.057 1.315.727.647 1.341.848 1.531.943.19.095.302.08.414-.047.112-.128.477-.557.604-.748.127-.19.255-.158.428-.095.174.064 1.103.52 1.293.616.19.095.318.143.365.222.047.08.047.461-.096.865z"/></svg>
              <span>WhatsApp</span>
            </a>

            <!-- Instagram -->
            <a 
              href="https://instagram.com/${cleanInstagram}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#C13584] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition-all"
            >
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              <span>Instagram</span>
            </a>

            <!-- Compartir -->
            <button 
              id="btn-share-profile" 
              type="button" 
              class="btn-outline w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs sm:text-sm py-2 px-4 cursor-pointer"
            >
              <svg class="w-4 h-4 text-ink-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
              <span>Compartir</span>
            </button>
          </div>

        </div>

        <!-- CINTA DE BENEFICIOS / VALORES ARTESANALES -->
        <div class="mt-6 pt-6 border-t border-sand/30 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="flex items-center gap-2.5 text-xs text-ink dark:text-slate-200">
            <span class="w-8 h-8 rounded-lg bg-sand/30 dark:bg-slate-800 flex items-center justify-center text-accent flex-shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </span>
            <span class="font-medium">100% Producción Artesanal Local</span>
          </div>
          <div class="flex items-center gap-2.5 text-xs text-ink dark:text-slate-200">
            <span class="w-8 h-8 rounded-lg bg-sand/30 dark:bg-slate-800 flex items-center justify-center text-accent flex-shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </span>
            <span class="font-medium">${fair ? `Puesto en ${fair.name}` : `Atención en Río Cuarto`}</span>
          </div>
          <div class="flex items-center gap-2.5 text-xs text-ink dark:text-slate-200">
            <span class="w-8 h-8 rounded-lg bg-sand/30 dark:bg-slate-800 flex items-center justify-center text-accent flex-shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            </span>
            <span class="font-medium">Trato Directo con el Productor</span>
          </div>
        </div>
      </div>

    </div>

    <!-- 3. SECCIÓN DE PRODUCTOS -->
    <section class="mt-8 mb-16">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold font-heading text-[#1E2B55] dark:text-[#A7BFD4]">
            Productos de ${merchant.name}
          </h2>
          <p class="text-xs sm:text-sm text-ink-muted dark:text-slate-400">
            Artesanías y creaciones locales disponibles para pedir ahora
          </p>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-bold bg-sand/30 dark:bg-slate-800 text-ink dark:text-sand-light border border-sand/40">
          ${merchantProducts.length} productos
        </span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        ${productsHtml}
      </div>
    </section>
  `;

  // Asignar listeners
  document.getElementById('btn-share-profile')?.addEventListener('click', handleShare);

  const cartButtons = container.querySelectorAll('.add-to-cart-btn');
  cartButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.getAttribute('data-product-id');
      const prod = merchantProducts.find(p => p.id === pId);
      if (prod) {
        cart.addItem(prod, 1);
        showToast(`"${prod.name}" agregado al carrito`, 'success');
      }
    });
  });
});

