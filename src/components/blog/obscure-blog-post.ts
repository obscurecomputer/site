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
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import posts from "virtual:blog-posts";

@customElement("obscure-blog-post")
export class ObscureBlogPost extends LitElement {
    @property()
    slug = "";

    private get _post(): BlogPostFull | undefined {
        return posts.find((p) => p.slug === this.slug);
    }

    private get _readTime(): number {
        if (!this._post) return 0;
        const text = this._post.html.replace(/<[^>]*>/g, "");
        const words = text.trim().split(/\s+/).length;
        return Math.max(1, Math.round(words / 200));
    }

    render() {
        if (!this._post) {
            return html`
                <div class="blog-container">
                    <nav class="blog-nav">
                        <a href="/blog/" class="blog-back-link interactable">
                            <span class="bracket">[</span> BACK
                            <span class="bracket">]</span>
                        </a>
                    </nav>
                    <div class="blog-error">
                        <h1>POST_NOT_FOUND</h1>
                        <p>No post matching slug "${this.slug}"</p>
                    </div>
                </div>
            `;
        }

        return html`
            <div class="blog-container">
                <nav class="blog-nav">
                    <a href="/blog/" class="blog-back-link interactable">
                        <span class="bracket">[</span> BACK
                        <span class="bracket">]</span>
                    </a>
                </nav>

                <article class="blog-article">
                    <header class="blog-article-header">
                        <h1 class="blog-article-title">${this._post.title}</h1>
                        <div class="blog-article-meta">
                            <span class="blog-article-date"
                                >${this._post.date}</span
                            >
                            <span class="blog-article-author"
                                >by ${this._post.author}</span
                            >
                            <span class="blog-article-readtime"
                                >${this._readTime} min read</span
                            >
                        </div>
                        <div class="blog-post-card-tags">
                            ${this._post.tags.map(
                                (tag) =>
                                    html`<span class="blog-tag">${tag}</span>`
                            )}
                        </div>
                    </header>

                    <div class="blog-article-body">
                        ${unsafeHTML(this._post.html)}
                    </div>
                </article>
            </div>
        `;
    }

    createRenderRoot() {
        return this;
    }
}
