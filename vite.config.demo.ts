import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// 演示网站配置
export default defineConfig({
  plugins: [react()],
  root: './demo-site',  // 设置为demo-site目录
  build: {
    outDir: '../dist-demo',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'demo-site/index.html'),
      },
    },
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/tokens': resolve(__dirname, 'src/tokens'),
      '@/theme': resolve(__dirname, 'src/theme'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/hooks': resolve(__dirname, 'src/hooks'),
      '@/types': resolve(__dirname, 'src/types'),
      '@/layouts': resolve(__dirname, 'src/layouts'),
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    strictPort: true,
    watch: {
      // 不使用轮询，依赖 Docker 卷挂载的文件系统事件
      usePolling: false,
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/dist-demo/**',
        '**/.git/**',
        '**/.claude-flow/**',
        '**/claudedocs/**',
        '**/*.log',
        '**/package-lock.json',
        '**/pnpm-lock.yaml',
        '**/yarn.lock',
        '**/.vscode/**',
        '**/.idea/**',
      ],
    },
    hmr: {
      // HMR WebSocket 服务器在容器内的 5173 端口
      // 通过 Docker 端口映射，浏览器通过 localhost:3100 访问
      host: 'localhost',
      clientPort: 3100,
      overlay: true,  // 显示错误覆盖层
    },
  },
})
