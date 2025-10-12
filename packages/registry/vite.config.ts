import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      include: ['src/**/*'],
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
      },
      formats: ['es', 'cjs'],
      fileName: (format) => {
        return `index.${format === 'es' ? 'js' : 'cjs.js'}`
      },
    },
    rollupOptions: {
      external: ['@th-ui/core'],
    },
  },
})