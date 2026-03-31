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

import gsap from "gsap";

export function initParticles(root: ParentNode) {
    const container = root.querySelector("#particles");
    if (!container) return;

    const colors = ["var(--c-cyan)", "var(--c-pink)", "var(--c-yellow)"];

    for (let i = 0; i < 15; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        p.style.left = Math.random() * 100 + "vw";
        p.style.animationDelay = Math.random() * 15 + "s";
        p.style.setProperty("--drift", (Math.random() - 0.5) * 100 + "px");
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(p);
    }
}

export function initCursor(
    root: ParentNode,
    hoverSelector: string,
) {
    const dot = root.querySelector(".cursor-dot") as HTMLElement;
    const outline = root.querySelector(".cursor-outline") as HTMLElement;

    if (!dot || !outline) return;

    dot.style.opacity = "0";
    outline.style.opacity = "0";
    document.body.style.cursor = "none";

    window.addEventListener("mousemove", (e) => {
        if (dot.style.opacity === "0") {
            dot.style.opacity = "1";
            outline.style.opacity = "1";
        }
        gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0 });
        gsap.to(outline, { x: e.clientX, y: e.clientY, duration: 0.15 });
    });

    document.addEventListener("mouseover", (e) => {
        const target = e.target as HTMLElement;
        if (target.closest(hoverSelector)) {
            outline.classList.add("hovered");
        }
    });

    document.addEventListener("mouseout", (e) => {
        const target = e.target as HTMLElement;
        if (target.closest(hoverSelector)) {
            outline.classList.remove("hovered");
        }
    });
}
