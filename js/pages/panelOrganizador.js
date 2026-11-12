import { renderNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { auth } from '../services/auth.js';
import { dataService } from '../services/dataService.js';
import { showToast } from '../components/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  if (!auth.requireAuth(['organizador'], '../login.html')) return;

  renderNavbar();
  renderFooter();

  const fairs = dataService.getFairs();
  const tbody = document.getElementById('org-fairs-tbody');
  const latInput = document.getElementById('fair-input-lat');
  const lngInput = document.getElementById('fair-input-lng');

  function renderTable() {
    tbody.innerHTML = fairs.map(f => `
      <tr class="hover:bg-sand/10 dark:hover:bg-slate-800/50 transition-colors">
        <td class="p-3.5 font-bold text-ink dark:text-white">${f.name}</td>
        <td class="p-3.5 text-ink-muted dark:text-slate-300">${f.locationName}</td>
        <td class="p-3.5 text-accent font-medium">${f.schedule}</td>
        <td class="p-3.5">${f.registeredCount} / ${f.capacity}</td>
        <td class="p-3.5">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${f.status === 'activa' ? 'bg-moss/20 text-moss-dark dark:bg-moss/30 dark:text-moss-light' : 'bg-primary/20 text-primary'}">
            ${f.status === 'activa' ? 'Pública' : 'Borrador'}
          </span>
        </td>
        <td class="p-3.5 text-right space-x-2">
          <button data-id="${f.id}" class="toggle-fair-btn text-accent font-bold text-xs hover:underline">
            ${f.status === 'activa' ? 'Despublicar' : 'Publicar'}
          </button>
        </td>
      </tr>
    `).join('');

    document.querySelectorAll('.toggle-fair-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const fair = fairs.find(f => f.id === id);
        if (fair) {
          fair.status = fair.status === 'activa' ? 'proxima' : 'activa';
          dataService.saveFair(fair);
          renderTable();
          showToast(`Estado de "${fair.name}" actualizado a ${fair.status === 'activa' ? 'Pública' : 'Borrador'}`, 'info');
        }
      });
    });
  }

  renderTable();

  // Inicializar mapa de selección con clic (Leaflet)
  let pickerMap = null;
  if (window.L) {
    pickerMap = L.map('org-picker-map').setView([-33.123, -64.349], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(pickerMap);

    let currentMarker = L.marker([-33.123, -64.349]).addTo(pickerMap);

    pickerMap.on('click', (e) => {
      const { lat, lng } = e.latlng;
      latInput.value = lat.toFixed(5);
      lngInput.value = lng.toFixed(5);
      currentMarker.setLatLng([lat, lng]);
      showToast(`Punto fijado: ${lat.toFixed(4)}, ${lng.toFixed(4)}`, 'info');
    });
  }

  // Configurar secciones colapsables (abiertas por default)
  function setupCollapsibleSection({ btnId, containerId, headerId, onExpand }) {
    const btn = document.getElementById(btnId);
    const container = document.getElementById(containerId);
    const header = headerId ? document.getElementById(headerId) : null;
    if (!btn || !container) return;

    const hasBorder = header?.classList.contains('border-b');

    const toggle = () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const newExpanded = !isExpanded;

      btn.setAttribute('aria-expanded', String(newExpanded));
      const textSpan = btn.querySelector('.toggle-text');
      const icon = btn.querySelector('svg');

      if (newExpanded) {
        container.classList.remove('hidden');
        if (textSpan) textSpan.textContent = 'Minimizar';
        if (icon) icon.classList.add('rotate-180');
        if (header && hasBorder) {
          header.classList.add('border-b', 'border-sand/30', 'pb-3');
        }
        if (typeof onExpand === 'function') {
          onExpand();
        }
      } else {
        container.classList.add('hidden');
        if (textSpan) textSpan.textContent = 'Expandir';
        if (icon) icon.classList.remove('rotate-180');
        if (header && hasBorder) {
          header.classList.remove('border-b', 'border-sand/30', 'pb-3');
        }
      }
    };

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle();
    });

    if (header) {
      header.classList.add('cursor-pointer', 'select-none');
      header.addEventListener('click', () => {
        toggle();
      });
    }
  }

  setupCollapsibleSection({
    btnId: 'toggle-fairs-btn',
    containerId: 'fairs-table-container',
    headerId: 'fairs-header'
  });

  setupCollapsibleSection({
    btnId: 'toggle-form-btn',
    containerId: 'fair-form-container',
    headerId: 'create-fair-header',
    onExpand: () => {
      setTimeout(() => {
        if (pickerMap) {
          pickerMap.invalidateSize();
        }
      }, 50);
    }
  });

  setupCollapsibleSection({
    btnId: 'toggle-support-btn',
    containerId: 'support-form-container',
    headerId: 'support-header'
  });

  // Guardar nueva feria
  document.getElementById('fair-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('fair-input-name').value;
    const locationName = document.getElementById('fair-input-location').value;
    const zone = document.getElementById('fair-input-zone').value;
    const schedule = document.getElementById('fair-input-schedule').value;
    const capacity = parseInt(document.getElementById('fair-input-capacity').value, 10);
    const lat = parseFloat(latInput.value);
    const lng = parseFloat(lngInput.value);
    const services = document.getElementById('fair-input-services').value.split(',').map(s => s.trim());

    const newFair = {
      name,
      locationName,
      zone,
      schedule,
      capacity,
      registeredCount: 0,
      status: 'activa',
      lat,
      lng,
      services,
      coverImage: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80',
      description: `Nueva feria habilitada en ${zone} para artesanos y productores locales.`
    };

    dataService.saveFair(newFair);
    fairs.unshift(newFair);
    renderTable();
    showToast(`¡Feria "${name}" creada y visible en el mapa general!`, 'success');
    document.getElementById('fair-form').reset();
  });

  // Soporte hacia desarrolladores
  document.getElementById('org-support-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Tu mensaje fue enviado al equipo de soporte de FeriaZone.', 'success');
    document.getElementById('org-support-form').reset();
  });
});
