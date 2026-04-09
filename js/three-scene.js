// ============================================
// Fintra - Three.js 3D Background
// Floating financial elements: dollar signs, coins, chart bars, arrows
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

    this.createDollarSigns();
    this.createCoins();
    this.createChartBars();
    this.createUpArrows();
    this.createParticles();

    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    this.animate();
  }

  createDollarShape() {
    const shape = new THREE.Shape();
    // S curve of dollar sign
    shape.moveTo(0.4, 0.8);
    shape.bezierCurveTo(0.4, 1.0, 0.0, 1.0, -0.3, 0.85);
    shape.bezierCurveTo(-0.5, 0.75, -0.5, 0.55, -0.2, 0.45);
    shape.lineTo(0.2, 0.3);
    shape.bezierCurveTo(0.5, 0.2, 0.5, -0.05, 0.2, -0.15);
    shape.lineTo(-0.2, -0.3);
    shape.bezierCurveTo(-0.5, -0.4, -0.5, -0.65, -0.2, -0.75);
    shape.bezierCurveTo(0.0, -0.85, 0.4, -0.85, 0.4, -0.65);
    // Close with a slight offset to make it look like an S
    shape.lineTo(0.3, -0.65);
    shape.bezierCurveTo(0.3, -0.75, 0.0, -0.75, -0.15, -0.65);
    shape.bezierCurveTo(-0.35, -0.55, -0.35, -0.4, -0.15, -0.3);
    shape.lineTo(0.25, -0.1);
    shape.bezierCurveTo(0.6, 0.05, 0.6, 0.35, 0.25, 0.45);
    shape.lineTo(-0.15, 0.55);
    shape.bezierCurveTo(-0.4, 0.65, -0.4, 0.85, -0.15, 0.9);
    shape.bezierCurveTo(0.1, 0.95, 0.3, 0.9, 0.3, 0.8);
    return shape;
  }

  createDollarSigns() {
    const colors = [
      { main: 0x00C48C, edge: 0x33D4A4 },
      { main: 0xFFB800, edge: 0xFFCB3D },
      { main: 0x635BFF, edge: 0x8B85FF },
    ];

    for (let i = 0; i < 6; i++) {
      const colorSet = colors[i % colors.length];
      const group = new THREE.Group();

      // Vertical line of dollar sign
      const lineGeo = new THREE.BoxGeometry(0.08, 2.2, 0.08);
      const lineMat = new THREE.MeshPhongMaterial({
        color: colorSet.main,
        transparent: true,
        opacity: 0.25,
      });
      const line = new THREE.Mesh(lineGeo, lineMat);
      group.add(line);

      // S shape using a torus knot approximation
      const sGeo = new THREE.TorusGeometry(0.5, 0.1, 8, 16, Math.PI);
      const sMat = new THREE.MeshPhongMaterial({
        color: colorSet.main,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
      });
      const sTop = new THREE.Mesh(sGeo, sMat);
      sTop.position.y = 0.3;
      sTop.rotation.z = Math.PI;
      group.add(sTop);

      const sBot = new THREE.Mesh(sGeo, sMat.clone());
      sBot.position.y = -0.3;
      group.add(sBot);

      group.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 25 - 5
      );
      group.rotation.set(
        Math.random() * 0.3,
        Math.random() * Math.PI,
        Math.random() * 0.3
      );

      group.userData = {
        type: 'float',
        baseY: group.position.y,
        speed: Math.random() * 0.4 + 0.2,
        amplitude: Math.random() * 2 + 1,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        phase: Math.random() * Math.PI * 2,
      };

      this.objects.push(group);
      this.scene.add(group);
    }
  }

  createCoins() {
    const colors = [
      { main: 0xFFB800, edge: 0xFFCB3D },
      { main: 0x00C48C, edge: 0x33D4A4 },
      { main: 0x0A2540, edge: 0x1A3A5C },
    ];

    for (let i = 0; i < 5; i++) {
      const colorSet = colors[i % colors.length];
      const geometry = new THREE.CylinderGeometry(1.0, 1.0, 0.12, 24);
      const material = new THREE.MeshPhongMaterial({
        color: colorSet.main,
        transparent: true,
        opacity: 0.2,
        shininess: 100,
        side: THREE.DoubleSide,
      });

      const coin = new THREE.Mesh(geometry, material);

      // Inner circle on coin face
      const innerGeo = new THREE.RingGeometry(0.4, 0.6, 24);
      const innerMat = new THREE.MeshBasicMaterial({
        color: colorSet.edge,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
      });
      const inner = new THREE.Mesh(innerGeo, innerMat);
      inner.rotation.x = Math.PI / 2;
      inner.position.y = 0.07;
      coin.add(inner);

      // Edge ring
      const ringGeo = new THREE.TorusGeometry(1.0, 0.03, 8, 24);
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
        rotSpeed: (Math.random() - 0.5) * 0.012,
        phase: Math.random() * Math.PI * 2,
      };

      this.objects.push(coin);
      this.scene.add(coin);
    }
  }

  createChartBars() {
    // Group of 3-4 bars that look like a mini bar chart
    for (let g = 0; g < 3; g++) {
      const group = new THREE.Group();
      const barCount = 3 + Math.floor(Math.random() * 2);
      const colors = [0x00C48C, 0x635BFF, 0xFFB800, 0x0A2540];

      for (let i = 0; i < barCount; i++) {
        const height = Math.random() * 1.5 + 0.5;
        const geometry = new THREE.BoxGeometry(0.35, height, 0.35);
        const material = new THREE.MeshPhongMaterial({
          color: colors[i % colors.length],
          transparent: true,
          opacity: 0.18,
          shininess: 60,
        });

        const bar = new THREE.Mesh(geometry, material);
        bar.position.x = i * 0.5 - (barCount * 0.25);
        bar.position.y = height / 2 - 0.5;

        const edges = new THREE.EdgesGeometry(geometry);
        const edgeMat = new THREE.LineBasicMaterial({
          color: colors[i % colors.length],
          transparent: true,
          opacity: 0.25,
        });
        bar.add(new THREE.LineSegments(edges, edgeMat));
        group.add(bar);
      }

      group.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 25 - 5
      );

      group.userData = {
        type: 'float',
        baseY: group.position.y,
        speed: Math.random() * 0.3 + 0.15,
        amplitude: Math.random() * 1.5 + 0.5,
        rotSpeed: (Math.random() - 0.5) * 0.005,
        phase: Math.random() * Math.PI * 2,
      };

      this.objects.push(group);
      this.scene.add(group);
    }
  }

  createUpArrows() {
    const colors = [0x00C48C, 0x635BFF, 0xFFB800];

    for (let i = 0; i < 4; i++) {
      const group = new THREE.Group();
      const color = colors[i % colors.length];

      // Arrow shaft
      const shaftGeo = new THREE.BoxGeometry(0.12, 1.2, 0.12);
      const shaftMat = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.2,
      });
      const shaft = new THREE.Mesh(shaftGeo, shaftMat);
      shaft.position.y = -0.2;
      group.add(shaft);

      // Arrow head (cone)
      const headGeo = new THREE.ConeGeometry(0.3, 0.5, 4);
      const headMat = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.25,
      });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 0.6;
      group.add(head);

      group.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 25 - 5
      );

      group.rotation.z = (Math.random() - 0.5) * 0.5;

      group.userData = {
        type: 'arrow',
        basePos: group.position.clone(),
        speed: Math.random() * 0.5 + 0.2,
        radius: Math.random() * 2 + 1,
        phase: Math.random() * Math.PI * 2,
      };

      this.objects.push(group);
      this.scene.add(group);
    }
  }

  createParticles() {
    const count = 500;
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
      opacity: 0.3,
      sizeAttenuation: true,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
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
      if (d.type === 'float' || d.type === 'coin') {
        obj.position.y = d.baseY + Math.sin(elapsed * d.speed + d.phase) * d.amplitude;
        obj.rotation.y += d.rotSpeed;
        if (d.type === 'coin') {
          obj.rotation.x += d.rotSpeed * 0.3;
        }
      } else if (d.type === 'arrow') {
        obj.position.x = d.basePos.x + Math.sin(elapsed * d.speed + d.phase) * d.radius * 0.5;
        obj.position.y = d.basePos.y + Math.cos(elapsed * d.speed * 0.7 + d.phase) * d.radius;
        obj.rotation.z = Math.sin(elapsed * d.speed * 0.3) * 0.15;
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
