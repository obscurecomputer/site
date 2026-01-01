import { bootMessages, memberData, projectsData } from './stuff.js';
import { globe } from './globe.js';

document.addEventListener('DOMContentLoaded', () => {
    particles();
    loading();
    smoothScroll();
    projects();
    cursor();
    scrollAnim();
    members();
    marqueeThingy();
    globe('three-container', 'globe-trigger');
});

function particles() {
    const container = document.getElementById('particles');
    const colors = ['var(--c-cyan)', 'var(--c-pink)', 'var(--c-yellow)'];

    for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDelay = Math.random() * 15 + 's';
        p.style.setProperty('--drift', (Math.random() - 0.5) * 100 + 'px');
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(p);
    }
}

function loading() {
    const msg = bootMessages[Math.floor(Math.random() * bootMessages.length)];
    document.getElementById('loader-msg').innerHTML = `> ${msg}<span class="cursor-blink">_</span>`;

    const bits = document.querySelectorAll('.loader-symbol-bit');
    const flickerInterval = setInterval(() => {
        bits.forEach(b => b.style.opacity = Math.random() > 0.5 ? '1' : '0.2');
    }, 50);

    const tl = gsap.timeline();
    tl.to({}, { duration: 0.8 })
      .call(() => {
          clearInterval(flickerInterval);
          bits.forEach(b => b.style.opacity = '1');
      })
      .to('.loader', {
          clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
          duration: 0.6,
          ease: "power4.inOut"
      })
      .to('.hero-text-animation', { y: 0, duration: 1.4, stagger: 0.1, ease: "power3.out" }, "-=0.4")
      .to('.hero-sub, .scroll-indicator', { opacity: 1, duration: 1, ease: "power2.out" }, "-=1.0");
}

function smoothScroll() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

function projects() {
    const container = document.getElementById('projects-container');
    const label = document.getElementById('project-count-label');
    if (!container) return;

    if (label) label.innerText = `PROJECTS: ${projectsData.length}`;

    projectsData.forEach(proj => {
        const item = document.createElement('div');
        item.className = 'project-item interactable';
        item.innerHTML = `
            <span class="p-name">${proj.name}</span>
            <span class="p-cat">${proj.cat}</span>
            <div class="status" style="background: ${proj.active ? '' : '#555; box-shadow: none;'}"></div>
        `;
        item.addEventListener('click', () => window.open(proj.link, '_blank'));
        container.appendChild(item);
    });
}

function cursor() {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    const targets = document.querySelectorAll('.interactable, a');

    window.addEventListener('mousemove', (e) => {
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
        outline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 500, fill: "forwards" });
    });

    targets.forEach(el => {
        el.addEventListener('mouseenter', () => outline.classList.add('hovered'));
        el.addEventListener('mouseleave', () => outline.classList.remove('hovered'));
    });
}

function scrollAnim() {
    gsap.from("#about-text", {
        scrollTrigger: { trigger: "#about-text", start: "top 80%", end: "bottom 60%", scrub: 1 },
        opacity: 0.2, y: 30, duration: 1
    });

    document.querySelectorAll('.project-item').forEach((p, i) => {
        gsap.from(p, {
            scrollTrigger: { trigger: p, start: "top 95%" },
            opacity: 0, y: 40, duration: 0.6, delay: i * 0.1, ease: 'power2.out'
        });
    });

    gsap.to('.marquee', {
        scrollTrigger: { trigger: '.marquee', scrub: true },
        rotation: 2, scale: 1.05
    });

    gsap.to(document.querySelector('.track'), {
        x: "-50%", duration: 20, ease: "none", repeat: -1
    });
}

