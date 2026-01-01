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
import { bootMessages } from "../scripts/stuff.ts";
import gsap from "gsap";

@customElement("obscure-loader")
export class ObscureLoader extends LitElement {
    render() {
        const msg =
            bootMessages[Math.floor(Math.random() * bootMessages.length)];
        return html`
            <div class="loader">
                <div class="loader-symbol">
                    <div class="loader-symbol-bit"></div>
                    <div class="loader-symbol-bit"></div>
                    <div class="loader-symbol-bit"></div>
                    <div class="loader-symbol-bit"></div>
                    <div class="loader-symbol-bit"></div>
                    <div class="loader-symbol-bit"></div>
                    <div class="loader-symbol-bit"></div>
                    <div class="loader-symbol-bit"></div>
                    <div class="loader-symbol-bit"></div>
                </div>
                <div class="loader-msg">
                    > ${msg}<span class="cursor-blink">_</span>
                </div>
            </div>
        `;
    }

    protected firstUpdated() {
        const bits = this.renderRoot.querySelectorAll(".loader-symbol-bit");
        const flickerInterval = setInterval(() => {
            bits.forEach(
                (b) =>
                    ((b as HTMLElement).style.opacity =
                        Math.random() > 0.5 ? "1" : "0.2")
            );
        }, 50);

        const tl = gsap.timeline();
        tl.to({}, { duration: 0.8 })
            .call(() => {
                clearInterval(flickerInterval);
                bits.forEach((b) => ((b as HTMLElement).style.opacity = "1"));
            })
            .to(this.renderRoot.querySelector(".loader"), {
                clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
                duration: 0.6,
                ease: "power4.inOut",
            })
            .call(() => {
                this.dispatchEvent(
                    new CustomEvent("loaded", { bubbles: true, composed: true })
                );
            });
    }

    createRenderRoot() {
        return this;
    }
}
