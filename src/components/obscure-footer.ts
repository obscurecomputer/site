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
import { globe } from "../scripts/globe.ts";

@customElement("obscure-footer")
export class ObscureFooter extends LitElement {
    render() {
        return html`
            <footer>
                <div class="container">
                    <div class="footer-cta">
                        <div class="fcta-small">got an idea?</div>
                        <a href="#" class="interactable fcta-big"
                            >keep it to yourself.</a
                        >
                    </div>
                </div>

                <div class="real-footer">
                    <div class="footer-deco"></div>
                    <div class="footer-deco"></div>
                    <div class="footer-deco"></div>

                    <div class="footer-bottom">
                        <div class="f-side f-left">
                            <div class="meta-row">
                                <span class="meta-label">LOC.NET ::</span>
                                <span class="meta-val">MUMBAI_SLUMS</span>
                            </div>
                            <div class="meta-row">
                                <span class="meta-label">IS.DOWN ::</span>
                                <span class="meta-val"
                                    ><span class="status-blink">●</span>
                                    NUH_UH</span
                                >
                            </div>
                            <div class="meta-row copyright-row">
                                <span class="meta-val"
                                    >&copy; 2025 OBSCURE COMPUTER</span
                                >
                            </div>
                        </div>

                        <div class="f-center interactable" id="globe-trigger">
                            <svg class="spinny-text" viewBox="0 0 100 100">
                                <path
                                    id="circlePath"
                                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                                    fill="transparent"
                                />
                                <text>
                                    <textPath
                                        href="#circlePath"
                                        startOffset="0%"
                                    >
                                        OBSCURE COMPUTER — SINCE 2025 — wtf how
                                    </textPath>
                                </text>
                            </svg>

                            <div id="three-container"></div>
                        </div>

                        <div class="f-side f-right">
                            <a href="#" class="link">
                                <span class="bracket">[</span> DISCORD_SV
                                <span class="bracket">]</span>
                            </a>
                            <a href="#" class="link">
                                <span class="bracket">[</span> GITHUB_ORG
                                <span class="bracket">]</span>
                            </a>
                            <a href="#" class="link">
                                <span class="bracket">[</span> HELP_EMAIL
                                <span class="bracket">]</span>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }

    protected firstUpdated() {
        const container = this.renderRoot.querySelector(
            "#three-container"
        ) as HTMLElement;
        const trigger = this.renderRoot.querySelector(
            "#globe-trigger"
        ) as HTMLElement;
        if (container && trigger) {
            globe(container, trigger);
        }
    }

    createRenderRoot() {
        return this;
    }
}
