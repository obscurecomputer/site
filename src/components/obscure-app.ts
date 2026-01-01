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
import { customElement, state } from "lit/decorators.js";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import "./obscure-loader";
import "./obscure-hero";
import "./obscure-about";
import "./obscure-marquee";
import "./obscure-projects";
import "./obscure-divider-marquee";
import "./obscure-members";
import "./obscure-footer";
import { memberData } from "../scripts/stuff";

@customElement("obscure-app")
export class ObscureApp extends LitElement {
    @state()
    private loaded = false;

    render() {
        return html`
            <div class="noise"></div>
            <div class="scanlines"></div>
            <div class="pixels" id="particles"></div>
            <div class="cursor-dot"></div>
            <div class="cursor-outline"></div>

            ${!this.loaded
                ? html`<obscure-loader
                      @loaded="${this._onLoaded}"
                  ></obscure-loader>`
                : ""}

            <main
                id="main-content"
                style="${!this.loaded ? "visibility: hidden;" : ""}"
            >
                <obscure-hero></obscure-hero>
                <obscure-about></obscure-about>
                <obscure-marquee></obscure-marquee>

                <section class="section container">
                    <obscure-projects></obscure-projects>
                    <obscure-divider-marquee></obscure-divider-marquee>
                    <obscure-members></obscure-members>
                </section>

                <obscure-footer></obscure-footer>
            </main>

            <div class="modal-wrapper">
                <div class="modal-backdrop"></div>
                <div class="modal-container">
                    <div class="modal-header">
                        <h2 id="modal-name"></h2>
                        <div id="modal-role" class="badge"></div>
                    </div>

                    <div class="modal-body">
                        <div class="modal-img-col">
                            <img id="modal-img" src="" alt="Profile" />
                        </div>

                        <div class="modal-content-col">
                            <p id="modal-bio"></p>
                            <div class="modal-links">
                                <a
                                    href="#"
                                    target="_blank"
                                    class="link"
                                    id="link-gh"
                                >
                                    <span class="bracket">[</span> GITHUB
                                    <span class="bracket">]</span>
                                </a>
                                <a
                                    href="#"
                                    target="_blank"
                                    class="link"
                                    id="link-social"
                                >
                                    <span class="bracket">[</span> SOCIAL
                                    <span class="bracket">]</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <button class="modal-close interactable">
                        [ESC] CLOSE_VIEW
                    </button>
                </div>
            </div>
        `;
    }

    private _onLoaded() {
        this.loaded = true;
        this.updateComplete.then(() => {
            this._initParticles();
            this._initAnimations();

            setTimeout(() => ScrollTrigger.refresh(), 100);
        });
    }

    private _initParticles() {
        const container = this.renderRoot.querySelector("#particles");
        if (!container) return;

        const colors = ["var(--c-cyan)", "var(--c-pink)", "var(--c-yellow)"];

        for (let i = 0; i < 15; i++) {
            const p = document.createElement("div");
            p.className = "particle";
            p.style.left = Math.random() * 100 + "vw";
            p.style.animationDelay = Math.random() * 15 + "s";
            p.style.setProperty("--drift", (Math.random() - 0.5) * 100 + "px");
            p.style.background =
                colors[Math.floor(Math.random() * colors.length)];
            container.appendChild(p);
        }
    }

