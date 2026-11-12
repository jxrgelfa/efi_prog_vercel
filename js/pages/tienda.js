import { renderNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { renderFeaturedMerchants } from '../components/featuredMerchants.js';
import { dataService } from '../services/dataService.js';
import { renderProductCard, attachAddToCartListeners } from '../components/productCard.js';

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();

  // Renderizar Carrusel estilo Instagram Stories de Feriantes en la Tienda
  renderFeaturedMerchants('featured-merchants-container');

  const allProducts = dataService.getProducts();
  const searchInput = document.getElementById('filter-search');
  const categorySelect = document.getElementById('filter-category');
  const fairSelect = document.getElementById('filter-fair');
  const sortSelect = document.getElementById('filter-sort');
  const clearBtn = document.getElementById('clear-filters-btn');
  const gridContainer = document.getElementById('catalog-products-grid');
  const countLabel = document.getElementById('catalog-count');

  // Si viene con parámetro en URL ?categoria= o ?feria=
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('categoria')) {
    categorySelect.value = urlParams.get('categoria');
  }
  if (urlParams.get('feria')) {
    fairSelect.value = urlParams.get('feria');
  }

  // Elementos de Mostrar / Ocultar Filtros
  const toggleFiltersBtn = document.getElementById('toggle-filters-btn');
  const filtersContent = document.getElementById('filters-content');
  const toggleFiltersText = document.getElementById('toggle-filters-text');
  const toggleFiltersIcon = document.getElementById('toggle-filters-icon');
  const activeFiltersBadge = document.getElementById('active-filters-badge');

  if (toggleFiltersBtn && filtersContent) {
    toggleFiltersBtn.addEventListener('click', () => {
      const isHidden = filtersContent.classList.toggle('hidden');
      toggleFiltersBtn.setAttribute('aria-expanded', String(!isHidden));
      if (toggleFiltersText) {
        toggleFiltersText.textContent = isHidden ? 'Mostrar filtros' : 'Ocultar filtros';
      }
      if (toggleFiltersIcon) {
        toggleFiltersIcon.classList.toggle('rotate-180', isHidden);
      }
    });
  }

  function applyFilters() {
    const query = (searchInput.value || '').trim().toLowerCase();
    const category = categorySelect.value;
    const fair = fairSelect.value;
    const sort = sortSelect.value;

    // Actualizar badge de filtros activos
    let activeFilterCount = 0;
    if (query) activeFilterCount++;
    if (category && category !== 'all') activeFilterCount++;
    if (fair && fair !== 'all') activeFilterCount++;

    if (activeFiltersBadge) {
      if (activeFilterCount > 0) {
        activeFiltersBadge.textContent = `${activeFilterCount} activo${activeFilterCount === 1 ? '' : 's'}`;
        activeFiltersBadge.classList.remove('hidden');
      } else {
        activeFiltersBadge.classList.add('hidden');
      }
    }

    let filtered = allProducts.filter(p => {
      const matchesQuery = !query || 
        p.name.toLowerCase().includes(query) || 
        p.merchantName.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(query)));

      const matchesCategory = category === 'all' || p.category === category;
      const matchesFair = fair === 'all' || p.fairId === fair;

      return matchesQuery && matchesCategory && matchesFair;
    });

    // Ordenamiento
    if (sort === 'promoted-first') {
      filtered.sort((a, b) => (b.isPromoted ? 1 : 0) - (a.isPromoted ? 1 : 0));
    } else if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    countLabel.textContent = `${filtered.length} producto${filtered.length === 1 ? '' : 's'} encontrado${filtered.length === 1 ? '' : 's'}`;

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div class="col-span-full card-surface p-12 text-center space-y-3">
          <div class="w-16 h-16 rounded-2xl bg-sand/30 dark:bg-slate-800 text-primary dark:text-[#A7BFD4] flex items-center justify-center mx-auto shadow-inner">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m1.85-5.65a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-[#1E2B55] dark:text-[#A7BFD4] font-heading">No encontramos productos con esos filtros</h3>
          <p class="text-sm text-ink-muted dark:text-slate-400">Probá modificando las palabras clave o seleccionando otra categoría.</p>
        </div>
      `;
    } else {
      gridContainer.innerHTML = filtered.map(p => renderProductCard(p, '../')).join('');
      attachAddToCartListeners(filtered);
    }
  }

  // Event Listeners
  searchInput.addEventListener('input', applyFilters);
  categorySelect.addEventListener('change', applyFilters);
  fairSelect.addEventListener('change', applyFilters);
  sortSelect.addEventListener('change', applyFilters);

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    categorySelect.value = 'all';
    fairSelect.value = 'all';
    sortSelect.value = 'promoted-first';
    applyFilters();
  });

  applyFilters();
});
