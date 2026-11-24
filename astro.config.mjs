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

/** @type {import('unified').Plugin<[], import('hast').Root>} */
function renderMermaid() {
  const render = rehypeMermaid.call(this, mermaidOptions);

  return async (tree, file) => {
    try {
      await render?.(tree, file, (error) => {
        if (error) throw error;
      });
    } catch (error) {
      const message = error instanceof Error ? error.message.split('\n')[0] : String(error);
      console.warn(`[mermaid] ${file.path || 'Markdown'}: ${message}. Keeping the Mermaid source.`);
    }
  };
}

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  markdown: {
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    processor: unified({
      rehypePlugins: [renderMermaid]
    })
  },

  integrations: [preact()]
});
