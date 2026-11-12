# FeriaZone — Arquitectura de Software

## 1. Stack Tecnológico
- **Lenguajes:** HTML5 semántico, CSS3 moderno, JavaScript ES2022+ (ES Modules).
- **Estilos:** Tailwind CSS compilado localmente a `css/styles.css` mediante `@tailwindcss/cli`.
- **Mapas:** Leaflet 1.9.x + OpenStreetMap (sin API key requerida).
- **Iconografía:** Lucide Vanilla (CDN SVG/ESM oficial).
- **Servidor Local de Desarrollo:** `live-server` para resolver peticiones de módulos nativos sin problemas de protocolo `file://`.
- **Despliegue:** 100% estático compatible con Vercel o GitHub Pages.

## 2. Mapa del Sitio y Rutas

```
/
├── index.html                  # Landing page (Home) con ferias y productos destacados
├── pages/
│   ├── tienda.html             # Tienda con buscador, filtros y ordenamiento
│   ├── producto.html           # Vista individual de producto (?id=...)
│   ├── emprendimiento.html     # Perfil público del feriante / emprendimiento (?id=...)
│   ├── ferias.html             # Listado de ferias activas, próximas y pasadas
│   ├── feria.html              # Detalle de una feria (?id=...)
│   ├── mapa.html               # Mapa interactivo y cálculo de feria más cercana
│   ├── planes.html             # Planes y paquetes de promoción para feriantes y organizadores
│   ├── nosotros.html           # Presentación del equipo de desarrollo (EFI 2026)
│   ├── contacto.html           # Datos de contacto, redes sociales y feedback
│   ├── login.html              # Inicio de sesión con botones demo por rol
│   ├── registro.html           # Registro simulado para vecinos y feriantes
│   ├── carrito.html            # Carrito de compras y checkout simulado con confirmación
│   ├── usuario/                # Panel de comprador (historial y reseñas)
│   │   └── index.html
│   ├── feriante/               # Panel de feriante (dashboard, CRUD productos, inscripciones)
│   │   ├── index.html
│   │   ├── productos.html
│   │   └── promocionar.html
│   └── organizador/            # Panel de organizador (gestión de ferias y postulaciones)
│       └── index.html
```

## 3. Manejo de Datos y Estado
- **Capa de Datos Semilla (`js/data/`):**
  - `fairs.js`: 6 ferias de Río Cuarto con geolocalización, fechas y servicios.
  - `merchants.js`: 12 emprendimientos artesanales locales.
  - `products.js`: 60 productos categorizados, con precios y stock.
  - `promotions.js`: Paquetes comerciales y promociones activas de ejemplo.
  - `reviews.js`: Calificaciones de productos y ferias.
  - `users.js`: Cuentas demostrativas para Vecino, Feriante y Organizador.
- **Capa de Servicios (`js/services/`):**
  - `storage.js`: Abstracción única sobre `localStorage` con fallback a memoria volátil para garantizar resiliencia total frente a errores de almacenamiento.
  - `auth.js`: Gestión de sesión activa (obtener usuario actual, login rápido demo, logout, guard de redirección en páginas protegidas).
  - `cart.js`: Gestión reactiva del carrito (agregar, remover, modificar cantidad, calcular totales).
  - `promotionsService.js`: Lógica para activar paquetes y calcular fechas de vigencia.

## 4. Inyección de Componentes Compartidos
Para no repetir markup en cada archivo `.html`, el módulo `js/components/navbar.js` y `js/components/footer.js` inyectan el encabezado y pie de página de forma asíncrona o al dispararse el evento `DOMContentLoaded`, adaptando enlaces relativos de navegación según la profundidad de la página actual.
