import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@layouts': path.resolve(__dirname, 'layouts'),
      '@typings': path.resolve(__dirname, 'typings'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@components': path.resolve(__dirname, 'components'),
    },
  },
  plugins: [react()],
})
