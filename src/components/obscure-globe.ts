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
import { customElement, query } from "lit/decorators.js";
import * as THREE from "three";

@customElement("obscure-globe")
export class ObscureGlobe extends LitElement {
    @query("#globe-trigger") private trigger!: HTMLElement;
    @query("#three-container") private container!: HTMLDivElement;

    private renderer?: THREE.WebGLRenderer;
    private scene?: THREE.Scene;
    private camera?: THREE.PerspectiveCamera;
    private group?: THREE.Group;
    private sphereOuter?: THREE.Mesh;
    private sphereInner?: THREE.Mesh;
    private mouseSpeed = 0;
    private animationFrameId?: number;
    private resizeHandler?: () => void;
    private mouseMoveHandler?: () => void;

    render() {
        return html`<div class="f-center interactable" id="globe-trigger">
            <svg class="spinny-text" viewBox="0 0 100 100">
                <path
                    id="circlePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="transparent"
                />
                <text>
                    <textPath href="#circlePath" startOffset="0%">
                        OBSCURE COMPUTER — SINCE 2025 —
                    </textPath>
                </text>
            </svg>

            <div id="three-container"></div>
        </div>`;
    }

    protected firstUpdated() {
        this.initGlobe(this.container, this.trigger);
    }

    private initGlobe(container: HTMLElement, trigger: HTMLElement) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.camera.position.z = 2.2;

        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: false,
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(0.25);
        container.appendChild(this.renderer.domElement);

        const material = new THREE.MeshBasicMaterial({
            color: 0x111111,
            wireframe: true,
            transparent: true,
            opacity: 0.9,
        });

        this.sphereOuter = new THREE.Mesh(
            new THREE.IcosahedronGeometry(1.2, 0),
            material
        );
        this.sphereInner = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.7, 0),
            material
        );

        this.group = new THREE.Group();
        this.group.add(this.sphereOuter);
        this.group.add(this.sphereInner);
        this.scene.add(this.group);

        this.animateGlobe();

        this.resizeHandler = () => {
            if (!container.clientWidth || !this.renderer || !this.camera)
                return;
            this.renderer.setSize(
                container.clientWidth,
                container.clientHeight
            );
            this.camera.aspect = container.clientWidth / container.clientHeight;
            this.camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", this.resizeHandler);

        this.mouseMoveHandler = () => {
            this.mouseSpeed = 0.05;
        };
        const targetElement = trigger || this;
        targetElement.addEventListener("mousemove", this.mouseMoveHandler);
    }

    private animateGlobe() {
        this.animationFrameId = requestAnimationFrame(() =>
            this.animateGlobe()
        );

        if (this.sphereOuter) {
            this.sphereOuter.rotation.y += 0.005 + this.mouseSpeed;
            this.sphereOuter.rotation.x += 0.002;
        }

        if (this.sphereInner) {
            this.sphereInner.rotation.y -= 0.01 + this.mouseSpeed;
            this.sphereInner.rotation.x -= 0.005;
        }

        this.mouseSpeed *= 0.95;

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        if (this.resizeHandler) {
            window.removeEventListener("resize", this.resizeHandler);
        }

        if (this.mouseMoveHandler) {
            this.removeEventListener("mousemove", this.mouseMoveHandler);
        }

        if (this.renderer) {
            this.renderer.dispose();
        }

        if (this.sphereOuter) {
            this.sphereOuter.geometry.dispose();
            (this.sphereOuter.material as THREE.Material).dispose();
        }

        if (this.sphereInner) {
            this.sphereInner.geometry.dispose();
            (this.sphereInner.material as THREE.Material).dispose();
        }
    }

    createRenderRoot() {
        return this;
    }
}
