module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      ...(process.platform === 'win32'
        ? {
            fontFamily: {
              mono: "'Cascadia Code', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
            },
          }
        : {}),
      colors: {
        accent: {
          fg: '#58A6FF',
          emphasis: '#1F6FEB',
          muted: 'rgba(56, 139, 253, 0.4)',
          subtle: 'rgba(56, 139, 253, 0.15)',
        },
        danger: {
          fg: '#f85149',
          emphasis: '#da3633',
          muted: 'rgba(248,81,73,0.4)',
          subtle: 'rgba(248,81,73,0.16)',
        },
        primary: {
          default: '#C9D1D9',
          muted: '#8B949E',
          subtle: '#6E7681',
          hover: 'rgba(177, 186, 196, 0.12)',
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
