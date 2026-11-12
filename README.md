# 🎪 FeriaZone — Mercado Online y Guía de Ferias de Río Cuarto

> **Proyecto:** Examen Final Integrador (EFI) — Programación II 2026  
> **Tema:** Opción 7: Producción y Emprendimientos Locales  
> **Ámbito:** Río Cuarto, Córdoba, Argentina

---

## 📌 Descripción
FeriaZone es una plataforma web multipágina (100% frontend estático) diseñada para conectar a feriantes independientes, organizadores de eventos y vecinos de Río Cuarto. Resuelve la falta de un catálogo unificado para emprendedores locales que participan en espacios como el Parque Sarmiento, el Paseo del Andino, la Costanera y Plaza Roca.

---

## 🚀 Requisitos Previos e Instalación

### Requisitos:
- **Node.js** (v18 o superior)
- **NPM** (v9 o superior)

### Instalación de dependencias de desarrollo:
```bash
npm install
```

---

## 🛠️ Scripts Disponibles

- **`npm run dev`**: Compila Tailwind CSS en modo escucha (`--watch`) y levanta un servidor de desarrollo local (`live-server`) en el puerto 3000 con recarga automática.
  > ⚠️ **Importante:** Utilizá siempre `npm run dev`. Debido al uso de **ES Modules** nativos de JavaScript, abrir los archivos HTML con doble clic (`file:///`) provocará errores de CORS en el navegador.

- **`npm run build`**: Compila y minifica `css/styles.css` con Tailwind CSS para producción.

- **`npm run dev:css`**: Compila únicamente Tailwind CSS en modo watch.

- **`npm run dev:server`**: Inicia únicamente el servidor local estático.

---

## 🎨 Paleta de Colores Oficial (8 Tonos)

| Token | Hex | Tono / Uso |
|---|---|---|
| `cream` (Color Principal) | `#E2EBF1` | **Azul Pálido**: Fondo general de páginas en modo claro y barras superiores |
| `primary.DEFAULT` | `#506580` | **Azul Musgo Pálido**: Identidad de marca, botones secundarios, acentos de tarjeta |
| `primary.dark` / `ink` | `#1E2B55` | **Azul Marino Profundo**: Títulos (h1..h6), pie de página, texto de alto contraste |
| `primary.light` | `#7994A6` | **Azul Medio Polvoriento**: Subtítulos, detalles sutiles, bordes suaves |
| `sand` | `#D7C6AD` | **Arena Suave**: Bordes de tarjetas, fondos cálidos suaves y divisores |
| `accent` / `brass` | `#B58120` / `#D7C393` | **Acento de Latón**: Botones de acción (CTA), badges destacados, estrellas de reseña |
| `moss.DEFAULT` | `#869F8A` | **Verde Musgo Pálido**: Categorías ecológicas y estados activos |
| `moss.dark` (Satin Metal) | `#5C725D` | **Acento y Latón Lopo Satin Metal**: Badges terrosos y acentos de contraste |

---

## 📂 Estructura del Proyecto

```
feriazone/
├── docs/                        # Documentación técnica, contexto y bitácora
│   ├── CONTEXTO.md
│   ├── REGLAS.md
│   ├── ARQUITECTURA.md
│   └── BITACORA.md
├── directivas/                  # Directivas operativas del proyecto
│   └── directiva_feriazone.md
├── index.html                   # Página principal (Home)
├── pages/                       # Pantallas del sitio
│   ├── tienda.html
│   ├── producto.html
│   ├── emprendimiento.html
│   ├── ferias.html
│   ├── feria.html
│   ├── mapa.html
│   ├── planes.html
│   ├── nosotros.html
│   ├── contacto.html
│   ├── login.html
│   ├── registro.html
│   ├── carrito.html
│   ├── usuario/                 # Panel de comprador (vecino)
│   ├── feriante/                # Panel de feriante y promociones
│   └── organizador/             # Panel de organizador de ferias
├── assets/
│   ├── brand/                   # Logo e íconos de la marca
│   └── img/                     # Imágenes ilustrativas de productos y ferias
├── css/
│   ├── input.css                # Entrada de Tailwind con directivas y fuentes
│   └── styles.css               # Salida compilada (no editar a mano)
├── js/
│   ├── components/              # Componentes reutilizables (navbar, footer, themeToggle, etc.)
│   ├── config/                  # Configuración global (site.js)
│   ├── data/                    # Semillas de datos de prueba
│   ├── pages/                   # Controladores por página
│   ├── services/                # Persistencia (storage.js), autenticación (auth.js), carrito
│   └── utils/                   # Formateadores de moneda, fecha y animaciones
├── package.json
└── README.md
```

---

## 👥 Datos de Contacto de la Empresa (Ficticios)
- **Domicilio:** Calle San Martín 1450, Barrio Alberdi, Río Cuarto, Córdoba
- **WhatsApp:** +54 9 358 412-3890
- **Email:** soporte.feriazone@gmail.com
- **Instagram:** `@feriazone.rc`
