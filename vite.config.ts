import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'
import Unocss from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    // https://github.com/antfu/unocss
    Unocss()
  ],
  server: {
    // port: 8000,
    // host: '0.0.0.0',
    proxy: {
      '/api/': {
        target: 'https://api.blacksilverscore.com',
        // target: 'https://eduapi.songzi-it.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, '')
      },
      '/api-prod/': {
        // target: 'https://250a7c9202.imdo.co',
        target: 'https://eduapi.songzi-it.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api-prod/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components')
    }
  },
  css: {
    // 配置`scss`和`less`全局变量
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/vars/_base.scss";'
      },
      less: {
        additionalData: '@import "@/styles/vars/_base.less";'
      }
    }
  },
  base: '/',
  build: {
    assetsDir: 'assets',
    outDir: 'hyLife'
  }
})
