/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {
            colors: {
                capsule: {
                    void: '#0B0F1A',    // primary background — vault dark
                    panel: '#121826',   // card / surface
                    panel2: '#1A2233',  // raised surface / hover
                    line: '#26304A',    // hairline borders
                    brass: '#C99A3E',   // sealing-wax brass — primary accent (locked)
                    brassDim: '#8A6B2C',
                    teal: '#2F7A6E',    // verdigris — unlocked / success accent
                    tealDim: '#1F5349',
                    rust: '#B4552F',    // overdue / warning
                    parchment: '#ECE7DA', // primary text
                    parchmentDim: '#A9AEC0', // secondary text
                    parchmentFaint: '#6B7288',
                },
            },
            fontFamily: {
                display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
                body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
            },
            backgroundImage: {
                'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
            },
            boxShadow: {
                seal: '0 0 0 1px rgba(201,154,62,0.35), 0 8px 24px -8px rgba(201,154,62,0.35)',
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
};
