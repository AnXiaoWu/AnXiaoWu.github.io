import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Vant 按需引入：自动注册模板中用到的 van-* 组件并引入对应样式
    Components({
      resolvers: [VantResolver()],
      dts: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // GitHub Pages（docs 目录）使用相对路径，避免 404
  base: './',
  server: {
    port: 8080,
    host: true,
    proxy: {
      '/mobile': {
        target: 'http://mobileapi.5sing.kugou.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mobile/, ''),
      },
      // 旧搜索域名 search.5sing.kugou.com 已 404，改用 5ssearch.kugou.com
      '/search-api': {
        target: 'https://5ssearch.kugou.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/search-api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // 将变动频率低的依赖单独拆包，提升缓存命中率
        manualChunks: {
          vue: ['vue', 'vue-router', 'vuex'],
          vant: ['vant'],
        },
      },
    },
  },
})
