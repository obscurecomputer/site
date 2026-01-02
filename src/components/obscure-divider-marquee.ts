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

@customElement("obscure-divider-marquee")
export class ObscureDividerMarquee extends LitElement {
    render() {
        return html`
            <div class="divider-marquee interactable">
                <div class="divmar-track" id="mouseTrack">
                    <span class="divmar-item">KOTLIN</span>
                    <span class="divmar-item">::</span>
                    <span class="divmar-item">C17</span>
                    <span class="divmar-item">::</span>
                    <span class="divmar-item">TYPESCRIPT</span>
                    <span class="divmar-item">::</span>
                    <span class="divmar-item">JAVA</span>
                    <span class="divmar-item">::</span>
                    <span class="divmar-item">C#</span>
                    <span class="divmar-item">::</span>
                    <span class="divmar-item">GO</span>
                    <span class="divmar-item">::</span>
                    
                    
                </div>
            </div>
        `;
    }

    protected firstUpdated() {
        this._initMarquee();
    }

    private _initMarquee() {
        const track = this.renderRoot.querySelector(
            "#mouseTrack"
        ) as HTMLElement;
        const wrapper = this.renderRoot.querySelector(
            ".divider-marquee"
        ) as HTMLElement;
        if (!track || !wrapper) return;

        const content = track.innerHTML;
        track.innerHTML = content.repeat(4);

        let scrollPos = 0;
        let currentSpeed = 0;
        let targetSpeed = 2;
        const trackWidth = track.scrollWidth / 2;

        window.addEventListener("mousemove", (e) => {
            const centerNorm = e.clientX / window.innerWidth - 0.5;
            targetSpeed = centerNorm * 35;
        });

        wrapper.addEventListener("mouseleave", () => (targetSpeed = 2));

        const animate = () => {
            currentSpeed += (targetSpeed - currentSpeed) * 0.05;
            scrollPos += currentSpeed;

            if (scrollPos <= -trackWidth) scrollPos = 0;
            if (scrollPos > 0) scrollPos = -trackWidth;

            track.style.transform = `translateX(${scrollPos}px) skewX(${
                currentSpeed * -0.5
            }deg)`;
            requestAnimationFrame(animate);
        };
        animate();
    }

    createRenderRoot() {
        return this;
    }
}
