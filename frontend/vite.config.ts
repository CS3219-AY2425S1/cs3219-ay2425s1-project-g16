import path from 'path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    build: {
      outDir: 'build',
      assetsDir: 'assets',
      emptyOutDir: true,
      minify: false,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/user-service': {
          target: env.VITE_USER_SERVICE,
          rewrite: (path) => path.replace(/^\/user-service/, ''),
          changeOrigin: true,
          cookiePathRewrite: {
            '*': '/',
          },
        },
        '/question-service': {
          target: env.VITE_QUESTION_SERVICE,
          rewrite: (path) => path.replace(/^\/question-service/, ''),
          changeOrigin: true,
          cookiePathRewrite: {
            '*': '/',
          },
        },
        '/matching-service': {
          target: env.VITE_MATCHING_SERVICE,
          rewrite: (path) => path.replace(/^\/matching-service/, ''),
          changeOrigin: true,
          cookiePathRewrite: {
            '*': '/',
          },
        },
        '/matching-socket/': {
          target: env.VITE_MATCHING_SERVICE,
          ws: true,
          secure: false,
          changeOrigin: true,
        },
      },
    },
  };
});
