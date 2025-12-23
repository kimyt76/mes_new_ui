import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        noDiscovery: true,
        include: ['handsontable', '@handsontable/vue3'],
    },
    build: {
        outDir: 'dist/mes', // 빌드 결과물이 저장될 폴더
        emptyOutDir: true,  //빌드전에 폴더 비우기
        commonjsOptions: {
            transformMixedEsModules: true, // ESM + CJS 섞인 모듈도 변환하도록
        },
    },
    plugins: [
        vue(),
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
        dedupe: ['handsontable'],
    },
    server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
  },
});
