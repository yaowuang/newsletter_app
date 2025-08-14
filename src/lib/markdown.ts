// Shared lightweight markdown helpers for compact render contexts (e.g., calendar cells)
// For full article/section markdown use react-markdown in TextBlock.

/**
 * Convert a limited subset of Markdown to HTML for tight spaces.
 * Supports: bold, italic, unordered/ordered lists, links, tables (basic), hr, line breaks.
 * Escapes HTML before processing to avoid injection.
 */
export function basicMarkdownToHtml(md: string): string {
  if (!md) return '';
  let txt = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Horizontal rules
  txt = txt.replace(/^---$/gm, '<hr />');

  // Unordered lists (lines starting with - space). Capture until a blank line or non-list line.
  txt = txt.replace(/(?:^|\n)(- .+(?:\n- .+)*)/g, (block: string) => {
    // Preserve leading newline if present
    const leadingNewline = block.startsWith('\n') ? '\n' : '';
    const content = leadingNewline ? block.slice(1) : block; // strip leading newline for processing
    const lines = content.split(/\n/);
    if (!lines.every(l => /^-\s+/.test(l))) return block; // safety guard
    const items = lines.map(l => l.replace(/^-\s+/, '').trim());
    return `${leadingNewline}<ul>` + items.map(i => `<li>${i}</li>`).join('') + '</ul>';
  });
  // Ordered lists (1. item, 2. item ...). Support block at end of string too.
  txt = txt.replace(/(?:^|\n)((?:\d+\. .+(?:\n|$))+)/g, (block: string) => {
    const leadingNewline = block.startsWith('\n') ? '\n' : '';
    const content = leadingNewline ? block.slice(1) : block;
    const lines = content.split(/\n/).filter(l => l.length > 0);
    if (!lines.every(l => /^\d+\.\s+/.test(l))) return block;
    const items = lines.map(l => l.replace(/^\d+\.\s+/, '').trim());
    return `${leadingNewline}<ol>` + items.map(i => `<li>${i}</li>`).join('') + '</ol>';
  });

  // Bold & italic
  txt = txt.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  txt = txt.replace(/(^|[^*])\*(?!\*)([^*]+)\*(?!\*)/g, '$1<em>$2</em>');

  // Links
  txt = txt.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Tables (primitive)
  if (txt.includes('|')) {
    txt = txt.replace(/((?:^.*\|.*$\n?)+)/gm, (block) => {
      const lines = block.trim().split(/\n/);
      if (lines.length === 0) return block;
      const hasSep = lines.some(l => /^\s*\|?\s*:?-{3,}:?/.test(l));
      if (!hasSep) return block;
      const rows = lines.filter(l => !/^\s*\|?\s*:?-{3,}:?/.test(l));
      const htmlRows = rows.map((l, idx) => {
        const cells = l.split('|').filter(c => c.trim() !== '').map(c => c.trim());
        const tag = idx === 0 ? 'th' : 'td';
        return '<tr>' + cells.map(c => `<${tag}>${c}</${tag}>`).join('') + '</tr>';
      }).join('');
      return `<table>${htmlRows}</table>`;
    });
  }

  // Line breaks (avoid adding <br/> inside list / table tags by splitting on blocks)
  // Replace remaining newlines that are not directly after block-level tags we inserted
  txt = txt.replace(/([^>])\n/g, (m, prev) => `${prev}<br />`);

  return txt;
}
