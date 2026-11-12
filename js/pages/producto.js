import { renderNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { dataService } from '../services/dataService.js';
import { formatCurrency, formatDate } from '../utils/formatters.js';
import { cart } from '../services/cart.js';
import { showToast } from '../components/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();

  const container = document.getElementById('product-detail-container');
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'prod-1';

  const product = dataService.getProductById(productId);

  if (!product) {
    container.innerHTML = `
      <div class="card-surface p-12 text-center space-y-4 max-w-xl mx-auto">
        <div class="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-[#1E2B55] dark:text-[#A7BFD4] font-heading">Producto no encontrado</h2>
        <p class="text-sm text-ink-muted dark:text-slate-300">El producto que estás buscando no existe o fue dado de baja por el feriante.</p>
        <a href="./tienda.html" class="btn-accent inline-block">Volver a la Tienda</a>
      </div>
    `;
    return;
  }

  const merchant = dataService.getMerchantById(product.merchantId);
  const fair = dataService.getFairById(product.fairId);
  const reviews = dataService.getReviews().products.filter(r => r.productId === product.id);

  // Armar mensaje directo de WhatsApp
  const whatsappMsg = encodeURIComponent(
    `¡Hola ${merchant ? merchant.name : ''}! Vi en FeriaZone tu producto "${product.name}" (${formatCurrency(product.price)}) y quería consultar disponibilidad para coordinar la compra.`
  );
  const whatsappUrl = merchant ? `https://wa.me/${merchant.phone.replace(/[^0-9]/g, '')}?text=${whatsappMsg}` : '#';

  container.innerHTML = `
    <!-- Migas de pan (Breadcrumb) -->
    <nav class="flex items-center space-x-2 text-xs text-ink-light dark:text-slate-400 mb-6">
      <a href="../index.html" class="hover:text-accent">Inicio</a>
      <span>/</span>
      <a href="./tienda.html" class="hover:text-accent">Tienda</a>
      <span>/</span>
      <span class="text-[#1E2B55] dark:text-[#A7BFD4] font-medium truncate max-w-xs">${product.name}</span>
    </nav>

    <!-- Ficha Principal de Producto -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      
      <!-- Columna Izquierda: Imagen y Badges -->
      <div class="lg:col-span-6 space-y-4">
        <div class="relative rounded-3xl overflow-hidden bg-sand/20 border border-sand/40 dark:border-slate-800 shadow-md">
          <img 
            src="${product.image.startsWith('http') ? product.image : `../${product.image.replace(/^\.\//, '')}`}" 
            alt="${product.name}" 
            class="w-full h-80 sm:h-[450px] object-cover"
            onerror="this.onerror=null; if(this.src.includes('imagenes/')) { this.src=this.src.replace('imagenes/', 'images/'); } else { this.src='../images/logo.png'; }"
          >
          ${product.isPromoted ? `
            <span class="absolute top-4 left-4 bg-accent text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-md inline-flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span>Producto Destacado</span>
            </span>
          ` : ''}
        </div>
      </div>

      <!-- Columna Derecha: Información y Acciones -->
      <div class="lg:col-span-6 space-y-6 flex flex-col justify-between">
        <div class="space-y-4">
          
          <!-- Categoría y Feriante -->
          <div class="flex items-center justify-between">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-sand/60 text-ink dark:bg-slate-800 dark:text-sand-light">
              ${product.category}
            </span>
            <span class="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>Stock disponible: ${product.stock} unidades</span>
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E2B55] dark:text-[#A7BFD4] font-heading leading-tight">
            ${product.name}
          </h1>

          <!-- Precio -->
          <div class="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-sand/30 flex items-center justify-between shadow-xs">
            <div>
              <span class="text-xs text-ink-light dark:text-slate-400 block font-medium">Precio en pesos</span>
              <span class="text-3xl font-extrabold text-accent font-heading">
                ${formatCurrency(product.price)}
              </span>
            </div>
            <span class="text-xs text-ink-muted dark:text-slate-300">Sin comisiones agregadas</span>
          </div>

          <!-- Descripción completa -->
          <div class="space-y-2">
            <h3 class="text-sm font-bold text-[#1E2B55] dark:text-[#A7BFD4] font-heading uppercase tracking-wider">Descripción del producto</h3>
            <p class="text-sm sm:text-base text-ink-muted dark:text-slate-300 leading-relaxed">
              ${product.description}
            </p>
          </div>

          <!-- Selector de cantidad y Botón Carrito -->
          <div class="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <div class="flex items-center border border-sand/60 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 p-1 w-full sm:w-36 justify-between">
              <button id="qty-minus" class="w-10 h-10 flex items-center justify-center font-bold text-ink dark:text-white hover:bg-sand/30 rounded-lg text-lg cursor-pointer">-</button>
              <span id="qty-value" class="font-bold text-ink dark:text-white px-2">1</span>
              <button id="qty-plus" class="w-10 h-10 flex items-center justify-center font-bold text-ink dark:text-white hover:bg-sand/30 rounded-lg text-lg cursor-pointer">+</button>
            </div>

            <button id="detail-add-cart-btn" class="btn-accent w-full sm:flex-grow text-base py-3 shadow-md cursor-pointer">
              Agregar al Carrito
            </button>
          </div>

          <!-- Botón de Contacto por WhatsApp -->
          <div>
            <a href="${whatsappUrl}" target="_blank" class="w-full inline-flex items-center justify-center min-h-[44px] px-5 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm gap-2">
              <svg class="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.772.82 2.791.82 3.182 0 5.768-2.587 5.769-5.766.001-3.182-2.585-5.769-5.769-5.769zm3.39 8.163c-.143.404-.73.74-1.02.778-.29.038-.636.088-2.074-.509-1.724-.716-2.827-2.483-2.913-2.599-.086-.116-.7-1.018-.7-1.942 0-.924.475-1.381.65-1.571.175-.19.382-.238.51-.238.128 0 .257 0 .37.006.12.006.277-.046.434.331.157.377.538 1.312.585 1.408.047.095.078.209.016.333-.063.124-.094.201-.188.312-.094.111-.198.248-.282.333-.095.095-.194.199-.083.39.111.19.493.813 1.057 1.315.727.647 1.341.848 1.531.943.19.095.302.08.414-.047.112-.128.477-.557.604-.748.127-.19.255-.158.428-.095.174.064 1.103.52 1.293.616.19.095.318.143.365.222.047.08.047.461-.096.865z"/>
              </svg>
              <span>Encargar directo al Feriante por WhatsApp</span>
            </a>
          </div>

        </div>

        <!-- Tarjeta del Emprendedor Asociado -->
        ${merchant ? `
          <div class="card-surface p-4 border border-sand/40 flex items-center justify-between gap-4 mt-6">
            <div class="flex items-center space-x-3">
              <img src="${merchant.avatar}" alt="${merchant.name}" class="w-12 h-12 rounded-xl object-cover border border-sand">
              <div>
                <span class="text-xs text-ink-light dark:text-slate-400">Elaborado por</span>
                <h4 class="font-bold text-sm text-[#1E2B55] dark:text-[#A7BFD4] font-heading">${merchant.name}</h4>
                <p class="text-xs text-accent">${merchant.neighborhood}</p>
              </div>
            </div>
            <a href="./emprendimiento.html?id=${merchant.id}" class="btn-outline text-xs py-2 px-3">
              Ver perfil
            </a>
          </div>
        ` : ''}

        <!-- Feria de retiro habitual -->
        ${fair ? `
          <div class="p-3.5 rounded-xl bg-white/70 dark:bg-slate-800 text-xs text-ink dark:text-slate-300 flex items-center gap-2 border border-sand/30">
            <svg class="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h18l-2 9H5L3 3zm0 9l2 9h14l2-9M9 21V12m6 9V12"></path>
            </svg>
            <span>Retiro habitual en: <strong>${fair.name}</strong> (${fair.schedule})</span>
          </div>
        ` : ''}

      </div>
    </div>

    <!-- SECCIÓN DE RESEÑAS -->
    <section class="mt-16 pt-12 border-t border-sand/30 dark:border-slate-800 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-2xl font-bold text-[#1E2B55] dark:text-[#A7BFD4] font-heading">Opiniones de compradores</h3>
          <p class="text-xs text-ink-muted dark:text-slate-400">Reseñas de vecinos que ya probaron este producto.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${reviews.length > 0 ? reviews.map(r => `
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
        `).join('') : `
          <p class="col-span-full text-sm text-ink-muted">Aún no hay reseñas para este producto. ¡Sé el primero en dejar una al comprar!</p>
        `}
      </div>
    </section>
  `;

  // Control de cantidad
  let currentQty = 1;
  const qtyValue = document.getElementById('qty-value');
  const minusBtn = document.getElementById('qty-minus');
  const plusBtn = document.getElementById('qty-plus');

  minusBtn?.addEventListener('click', () => {
    if (currentQty > 1) {
      currentQty--;
      qtyValue.textContent = currentQty;
    }
  });

  plusBtn?.addEventListener('click', () => {
    if (currentQty < product.stock) {
      currentQty++;
      qtyValue.textContent = currentQty;
    } else {
      showToast('Alcanzaste el límite de stock disponible', 'error');
    }
  });

  // Agregar al carrito
  document.getElementById('detail-add-cart-btn')?.addEventListener('click', () => {
    cart.addItem(product, currentQty);
    showToast(`Agregaste ${currentQty} unidad(es) de "${product.name}" al carrito`, 'success');
  });
});
