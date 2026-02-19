
// --- Configuration & State ---
const config = {
    colors: {
        bg: 0x05060a,
        neonBlue: 0x00d2ff,
        neonPurple: 0xa100ff,
        neonGreen: 0x25ff9b,
        white: 0xffffff
    },
    camera: {
        fov: 45,
        near: 0.1,
        far: 1000
    }
};

let scene, camera, renderer;
let timeline;
const objects = {}; // Store references to scene objects
let resumeState = null;

// --- Initialization ---
function init() {
    // 1. Setup Three.js
    const canvas = document.querySelector('#webgl');
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // Navigation to resume occurs only via the explicit "View Resume" link

    scene = new THREE.Scene();
    scene.background = new THREE.Color(config.colors.bg);
    scene.fog = new THREE.FogExp2(config.colors.bg, 0.02);

    camera = new THREE.PerspectiveCamera(config.camera.fov, window.innerWidth / window.innerHeight, config.camera.near, config.camera.far);
    camera.position.set(0, 0, 50);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 10, 10);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(config.colors.neonBlue, 2, 50);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // 3. Create Scenes Objects
    createScene1_Particles(); // Name Particles
    createScene2_MERN();      // MERN Holograms
    createScene3_Panels();    // Floating Panels
    createScene4_Neural();    // Neural Network
    createScene5_City();      // City
    createScene6_Resume();    // Resume Cards

    // 4. Events
    window.addEventListener('resize', onWindowResize);
    document.getElementById('start-btn').addEventListener('click', startExperience);

    setupResumeViewer();

    // 5. Start Loop
    renderer.setAnimationLoop(animate);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    // Rotation animations for idle movement
    if (objects.mernGroup) objects.mernGroup.rotation.y += 0.005;
    if (objects.neuralGroup) objects.neuralGroup.rotation.y -= 0.002;
    if (objects.cityGroup) objects.cityGroup.rotation.y += 0.001;
    
    // Particle animation
    if (objects.particles) {
        const positions = objects.particles.geometry.attributes.position.array;
        for(let i=0; i<positions.length; i+=3) {
            // Subtle noise movement
            positions[i+1] += Math.sin(Date.now()*0.001 + positions[i])*0.01;
        }
        objects.particles.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
}

// --- Asset Generation Helpers ---

