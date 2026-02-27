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
import { customElement, property } from "lit/decorators.js";
import gsap from "gsap";
import { initParticles, initCursor } from "../scripts/effects.ts";
import { notFoundMessages } from "../scripts/data.ts";

@customElement("obscure-not-found")
export class ObscureNotFound extends LitElement {
  @property() path = "/";

  private _recommendation =
    notFoundMessages[Math.floor(Math.random() * notFoundMessages.length)];

  render() {
    return html`
      <div class="noise"></div>
      <div class="scanlines"></div>
      <div class="pixels" id="particles"></div>
      <div class="cursor-dot"></div>
      <div class="cursor-outline"></div>

      <div class="not-found">
        <div class="not-found-code">404</div>

        <div class="not-found-terminal">
          <div class="not-found-line">
            <span class="prompt">&gt;</span>
            <span class="err"> SEGFAULT</span> at
            <span class="addr">0xDEADBEEF</span>
          </div>
          <div class="not-found-line">
            <span class="prompt">&gt;</span> PAGE_TABLE lookup
            <span class="err">failed</span>
          </div>
          <div class="not-found-line">
            <span class="prompt">&gt;</span> requested path:
            <span class="addr">"${this.path}"</span>
          </div>
          <div class="not-found-line">
            <span class="prompt">&gt;</span> dumping core...
          </div>
          <div class="not-found-line">
            <span class="prompt">&gt;</span> ......
          </div>
          <div class="not-found-line">
            <span class="prompt">&gt;</span> RECOMMENDATION:
            <span class="err">${this._recommendation}</span>
            <span class="not-found-cursor"></span>
          </div>
        </div>

        <a href="/" class="not-found-link">
          <span class="bracket">[</span> RETURN_HOME
          <span class="bracket">]</span>
        </a>
      </div>
    `;
  }

  firstUpdated() {
    initParticles(this.renderRoot);
    initCursor(this.renderRoot, "a");

    const lines = this.renderRoot.querySelectorAll(".not-found-line");
    gsap.to(lines, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.15,
      ease: "power2.out",
      delay: 0.3,
    });
  }

  createRenderRoot() {
    return this;
  }
}
