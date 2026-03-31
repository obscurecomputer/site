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

import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { initParticles, initCursor } from "../../scripts/effects";

import "./obscure-blog-list";
import "./obscure-blog-post";

@customElement("obscure-blog-app")
export class ObscureBlogApp extends LitElement {
    @property()
    slug = "";

    render() {
        return html`
            <div class="noise"></div>
            <div class="scanlines"></div>
            <div class="pixels" id="particles"></div>
            <div class="cursor-dot"></div>
            <div class="cursor-outline"></div>

            <main class="blog-main">
                ${this.slug
                    ? html`<obscure-blog-post
                          .slug=${this.slug}
                      ></obscure-blog-post>`
                    : html`<obscure-blog-list></obscure-blog-list>`}
            </main>
        `;
    }

    firstUpdated() {
        initParticles(this.renderRoot);
        initCursor(this.renderRoot, "a, button, .blog-post-card");
        this._initCopyButtons();
    }

    updated() {
        this._initCopyButtons();
    }

    private _initCopyButtons() {
        this.renderRoot.querySelectorAll<HTMLButtonElement>(".code-copy").forEach((btn) => {
            if (btn.dataset.bound) return;
            btn.dataset.bound = "1";
            btn.addEventListener("click", () => {
                const code = btn.closest(".code-block")?.querySelector("code");
                if (!code) return;
                const original = btn.innerHTML;
                navigator.clipboard.writeText(code.textContent ?? "").then(() => {
                    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
                    btn.style.color = "var(--c-cyan)";
                    setTimeout(() => { btn.innerHTML = original; btn.style.color = ""; }, 1500);
                });
            });
        });
    }

    createRenderRoot() {
        return this;
    }
}
