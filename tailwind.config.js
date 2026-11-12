/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './*.html',
    './pages/**/*.html',
    './js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#506580', // Azul Musgo Pálido
          dark: '#1E2B55',    // Azul Marino Profundo
          light: '#7994A6'    // Azul Medio Polvoriento
        },
        accent: {
          DEFAULT: '#B58120', // Acento de Latón Dorado (WCAG AA accesible con blanco)
          hover: '#9A6C17',   // Latón intenso hover
          light: '#D7C393'    // Acento de Latón claro (muestra exacta de paleta)
        },
        brass: {
          DEFAULT: '#D7C393', // Acento de Latón Metal Satinado
          dark: '#B58120',
          light: '#E8DCBD'
        },
        sand: {
          DEFAULT: '#D7C6AD', // Arena Suave
          light: '#EAE1D3',
          dark: '#BFAB8F'
        },
        cream: {
          DEFAULT: '#E2EBF1', // Color Principal: Azul Pálido
          light: '#F0F5F9',
          dark: '#CFDFEA'
        },
        moss: {
          DEFAULT: '#869F8A', // Verde Musgo Pálido
          dark: '#5C725D',    // Acento Satin Metal Verde
          light: '#AEC0B1'
        },
        ink: {
          DEFAULT: '#1E2B55', // Azul Marino Profundo (tinta de lectura)
          muted: '#506580',   // Azul Musgo Pálido (subtítulos)
          light: '#7994A6'    // Azul Medio Polvoriento (íconos y detalles)
        }
      },
      fontFamily: {
        heading: ['"Outfit"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      },
      minHeight: {
        touch: '44px'
      },
      minWidth: {
        touch: '44px'
      }
    }
  },
  plugins: []
}
