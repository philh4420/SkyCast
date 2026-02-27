import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['icon.svg'],
          manifest: {
            name: 'SkyCast Weather',
            short_name: 'SkyCast',
            description: 'A beautiful, cinematic weather dashboard',
            theme_color: '#0284c7',
            background_color: '#000000',
            display: 'standalone',
            display_override: ['window-controls-overlay', 'standalone'],
            orientation: 'any',
            scope: '/',
            start_url: '/',
            id: '/',
            categories: ['weather', 'utilities'],
            icons: [
              {
                src: 'icon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
                purpose: 'any'
              },
              {
                src: 'icon.svg',
                sizes: '192x192',
                type: 'image/svg+xml',
                purpose: 'maskable'
              },
              {
                src: 'icon.svg',
                sizes: '512x512',
                type: 'image/svg+xml',
                purpose: 'maskable'
              }
            ]
          }
        })
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
