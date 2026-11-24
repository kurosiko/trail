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

/** @param {import('hast').Root | import('hast').Element} parent */
function frameMermaid(parent) {
  for (const [index, node] of parent.children.entries()) {
    if (node.type !== 'element') continue;
    const { id, viewBox } = node.properties;
    if (node.tagName !== 'svg' || typeof id !== 'string' || !id.startsWith('mermaid-')) {
      frameMermaid(node);
      continue;
    }

    const width = Number(String(viewBox).split(/\s+/)[2]);
    const title = node.children.find((child) => child.type === 'element' && child.tagName === 'title');
    const caption = title?.type === 'element' ? title.children : [];
    /** @type {import('hast').Element} */
    const figure = {
      type: 'element',
      tagName: 'figure',
      properties: { className: ['post-diagram', 'post-mermaid'] },
      children: [
        {
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['post-mermaid-scroll'],
            // Keep labels legible. Wide diagrams scroll inside the figure.
            style: Number.isFinite(width) && width > 0 ? `--mermaid-min-width: ${Math.ceil(width * 0.82)}px` : undefined
          },
          children: [node]
        }
      ]
    };
    if (caption.length) {
      figure.children.push({ type: 'element', tagName: 'figcaption', properties: {}, children: caption });
    }
    parent.children[index] = figure;
  }
}

/** @type {import('unified').Plugin<[], import('hast').Root>} */
function renderMermaid() {
  const render = rehypeMermaid.call(this, mermaidOptions);

  return async (tree, file) => {
    try {
      await render?.(tree, file, (error) => {
        if (error) throw error;
      });
      frameMermaid(tree);
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
