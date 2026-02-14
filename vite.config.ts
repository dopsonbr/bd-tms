import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const parsedDevtoolsPort = Number(process.env.DEVTOOLS_PORT ?? '42069')
const devtoolsPort = Number.isFinite(parsedDevtoolsPort)
  ? parsedDevtoolsPort
  : 42069

const config = defineConfig({
  plugins: [
    devtools({
      eventBusConfig: {
        port: devtoolsPort,
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
