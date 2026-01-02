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

@customElement("obscure-about")
export class ObscureAbout extends LitElement {
    render() {
        return html`
            <section class="section container">
                <p class="about morse-code" id="about-text">
                    We are a collective of <span class="badge">developers</span> and <span class="badge">designers</span> dedicated to <span class="highlight">creative experimentation</span>. From <span class="highlight">Minecraft mods</span> to <span class="highlight">Lua scripting utilities</span>, we believe in the power of <span class="highlight">open-source</span> and building awesome software for <span class="highlight">everybody</span>.
                </p>
            </section>
        `;
    }

    createRenderRoot() {
        return this;
    }
}
