import inject from '@rollup/plugin-inject';
import react from '@vitejs/plugin-react';
import { copyFile } from 'fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// https://vitejs.dev/config/
export default defineConfig(async ({ command }) => ({
  define: {
    'process.env': {},
    'process.platform': {},
  },
  build: {
    rollupOptions: {
      plugins: [inject({ Buffer: ['buffer', 'Buffer'] })],
    },
  },
  plugins: [
    react(),
    {
      name: 'move:esbuild.wasm',
      async buildStart(options) {
        if (command == 'serve') return;
        await copyFileToPublic('esbuild-wasm/esbuild.wasm', 'esbuild.wasm');
      },
    },
  ],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
  },
  // 3. to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.app/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ['VITE_', 'TAURI_'],

  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      }
    },
  },
}));

async function copyFileToPublic(
  sourceFileName: string,
  destinationFileName: string
) {
  try {
    const sourceFilePath = require.resolve(sourceFileName);
    const destinationFilePath = resolve(
      __dirname,
      'public',
      destinationFileName
    );

    await copyFile(sourceFilePath, destinationFilePath);
    console.log(`${sourceFileName} was successfully copied to public folder`);
  } catch (error) {
    console.error(`Error copying ${sourceFileName} to public folder:`, error);
  }
}
