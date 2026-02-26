/*
 * Copyright (c) Obscure Computer 2026. Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { TokenizerAndRendererExtension, Tokens } from "marked";

interface AlertToken extends Tokens.Generic {
  type: "alert";
  alertType: string;
  text: string;
}

export const infoboxExtension: TokenizerAndRendererExtension = {
  name: "alert",
  level: "block",
  start(src) { return src.match(/:::(info|note|tip|important|warning|caution)\n/i)?.index; },
  tokenizer(src) {
    const rule = /^:::(info|note|tip|important|warning|caution)\n([\s\S]*?)\n:::\s*(?:\n|$)/i;
    const match = rule.exec(src);

    if (match) {
      const alertType = match[1].toUpperCase();
      const text = match[2].trim();

      return {
        type: "alert",
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
