/* =====================================================================
   SHARED TAILWIND CONFIG
   Brand colors, fonts, and animation keyframes used across every page.
   Edit here once and it updates everywhere.
===================================================================== */
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                solarglyph: '#07304B', // Brand accent color
                apple: {
                    bgLight: '#F5F5F7', // Slightly grayish white
                    bgDark: '#000000',  // Deep pitch black
                    textLight: '#1D1D1F',
                    textDark: '#F5F5F7'
                }
            },
            animation: {
                'fade-in-up': 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'float': 'float 8s ease-in-out infinite',
                'float-delayed': 'float 10s ease-in-out 2s infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px) scale(0.98)' },
                    '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0) scale(1)' },
                    '50%': { transform: 'translateY(-20px) scale(1.05)' },
                }
            }
        }
    }
}