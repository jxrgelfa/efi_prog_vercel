import { formatCurrency } from '../utils/formatters.js';
import { cart } from '../services/cart.js';
import { showToast } from './toast.js';

/**
 * Genera el HTML de una tarjeta de producto con diseño artesanal accesible
 */
export function renderProductCard(product, relativePrefix = './') {
  const isInsidePages = window.location.pathname.includes('/pages/');
  const isDeepLevel = window.location.pathname.includes('/usuario/') || 
                      window.location.pathname.includes('/feriante/') || 
                      window.location.pathname.includes('/organizador/');
  
  const rootPrefix = isDeepLevel ? '../../' : isInsidePages ? '../' : './';
  const pagesPrefix = isDeepLevel ? '../' : isInsidePages ? './' : './pages/';
  const resolvedImg = product.image.startsWith('http') ? product.image : `${rootPrefix}${product.image.replace(/^\.\//, '')}`;

  return `
  <article class="card-surface overflow-hidden group flex flex-col justify-between hover:shadow-md transition-all duration-200 border border-sand/40 relative">
    
    <!-- Badges Superiores -->
    <div class="absolute top-3 left-3 z-10 flex flex-col gap-1">
      ${product.isPromoted ? `
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-accent text-white shadow-sm">
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <span>Destacado</span>
        </span>
      ` : ''}
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sand/80 text-ink backdrop-blur-sm shadow-xs">
        ${product.category}
      </span>
    </div>

    <!-- Imagen del Producto -->
    <div class="relative h-48 sm:h-52 overflow-hidden bg-sand/20">
      <img 
        src="${resolvedImg}" 
        alt="${product.name}" 
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        onerror="this.onerror=null; if(this.src.includes('imagenes/')) { this.src=this.src.replace('imagenes/', 'images/'); } else { this.src='${rootPrefix}images/logo.png'; }"
      >
    </div>

    <!-- Contenido y Metadatos -->
    <div class="p-4 sm:p-5 flex-grow flex flex-col justify-between">
      <div>
        <a href="${pagesPrefix}emprendimiento.html?id=${product.merchantId}" class="text-xs text-accent hover:underline font-semibold uppercase tracking-wider block mb-1">
          ${product.merchantName}
        </a>
        <h3 class="text-base sm:text-lg font-bold text-[#1E2B55] dark:text-[#A7BFD4] font-heading line-clamp-2 leading-snug group-hover:text-accent transition-colors">
          <a href="${pagesPrefix}producto.html?id=${product.id}">
            ${product.name}
          </a>
        </h3>
        <p class="text-xs text-ink-muted dark:text-slate-300 line-clamp-2 mt-2 leading-relaxed">
          ${product.description}
        </p>
      </div>

      <!-- Precio y Botón Agregar -->
      <div class="mt-4 pt-3 border-t border-sand/30 dark:border-slate-700/60 flex items-center justify-between">
        <div>
          <span class="text-xs text-ink-light dark:text-slate-400 block font-medium">Precio</span>
          <span class="text-lg sm:text-xl font-extrabold text-[#1E2B55] dark:text-[#A7BFD4] font-heading">
            ${formatCurrency(product.price)}
          </span>
        </div>

        <button 
          type="button"
          data-product-id="${product.id}"
          class="add-to-cart-btn btn-accent px-3.5 py-2 text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
          aria-label="Agregar ${product.name} al carrito">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>Carrito</span>
        </button>
      </div>

    </div>
  </article>
  `;
}

/**
 * Inicializa los eventos de clic en los botones de "Agregar al carrito"
 */
export function attachAddToCartListeners(productsList) {
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const prodId = btn.getAttribute('data-product-id');
      const product = productsList.find(p => p.id === prodId);
      if (product) {
        cart.addItem(product, 1);
        showToast(`Agregaste "${product.name}" al carrito`, 'success');
      }
    });
  });
}
