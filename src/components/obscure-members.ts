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
import { memberData } from "../scripts/data.ts";

@customElement("obscure-members")
export class ObscureMembers extends LitElement {
    render() {
        return html`
            <div style="margin-top: 4rem" class="members-section">
                <div class="divider"></div>

                <div class="members-header">
                    <span class="section-label">02 — our members</span>
                    <span class="section-label-right"
                        >MEMBERS: ${memberData.length}</span
                    >
                </div>

                <div class="members-grid">
                    <div class="members-img-reveal">
                        <img src="" alt="" id="members-img" />
                    </div>

                    ${memberData.map(
                        (member, index) => html`
                            <div
                                class="member-row interactable"
                                data-index="${index}"
                                data-img="${member.img ||
                                "https://avatars.githubusercontent.com/u/59340653?v=4"}"
                            >
                                <div class="m-col m-index">00${index + 1}</div>
                                <div class="m-col m-name">
                                    <span class="name-text"
                                        >${member.name}</span
                                    >
                                    <span class="name-hover"
                                        >${member.handle || member.name}</span
                                    >
                                </div>
                                <div class="m-col m-role">
                                    [ ${member.role} ]
                                </div>
                                <div class="m-col m-arrow">
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <line
                                            x1="7"
                                            y1="17"
                                            x2="17"
                                            y2="7"
                                        ></line>
                                        <polyline
                                            points="7 7 17 7 17 17"
                                        ></polyline>
                                    </svg>
                                </div>
                            </div>
                        `
                    )}
                </div>
            </div>
        `;
    }

    createRenderRoot() {
        return this;
    }
}
