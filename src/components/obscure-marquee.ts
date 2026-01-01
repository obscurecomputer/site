import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('obscure-marquee')
export class ObscureMarquee extends LitElement {
    render() {
        return html`
            <div class="marquee section">
                <div class="track">
                    <span class="marquee-text">MINECRAFT MODDING — KOTLIN — JAVA — DESIGN — PHP? — </span>
                    <span class="marquee-text">MINECRAFT MODDING — KOTLIN — JAVA — DESIGN — PHP? — </span>
                </div>
            </div>
        `;
    }

    createRenderRoot() {
        return this;
    }
}