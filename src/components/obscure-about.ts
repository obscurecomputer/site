import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('obscure-about')
export class ObscureAbout extends LitElement {
    render() {
        return html`
            <section class="section container">
                <p class="about morse-code" id="about-text">
                    We make a lot of <span class="highlight">bombs</span> made with <span class="badge">U-235</span>. Did you know in just 5 years we have a K/D ratio of 60.7? We died a <span class="highlight">lot</span>... because that K/D is in the <span class="badge">negatives</span>.
                </p>
            </section>
        `;
    }

    createRenderRoot() {
        return this;
    }
}