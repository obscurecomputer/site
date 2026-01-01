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
import { projectsData } from "../scripts/stuff.ts";

@customElement("obscure-projects")
export class ObscureProjects extends LitElement {
    render() {
        return html`
            <div>
                <div class="members-header">
                    <span class="section-label">01 — our projects</span>
                    <span class="section-label-right" id="project-count-label"
                        >PROJECTS: ${projectsData.length}</span
                    >
                </div>

                <div class="projects-list" id="projects-container">
                    ${projectsData.map(
                        (proj) => html`
                            <div
                                class="project-item interactable"
                                @click="${() =>
                                    window.open(proj.link, "_blank")}"
                            >
                                <span class="p-name">${proj.name}</span>
                                <span class="p-cat">${proj.cat}</span>
                                <div
                                    class="status"
                                    style="${proj.active
                                        ? ""
                                        : "background: #555; box-shadow: none;"}"
                                ></div>
                            </div>
                        `
                    )}
                </div>

                <div class="divider"></div>
            </div>
        `;
    }

    createRenderRoot() {
        return this;
    }
}
