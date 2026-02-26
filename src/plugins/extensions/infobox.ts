import type { TokenizerAndRendererExtension, Tokens } from 'marked';

interface AlertToken extends Tokens.Generic {
  type: 'alert';
  alertType: string;
  text: string;
}

export const infoboxExtension: TokenizerAndRendererExtension = {
  name: 'alert',
  level: 'block',
  start(src) { return src.match(/:::(info|note|tip|important|warning|caution)\n/i)?.index; },
  tokenizer(src) {
    const rule = /^:::(info|note|tip|important|warning|caution)\n([\s\S]*?)\n:::\s*(?:\n|$)/i;
    const match = rule.exec(src);

    if (match) {
      const alertType = match[1].toUpperCase();
      const text = match[2].trim();

      return {
        type: 'alert',
        raw: match[0],
        alertType,
        text,
        tokens: this.lexer.blockTokens(text, [])
      };
    }
  },
  renderer(token) {
    const t = token as unknown as AlertToken;
    const body = this.parser.parse(t.tokens ?? []);
    return `
      <div class="markdown-infobox markdown-infobox-${t.alertType.toLowerCase()}">
        <p class="markdown-infobox-title">${t.alertType}</p>
        ${body}
      </div>`;
  }
};
