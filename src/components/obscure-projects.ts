import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { projectsData } from '../scripts/stuff.ts';

@customElement('obscure-projects')
export class ObscureProjects extends LitElement {
    render() {
        return html`
            <div>
                <div class="members-header">
                    <span class="section-label">01 — our projects</span>
                    <span class="section-label-right" id="project-count-label">PROJECTS: ${projectsData.length}</span>
                </div>

                <div class="projects-list" id="projects-container">
                    ${projectsData.map(proj => html`
                        <div class="project-item interactable" @click="${() => window.open(proj.link, '_blank')}">
                            <span class="p-name">${proj.name}</span>
                            <span class="p-cat">${proj.cat}</span>
                            <div class="status" style="${proj.active ? '' : 'background: #555; box-shadow: none;'}"></div>
                        </div>
                    `)}
                </div>

                <div class="divider"></div>
            </div>
        `;
    }

    createRenderRoot() {
        return this;
    }
}