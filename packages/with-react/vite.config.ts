/// <reference types="vitest" />
import { defineConfig } from 'vite';
import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import rehypeHighlight from 'rehype-highlight';

import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import yaml from 'highlight.js/lib/languages/yaml';
import ts from 'highlight.js/lib/languages/typescript';

// https://vitejs.dev/config/
export default defineConfig({
  build: { target: 'esnext' },
  plugins: [
    mdx({
      rehypePlugins: [[rehypeHighlight, { languages: { json, bash, yaml, ts } }]],
      remarkPlugins: [],
    }),
    react(),
    wasm(),
    nodePolyfills({
      globals: {
        Buffer: true, // can also be 'build', 'dev', or false
        global: true,
        process: true,
      },
      include: ['events', 'buffer', 'crypto', 'stream', 'vm'],
    }),
  ],

  server: {
    port: 3000,
  },
  define: {
    __API_URL__: JSON.stringify(process.env.API_ENDPOINT_DEVNET),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    silent: true,
    deps: {
      optimizer: {
        web: {
          include: ['@coinweb/wallet-lib'], // need this because of wasm
        },
      },
    },
  },
});
