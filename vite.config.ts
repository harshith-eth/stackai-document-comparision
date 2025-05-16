import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env file
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    define: {
      // Expose environment variables with VITE_ prefix to the client-side code
      'import.meta.env.VITE_AZURE_OPENAI_API_KEY': JSON.stringify(env.AZURE_OPENAI_API_KEY),
      'import.meta.env.VITE_AZURE_OPENAI_ENDPOINT': JSON.stringify(env.AZURE_OPENAI_ENDPOINT),
      'import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT_NAME': JSON.stringify(env.AZURE_OPENAI_DEPLOYMENT_NAME),
      'import.meta.env.VITE_AZURE_OPENAI_API_VERSION': JSON.stringify(env.AZURE_OPENAI_API_VERSION),
      'import.meta.env.VITE_AZURE_OPENAI_RESOURCE_NAME': JSON.stringify(env.AZURE_OPENAI_RESOURCE_NAME),
    },
    // Configure the public directory to include PDF files from root
    publicDir: 'public',
    // Configure static assets
    assetsInclude: ['**/*.pdf'],
    // Configure the server to properly handle PDF files
    server: {
      fs: {
        // Allow serving files from root and parent directories
        allow: ['..', '.']
      },
    },
    // Configure build to properly handle static assets
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
      },
    },
  };
});
