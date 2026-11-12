import { auth } from '../services/auth.js';
import { cart } from '../services/cart.js';
import { initThemeToggle } from './themeToggle.js';

/**
 * Componente Navbar responsive Mobile-First y Desktop simétrico
 * Basado en las referencias de diseño de FeriaZone (Figma)
 * - Desktop: Links a la izquierda (FERIAS, FERIANTES, CONTACTO, NOSOTROS),
 *   logo únicamente en el centro, acciones a la derecha.
 * - Mobile: Logo a la izquierda, y a la derecha: Lupa SVG, Modo Oscuro SVG,
 *   Bolsa de compras SVG y Menú Hamburguesa SVG.
 * - Menú hamburguesa: 100% libre de emojis, íconos SVG de trazo limpio.
 */
export function renderNavbar(currentPath = '', options = {}) {
  const user = auth.getCurrentUser();
  const cartCount = cart.getCount();

  const isInsidePages = window.location.pathname.includes('/pages/');
  const isDeepLevel = window.location.pathname.includes('/usuario/') || 
                      window.location.pathname.includes('/feriante/') || 
                      window.location.pathname.includes('/organizador/');
  
  const rootPrefix = isDeepLevel ? '../../' : isInsidePages ? '../' : './';
  const pagesPrefix = isDeepLevel ? '../' : isInsidePages ? './' : './pages/';

  let panelLink = '';
  if (user) {
    if (user.role === 'usuario') panelLink = `${pagesPrefix}usuario/index.html`;
    else if (user.role === 'feriante') panelLink = `${pagesPrefix}feriante/index.html`;
    else if (user.role === 'organizador') panelLink = `${pagesPrefix}organizador/index.html`;
  }

  const placeholder = document.getElementById('navbar-placeholder');
  const isDesktopOnly = options.desktopOnly || (placeholder && placeholder.dataset.desktopOnly === 'true');
  const headerClass = isDesktopOnly
    ? 'hidden md:block sticky top-0 z-40 bg-[#E2EBF1]/95 dark:bg-[#121A2C]/95 backdrop-blur-md text-ink dark:text-white border-b border-sand/30 dark:border-slate-800 transition-colors shadow-xs'
    : 'sticky top-0 z-40 bg-[#E2EBF1]/95 dark:bg-[#121A2C]/95 backdrop-blur-md text-ink dark:text-white border-b border-sand/30 dark:border-slate-800 transition-colors shadow-xs';

  const html = `
  <header class="${headerClass}">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- BARRA PRINCIPAL -->
      <div class="flex items-center justify-between h-16 sm:h-20">
        
        <!-- ============================================== -->
        <!-- VISTA DESKTOP: LINKS IZQUIERDA (FERIAS, TIENDA, CONTACTO, NOSOTROS) -->
        <!-- ============================================== -->
        <nav class="hidden md:flex items-center space-x-6 lg:space-x-8 flex-1 justify-start">
          <a href="${rootPrefix}index.html" class="text-xs lg:text-sm font-bold tracking-wider text-ink dark:text-slate-100 hover:text-accent transition-colors font-heading uppercase">
            Inicio
          </a>
          <a href="${pagesPrefix}ferias.html" class="text-xs lg:text-sm font-bold tracking-wider text-ink dark:text-slate-100 hover:text-accent transition-colors font-heading uppercase">
            Ferias
          </a>
          <a href="${pagesPrefix}tienda.html" class="text-xs lg:text-sm font-bold tracking-wider text-ink dark:text-slate-100 hover:text-accent transition-colors font-heading uppercase">
            Tienda
          </a>
          <a href="${pagesPrefix}contacto.html" class="text-xs lg:text-sm font-bold tracking-wider text-ink dark:text-slate-100 hover:text-accent transition-colors font-heading uppercase">
            Contacto
          </a>
          <a href="${pagesPrefix}nosotros.html" class="text-xs lg:text-sm font-bold tracking-wider text-ink dark:text-slate-100 hover:text-accent transition-colors font-heading uppercase">
            Nosotros
          </a>
        </nav>

        <!-- ============================================== -->
        <!-- LOGO CENTRAL (Únicamente en el centro)          -->
        <!-- ============================================== -->
        <div class="flex items-center justify-center flex-shrink-0">
          <a href="${rootPrefix}index.html" class="flex items-center group" aria-label="Ir al inicio">
            <div class="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-white dark:bg-slate-800 border-2 border-sand/50 shadow-sm group-hover:scale-105 transition-transform">
              <img 
                src="${rootPrefix}imagenes/logo.png" 
                alt="Logo" 
                class="w-full h-full object-cover"
                onerror="this.onerror=null; this.src='${rootPrefix}images/logo.png';"
              >
            </div>
          </a>
        </div>

        <!-- ============================================== -->
        <!-- VISTA DESKTOP: ACCIONES DERECHA (LUPA, MODO OSCURO, CARRITO, AUTH) -->
        <!-- ============================================== -->
        <div class="hidden md:flex items-center space-x-4 lg:space-x-5 flex-1 justify-end">
          
          <!-- Botón de Búsqueda (Lupa SVG) -->
          <button id="desktop-search-toggle-btn" 
                  class="inline-flex items-center justify-center w-10 h-10 rounded-full text-ink-muted dark:text-slate-300 hover:text-accent hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  aria-label="Abrir buscador">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M21 21l-4.35-4.35m1.85-5.65a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"></path>
            </svg>
          </button>

          <!-- Botón de Modo Oscuro SVG Desktop -->
          <button id="theme-toggle-btn"
                  class="theme-toggle-btn inline-flex items-center justify-center w-10 h-10 rounded-full text-ink-muted dark:text-slate-300 hover:text-accent hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  aria-label="Alternar tema">
            <svg class="sun-icon w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5" stroke-width="2"></circle>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
            </svg>
            <svg class="moon-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
          </button>

          <!-- Carrito con Badge -->
          <a href="${pagesPrefix}carrito.html" 
             class="relative inline-flex items-center justify-center w-10 h-10 rounded-full text-ink-muted dark:text-slate-300 hover:text-accent hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
             aria-label="Ver carrito de compras">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <span id="nav-cart-badge" class="${cartCount > 0 ? '' : 'hidden'} absolute -top-1 -right-1 bg-accent text-white font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-xs">
              ${cartCount}
            </span>
          </a>

          <!-- Auth Desktop: Iniciar Sesion / Registrarse o Usuario -->
          ${user ? `
            <div class="flex items-center space-x-2 pl-3 border-l border-sand/40 dark:border-slate-700">
              <a href="${panelLink}" class="flex items-center space-x-2 py-1 px-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                <img src="${user.avatar}" alt="${user.name}" class="w-8 h-8 rounded-full object-cover border border-sand">
                <span class="text-xs font-bold leading-tight uppercase font-heading">${user.name.split(' ')[0]}</span>
              </a>
              <button id="nav-logout-btn" title="Cerrar sesión" class="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-rose-500/10 text-rose-500 text-xs transition-colors" aria-label="Cerrar sesión">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </button>
            </div>
          ` : `
            <div class="flex items-center space-x-4 pl-3 border-l border-sand/40 dark:border-slate-700">
              <a href="${pagesPrefix}login.html" class="text-xs font-bold tracking-wider text-ink dark:text-slate-100 hover:text-accent font-heading uppercase transition-colors">
                Iniciar Sesion
              </a>
              <a href="${pagesPrefix}registro.html" class="text-xs font-bold tracking-wider text-accent dark:text-sand-light hover:underline font-heading uppercase transition-colors">
                Registrarse
              </a>
            </div>
          `}
        </div>

        <!-- ============================================== -->
        <!-- VISTA MOBILE: LUPA + MODO OSCURO + BOLSA + MENÚ -->
        <!-- ============================================== -->
        <div class="flex md:hidden items-center space-x-1 sm:space-x-1.5">
          
          <!-- 1. Icono SVG Lupa -->
          <button id="mobile-search-toggle-btn" 
                  class="inline-flex items-center justify-center w-10 h-10 rounded-xl text-ink dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  aria-label="Buscar en FeriaZone">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M21 21l-4.35-4.35m1.85-5.65a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"></path>
            </svg>
          </button>

          <!-- 2. Botón Modo Oscuro SVG (Justo entre la lupa y la bolsa de compras) -->
          <button id="mobile-theme-toggle-btn" 
                  class="theme-toggle-btn inline-flex items-center justify-center w-10 h-10 rounded-xl text-ink dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  aria-label="Alternar modo oscuro">
            <svg class="sun-icon w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5" stroke-width="2"></circle>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
            </svg>
            <svg class="moon-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
          </button>

          <!-- 3. Bolsa de compras Mobile -->
          <a href="${pagesPrefix}carrito.html" 
             class="relative inline-flex items-center justify-center w-10 h-10 rounded-xl text-ink dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
             aria-label="Ver carrito">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <span id="nav-cart-badge-mobile" class="${cartCount > 0 ? '' : 'hidden'} absolute top-1 right-1 bg-accent text-white font-bold text-[10px] rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
              ${cartCount}
            </span>
          </a>

          <!-- 4. Botón Menú Hamburguesa Mobile -->
          <button id="mobile-menu-btn" 
                  class="inline-flex items-center justify-center w-10 h-10 rounded-xl text-ink dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  aria-label="Abrir menú de navegación"
                  aria-expanded="false">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

        </div>

      </div>

      <!-- ============================================== -->
      <!-- BARRA DE BÚSQUEDA DESPLEGABLE (Mobile y Desktop) -->
      <!-- ============================================== -->
      <div id="nav-search-bar" class="hidden py-3 border-t border-sand/30 dark:border-slate-800 transition-all">
        <form id="nav-search-form" action="${pagesPrefix}tienda.html" method="GET" class="relative max-w-xl mx-auto flex items-center">
          <input 
            type="search" 
            name="q" 
            id="nav-search-input"
            placeholder="Buscar artesanías, mates, ferias, o feriantes..." 
            class="w-full pl-11 pr-24 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-sand/50 dark:border-slate-700 text-sm text-ink dark:text-white placeholder-ink-light focus:ring-2 focus:ring-accent shadow-inner"
          >
          <div class="absolute left-3.5 text-ink-light">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m1.85-5.65a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"></path>
            </svg>
          </div>
          <button type="submit" class="absolute right-1.5 px-4 py-1.5 rounded-full bg-accent text-white text-xs font-bold hover:bg-accent-hover transition-colors">
            Buscar
          </button>
        </form>
      </div>

    </div>

    <!-- ============================================== -->
    <!-- MENÚ MÓVIL DESPLEGABLE (100% SVG - 0 EMOJIS)    -->
    <!-- ============================================== -->
    <div id="mobile-menu" class="hidden md:hidden border-t border-sand/30 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg px-6 pt-4 pb-8 space-y-3 shadow-xl">
      <div class="flex items-center justify-between pb-3 border-b border-sand/20 dark:border-slate-800">
        <span class="text-xs font-bold uppercase tracking-wider text-accent font-heading">Navegación</span>
        <span class="text-xs font-medium text-ink-muted dark:text-slate-400">Río Cuarto, Cba</span>
      </div>

      <nav class="space-y-1">
        <!-- Inicio -->
        <a href="${rootPrefix}index.html" class="group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-semibold text-ink dark:text-white hover:bg-sand/20 dark:hover:bg-slate-800 transition-colors">
          <span>Inicio</span>
          <svg class="w-5 h-5 text-accent group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
        </a>

        <!-- Ferias -->
        <a href="${pagesPrefix}ferias.html" class="group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-semibold text-ink dark:text-white hover:bg-sand/20 dark:hover:bg-slate-800 transition-colors">
          <span>Ferias</span>
          <svg class="w-5 h-5 text-accent group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18l-1.5 6.5a2.5 2.5 0 01-5 0 2.5 2.5 0 01-5 0 2.5 2.5 0 01-5 0L3 3zm1 7v11h16V10M9 21v-6h6v6"></path>
          </svg>
        </a>

        <!-- Tienda -->
        <a href="${pagesPrefix}tienda.html" class="group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-semibold text-ink dark:text-white hover:bg-sand/20 dark:hover:bg-slate-800 transition-colors">
          <span>Tienda</span>
          <svg class="w-5 h-5 text-accent group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
        </a>

        <!-- Mapa de Ferias -->
        <a href="${pagesPrefix}mapa.html" class="group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-semibold text-ink dark:text-white hover:bg-sand/20 dark:hover:bg-slate-800 transition-colors">
          <span>Mapa de Ferias</span>
          <svg class="w-5 h-5 text-accent group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
          </svg>
        </a>

        <!-- Sumar mi Puesto / Planes -->
        <a href="${pagesPrefix}planes.html" class="group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-semibold text-ink dark:text-white hover:bg-sand/20 dark:hover:bg-slate-800 transition-colors">
          <span>Sumar mi Puesto / Planes</span>
          <svg class="w-5 h-5 text-accent group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96l-5.96-5.96m0 0A6 6 0 012.25 14.25h4.8m2.58-5.84L4.5 19.5l4.8-1.5"></path>
          </svg>
        </a>

        <!-- Contacto -->
        <a href="${pagesPrefix}contacto.html" class="group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-semibold text-ink dark:text-white hover:bg-sand/20 dark:hover:bg-slate-800 transition-colors">
          <span>Contacto</span>
          <svg class="w-5 h-5 text-accent group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </a>

        <!-- Nosotros -->
        <a href="${pagesPrefix}nosotros.html" class="group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-semibold text-ink dark:text-white hover:bg-sand/20 dark:hover:bg-slate-800 transition-colors">
          <span>Nosotros</span>
          <svg class="w-5 h-5 text-accent group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </a>
      </nav>

      <!-- Auth Mobile -->
      <div class="pt-4 border-t border-sand/30 dark:border-slate-800 space-y-2">
        ${user ? `
          <div class="flex items-center justify-between p-3 rounded-2xl bg-sand/20 dark:bg-slate-800">
            <div class="flex items-center gap-3">
              <img src="${user.avatar}" alt="${user.name}" class="w-10 h-10 rounded-full object-cover border border-sand">
              <div>
                <p class="text-sm font-bold text-ink dark:text-white">${user.name}</p>
                <a href="${panelLink}" class="text-xs text-accent font-semibold hover:underline">Ir a mi Panel (${user.role}) →</a>
              </div>
            </div>
            <button id="mobile-logout-btn" class="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-500 font-bold bg-rose-500/10 rounded-lg hover:bg-rose-500/20 transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span>Salir</span>
            </button>
          </div>
        ` : `
          <div class="grid grid-cols-2 gap-3 pt-2">
            <a href="${pagesPrefix}login.html" class="btn-outline text-center text-sm py-2.5 font-bold">
              Iniciar Sesión
            </a>
            <a href="${pagesPrefix}registro.html" class="btn-accent text-center text-sm py-2.5 font-bold shadow-sm">
              Registrarse
            </a>
          </div>
        `}
      </div>
    </div>
  </header>
  `;

  // Montar en el placeholder o al inicio del body
  if (placeholder) {
    placeholder.outerHTML = html;
  } else {
    const existing = document.querySelector('header');
    if (existing) {
      existing.outerHTML = html;
    } else {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      document.body.prepend(wrapper.firstElementChild);
    }
  }

  // Inicializar handlers de modo oscuro sincronizados (desktop y mobile)
  initThemeToggle();

  // Toggle menú mobile hamburguesa
  const menuBtn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      const isHidden = menu.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', !isHidden);
    });
  }

  // Toggle barra de búsqueda (Lupa SVG)
  const searchBar = document.getElementById('nav-search-bar');
  const searchInput = document.getElementById('nav-search-input');
  const toggleSearch = () => {
    if (searchBar) {
      const isHidden = searchBar.classList.toggle('hidden');
      if (!isHidden && searchInput) {
        searchInput.focus();
      }
    }
  };

  document.getElementById('mobile-search-toggle-btn')?.addEventListener('click', toggleSearch);
  document.getElementById('desktop-search-toggle-btn')?.addEventListener('click', toggleSearch);

  // Logout
  const handleLogout = () => {
    auth.logout();
    window.location.reload();
  };
  document.getElementById('nav-logout-btn')?.addEventListener('click', handleLogout);
  document.getElementById('mobile-logout-btn')?.addEventListener('click', handleLogout);

  // Sincronizar badge de carrito en vivo
  cart.onChange((items, count) => {
    const desktopBadge = document.getElementById('nav-cart-badge');
    const mobileBadge = document.getElementById('nav-cart-badge-mobile');
    
    [desktopBadge, mobileBadge].forEach(badge => {
      if (badge) {
        badge.textContent = count;
        if (count > 0) badge.classList.remove('hidden');
        else badge.classList.add('hidden');
      }
    });
  });

  // Asegurar favicon en la pestaña / tabulador del navegador si no está presente
  if (!document.querySelector('link[rel*="icon"]')) {
    const iconLink = document.createElement('link');
    iconLink.rel = 'icon';
    iconLink.type = 'image/png';
    iconLink.href = `${rootPrefix}images/logo.png`;
    document.head.appendChild(iconLink);
  }
}

