import { renderNavbar } from '../components/navbar.js';
import { renderFooter } from '../components/footer.js';
import { dataService } from '../services/dataService.js';
import { calculateDistanceKm } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';
import { SITE_CONFIG } from '../config/site.js';

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();

  const fairs = dataService.getFairs();
  const closestBtn = document.getElementById('find-closest-btn');
  const closestBox = document.getElementById('closest-result-box');
  const closestName = document.getElementById('closest-name');
  const closestDist = document.getElementById('closest-dist');
  const closestLink = document.getElementById('closest-link');

  if (!window.L) {
    console.error('Leaflet no pudo cargarse');
    return;
  }

  // Centrar por defecto en Río Cuarto
  const defaultCoords = SITE_CONFIG.defaultCoords;
  const map = L.map('fairs-map').setView([defaultCoords.lat, defaultCoords.lng], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap - FeriaZone Río Cuarto'
  }).addTo(map);

  // SVG Pin string reusable
  const pinSvg = `<svg style="width: 13px; height: 13px; display: inline-block; vertical-align: middle; margin-right: 3px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`;

  // Agregar marcadores para cada feria
  const markers = [];
  fairs.forEach(fair => {
    const marker = L.marker([fair.lat, fair.lng]).addTo(map);
    marker.bindPopup(`
      <div style="font-family: inherit; font-size: 13px; max-width: 200px;">
        <strong style="color: #1E2B55;">${fair.name}</strong><br>
        <span style="color: #506580; font-weight: 600;">${pinSvg}${fair.zone}</span><br>
        <span style="font-size: 11px; color: #666;">${fair.schedule}</span><br>
        <div style="margin-top: 6px;">
          <a href="./feria.html?id=${fair.id}" style="color: #B58120; font-weight: bold; text-decoration: underline;">Ver ficha completa</a>
        </div>
      </div>
    `);
    markers.push({ fair, marker });
  });

  // Geolocalización: Feria más cercana a mí
  closestBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      showToast('Tu navegador no soporta geolocalización', 'error');
      fallbackToCenter();
      return;
    }

    closestBtn.disabled = true;
    closestBtn.innerHTML = `
      <svg class="w-4 h-4 animate-spin flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Buscando tu posición...</span>
    `;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // Marcador del usuario con SVG de silueta
        const userIcon = L.divIcon({
          className: 'user-marker',
          html: '<div style="background-color: #1E2B55; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"><svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>',
          iconSize: [28, 28]
        });

        L.marker([userLat, userLng], { icon: userIcon })
          .addTo(map)
          .bindPopup('<b>Tu ubicación actual</b>')
          .openPopup();

        // Calcular feria más cercana
        let minDistance = Infinity;
        let closestFair = null;

        fairs.forEach(f => {
          const dist = calculateDistanceKm(userLat, userLng, f.lat, f.lng);
          if (dist < minDistance) {
            minDistance = dist;
            closestFair = f;
          }
        });

        if (closestFair) {
          closestBox.classList.remove('hidden');
          closestName.textContent = closestFair.name;
          closestDist.textContent = `Aproximadamente a ${minDistance} km de tu ubicación (${closestFair.zone} - ${closestFair.locationName})`;
          closestLink.href = `./feria.html?id=${closestFair.id}`;

          map.setView([closestFair.lat, closestFair.lng], 15);
          showToast(`La feria más cercana es "${closestFair.name}"`, 'success');
        }

        closestBtn.disabled = false;
        closestBtn.innerHTML = `
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span>Feria más cercana a mí</span>
        `;
      },
      (error) => {
        console.warn('Permiso de geolocalización denegado o error:', error);
        showToast('No pudimos acceder a tu GPS. Centrando en Río Cuarto.', 'info');
        fallbackToCenter();
        closestBtn.disabled = false;
        closestBtn.innerHTML = `
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span>Feria más cercana a mí</span>
        `;
      },
      { timeout: 7000 }
    );
  });

  function fallbackToCenter() {
    map.setView([defaultCoords.lat, defaultCoords.lng], 13);
  }
});
