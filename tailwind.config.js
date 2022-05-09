module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          fg: '#58A6FF',
          emphasis: '#1F6FEB',
          muted: 'rgba(56, 139, 253, 0.4)',
          subtle: 'rgba(56, 139, 253, 0.15)',
        },
        primary: {
          default: '#C9D1D9',
          muted: '#8B949E',
          subtle: '#6E7681',
        },
        secondary: {
          emphasis: '#6E7681',
          muted: 'rgba(110, 118, 129, 0.4)',
          subtle: 'rgba(110, 118, 129, 0.1)',
        },
        canvas: {
          default: '#0D1117',
          inset: '#010409',
          overlay: '#161B22',
          subtle: '#161B22',
        },
        border: {
          default: '#30363D',
          muted: '#21262D',
          subtle: '#F0F6FC',
        },
      },
    },
  },
  plugins: [],
}
