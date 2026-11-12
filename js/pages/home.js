import { renderNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { renderHeroCarousel } from '../components/heroCarousel.js';
import { renderFeaturedMerchants } from '../components/featuredMerchants.js';
import { dataService } from '../services/dataService.js';
import { renderProductCard, attachAddToCartListeners } from '../components/productCard.js';
import { renderFairCard } from '../components/fairCard.js';
import { initScrollAnimations } from '../utils/formatters.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inyectar Navbar y Footer
  renderNavbar();
  renderFooter();

  // 2. Renderizar Componente Hero Carrusel (Mobile-First + Desktop)
  renderHeroCarousel('hero-carousel-container');

  // 3. Renderizar Componente Feriantes Destacados (Estilo Instagram Stories)
  renderFeaturedMerchants('featured-merchants-container');

  // 4. Cargar Próximas Ferias (Tarjetas según diseño de Figma)
  const allFairs = dataService.getFairs();
  const fairsContainer = document.getElementById('home-fairs-grid');
  if (fairsContainer) {
    fairsContainer.innerHTML = allFairs.slice(0, 3).map(f => renderFairCard(f)).join('');
  }

  // 5. Cargar productos destacados para la sección complementaria
  const allProducts = dataService.getProducts();
  const featuredProducts = allProducts.filter(p => p.isPromoted).slice(0, 4);
  const productsContainer = document.getElementById('home-featured-products');
  if (productsContainer) {
    if (featuredProducts.length > 0) {
      productsContainer.innerHTML = featuredProducts.map(p => renderProductCard(p)).join('');
      attachAddToCartListeners(allProducts);
    } else {
      productsContainer.innerHTML = '<p class="col-span-full text-center text-sm text-ink-muted">No hay productos destacados activos en este momento.</p>';
    }
  }

  // 6. Iniciar animaciones de entrada suaves
  initScrollAnimations();
});