function createTextTexture(text, color = 'white', size = 64) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.font = `bold ${size}px "Archivo", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width/2, canvas.height/2);
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
}

function createCardTexture(title, lines, c1 = '#0af', c2 = '#a0f') {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, 'rgba(0,210,255,0.12)');
    grad.addColorStop(1, 'rgba(161,0,255,0.12)');
    ctx.fillStyle = 'rgba(10,12,18,0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(0,210,255,0.6)';
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    ctx.shadowColor = 'rgba(0,210,255,0.5)';
    ctx.shadowBlur = 24;
    ctx.font = '900 72px "Archivo", sans-serif';
    ctx.fillStyle = '#e6f7ff';
    ctx.textBaseline = 'top';
    ctx.shadowBlur = 0;
    ctx.fillText(title, 40, 40);
    ctx.font = '28px "Share Tech Mono", monospace';
    ctx.fillStyle = '#bfeaff';
    let y = 140;
    const lineH = 42;
    lines.forEach((ln) => {
        ctx.fillText('• ' + ln, 48, y);
        y += lineH;
    });
    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    return tex;
}

// --- Scene Creation Functions ---

function createScene1_Particles() {
    // Create "VISMAY" particles
    // Since we don't have font loader, we'll create a grid of particles that "looks" like tech dust
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(config.colors.neonBlue);
    const color2 = new THREE.Color(config.colors.neonPurple);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Random spread initially
        positions[i3] = (Math.random() - 0.5) * 100;
        positions[i3 + 1] = (Math.random() - 0.5) * 100;
        positions[i3 + 2] = (Math.random() - 0.5) * 100;

        // Colors
        const mixedColor = i % 2 === 0 ? color1 : color2;
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0, // Start invisible
        blending: THREE.AdditiveBlending
    });

    objects.particles = new THREE.Points(geometry, material);
    scene.add(objects.particles);
}

function createScene2_MERN() {
    const group = new THREE.Group();
    
    // React Atom (Center)
    const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: config.colors.neonBlue });
    const core = new THREE.Mesh(sphereGeo, coreMat);
    group.add(core);

    // Rings
    const ringMat = new THREE.MeshBasicMaterial({ color: config.colors.neonBlue, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    for(let i=0; i<3; i++) {
        const ringGeo = new THREE.TorusGeometry(3, 0.05, 16, 100);
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
        group.add(ring);
    }

    // Node.js (Hexagon) - Top Right
    const hexGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 6);
    const nodeMat = new THREE.MeshBasicMaterial({ color: config.colors.neonGreen, wireframe: true });
    const nodeMesh = new THREE.Mesh(hexGeo, nodeMat);
    nodeMesh.position.set(6, 3, -2);
    nodeMesh.rotation.x = Math.PI / 2;
    group.add(nodeMesh);

    // Database (Cylinder) - Bottom Left
    const dbGeo = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
    const dbMat = new THREE.MeshBasicMaterial({ color: config.colors.neonPurple, wireframe: true });
    const dbMesh = new THREE.Mesh(dbGeo, dbMat);
    dbMesh.position.set(-6, -3, -2);
    group.add(dbMesh);

    // Connections
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    const points = [
        new THREE.Vector3(0,0,0), new THREE.Vector3(6,3,-2),
        new THREE.Vector3(0,0,0), new THREE.Vector3(-6,-3,-2)
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);

    group.visible = false;
    objects.mernGroup = group;
    scene.add(group);
}

function createScene3_Panels() {
    const group = new THREE.Group();
    const panelGeo = new THREE.PlaneGeometry(8, 4.5);
    
    // Data for panels
    const panelData = [
        { text: "Video Editing", color: "#ff0055", pos: [-10, 5, -10] },
        { text: "Full Stack Dev", color: "#00d2ff", pos: [10, 2, -15] },
        { text: "AI Integration", color: "#a100ff", pos: [-6, -5, -5] },
        { text: "Product Design", color: "#25ff9b", pos: [8, -4, -10] }
    ];

    panelData.forEach((data, i) => {
        const tex = createTextTexture(data.text, data.color);
        const mat = new THREE.MeshBasicMaterial({ 
            map: tex, 
            transparent: true, 
            opacity: 0.9, 
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        const mesh = new THREE.Mesh(panelGeo, mat);
        mesh.position.set(...data.pos);
        mesh.lookAt(0,0,0);
        group.add(mesh);
    });

    group.visible = false;
    objects.panelsGroup = group;
    scene.add(group);
}

function createScene4_Neural() {
    const group = new THREE.Group();
    
    // Neural Nodes
    const geometry = new THREE.BufferGeometry();
    const count = 300;
    const positions = [];
    
    for(let i=0; i<count; i++) {
        const r = 20;
        const x = (Math.random()-0.5) * r;
        const y = (Math.random()-0.5) * r;
        const z = (Math.random()-0.5) * r;
        positions.push(x,y,z);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const nodesMat = new THREE.PointsMaterial({ color: config.colors.neonBlue, size: 0.3, transparent: true, opacity: 0.8 });
    const nodes = new THREE.Points(geometry, nodesMat);
    group.add(nodes);

    // Random Connections
    const lineGeo = new THREE.BufferGeometry();
    const linePos = [];
    // Connect some random nodes
    for(let i=0; i<100; i++) {
        const idx1 = Math.floor(Math.random() * count) * 3;
        const idx2 = Math.floor(Math.random() * count) * 3;
        linePos.push(
            positions[idx1], positions[idx1+1], positions[idx1+2],
            positions[idx2], positions[idx2+1], positions[idx2+2]
        );
    }
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: config.colors.neonPurple, transparent: true, opacity: 0.4 });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);

    group.visible = false;
    objects.neuralGroup = group;
    scene.add(group);
}

function createScene5_City() {
    const group = new THREE.Group();
    
    // Simple boxes for buildings
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    // Instanced mesh for performance
    const count = 500;
    const mesh = new THREE.InstancedMesh(boxGeo, new THREE.MeshLambertMaterial({ color: 0x111122 }), count);
    
    const dummy = new THREE.Object3D();
    for(let i=0; i<count; i++) {
        const x = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 50 - 20; // Behind camera mostly? No, spread out
        const y = 0;
        const h = Math.random() * 10 + 2;
        
        dummy.position.set(x, -10 + h/2, z); // Floor is at -10
        dummy.scale.set(1 + Math.random(), h, 1 + Math.random());
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
    }
    
    group.add(mesh);

    // Floor grid
    const grid = new THREE.GridHelper(200, 50, config.colors.neonBlue, 0x222222);
    grid.position.y = -10;
    group.add(grid);

    group.visible = false;
    objects.cityGroup = group;
    scene.add(group);
}

function createScene6_Resume() {
    const group = new THREE.Group();
    const geo = new THREE.PlaneGeometry(12, 7);
    const sections = [
        { title: 'Profile', lines: ['Vismay M. Nayak', 'Full Stack Developer', 'AI Innovator'] },
        { title: 'Skills', lines: ['JavaScript • Node.js • React', 'MongoDB • Express', 'Python • AI/ML'] },
        { title: 'Experience', lines: ['Software Developer — Projects', 'Built scalable web apps', 'Integrated AI features'] },
        { title: 'Projects', lines: ['Cinematic Portfolio', 'AI Chat Assistant', 'MERN SaaS Platform'] },
        { title: 'Education', lines: ['B.Tech — Computer Science', 'Coursework: DSA, OS, AI'] },
        { title: 'Contact', lines: ['Email: vismay@example.com', 'GitHub: github.com/vismay', 'LinkedIn: /in/vismay'] }
    ];
    const positions = [
        [-16, 7.5, -20], [0, 7.5, -20], [16, 7.5, -20],
        [-16, -2, -20], [0, -2, -20], [16, -2, -20]
    ];
    sections.forEach((sec, i) => {
        const tex = createCardTexture(sec.title, sec.lines);
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.95 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(positions[i][0], positions[i][1], positions[i][2]);
        mesh.lookAt(0, 0, 0);
        mesh.scale.set(0, 0, 0);
        group.add(mesh);
    });
    const floor = new THREE.GridHelper(80, 40, 0x004466, 0x111122);
    floor.position.y = -8;
    group.add(floor);
    group.visible = false;
    objects.resumeGroup = group;
    scene.add(group);
}

// --- Sequencing ---

function startExperience() {
    // Hide Overlay
    const overlay = document.getElementById('start-overlay');
    overlay.classList.add('hidden');
    
    // Play Audio
    const audio = document.getElementById('bgm');
    if (audio && typeof audio.play === 'function') {
        audio.play().catch(e => console.log("Audio requires interaction"));
    }

    // Init Timeline
    timeline = gsap.timeline();

    // === SCENE 1: Terminal & Init ===
    const uiContainer = document.getElementById('ui-container');
    const terminalDiv = document.createElement('div');
    terminalDiv.className = 'terminal-text';
    uiContainer.appendChild(terminalDiv);

    // Typewriter effect
    const bootText = "Initializing Vision...\nLoading Vismay M. Nayak...\nSystem: ONLINE";
    let textIdx = 0;
    
    // GSAP Sequence
    timeline
        // 1. Text typing
        .to({}, {
            duration: 3,
            onUpdate: () => {
                const len = Math.floor(textIdx);
                terminalDiv.innerText = bootText.substring(0, len) + (Math.random() > 0.5 ? "_" : "");
                textIdx += (bootText.length / 100); // Approximate speed
            }
        })
        .to(terminalDiv, { opacity: 0, duration: 0.5, delay: 0.5 })
        
        // 2. Particles form name
        .call(() => {
            objects.particles.material.opacity = 1;
            // Morph particles from random to sphere/cloud shape
            gsap.to(objects.particles.rotation, { y: Math.PI * 2, duration: 10, ease: "none" });
        })
        .to(camera.position, { z: 20, duration: 4, ease: "power2.inOut" }, "<")
        
        // === SCENE 2: MERN Stack ===
        .call(() => {
            objects.particles.visible = false;
            objects.mernGroup.visible = true;
            objects.mernGroup.scale.set(0,0,0);
        })
        .to(objects.mernGroup.scale, { x: 1, y: 1, z: 1, duration: 1.5, ease: "back.out(1.7)" })
        .to(camera.position, { z: 15, y: 2, duration: 5 })
        .to(objects.mernGroup.rotation, { y: Math.PI, duration: 5 }, "<")

        // === SCENE 3: Floating Panels ===
        .call(() => {
            objects.mernGroup.visible = false;
            objects.panelsGroup.visible = true;
            // Animate panels in
            objects.panelsGroup.children.forEach((child, i) => {
                child.scale.set(0,0,0);
                gsap.to(child.scale, { x: 1, y: 1, z: 1, duration: 1, delay: i*0.2, ease: "back.out" });
            });
        })
        .to(camera.position, { z: 30, duration: 6, ease: "power1.inOut" })
        .to(objects.panelsGroup.rotation, { y: -0.5, duration: 6 }, "<")

        // === SCENE 4: Neural Network ===
        .call(() => {
            objects.panelsGroup.visible = false;
            objects.neuralGroup.visible = true;
            objects.neuralGroup.scale.set(0.1, 0.1, 0.1);
        })
        .to(objects.neuralGroup.scale, { x: 2, y: 2, z: 2, duration: 2, ease: "power2.out" })
        .to(camera.position, { z: 40, duration: 5 })
        
        // === SCENE 5: City & Final Text ===
        .call(() => {
            objects.neuralGroup.visible = false;
            objects.cityGroup.visible = true;
            // Add final text
            const finalDiv = document.createElement('div');
            finalDiv.className = 'final-text-container';
            finalDiv.innerHTML = `
                <div class="final-title">VISMAY M. NAYAK</div>
                <div class="final-subtitle">Full Stack Developer | AI Innovator</div>
                <div style="margin-top:20px; font-family:var(--font-mono); color:var(--neon-green)">Building systems that scale. Creating technology that impacts millions.</div>
                <div style="margin-top:28px">
                  <a id="open-resume" class="resume-link" href="#">View Resume</a>
                </div>
            `;
            uiContainer.appendChild(finalDiv);
            
            gsap.to(finalDiv, { opacity: 1, duration: 2, delay: 1, onComplete: () => {
                const openBtn = document.getElementById('open-resume');
                console.log('View Resume button found:', openBtn);
                if (openBtn) {
                    openBtn.addEventListener('click', (e) => {
                        console.log('View Resume clicked');
                        e.preventDefault();
                        window.location.href = 'resume.html';
                    });
                    // Also add hover effects
                    openBtn.style.pointerEvents = 'auto';
                    openBtn.style.opacity = '1';
                    console.log('Event listener added to View Resume button');
                } else {
                    console.log('View Resume button not found');
                }
            }});
        })
        .fromTo(camera.position, { y: -5, z: 10 }, { y: 20, z: 80, duration: 8, ease: "power2.out" })
        .to(objects.cityGroup.rotation, { y: 0.5, duration: 8 }, "<");

}

// Initialize
init();

function showResumeScene() {
    if (!objects.resumeGroup) return;
    objects.cityGroup.visible = false;
    objects.resumeGroup.visible = true;
    gsap.to(camera.position, { x: 0, y: 2, z: 26, duration: 1.2, ease: 'power2.out' });
    objects.resumeGroup.children.forEach((child, i) => {
        gsap.to(child.scale, { x: 1, y: 1, z: 1, duration: 0.8, delay: i * 0.08, ease: 'back.out(1.6)' });
    });
    gsap.to(objects.resumeGroup.rotation, { y: 0.1, duration: 2, ease: 'power1.out' });
}

function setupResumeViewer() {
    const overlay = document.getElementById('resume-overlay');
    const closeBtn = document.getElementById('resume-close');
    
    resumeState = {
        overlay
    };

    closeBtn.addEventListener('click', () => {
        closeResumeViewer();
    });

    document.addEventListener('keydown', (e) => {
        if (overlay.classList.contains('active')) {
            if (e.key === 'Escape') closeResumeViewer();
        }
    });
}

function openResumeViewer(src) {
    if (!resumeState) return;
    resumeState.overlay.classList.add('active');
    resumeState.overlay.setAttribute('aria-hidden', 'false');
    
    // Update embed src if provided, though it's hardcoded in HTML
    const embed = document.getElementById('resume-embed');
    if (embed && src) {
        embed.src = src;
    }
}

function closeResumeViewer() {
    if (!resumeState) return;
    resumeState.overlay.classList.remove('active');
    resumeState.overlay.setAttribute('aria-hidden', 'true');
}

// Remove unused functions
// function updatePageLabel() ...
// function renderPage(num) ...
// function queueRenderPage(num) ...
