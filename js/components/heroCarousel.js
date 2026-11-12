/**
 * Componente Hero Carrusel Full-Width Edge-to-Edge (Mobile First y Desktop)
 * Ocupa el 100% del ancho de la pantalla sin cortes ni márgenes.
 * Incluye flechas semi-transparentes (50%-70%), 4 indicadores y overlay con metadatos.
 */

const HERO_SLIDES = [
  {
    image: 'imagenes/ferias/feria_parque_sarmiento.jpg',
    fallbackImage: 'images/ferias/feria_parque_sarmiento.jpg',
    badge: 'Gratis',
    titleMobile: 'Feria del Parque',
    titleDesktop: 'Feria del Parque Sarmiento',
    date: '17/10',
    location: 'Banda Norte',
    link: './pages/feria.html?id=feria-1'
  },
  {
    image: 'imagenes/ferias/feria_andino.jpg',
    fallbackImage: 'images/ferias/feria_andino.jpg',
    badge: 'Cultural',
    titleMobile: 'Feria del Andino',
    titleDesktop: 'Centro Cultural del Andino',
    date: '17/10',
    location: 'Rio Cuarto, Cordoba',
    link: './pages/feria.html?id=feria-2'
  },
  {
    image: 'imagenes/ferias/mercado_urbano.jpg',
    fallbackImage: 'images/ferias/mercado_urbano.jpg',
    badge: 'Artesanal',
    titleMobile: 'Mercado Urbano',
    titleDesktop: 'Mercado Urbano El Andino',
    date: '17/10',
    location: 'Costanera Sur',
    link: './pages/feria.html?id=feria-3'
  },
  {
    image: 'imagenes/ferias/plaza_roca.jpg',
    fallbackImage: 'images/ferias/plaza_roca.jpg',
    badge: 'Urbana',
    titleMobile: 'Plaza Roca Emprende',
    titleDesktop: 'Paseo Plaza Roca Emprende',
    date: '18/10',
    location: 'Centro',
    link: './pages/feria.html?id=feria-4'
  }
];

