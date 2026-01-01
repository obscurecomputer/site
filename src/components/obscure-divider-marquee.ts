import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('obscure-divider-marquee')
export class ObscureDividerMarquee extends LitElement {
    render() {
        return html`
            <div class="divider-marquee interactable">
                <div class="divmar-track" id="mouseTrack">
                    <span class="divmar-item">GIBSTEIN</span>
                    <span class="divmar-item">::</span>
                    <span class="divmar-item">CHILLSTEIN</span>
                    <span class="divmar-item">::</span>
                    <span class="divmar-item">CERQSTEIN</span>
                    <span class="divmar-item">::</span>
                    <span class="divmar-item">UNIUMSTEIN</span>
                    <span class="divmar-item">::</span>
                    <span class="divmar-item">ERM I FORGOT</span>
                    <span class="divmar-item">::</span>
                    <span class="divmar-item">sudo rm -rf /</span>
                    <span class="divmar-item">::</span>
                </div>
            </div>
        `;
    }

    protected firstUpdated() {
        this._initMarquee();
    }

    private _initMarquee() {
        const track = this.renderRoot.querySelector('#mouseTrack') as HTMLElement;
        const wrapper = this.renderRoot.querySelector('.divider-marquee') as HTMLElement;
        if (!track || !wrapper) return;

        const content = track.innerHTML;
        track.innerHTML = content.repeat(4);

        let scrollPos = 0;
        let currentSpeed = 0;
        let targetSpeed = 2;
        const trackWidth = track.scrollWidth / 2;

        window.addEventListener('mousemove', (e) => {
            const centerNorm = (e.clientX / window.innerWidth) - 0.5;
            targetSpeed = centerNorm * 35;
        });

        wrapper.addEventListener('mouseleave', () => targetSpeed = 2);

        const animate = () => {
            currentSpeed += (targetSpeed - currentSpeed) * 0.05;
            scrollPos += currentSpeed;

            if (scrollPos <= -trackWidth) scrollPos = 0;
            if (scrollPos > 0) scrollPos = -trackWidth;

            track.style.transform = `translateX(${scrollPos}px) skewX(${currentSpeed * -0.5}deg)`;
            requestAnimationFrame(animate);
        }
        animate();
    }

    createRenderRoot() {
        return this;
    }
}
