import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


export default defineConfig({
  plugins: [react()],
  base: '/nucgpt',
  server: {
    port: 3333,
    host: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'suptec.ddnm.mb'
    ],
//    hmr: {
//      host: 'suptec.ddnm.mb',
//      protocol: 'ws',
//      port: 3333
//    },
    proxy: {
      '/api/nucgpt': {
        target: 'http://localhost:4333',
        changeOrigin: true,
        //secure: false,
        rewrite: (path) => path.replace(/^\/api\/nucgpt/, ''),
      },
    }
  }
})
