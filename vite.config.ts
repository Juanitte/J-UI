import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(() => {
  const isLibBuild = process.env.BUILD_LIB === 'true'

  if (isLibBuild) {
    // Configuracion para compilar la libreria
    return {
      plugins: [
        react(),
        dts({
          include: ['src'],
          exclude: ['src/playground', 'src/main.tsx'],
          outDir: 'dist',
          insertTypesEntry: true,
        }),
      ],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'JUI',
          formats: ['es', 'cjs'],
          fileName: (format) => `j-ui.${format === 'es' ? 'mjs' : 'cjs'}`,
        },
        rollupOptions: {
          external: ['react', 'react-dom', 'react/jsx-runtime'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'react/jsx-runtime': 'jsxRuntime',
            },
          },
        },
        sourcemap: true,
        emptyOutDir: true,
      },
    }
  }

  // Configuracion para el playground (desarrollo)
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/upload': {
          target: 'https://httpbin.org',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api\/upload/, '/post'),
        },
      },
    },
  }
})