export function renderHeroCarousel(containerId = 'hero-carousel-container') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const slidesHtml = HERO_SLIDES.map((slide, index) => `
    <div class="hero-slide absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}" data-slide-index="${index}">
      
      <!-- Imagen de Fondo Full-Width -->
      <img 
        src="${slide.image}" 
        alt="${slide.titleDesktop}" 
        class="w-full h-full object-cover select-none"
        onerror="this.onerror=null; this.src='${slide.fallbackImage}';"
      >

      <!-- Capa de Gradiente que abarca el 100% del ancho para máxima legibilidad -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15 select-none"></div>

      <!-- Contenedor de Textos y Componentes superpuestos (alineado a la cuadrícula de la página) -->
      <div class="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12 flex flex-col justify-between pointer-events-none">
        
        <!-- Fila Superior: Badge "Gratis" -->
        <div class="flex items-center justify-between pointer-events-auto">
          <span class="inline-block px-3.5 py-1 rounded-full bg-white text-ink font-black text-xs tracking-wider uppercase shadow-md">
            ${slide.badge}
          </span>
        </div>

        <!-- Fila Inferior: Título a la izquierda, Fecha y Ubicación a la derecha -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-3 text-white pb-6 md:pb-2 pointer-events-auto">
          
          <!-- Título de la Feria -->
          <div class="space-y-1">
            <h2 class="block md:hidden text-2xl sm:text-3xl font-black font-heading leading-tight drop-shadow-lg text-white !text-white">
              ${slide.titleMobile}
            </h2>
            <h2 class="hidden md:block text-3xl lg:text-5xl font-black font-heading leading-tight drop-shadow-lg text-white !text-white">
              ${slide.titleDesktop}
            </h2>
          </div>

          <!-- Componente Fecha (Calendario) y Ubicación (Pin) -->
          <div class="flex items-center md:flex-col md:items-end gap-4 md:gap-1 text-white drop-shadow-md">
            
            <!-- Fecha con icono SVG de Calendario -->
            <div class="flex items-center gap-2 font-heading font-extrabold text-lg sm:text-2xl md:text-3xl tracking-tight">
              <span>${slide.date}</span>
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2.2"></rect>
                <line x1="16" y1="2" x2="16" y2="6" stroke-width="2.2"></line>
                <line x1="8" y1="2" x2="8" y2="6" stroke-width="2.2"></line>
                <line x1="3" y1="10" x2="21" y2="10" stroke-width="2.2"></line>
              </svg>
            </div>

            <!-- Ubicación con icono SVG de Pin de Mapa -->
            <div class="flex items-center gap-1.5 text-xs sm:text-sm md:text-base font-semibold text-white/95">
              <span>${slide.location}</span>
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>

          </div>

        </div>

      </div>

    </div>
  `).join('');

  // 4 Puntos blancos indicadores de cantidad
  const dotsHtml = HERO_SLIDES.map((_, index) => `
    <button 
      type="button" 
      class="hero-dot ${index === 0 ? 'w-6 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'} h-2.5 rounded-full transition-all duration-300 shadow-sm cursor-pointer" 
      data-dot-index="${index}"
      aria-label="Ir a diapositiva ${index + 1}"
    ></button>
  `).join('');

  const html = `
  <!-- Contenedor Full-Width (100% de la pantalla sin bordes redondeados ni márgenes laterales) -->
  <div class="relative w-full h-[300px] sm:h-[400px] md:h-[480px] lg:h-[560px] xl:h-[620px] overflow-hidden group select-none">
    
    <!-- Contenedor de Diapositivas -->
    <div id="hero-slides-wrapper" class="relative w-full h-full">
      ${slidesHtml}
    </div>

    <!-- Flecha Izquierda (Semi-transparente 50%-70%) -->
    <button 
      id="hero-prev-btn"
      type="button"
      class="absolute left-3 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-black/55 text-white/80 hover:text-white hover:bg-black/80 opacity-60 hover:opacity-100 transition-all duration-200 backdrop-blur-xs border border-white/20 shadow-lg cursor-pointer active:scale-95"
      aria-label="Diapositiva anterior"
    >
      <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path>
      </svg>
    </button>

    <!-- Flecha Derecha (Semi-transparente 50%-70%) -->
    <button 
      id="hero-next-btn"
      type="button"
      class="absolute right-3 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-black/55 text-white/80 hover:text-white hover:bg-black/80 opacity-60 hover:opacity-100 transition-all duration-200 backdrop-blur-xs border border-white/20 shadow-lg cursor-pointer active:scale-95"
      aria-label="Diapositiva siguiente"
    >
      <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path>
      </svg>
    </button>

    <!-- Indicadores de posición (4 puntos blancos) -->
    <div class="absolute bottom-3.5 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
      ${dotsHtml}
    </div>

  </div>
  `;

  container.innerHTML = html;

  // Lógica interactiva del carrusel
  let currentIndex = 0;
  const totalSlides = HERO_SLIDES.length;
  const slideElements = container.querySelectorAll('.hero-slide');
  const dotElements = container.querySelectorAll('.hero-dot');
  let autoPlayTimer = null;

  function updateCarousel(newIndex) {
    currentIndex = (newIndex + totalSlides) % totalSlides;

    slideElements.forEach((slide, idx) => {
      if (idx === currentIndex) {
        slide.classList.remove('opacity-0', 'pointer-events-none', 'z-0');
        slide.classList.add('opacity-100', 'z-10');
      } else {
        slide.classList.remove('opacity-100', 'z-10');
        slide.classList.add('opacity-0', 'pointer-events-none', 'z-0');
      }
    });

    dotElements.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.className = 'hero-dot w-6 h-2.5 rounded-full bg-white transition-all duration-300 shadow-sm cursor-pointer';
      } else {
        dot.className = 'hero-dot w-2.5 h-2.5 rounded-full bg-white/50 hover:bg-white/80 transition-all duration-300 shadow-sm cursor-pointer';
      }
    });
  }

  function nextSlide() {
    updateCarousel(currentIndex + 1);
  }

  function prevSlide() {
    updateCarousel(currentIndex - 1);
  }

  function resetAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(nextSlide, 5000);
  }

  document.getElementById('hero-next-btn')?.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });

  document.getElementById('hero-prev-btn')?.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
  });

  dotElements.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      updateCarousel(idx);
      resetAutoPlay();
    });
  });

  // Soporte de Swipe táctil en Mobile
  let touchStartX = 0;
  let touchEndX = 0;
  const wrapper = container.querySelector('#hero-slides-wrapper');
  if (wrapper) {
    wrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 40) {
      if (swipeDistance < 0) nextSlide();
      else prevSlide();
      resetAutoPlay();
    }
  }

  resetAutoPlay();
}