function members() {
    const rows = document.querySelectorAll('.member-row');
    const revealBox = document.querySelector('.members-img-reveal');
    const revealImg = document.getElementById('members-img');

    rows.forEach((row, i) => {
        gsap.from(row, {
            scrollTrigger: { trigger: row, start: "top 90%" },
            borderBottomColor: "rgba(255,255,255,0)", scaleX: 0.95, opacity: 0, duration: 1, delay: i * 0.1, ease: "power3.out"
        });

        row.addEventListener('mouseenter', () => {
            const url = row.getAttribute('data-img');
            if (url) {
                revealImg.src = url;
                revealBox.classList.add('active');
                gsap.to(revealImg, { scale: 1, duration: 0.4 });
            }
        });
        row.addEventListener('mouseleave', () => {
            revealBox.classList.remove('active');
            gsap.to(revealImg, { scale: 1.2, duration: 0.4 });
        });
        row.addEventListener('click', () => modalOpen(row.getAttribute('data-index'), row.getAttribute('data-img')));
    });

    window.addEventListener('mousemove', (e) => {
        gsap.to(revealBox, { x: e.clientX, y: e.clientY, duration: 0.6, ease: "power3.out" });
    });

    modalControls();
}

const modal = {
    wrapper: document.querySelector('.modal-wrapper'),
    container: document.querySelector('.modal-container'),
    elements: {
        name: document.getElementById('modal-name'),
        role: document.getElementById('modal-role'),
        bio: document.getElementById('modal-bio'),
        img: document.getElementById('modal-img'),
        gh: document.getElementById('link-gh'),
        soc: document.getElementById('link-social')
    },
    isOpen: false
};

function modalOpen(idx, imgUrl) {
    const data = memberData[idx];
    if (!data) return;

    modal.elements.name.innerText = data.name;
    modal.elements.role.innerText = `[ ${data.role} ]`;
    modal.elements.bio.innerText = data.bio;
    modal.elements.img.src = imgUrl;
    modal.elements.gh.href = data.github;
    modal.elements.soc.href = data.social;

    modal.isOpen = true;
    modal.wrapper.style.display = 'flex';

    gsap.killTweensOf([modal.wrapper, modal.container]);
    const tl = gsap.timeline();
    tl.to(modal.wrapper, { duration: 0.3, opacity: 1 })
      .to(modal.container, { duration: 0.5, y: 0, opacity: 1, ease: "cubic-bezier(0.19, 1, 0.22, 1)" }, "-=0.2");
}

function modalClose() {
    modal.isOpen = false;
    gsap.to(modal.container, { duration: 0.3, y: 50, opacity: 0, ease: "power2.in" });
    gsap.to(modal.wrapper, {
        duration: 0.3, opacity: 0, delay: 0.1,
        onComplete: () => modal.wrapper.style.display = 'none'
    });
}

function modalControls() {
    document.querySelector('.modal-close').addEventListener('click', modalClose);
    document.querySelector('.modal-backdrop').addEventListener('click', modalClose);
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && modal.isOpen) modalClose();
    });
}

function marqueeThingy() {
    const track = document.getElementById('mouseTrack');
    const wrapper = document.querySelector('.divider-marquee');
    if (!track || !wrapper) return;

    const content = track.innerHTML;
    track.innerHTML = content.repeat(4);

    let scrollPos = 0;
    let currentSpeed = 0;
    let targetSpeed = 0;
    const trackWidth = track.scrollWidth / 2;

    window.addEventListener('mousemove', (e) => {
        const centerNorm = (e.clientX / window.innerWidth) - 0.5;
        targetSpeed = centerNorm * 35;
    });

    wrapper.addEventListener('mouseleave', () => targetSpeed = 2);

    function animate() {
        currentSpeed += (targetSpeed - currentSpeed) * 0.05;
        scrollPos += currentSpeed;

        if (scrollPos <= -trackWidth) scrollPos = 0;
        if (scrollPos > 0) scrollPos = -trackWidth;

        track.style.transform = `translateX(${scrollPos}px) skewX(${currentSpeed * -0.5}deg)`;
        requestAnimationFrame(animate);
    }
    animate();
}