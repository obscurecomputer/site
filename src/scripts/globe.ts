import * as THREE from 'three';

export function globe(container: HTMLElement, trigger: HTMLElement) {
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 2.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(0.25)
    container.appendChild(renderer.domElement);

    const material = new THREE.MeshBasicMaterial({
        color: 0x111111,
        wireframe: true,
        transparent: true,
        opacity: 0.9
    });

    const sphereOuter = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 0), material);
    const sphereInner = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 0), material);

    const group = new THREE.Group();
    group.add(sphereOuter);
    group.add(sphereInner);
    scene.add(group);
    new THREE.Clock();
    let mouseSpeed = 0;

    function animate() {
        requestAnimationFrame(animate);
        sphereOuter.rotation.y += 0.005 + mouseSpeed;
        sphereOuter.rotation.x += 0.002;
        sphereInner.rotation.y -= 0.01 + mouseSpeed;
        sphereInner.rotation.x -= 0.005;
        mouseSpeed *= 0.95;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        if (!container.clientWidth) return;
        renderer.setSize(container.clientWidth, container.clientHeight);
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
    });

    if (trigger) {
        trigger.addEventListener('mousemove', () => mouseSpeed = 0.05);
    }
}