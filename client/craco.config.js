module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  devServer: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: 'all',
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true,
        headers: {
          Connection: 'keep-alive'
        }
      }
    }
  },
}; 