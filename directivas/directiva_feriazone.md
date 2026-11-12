# Directiva: FeriaZone — Portal y Guía de Ferias de Río Cuarto

## 1. Objetivo General
Construir una plataforma frontend completa, accesible y determinista para **FeriaZone** (Examen Final Integrador de Programación II 2026), que conecta a feriantes, organizadores y vecinos de Río Cuarto (Córdoba).
El proyecto es 100% frontend estático, con simulación de roles, carrito, CRUD de productos, contratación de promociones y mapas con Leaflet.

## 2. Entradas y Salidas
- **Entradas:** 
  - Datos de prueba en `js/data/` (ferias, emprendimientos, productos, promociones, reseñas, métricas).
  - Interacciones de usuario en formularios (login demo, carrito, checkout simulado, altas/bajas de productos).
- **Salidas:**
  - Sitio web multipágina estático en HTML5 semántico.
  - Hoja de estilos única y compilada `css/styles.css` vía Tailwind CLI.
  - Estado reactivo persistido en `localStorage` con aislamiento en `js/services/storage.js`.
  - Paquete final `Sitio_Web.zip` listo para entrega y deploy en Vercel.

## 3. Lógica y Reglas de Arquitectura
- **Modularidad:** ES Modules nativos (`import`/`export`).
- **Componentes compartidos:** `navbar.js` y `footer.js` inyectados dinámicamente en cada página para evitar duplicación.
- **Tokens de Color (Paleta Oficial de 8 Tonos):**
  - `cream` (Color Principal): `#E2EBF1` (Azul pálido / fondo claro)
  - `primary`: `#506580` (Azul musgo pálido / marca y botones secundarios)
  - `primary.dark` / `ink`: `#1E2B55` (Azul marino profundo / títulos y tinta de texto)
  - `primary.light`: `#7994A6` (Azul medio polvoriento)
  - `sand`: `#D7C6AD` (Arena suave)
  - `accent` / `brass`: `#B58120` / `#D7C393` (Acento de latón dorado / llamados a la acción)
  - `moss`: `#869F8A` (Verde musgo pálido) y `#5C725D` (Acento Satin Metal Verde)
- **Tema Claro / Oscuro:** Controlado por clase `.dark` en la etiqueta `<html>`, detectando preferencia del sistema y recordando elección con script inline previo al renderizado para eliminar parpadeos (FOUC).
- **Accesibilidad y Legibilidad al Sol:** Contraste mínimo WCAG AA, botones con alto mínimo de 44px, tipografía base >= 16px.

## 4. Restricciones y Casos Borde Identificados
- **Persistencia:** Si `localStorage` está deshabilitado o arroja excepción por cuota/modo incógnito estricto, `storage.js` debe atrapar el error con `try/catch` y mantener un fallback transparente en memoria para no romper la app.
- **Geolocalización:** Si el usuario rechaza los permisos del navegador o el dispositivo no cuenta con GPS, el mapa debe centrarse automáticamente en el centro de Río Cuarto (`lat: -33.123, lng: -64.349`).
- **Límite de Plan Básico:** Los feriantes en Plan Básico solo pueden tener un máximo de 15 productos activos. El sistema debe bloquear la creación del producto 16 e invitar a contratar el Plan Pro.
- **Rutas y Servidor:** No abrir archivos HTML directamente desde el explorador con protocolo `file://` debido a restricciones CORS de ES Modules; utilizar `npm run dev` (`live-server`).
