import { SITE_CONFIG } from '../config/site.js';

export function renderFooter() {
  const isInsidePages = window.location.pathname.includes('/pages/');
  const isDeepLevel = window.location.pathname.includes('/usuario/') || 
                      window.location.pathname.includes('/feriante/') || 
                      window.location.pathname.includes('/organizador/');
  
  const rootPrefix = isDeepLevel ? '../../' : isInsidePages ? '../' : './';
  const pagesPrefix = isDeepLevel ? '../' : isInsidePages ? './' : './pages/';

  const html = `
  <footer class="bg-primary-dark dark:bg-slate-950 text-slate-300 border-t border-sand/20 mt-16 pt-12 pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        
        <!-- Columna 1: Marca y Propósito -->
        <div class="space-y-4">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-full overflow-hidden bg-white/10 flex items-center justify-center p-0.5 border border-sand/40">
              <img src="${rootPrefix}imagenes/logo.png" alt="Logo" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='${rootPrefix}images/logo.png';">
            </div>
            <span class="text-2xl font-black text-white font-heading tracking-tight">
              FERIA<span class="text-accent">ZONE</span>
            </span>
          </div>
          <p class="text-sm text-sand-light leading-relaxed">
            ${SITE_CONFIG.slogan}. Uniendo el trabajo de artesanos y productores con los vecinos de nuestra ciudad.
          </p>
          <div class="pt-2 text-xs text-sand">
            <p class="font-semibold text-white">Examen Final Integrador 2026</p>
            <p>Programación II · Opción 7</p>
          </div>
        </div>

        <!-- Columna 2: Enlaces Rápidos -->
        <div>
          <h4 class="text-white font-bold text-base mb-4 font-heading border-b border-sand/20 pb-2">Navegación</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="${rootPrefix}index.html" class="hover:text-accent transition-colors">Inicio</a></li>
            <li><a href="${pagesPrefix}tienda.html" class="hover:text-accent transition-colors">Tienda</a></li>
            <li><a href="${pagesPrefix}ferias.html" class="hover:text-accent transition-colors">Guía de Ferias</a></li>
            <li><a href="${pagesPrefix}mapa.html" class="hover:text-accent transition-colors">Mapa y Cercanía</a></li>
            <li><a href="${pagesPrefix}planes.html" class="hover:text-accent transition-colors">Planes y Promociones</a></li>
            <li><a href="${pagesPrefix}nosotros.html" class="hover:text-accent transition-colors">Quiénes Somos (Equipo)</a></li>
          </ul>
        </div>

        <!-- Columna 3: Información de Contacto -->
        <div>
          <h4 class="text-white font-bold text-base mb-4 font-heading border-b border-sand/20 pb-2">Sede y Contacto</h4>
          <ul class="space-y-3 text-sm">
            <li class="flex items-start space-x-2.5">
              <svg class="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>${SITE_CONFIG.address}</span>
            </li>
            <li class="flex items-center space-x-2.5">
              <svg class="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <a href="${SITE_CONFIG.whatsappUrl}" target="_blank" class="hover:text-white transition-colors">
                ${SITE_CONFIG.phone}
              </a>
            </li>
            <li class="flex items-center space-x-2.5">
              <svg class="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <a href="mailto:${SITE_CONFIG.email}" class="hover:text-white transition-colors">
                ${SITE_CONFIG.email}
              </a>
            </li>
            <li class="pt-2">
              <a href="${SITE_CONFIG.feedbackUrl}" target="_blank" class="inline-flex items-center text-xs text-accent hover:underline font-medium">
                <span>Completar Formulario de Feedback</span>
                <span class="ml-1">↗</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Columna 4: Redes Sociales -->
        <div>
          <h4 class="text-white font-bold text-base mb-4 font-heading border-b border-sand/20 pb-2">Comunidad</h4>
          <p class="text-xs text-sand-light mb-4">Seguí las novedades de las ferias de Río Cuarto en nuestras redes oficiales:</p>
          <div class="flex flex-wrap gap-2">
            <a href="${SITE_CONFIG.social.instagram.url}" target="_blank" class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors">
              Instagram
            </a>
            <a href="${SITE_CONFIG.social.facebook.url}" target="_blank" class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors">
              Facebook
            </a>
            <a href="${SITE_CONFIG.social.tiktok.url}" target="_blank" class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors">
              TikTok
            </a>
            <a href="${SITE_CONFIG.social.youtube.url}" target="_blank" class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors">
              YouTube
            </a>
            <a href="${SITE_CONFIG.social.linkedin.url}" target="_blank" class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors">
              LinkedIn
            </a>
          </div>
        </div>

      </div>

      <div class="border-t border-sand/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand">
        <p>© 2026 FeriaZone · Trabajo Práctico EFI · Río Cuarto, Córdoba, Argentina</p>
        <p class="text-sand/80">Desarrollado para la materia Programación II</p>
      </div>
    </div>
  </footer>
  `;

  const placeholder = document.getElementById('footer-placeholder');
  if (placeholder) {
    placeholder.outerHTML = html;
  }
}
