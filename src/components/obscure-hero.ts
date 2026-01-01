import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('obscure-hero')
export class ObscureHero extends LitElement {
    render() {
        return html`
            <section class="hero container">
                <div class="hero-title" data-text="OBSCURE COMPUTER">
                    <div class="hero-title-text"><span class="hero-text-animation">OBSCURE</span></div>
                    <h1 class="hero-title-text" style="text-align: right;"><span class="hero-text-animation" style="color: var(--c-cyan);">COMPUTER</span></h1>
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