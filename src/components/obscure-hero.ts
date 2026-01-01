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

import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('obscure-hero')
export class ObscureHero extends LitElement {
    render() {
        return html`
            <section class="hero container">
                <div class="hero-title" data-text="OBSCURE COMPUTER">
                    <div class="hero-title-text"><span class="hero-text-animation">OBSCURE</span></div>
                    <h1 class="hero-title-text"><span class="hero-text-animation" style="color: var(--c-cyan);">COMPUTER</span></h1>
                </div>

                <div class="hero-sub">
                    <div><span class="hero-dot-thingy"></span>EST. BARELY 2025</div>
                    <div><span class="hero-dot-thingy"></span>WE MAKE OBSCURE STUFF</div>
                </div>

                <div class="scroll-indicator">
                    <div class="scroll-line"></div>
                    Scroll
                </div>
            </section>
        `;
    }

    createRenderRoot() {
        return this;
    }
}