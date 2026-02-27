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

const copyIcon = html`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
const checkIcon = html`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;

@customElement("obscure-code-copy")
export class ObscureCodeCopy extends LitElement {
    @state() private _copied = false;

    private _onClick() {
        const block = this.closest(".code-block");
        const code = block?.querySelector("code");
        if (!code) return;

        navigator.clipboard.writeText(code.textContent ?? "").then(() => {
            this._copied = true;
            setTimeout(() => { this._copied = false; }, 1500);
        });
    }

    render() {
        return html`
            <button
                class="code-copy ${this._copied ? "code-copy-ok" : ""}"
                type="button"
                @click=${this._onClick}
            >
                ${this._copied ? checkIcon : copyIcon}
            </button>
        `;
    }

    createRenderRoot() {
        return this;
    }
}
