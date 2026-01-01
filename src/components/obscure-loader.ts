import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { bootMessages } from '../scripts/stuff.ts';
import gsap from 'gsap';

@customElement('obscure-loader')
export class ObscureLoader extends LitElement {
    render() {
        const msg = bootMessages[Math.floor(Math.random() * bootMessages.length)];
        return html`
            <div class="loader">
                <div class="loader-symbol">
                    <div class="loader-symbol-bit"></div><div class="loader-symbol-bit"></div><div class="loader-symbol-bit"></div>
                    <div class="loader-symbol-bit"></div><div class="loader-symbol-bit"></div><div class="loader-symbol-bit"></div>
                    <div class="loader-symbol-bit"></div><div class="loader-symbol-bit"></div><div class="loader-symbol-bit"></div>
                </div>
                <div class="loader-msg">> ${msg}<span class="cursor-blink">_</span></div>
            </div>
        `;
    }

    protected firstUpdated() {
        const bits = this.renderRoot.querySelectorAll('.loader-symbol-bit');
        const flickerInterval = setInterval(() => {
            bits.forEach(b => (b as HTMLElement).style.opacity = Math.random() > 0.5 ? '1' : '0.2');
        }, 50);

        const tl = gsap.timeline();
        tl.to({}, { duration: 0.8 })
          .call(() => {
              clearInterval(flickerInterval);
              bits.forEach(b => (b as HTMLElement).style.opacity = '1');
          })
          .to(this.renderRoot.querySelector('.loader'), {
              clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
              duration: 0.6,
              ease: "power4.inOut"
          })
          .call(() => {
              this.dispatchEvent(new CustomEvent('loaded', { bubbles: true, composed: true }));
          });
    }

    createRenderRoot() {
        return this;
    }
}