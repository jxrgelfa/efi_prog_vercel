# Reglas de Proyecto: FeriaZone

Consulta permanente de las directivas y normas de desarrollo para FeriaZone:
- Idioma de interfaz, comentarios y documentación: Español Rioplatense. Código (variables, funciones, clases): Inglés.
- Sin frameworks de frontend (solo HTML5 + CSS3 + Tailwind CLI + ES Modules).
- Tokens de diseño: cream (#E2EBF1 Azul Pálido), primary (#506580 / #1E2B55), accent (#B58120 / #D7C393 Latón), sand (#D7C6AD), moss (#869F8A / #5C725D), ink (#1E2B55).
- Modo oscuro por clase .dark con guardado en localStorage y script anti-parpadeo.
- Accesibilidad WCAG AA, botones de altura mínima de 44px, tipografía base >= 16px.
- Persistencia exclusiva mediante `js/services/storage.js` con soporte en memoria como fallback ante fallos de localStorage.
- Rutas y ejecución mediante `npm run dev` (soporte de ES Modules con `live-server`).
