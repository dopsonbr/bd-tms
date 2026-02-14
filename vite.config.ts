import path from 'node:path'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const DEV_PORT = Number(process.env.DEV_PORT ?? 43857)
const PREVIEW_PORT = Number(process.env.PREVIEW_PORT ?? 43858)
const DEVTOOLS_PORT = Number(process.env.DEVTOOLS_PORT ?? 53857)
const WORKSPACE_ROOT = process.cwd()
const LOCAL_NODE_MODULES = path.resolve(process.cwd(), 'node_modules')
const SHARED_NODE_MODULES = path.resolve(process.cwd(), '../../node_modules')

const config = defineConfig({
  server: {
    host: '127.0.0.1',
    port: DEV_PORT,
    strictPort: true,
    fs: {
      allow: [WORKSPACE_ROOT, LOCAL_NODE_MODULES, SHARED_NODE_MODULES],
    },
  },
  preview: {
    host: '127.0.0.1',
    port: PREVIEW_PORT,
    strictPort: true,
  },
  plugins: [
    devtools({
      eventBusConfig: {
        port: DEVTOOLS_PORT,
      },
    }),
    nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
