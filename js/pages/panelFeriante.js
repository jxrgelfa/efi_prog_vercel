import { renderNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { auth } from '../services/auth.js';
import { dataService } from '../services/dataService.js';
import { formatCurrency } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  // Guard de rol feriante
  if (!auth.requireAuth(['feriante'], '../login.html')) return;

  renderNavbar();
  renderFooter();

  const user = auth.getCurrentUser();
  const merchantId = user.merchantId || 'emp-1';
  const merchant = dataService.getMerchantById(merchantId);

  // Render cabecera
  document.getElementById('merchant-title').textContent = merchant ? merchant.name : user.name;
  document.getElementById('merchant-details').textContent = `${merchant ? merchant.artisanName : user.name} · ${merchant ? merchant.neighborhood : 'Río Cuarto'}`;
  document.getElementById('merchant-avatar').src = merchant ? merchant.avatar : user.avatar;

  const planBadge = document.getElementById('merchant-plan-badge');
  const isPlanBasico = user.plan === 'basico';
  planBadge.textContent = isPlanBasico ? 'Plan Básico (Hasta 15)' : 'Plan Pro (Ilimitado)';

  const modal = document.getElementById('product-modal');
  const modalTitle = document.getElementById('modal-title');
  const form = document.getElementById('product-crud-form');
  const tbody = document.getElementById('merchant-products-tbody');
  const metricCount = document.getElementById('metric-prod-count');

  function renderTable() {
    const allProducts = dataService.getProducts();
    const myProducts = allProducts.filter(p => p.merchantId === merchantId);

    metricCount.textContent = myProducts.length;

    if (myProducts.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="p-6 text-center text-ink-muted">No tenés productos cargados todavía. Agregá el primero con el botón superior.</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = myProducts.map(p => `
      <tr class="hover:bg-sand/10 dark:hover:bg-slate-800/50 transition-colors">
        <td class="p-3.5">
          <div class="flex items-center space-x-3">
            <img src="${p.image}" alt="${p.name}" class="w-10 h-10 rounded-lg object-cover border border-sand/40">
            <div>
              <span class="font-bold text-ink dark:text-white block">${p.name}</span>
              ${p.isPromoted ? `
                <span class="inline-flex items-center gap-1 text-[10px] text-accent font-extrabold uppercase">
                  <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span>En Promoción</span>
                </span>
              ` : ''}
            </div>
          </div>
        </td>
        <td class="p-3.5 text-ink-muted dark:text-slate-300">${p.category}</td>
        <td class="p-3.5 font-bold text-accent font-heading">${formatCurrency(p.price)}</td>
        <td class="p-3.5 text-ink dark:text-white font-medium">${p.stock} un.</td>
        <td class="p-3.5">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${p.stock > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700'}">
            ${p.stock > 0 ? 'En Stock' : 'Agotado'}
          </span>
        </td>
        <td class="p-3.5 text-right space-x-2">
          <button data-id="${p.id}" class="edit-prod-btn text-accent hover:underline font-bold text-xs cursor-pointer">Editar</button>
          <button data-id="${p.id}" class="delete-prod-btn text-rose-500 hover:underline font-bold text-xs cursor-pointer">Eliminar</button>
        </td>
      </tr>
    `).join('');

    // Listener Editar
    document.querySelectorAll('.edit-prod-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const prod = myProducts.find(p => p.id === id);
        if (prod) {
          modalTitle.textContent = 'Editar Producto';
          document.getElementById('prod-form-id').value = prod.id;
          document.getElementById('prod-form-name').value = prod.name;
          document.getElementById('prod-form-category').value = prod.category;
          document.getElementById('prod-form-price').value = prod.price;
          document.getElementById('prod-form-stock').value = prod.stock;
          document.getElementById('prod-form-desc').value = prod.description;
          modal.classList.remove('hidden');
        }
      });
    });

    // Listener Eliminar
    document.querySelectorAll('.delete-prod-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('¿Seguro que deseás eliminar este producto?')) {
          dataService.deleteProduct(id);
          renderTable();
          showToast('Producto eliminado del catálogo', 'info');
        }
      });
    });
  }

  // Modal Handlers
  const openModal = () => {
    // Validar límite si es plan básico
    const currentCount = dataService.getProducts().filter(p => p.merchantId === merchantId).length;
    if (isPlanBasico && currentCount >= 15) {
      alert('Alcanzaste el límite de 15 productos de tu Plan Básico. Actualizá a Plan Pro para publicar sin límites.');
      return;
    }

    modalTitle.textContent = 'Agregar Producto';
    form.reset();
    document.getElementById('prod-form-id').value = '';
    modal.classList.remove('hidden');
  };

  const closeModal = () => modal.classList.add('hidden');

  document.getElementById('open-new-prod-btn')?.addEventListener('click', openModal);
  document.getElementById('close-modal-btn')?.addEventListener('click', closeModal);
  document.getElementById('cancel-modal-btn')?.addEventListener('click', closeModal);

  // Guardar / Crear producto
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('prod-form-id').value;
    const name = document.getElementById('prod-form-name').value;
    const category = document.getElementById('prod-form-category').value;
    const price = parseFloat(document.getElementById('prod-form-price').value) || 0;
    const stock = parseInt(document.getElementById('prod-form-stock').value, 10) || 0;
    const description = document.getElementById('prod-form-desc').value;

    const payload = {
      name,
      category,
      price,
      stock,
      description,
      merchantId,
      merchantName: merchant ? merchant.name : user.name
    };

    if (id) payload.id = id;

    dataService.saveProduct(payload);
    closeModal();
    renderTable();
    showToast(`Producto "${name}" guardado con éxito`, 'success');
  });

  // Render ferias para postularse
  const applyList = document.getElementById('fairs-apply-list');
  if (applyList) {
    const fairs = dataService.getFairs();
    applyList.innerHTML = fairs.slice(0, 3).map(f => `
      <div class="p-3.5 rounded-xl border border-sand/30 bg-[#E2EBF1] dark:bg-slate-800/50 flex items-center justify-between gap-3 text-xs">
        <div>
          <p class="font-bold text-[#1E2B55] dark:text-[#A7BFD4] font-heading">${f.name}</p>
          <p class="text-ink-muted dark:text-slate-400 flex items-center gap-1 mt-0.5">
            <svg class="w-3.5 h-3.5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke-width="2"></circle>
              <polyline points="12 6 12 12 16 14" stroke-width="2"></polyline>
            </svg>
            <span>${f.schedule}</span>
          </p>
        </div>
        <button class="apply-fair-btn btn-accent text-[11px] py-1.5 px-3 whitespace-nowrap cursor-pointer" data-fair="${f.name}">
          Inscribirme
        </button>
      </div>
    `).join('');

    document.querySelectorAll('.apply-fair-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const fairName = btn.getAttribute('data-fair');
        btn.innerHTML = `
          <span class="inline-flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Inscripto</span>
          </span>
        `;
        btn.disabled = true;
        btn.classList.replace('btn-accent', 'btn-outline');
        showToast(`Te postulaste exitosamente a "${fairName}". El organizador revisará tu solicitud.`, 'success');
      });
    });
  }

  renderTable();
});
