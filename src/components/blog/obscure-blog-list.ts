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
import { customElement } from "lit/decorators.js";
import posts from "virtual:blog-posts";

@customElement("obscure-blog-list")
export class ObscureBlogList extends LitElement {
    render() {
        return html`
            <div class="blog-container">
                <nav class="blog-nav">
                    <a href="/" class="blog-back-link interactable">
                        <span class="bracket">[</span> BACK
                        <span class="bracket">]</span>
                    </a>
                </nav>

                <header class="blog-header">
                    <h1 class="blog-title">BLOG</h1>
                    <div class="blog-header-meta">
                        <span class="blog-header-dot"></span>
                        <span>ENTRIES: ${posts.length}</span>
                    </div>
                </header>

                <div class="blog-list">
                    ${posts.map(
                        (post) => html`
                            <a
                                href="#${post.slug}"
                                class="blog-post-card interactable"
                            >
                                <div class="blog-post-card-content">
                                    <h2 class="blog-post-card-title">
                                        ${post.title}
                                    </h2>
                                    <p class="blog-post-card-desc">
                                        ${post.description}
                                    </p>
                                    <div class="blog-post-card-meta">
                                        <span class="blog-post-card-date"
                                            >${post.date}</span
                                        >
                                        <span class="blog-post-card-author"
                                            >by ${post.author}</span
                                        >
                                    </div>
                                    <div class="blog-post-card-tags">
                                        ${post.tags.map(
                                            (tag) =>
                                                html`<span class="blog-tag"
                                                    >${tag}</span
                                                >`
                                        )}
                                    </div>
                                </div>
                                <div class="blog-post-card-arrow">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </a>
                        `
                    )}
                </div>
            </div>
        `;
    }

    createRenderRoot() {
        return this;
    }
}
