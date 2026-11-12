/**
 * Paquetes comerciales y promociones para FeriaZone
 */
export const PROMOTION_PACKAGES = [
  {
    id: 'pkg-producto-destacado',
    name: 'Producto Destacado',
    tagline: 'Tu producto primero en el catálogo con insignia dorada',
    scope: 'product',
    durations: [
      { days: 7, price: 4500 },
      { days: 15, price: 8000 },
      { days: 30, price: 14000 }
    ],
    features: [
      'Aparición fija en las primeras posiciones del catálogo',
      'Etiqueta visual "Destacado" en la tarjeta',
      'Prioridad en filtros por rubro',
      'Métricas de clics y pedidos directos'
    ]
  },
  {
    id: 'pkg-vidriera-home',
    name: 'Vidriera en la Home',
    tagline: 'Tu emprendimiento exhibido en la portada principal de FeriaZone',
    scope: 'merchant',
    durations: [
      { days: 7, price: 7500 },
      { days: 15, price: 13500 },
      { days: 30, price: 24000 }
    ],
    features: [
      'Banner y tarjeta en la sección de Emprendimientos Destacados de la Home',
      'Enlace directo a tu catálogo y WhatsApp',
      'Mayor volumen de visitas semanales garantizado',
      'Distintivo de feriante verificado'
    ]
  },
  {
    id: 'pkg-impulso-feria',
    name: 'Impulso en Feria',
    tagline: 'Destacate en el detalle y en el mapa de tu próxima feria',
    scope: 'fair',
    durations: [
      { days: 7, price: 6000 },
      { days: 15, price: 11000 },
      { days: 30, price: 19500 }
    ],
    features: [
      'Pin especial y resaltado en el mapa de Leaflet',
      'Aparición en la cabecera de la ficha del evento',
      'Aviso a los vecinos que busquen feria cercana',
      'Recomendación del organizador'
    ]
  }
];

export const ACTIVE_PROMOTIONS = [
  {
    id: 'promo-1',
    packageId: 'pkg-producto-destacado',
    targetType: 'product',
    targetId: 'prod-1', // Mate Imperial
    merchantId: 'emp-1',
    startDate: '2026-10-25',
    endDate: '2026-11-25',
    daysRemaining: 17,
    stats: { viewsBefore: 84, viewsDuring: 342, ordersBefore: 4, ordersDuring: 21 }
  },
  {
    id: 'promo-2',
    packageId: 'pkg-producto-destacado',
    targetType: 'product',
    targetId: 'prod-7', // Cazuela Cerámica
    merchantId: 'emp-2',
    startDate: '2026-10-28',
    endDate: '2026-11-12',
    daysRemaining: 10,
    stats: { viewsBefore: 60, viewsDuring: 210, ordersBefore: 3, ordersDuring: 14 }
  },
  {
    id: 'promo-3',
    packageId: 'pkg-vidriera-home',
    targetType: 'merchant',
    targetId: 'emp-1',
    merchantId: 'emp-1',
    startDate: '2026-10-20',
    endDate: '2026-11-20',
    daysRemaining: 18,
    stats: { viewsBefore: 120, viewsDuring: 580, ordersBefore: 8, ordersDuring: 37 }
  },
  {
    id: 'promo-4',
    packageId: 'pkg-vidriera-home',
    targetType: 'merchant',
    targetId: 'emp-3',
    merchantId: 'emp-3',
    startDate: '2026-10-26',
    endDate: '2026-11-10',
    daysRemaining: 8,
    stats: { viewsBefore: 95, viewsDuring: 410, ordersBefore: 6, ordersDuring: 28 }
  }
];
