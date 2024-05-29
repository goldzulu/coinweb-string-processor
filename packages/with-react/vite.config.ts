import { defineConfig } from 'vitest/config';
import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import rehypeHighlight from 'rehype-highlight';

import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import yaml from 'highlight.js/lib/languages/yaml';
import ts from 'highlight.js/lib/languages/typescript';
import gql from 'highlight.js/lib/languages/graphql';

// https://vitejs.dev/config/
const config = defineConfig({
  base: process.env.VITE_BASE_URL || '/',
  build: { target: 'modules' },
  plugins: [
    mdx({
      rehypePlugins: [[rehypeHighlight, { languages: { json, bash, yaml, ts, gql } }]],
      remarkPlugins: [],
    }),
    react(),
    wasm(),
    topLevelAwait(),
    nodePolyfills({
      globals: {
        Buffer: true,
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
    __API_URL__: JSON.stringify(process.env.API_ENDPOINT_DEVNET || process.env.VITE_API_ENDPOINT),
    __BASE_URL__: JSON.stringify(process.env.VITE_BASE_URL),
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

export default config;
