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

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { Plugin } from "vite";
import { infoboxExtension } from "./extensions/infobox.ts";
import { highlightExtension } from "./extensions/highlight.ts";

interface PostMeta {
    slug: string;
    title: string;
    date: string;
    description: string;
    tags: string[];
    author: string;
}

interface PostFull extends PostMeta {
    html: string;
}

const POSTS_DIR = path.resolve("src/content/posts");
const VIRTUAL_LIST = "virtual:blog-posts";
const RESOLVED_LIST = "\0" + VIRTUAL_LIST;

function getSlug(filename: string): string {
    return filename.replace(/\.md$/, "");
}

marked.use({ extensions: [infoboxExtension] });
marked.use(highlightExtension);

function parsePost(filePath: string): PostFull {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const html = marked.parse(content) as string;
    const slug = getSlug(path.basename(filePath));

    return {
        slug,
        title: data.title ?? slug,
        date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
        description: data.description ?? "",
        tags: data.tags ?? [],
        author: data.author ?? "",
        html,
    };
}

function getAllPosts(): PostFull[] {
    if (!fs.existsSync(POSTS_DIR)) return [];

    return fs
        .readdirSync(POSTS_DIR)
        .filter((f: string) => f.endsWith(".md"))
        .map((f: string) => parsePost(path.join(POSTS_DIR, f)))
        .sort((a: PostFull, b: PostFull) => (a.date > b.date ? -1 : 1));
}

const SITE_URL = "https://obscure.computer";

function replaceMetaTag(
    html: string,
    attr: string,
    attrValue: string,
    newContent: string,
): string {
    const re = new RegExp(
        `(<meta\\s[^>]*${attr}=["']${attrValue}["'][^>]*content=["'])([^"']*)(["'])`,
        "i",
    );
    const reAlt = new RegExp(
        `(<meta\\s[^>]*content=["'])([^"']*)(["'][^>]*${attr}=["']${attrValue}["'])`,
        "i",
    );
    if (re.test(html)) return html.replace(re, `$1${newContent}$3`);
    if (reAlt.test(html)) return html.replace(reAlt, `$1${newContent}$3`);
    return html;
}

function injectPostMeta(html: string, post: PostMeta): string {
    const title = `${post.title} | obscure computer`;
    const url = `${SITE_URL}/blog/${post.slug}`;

    let out = html.replace(
        /<title>[^<]*<\/title>/,
        `<title>${title}</title>`,
    );
    out = replaceMetaTag(out, "name", "description", post.description);
    out = replaceMetaTag(out, "property", "og:title", title);
    out = replaceMetaTag(out, "property", "og:description", post.description);
    out = replaceMetaTag(out, "property", "og:url", url);
    out = replaceMetaTag(out, "property", "og:type", "article");
    out = replaceMetaTag(out, "property", "twitter:title", title);
    out = replaceMetaTag(out, "property", "twitter:description", post.description);
    out = out.replace(
        /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
        `<link rel="canonical" href="${url}" />`,
    );

    return out;
}

function injectBlogListingMeta(html: string): string {
    const title = "blog | obscure computer";
    const description =
        "Latest posts from the obscure computer collective.";
    const url = `${SITE_URL}/blog`;

    let out = html.replace(
        /<title>[^<]*<\/title>/,
        `<title>${title}</title>`,
    );
    out = replaceMetaTag(out, "name", "description", description);
    out = replaceMetaTag(out, "property", "og:title", title);
    out = replaceMetaTag(out, "property", "og:description", description);
    out = replaceMetaTag(out, "property", "og:url", url);
    out = replaceMetaTag(out, "property", "twitter:title", title);
    out = replaceMetaTag(out, "property", "twitter:description", description);
    out = out.replace(
        /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
        `<link rel="canonical" href="${url}" />`,
    );

    return out;
}

export default function blogPlugin(): Plugin {
    return {
        name: "vite-plugin-blog",

        resolveId(id) {
            if (id === VIRTUAL_LIST) return RESOLVED_LIST;
            return null;
        },

        load(id) {
            if (id === RESOLVED_LIST) {
                const posts = getAllPosts();
                return `export default ${JSON.stringify(posts)};`;
            }

            return null;
        },

        closeBundle() {
            const distDir = path.resolve("dist");
            const indexPath = path.join(distDir, "index.html");
            if (!fs.existsSync(indexPath)) return;

            const template = fs.readFileSync(indexPath, "utf-8");
            const posts = getAllPosts();

            const blogDir = path.join(distDir, "blog");
            fs.mkdirSync(blogDir, { recursive: true });

            // Generate per-post HTML files as blog/<slug>.html so
            // Cloudflare Pages serves them directly without a trailing-slash redirect
            for (const post of posts) {
                fs.writeFileSync(
                    path.join(blogDir, `${post.slug}.html`),
                    injectPostMeta(template, post),
                );
            }

            // Generate blog listing HTML
            fs.writeFileSync(
                path.join(blogDir, "index.html"),
                injectBlogListingMeta(template),
            );
        },

        configureServer(server) {
            if (!fs.existsSync(POSTS_DIR)) return;

            server.watcher.add(POSTS_DIR);

            server.watcher.on("change", (filePath) => {
                if (filePath.startsWith(POSTS_DIR) && filePath.endsWith(".md")) {
                    const mod = server.moduleGraph.getModuleById(RESOLVED_LIST);
                    if (mod) server.moduleGraph.invalidateModule(mod);
                    server.ws.send({ type: "full-reload" });
                }
            });

            server.watcher.on("add", (filePath) => {
                if (filePath.startsWith(POSTS_DIR) && filePath.endsWith(".md")) {
                    const mod = server.moduleGraph.getModuleById(RESOLVED_LIST);
                    if (mod) server.moduleGraph.invalidateModule(mod);
                    server.ws.send({ type: "full-reload" });
                }
            });

            server.watcher.on("unlink", (filePath) => {
                if (filePath.startsWith(POSTS_DIR) && filePath.endsWith(".md")) {
                    const mod = server.moduleGraph.getModuleById(RESOLVED_LIST);
                    if (mod) server.moduleGraph.invalidateModule(mod);
                    server.ws.send({ type: "full-reload" });
                }
            });
        },
    };
}
