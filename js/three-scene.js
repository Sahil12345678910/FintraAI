// ============================================
// Fintra - Three.js 3D Background
// Floating financial elements with finance palette
// ============================================

class FintraScene {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.objects = [];
    this.mouse = { x: 0, y: 0 };
    this.clock = new THREE.Clock();
    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xF6F9FC);
    this.scene.fog = new THREE.FogExp2(0xF6F9FC, 0.018);

    this.camera = new THREE.PerspectiveCamera(
      60, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.z = 35;

    const canvas = document.getElementById('three-canvas');
    this.renderer = new THREE.WebGLRenderer({
      canvas, antialias: true, alpha: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Cool financial lighting
    const ambientLight = new THREE.AmbientLight(0xF0F4F8, 0.6);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x00C48C, 0.7);
    mainLight.position.set(10, 15, 10);
    this.scene.add(mainLight);

    const accentLight = new THREE.PointLight(0x635BFF, 0.5, 60);
    accentLight.position.set(-10, 5, 15);
    this.scene.add(accentLight);

    const goldLight = new THREE.PointLight(0xFFB800, 0.3, 50);
    goldLight.position.set(15, -10, 10);
    this.scene.add(goldLight);

    this.createFloatingCoins();
    this.createChartBars();
    this.createParticles();
    this.createGeometricAccents();

    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    this.animate();
  }

  createFloatingCoins() {
    const colors = [
      { main: 0x00C48C, edge: 0x33D4A4 },
      { main: 0x0A2540, edge: 0x1A3A5C },
      { main: 0x635BFF, edge: 0x8B85FF },
      { main: 0xFFB800, edge: 0xFFCB3D },
    ];

    for (let i = 0; i < 8; i++) {
      const colorSet = colors[i % colors.length];
      const geometry = new THREE.CylinderGeometry(1.2, 1.2, 0.15, 24);
      const material = new THREE.MeshPhongMaterial({
        color: colorSet.main,
        transparent: true,
        opacity: 0.2,
        shininess: 100,
        side: THREE.DoubleSide,
      });

      const coin = new THREE.Mesh(geometry, material);

      // Add edge ring
      const ringGeo = new THREE.TorusGeometry(1.2, 0.04, 8, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorSet.edge,
        transparent: true,
        opacity: 0.3,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      coin.add(ring);

      coin.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 25 - 5
      );

      coin.rotation.set(
        Math.random() * Math.PI * 0.5,
        Math.random() * Math.PI,
        Math.random() * Math.PI * 0.3
      );

      coin.userData = {
        type: 'coin',
        baseY: coin.position.y,
        speed: Math.random() * 0.4 + 0.2,
        amplitude: Math.random() * 2 + 1,
        rotSpeed: (Math.random() - 0.5) * 0.01,
        phase: Math.random() * Math.PI * 2,
      };

      this.objects.push(coin);
      this.scene.add(coin);
    }
  }

  createChartBars() {
    const colors = [0x00C48C, 0x635BFF, 0x0A2540, 0xFFB800];

    for (let i = 0; i < 5; i++) {
      const height = Math.random() * 2 + 0.5;
      const geometry = new THREE.BoxGeometry(0.5, height, 0.5);
      const material = new THREE.MeshPhongMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: 0.15,
        shininess: 60,
      });

      const bar = new THREE.Mesh(geometry, material);

      const edges = new THREE.EdgesGeometry(geometry);
      const edgeMat = new THREE.LineBasicMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: 0.25,
      });
      bar.add(new THREE.LineSegments(edges, edgeMat));

      bar.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 25 - 5
      );

      bar.userData = {
        type: 'bar',
        baseY: bar.position.y,
        speed: Math.random() * 0.3 + 0.15,
        amplitude: Math.random() * 1.5 + 0.5,
        rotSpeed: (Math.random() - 0.5) * 0.005,
        phase: Math.random() * Math.PI * 2,
      };

      this.objects.push(bar);
      this.scene.add(bar);
    }
  }

  createParticles() {
    const count = 600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color(0x00C48C),
      new THREE.Color(0x635BFF),
      new THREE.Color(0xFFB800),
      new THREE.Color(0x0A2540),
      new THREE.Color(0x8898AA),
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  createGeometricAccents() {
    const items = [
      { type: 'diamond', color: 0x00C48C },
      { type: 'ring', color: 0x635BFF },
      { type: 'diamond', color: 0xFFB800 },
      { type: 'ring', color: 0x0A2540 },
      { type: 'diamond', color: 0x635BFF },
      { type: 'ring', color: 0x00C48C },
    ];

    items.forEach((item) => {
      let geo;
      if (item.type === 'diamond') {
        geo = new THREE.OctahedronGeometry(0.4, 0);
      } else {
        geo = new THREE.TorusGeometry(0.3, 0.08, 8, 16);
      }

      const mat = new THREE.MeshBasicMaterial({
        color: item.color,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20
      );

      mesh.userData = {
        type: 'accent',
        basePos: mesh.position.clone(),
        speed: Math.random() * 0.5 + 0.2,
        radius: Math.random() * 3 + 1,
        phase: Math.random() * Math.PI * 2,
      };

      this.objects.push(mesh);
      this.scene.add(mesh);
    });
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsed = this.clock.getElapsedTime();

    if (this.particles) {
      this.particles.rotation.y = elapsed * 0.008;
      this.particles.rotation.x = Math.sin(elapsed * 0.004) * 0.04;
    }

    this.objects.forEach((obj) => {
      const d = obj.userData;
      if (d.type === 'coin' || d.type === 'bar') {
        obj.position.y = d.baseY + Math.sin(elapsed * d.speed + d.phase) * d.amplitude;
        obj.rotation.y += d.rotSpeed;
        if (d.type === 'coin') {
          obj.rotation.x += d.rotSpeed * 0.3;
        }
      } else if (d.type === 'accent') {
        obj.position.x = d.basePos.x + Math.sin(elapsed * d.speed + d.phase) * d.radius;
        obj.position.y = d.basePos.y + Math.cos(elapsed * d.speed * 0.7 + d.phase) * d.radius * 0.6;
        obj.rotation.z = elapsed * d.speed;
      }
    });

    this.camera.position.x += (this.mouse.x * 2 - this.camera.position.x) * 0.012;
    this.camera.position.y += (this.mouse.y * 1.5 - this.camera.position.y) * 0.012;
    this.camera.lookAt(this.scene.position);

    this.renderer.render(this.scene, this.camera);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('three-canvas')) {
    new FintraScene();
  }
});
