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
