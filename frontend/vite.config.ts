import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

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
      },
    },
  };
});
