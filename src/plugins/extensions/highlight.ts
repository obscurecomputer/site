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

import { createHighlighter, type ShikiTransformer } from "shiki";
import type { MarkedExtension } from "marked";

const lineNumbers: ShikiTransformer = {
    name: "line-numbers",
    line(node, line) {
        node.children.unshift({
            type: "element",
            tagName: "span",
            properties: { class: "line-number" },
            children: [{ type: "text", value: String(line) }],
        });
    },
};

const highlighter = await createHighlighter({
    themes: ["synthwave-84"],
    langs: [
        "kotlin",
        "yaml",
        "typescript",
        "javascript",
        "bash",
        "html",
        "css",
        "java",
        "json",
        "lua",
        "markdown",
    ],
});

export const highlightExtension: MarkedExtension = {
    renderer: {
        code({ text, lang }) {
            const label = lang || "text";
            let html: string;
            try {
                html = highlighter.codeToHtml(text, {
                    lang: label,
                    theme: "synthwave-84",
                    transformers: [lineNumbers],
                });
            } catch {
                html = highlighter.codeToHtml(text, {
                    lang: "text",
                    theme: "synthwave-84",
                    transformers: [lineNumbers],
                });
            }
            html = html.replace(
                /^<pre /,
                `<pre data-lang="${label}" `
            );
            return `<div class="code-block">${html}<obscure-code-copy></obscure-code-copy></div>`;
        },
    },
};
