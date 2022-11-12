import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import EnvironmentPlugin from 'vite-plugin-environment';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import istanbul from 'vite-plugin-istanbul';

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
      VITE_CB_ENDPOINT: (process.env.NODE_ENV == 'development' ? 'http://localhost:8090' : 'http://localhost:8090'),
      // Legacy APIs
    }),
    istanbul({
      include: 'src/*',
      exclude: ['node_modules', 'test/'],
      extension: [ '.js', '.ts', '.vue' ],
      requireEnv: true,
    })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 8080
  },
  preview: {
    host: '0.0.0.0',
    port: 8080
  }
});
