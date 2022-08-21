import { fileURLToPath, URL } from 'node:url'
import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import EnvironmentPlugin from 'vite-plugin-environment';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: './node_modules/blockly/media/*.*',
          dest: 'media'
        }
      ]
    }),
    EnvironmentPlugin({
      // Backend location. Must point to the exposed Flask instance
      //  By default, if you run the backend locally, it's available at localhost:5000
      CB_ENDPOINT: (process.env.NODE_ENV == 'development' ? 'http://localhost:8090' : ''),
      // Legacy APIs
      APIv1: '',
      // New API, exposed by Connexion
      APIv2: '/v1'
    })  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: "0.0.0.0",
    port: 8080
  },
  preview: {
    host: "0.0.0.0",
    port: 8080
  }
})
