import { createHighlighter } from "shiki";
import type { MarkedExtension } from "marked";

const highlighter = await createHighlighter({
    themes: ["vitesse-dark"],
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
                    theme: "vitesse-dark",
                });
            } catch {
                html = highlighter.codeToHtml(text, {
                    lang: "text",
                    theme: "vitesse-dark",
                });
            }
            html = html.replace(
                /^<pre /,
                `<pre data-lang="${label}" `
            );
            return `<div class="code-block">${html}<button class="code-copy" type="button"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button></div>`;
        },
    },
};
