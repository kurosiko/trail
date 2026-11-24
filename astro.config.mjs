// @ts-check
import { defineConfig } from 'astro/config';

import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';

import preact from '@astrojs/preact';
import rehypeMermaid from 'rehype-mermaid';

/** @type {import('rehype-mermaid').RehypeMermaidOptions} */
const mermaidOptions = {
  strategy: 'inline-svg',
  mermaidConfig: { theme: 'dark', securityLevel: 'strict' },
  errorFallback: (element) => element
};

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  markdown: {
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    processor: unified({
      rehypePlugins: [[rehypeMermaid, mermaidOptions]]
    })
  },

  integrations: [preact()]
});
