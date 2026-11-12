# FeriaZone — Reglas de Código, Diseño y Accesibilidad

## 1. Principios de Código
- **Stack Puro:** HTML5 semántico + Tailwind CSS (compilado vía CLI) + JavaScript Vanilla moderno con ES Modules (`import`/`export`).
- **Prohibiciones:** Sin frameworks frontend (React, Vue, Vite, etc.), sin librerías pesadas como jQuery o librerías de animación externas.
- **Modularidad y Responsabilidades:**
  - `data/`: Datos estáticos y semillas de prueba.
  - `services/`: Lógica de negocio pura y persistencia (`storage.js`, `auth.js`, `cart.js`, `promotions.js`).
  - `components/`: Generadores de vistas reutilizables (`navbar.js`, `footer.js`, `productCard.js`, `toast.js`, etc.).
  - `pages/`: Controladores por pantalla encargados de inicializar eventos y renderizar la vista.
- **Manipulación del DOM:**
  - Uso estricto de template literals limpios y/o `document.createElement`.
  - Todo dato ingresado por el usuario o proveniente de formularios debe ser sanitizado/escapado antes de insertarse en el DOM para prevenir XSS.
- **Calidad de Código:**
  - Cero código muerto y cero `console.log` de depuración en producción.
  - Declaraciones inmutables con `const` salvo necesidad real de `let`. Funciones puras, breves y con propósito único.

## 2. Accesibilidad y Ergonomía Visual (Legibilidad al Sol)
- La aplicación está diseñada para ser utilizada en ferias al aire libre y en condiciones de luz solar directa.
- **Contraste mínimo:** Cumplimiento estricto de las pautas WCAG AA en modo claro y modo oscuro.
- **Dimensiones táctiles:** Botones y elementos interactivos con una altura mínima de 44 px para facilitar el toque en pantallas móviles.
- **Tipografía legible:** Tamaño de fuente base de 16 px o superior, sin grises claros sobre fondos claros.
- **Foco visible y teclado:** Todos los elementos interactivos deben poseer un anillo de enfoque accesible (`focus-visible`).
- **Semántica y ARIA:** Uso correcto de `nav`, `main`, `footer`, `section`, `article`, `aria-label`, `aria-expanded` para menús hamburguesa y modales.
- **Respeto a preferencias del usuario:** Soportar `prefers-reduced-motion` silenciando o simplificando transiciones.

## 3. Identidad Visual y Paleta Oficial (8 Tonos)
| Token / Rol | Valor Hex | Muestra / Uso Principal |
|---|---|---|
| `cream` (Color Principal) | `#E2EBF1` | **Azul Pálido**: Fondo general de la aplicación en modo claro y barras superiores |
| `primary.DEFAULT` | `#506580` | **Azul Musgo Pálido**: Identidad principal, botones secundarios, acentos de tarjeta |
| `primary.dark` / `ink` | `#1E2B55` | **Azul Marino Profundo**: Encabezados (h1..h6), texto de alta legibilidad, pie de página |
| `primary.light` | `#7994A6` | **Azul Medio Polvoriento**: Subtítulos, detalles sutiles, bordes suaves |
| `sand` | `#D7C6AD` | **Arena Suave**: Bordes de tarjetas, divisores y badges neutrales |
| `accent` / `brass` | `#B58120` / `#D7C393` | **Acento de Latón**: Botones de acción (CTA), badges destacados, estrellas de reseña |
| `moss.DEFAULT` | `#869F8A` | **Verde Musgo Pálido**: Categorías ecológicas/artesanales y estados |
| `moss.dark` (Satin Metal) | `#5C725D` | **Acento y Latón Lopo Satin Metal**: Badges terrosos y acentos de contraste |

## 4. Modo Claro y Oscuro
- Gestionado a través de la clase `.dark` en el elemento raíz `<html>`.
- Guardado en `localStorage` con captura de excepciones.
- Respeto por la preferencia de color del sistema operativo en la primera visita (`prefers-color-scheme`).
- Script inline liviano en el `<head>` de todas las páginas para aplicar la clase `.dark` antes del primer render, impidiendo el parpadeo blanco (FOUC).

## 5. Formatos y Monedas
- Todos los precios deben formatearse en Pesos Argentinos mediante:
  `Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })`
- Fechas y horarios formateados en español rioplatense.