    private _initAnimations() {
        gsap.to(".hero-text-animation", {
            y: 0,
            duration: 1.4,
            stagger: 0.1,
            ease: "power3.out",
        });

        gsap.to(".hero-sub, .scroll-indicator", {
            opacity: 1,
            duration: 1,
            ease: "power2.out",
        });

        gsap.from(".about", {
            scrollTrigger: {
                trigger: ".about",
                start: "top 80%",
                end: "bottom 60%",
                scrub: 1,
            },
            opacity: 0.2,
            y: 30,
            duration: 1,
        });

        const items = this.renderRoot.querySelectorAll(".project-item");
        items.forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 95%",
                },
                opacity: 0,
                y: 40,
                duration: 0.6,
                delay: i * 0.1,
                ease: "power2.out",
            });
        });

        const members = this.renderRoot.querySelectorAll(".member-row");
        members.forEach((member, i) => {
            gsap.from(member, {
                scrollTrigger: {
                    trigger: member,
                    start: "top 90%",
                },
                borderBottomColor: "rgba(255,255,255,0)",
                scaleX: 0.95,
                opacity: 0,
                duration: 1,
                delay: i * 0.1,
                ease: "power3.out",
            });
        });

        gsap.to(".marquee", {
            scrollTrigger: {
                trigger: ".marquee",
                scrub: true,
            },
            rotation: 2,
            scale: 1.05,
        });

        gsap.to(this.renderRoot.querySelector(".track"), {
            x: "-50%",
            duration: 20,
            ease: "none",
            repeat: -1,
        });

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        });

        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        ScrollTrigger.refresh();

        this._initCursor();
        this._initMembers();
        this._initModal();
    }

    private _initMembers() {
        const rows = this.renderRoot.querySelectorAll(".member-row");
        const revealBox = this.renderRoot.querySelector(
            ".members-img-reveal"
        ) as HTMLElement;
        const revealImg = this.renderRoot.querySelector(
            "#members-img"
        ) as HTMLImageElement;

        if (!revealBox || !revealImg) return;

        rows.forEach((row) => {
            row.addEventListener("mouseenter", () => {
                const url = row.getAttribute("data-img");
                if (url) {
                    revealImg.src = url;
                    revealBox.classList.add("active");
                    gsap.to(revealImg, { scale: 1, duration: 0.4 });
                }
            });
            row.addEventListener("mouseleave", () => {
                revealBox.classList.remove("active");
                gsap.to(revealImg, { scale: 1.2, duration: 0.4 });
            });
            row.addEventListener("click", () => {
                const index = row.getAttribute("data-index");
                const img = row.getAttribute("data-img");
                if (index !== null && img !== null) {
                    this._modalOpen(parseInt(index), img);
                }
            });
        });

        window.addEventListener("mousemove", (e) => {
            gsap.to(revealBox, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.6,
                ease: "power3.out",
            });
        });
    }

    private _modalOpen(idx: number, imgUrl: string) {
        const data = memberData[idx];
        if (!data) return;

        const wrapper = this.renderRoot.querySelector(
            ".modal-wrapper"
        ) as HTMLElement;
        const container = this.renderRoot.querySelector(
            ".modal-container"
        ) as HTMLElement;
        const name = this.renderRoot.querySelector(
            "#modal-name"
        ) as HTMLElement;
        const role = this.renderRoot.querySelector(
            "#modal-role"
        ) as HTMLElement;
        const bio = this.renderRoot.querySelector("#modal-bio") as HTMLElement;
        const img = this.renderRoot.querySelector(
            "#modal-img"
        ) as HTMLImageElement;
        const gh = this.renderRoot.querySelector(
            "#link-gh"
        ) as HTMLAnchorElement;
        const soc = this.renderRoot.querySelector(
            "#link-social"
        ) as HTMLAnchorElement;

        name.innerText = data.name;
        role.innerText = `[ ${data.role} ]`;
        bio.innerText = data.bio;
        img.src = imgUrl;
        gh.href = data.github;
        soc.href = data.social;

        wrapper.style.display = "flex";

        gsap.killTweensOf([wrapper, container]);
        const tl = gsap.timeline();
        tl.to(wrapper, { duration: 0.3, opacity: 1 }).to(
            container,
            { duration: 0.5, y: 0, opacity: 1, ease: "power4.out" },
            "-=0.2"
        );

        (window as any).isModalOpen = true;
    }

    private _modalClose() {
        const wrapper = this.renderRoot.querySelector(
            ".modal-wrapper"
        ) as HTMLElement;
        const container = this.renderRoot.querySelector(
            ".modal-container"
        ) as HTMLElement;

        gsap.to(container, {
            duration: 0.3,
            y: 50,
            opacity: 0,
            ease: "power2.in",
        });
        gsap.to(wrapper, {
            duration: 0.3,
            opacity: 0,
            delay: 0.1,
            onComplete: () => {
                wrapper.style.display = "none";
                (window as any).isModalOpen = false;
            },
        });
    }

    private _initModal() {
        const closeBtn = this.renderRoot.querySelector(".modal-close");
        const backdrop = this.renderRoot.querySelector(".modal-backdrop");

        closeBtn?.addEventListener("click", () => this._modalClose());
        backdrop?.addEventListener("click", () => this._modalClose());

        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && (window as any).isModalOpen) {
                this._modalClose();
            }
        });
    }

    private _initCursor() {
        const dot = this.renderRoot.querySelector(".cursor-dot") as HTMLElement;
        const outline = this.renderRoot.querySelector(
            ".cursor-outline"
        ) as HTMLElement;

        if (!dot || !outline) return;

        window.addEventListener("mousemove", (e) => {
            gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0 });
            gsap.to(outline, { x: e.clientX, y: e.clientY, duration: 0.15 });
        });

        const hoverables = this.renderRoot.querySelectorAll(
            "a, button, .project-item, .member-row"
        );
        hoverables.forEach((el) => {
            el.addEventListener("mouseenter", () =>
                outline.classList.add("hovered")
            );
            el.addEventListener("mouseleave", () =>
                outline.classList.remove("hovered")
            );
        });
    }

    createRenderRoot() {
        return this;
    }
}
