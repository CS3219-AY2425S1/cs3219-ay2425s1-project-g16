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
          rewrite: (path) => path?.replace && path.replace(/^\/user-service/, ''),
          changeOrigin: true,
          cookiePathRewrite: {
            '*': '/',
          },
        },
        '/question-service': {
          target: env.VITE_QUESTION_SERVICE,
          rewrite: (path) => path?.replace && path.replace(/^\/question-service/, ''),
          changeOrigin: true,
          cookiePathRewrite: {
            '*': '/',
          },
        },
        '/collaboration-service': {
          target: env.VITE_COLLAB_SERVICE,
          rewrite: (path) => path?.replace && path.replace(/^\/collaboration-service/, ''),
          changeOrigin: true,
          cookiePathRewrite: {
            '*': '/',
          },
        },
        '/matching-service': {
          target: env.VITE_MATCHING_SERVICE,
          rewrite: (path) => path?.replace && path.replace(/^\/matching-service/, ''),
          changeOrigin: true,
          cookiePathRewrite: {
            '*': '/',
          },
        },
        '/collab-ws': {
          target: `${(env.VITE_COLLAB_SERVICE ?? 'http://collaboration-service').replace('http', 'ws')}`,
          rewrite: (path) => path?.replace && path.replace(/\/collab-ws/, ''),
          ws: true,
        },
        '/matching-socket/': {
          target: env.VITE_MATCHING_SERVICE,
          ws: true,
          secure: false,
          changeOrigin: true,
        },
        '/chat-socket/': {
          target: env.VITE_CHAT_SERVICE,
          ws: true,
          secure: false,
          changeOrigin: true,
        },
      },
    },
  };
});
