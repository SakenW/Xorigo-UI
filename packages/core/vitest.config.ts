import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 85,
          functions: 85,
          lines: 90,
          statements: 90,
        },
        // 按目录设置更严格的阈值
        'src/components/**': {
          branches: 90,
          functions: 90,
          lines: 95,
          statements: 95,
        },
        'src/primitives/**': {
          branches: 95,
          functions: 95,
          lines: 98,
          statements: 98,
        },
        'src/forms/**': {
          branches: 90,
          functions: 90,
          lines: 95,
          statements: 95,
        },
        'src/hoc/**': {
          branches: 95,
          functions: 95,
          lines: 98,
          statements: 98,
        },
      },
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/test/**',
        '**/tests/**',
        '**/*.stories.tsx',
        '**/*.stories.ts',
        'examples/**',
        'archive/**',
        'packages-backup-*/**',
        'quality-assurance/**',
      ],
      include: [
        'src/**/*.{ts,tsx}',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/foundations': resolve(__dirname, './src/foundations'),
      '@/feedback': resolve(__dirname, './src/feedback'),
      '@/layout': resolve(__dirname, './src/layout'),
      '@/navigation': resolve(__dirname, './src/navigation'),
      '@/data-display': resolve(__dirname, './src/data-display'),
      '@/system': resolve(__dirname, './src/system'),
      '@/tokens': resolve(__dirname, './src/tokens'),
      '@/theme': resolve(__dirname, './src/theme'),
      '@/utils': resolve(__dirname, './src/utils'),
      '@/types': resolve(__dirname, './src/types'),
      '@/ai': resolve(__dirname, './src/ai'),
    },
  },
})
