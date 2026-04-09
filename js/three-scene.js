// ============================================
// Fintra - Three.js 3D Background
// Bold floating financial elements: coins, chart bars, dollar signs, bills
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
    this.scene.fog = new THREE.FogExp2(0xF6F9FC, 0.015);

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

    const ambientLight = new THREE.AmbientLight(0xF0F4F8, 0.7);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x00C48C, 0.8);
    mainLight.position.set(10, 15, 10);
    this.scene.add(mainLight);

    const accentLight = new THREE.PointLight(0x635BFF, 0.5, 60);
    accentLight.position.set(-10, 5, 15);
    this.scene.add(accentLight);

    const goldLight = new THREE.PointLight(0xFFB800, 0.4, 50);
    goldLight.position.set(15, -10, 10);
    this.scene.add(goldLight);

    this.createCoins();
    this.createBills();
    this.createChartGroups();
    this.createUpArrows();
    this.createParticles();

    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    this.animate();
  }

  createCoins() {
    const colors = [
      { main: 0xFFB800, edge: 0xFFD54F },
      { main: 0x00C48C, edge: 0x4DDBAA },
      { main: 0xFFB800, edge: 0xFFD54F },
      { main: 0x635BFF, edge: 0x9590FF },
    ];

    for (let i = 0; i < 7; i++) {
      const colorSet = colors[i % colors.length];
      const group = new THREE.Group();

      // Thick coin body
      const coinGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.2, 32);
      const coinMat = new THREE.MeshPhongMaterial({
        color: colorSet.main,
        transparent: true,
        opacity: 0.3,
        shininess: 120,
      });
      const coin = new THREE.Mesh(coinGeo, coinMat);
      group.add(coin);

      // Dollar sign on coin face - vertical bar
      const barGeo = new THREE.BoxGeometry(0.08, 1.4, 0.05);
      const signMat = new THREE.MeshPhongMaterial({
        color: colorSet.edge,
        transparent: true,
        opacity: 0.4,
      });
      const vBar = new THREE.Mesh(barGeo, signMat);
      vBar.position.set(0, 0, 0.12);
      group.add(vBar);

      // S curves on coin
      const sTop = new THREE.TorusGeometry(0.35, 0.06, 8, 12, Math.PI);
      const sTopMesh = new THREE.Mesh(sTop, signMat);
      sTopMesh.position.set(0, 0.2, 0.12);
      sTopMesh.rotation.z = Math.PI;
      group.add(sTopMesh);

      const sBot = new THREE.Mesh(sTop.clone(), signMat);
      sBot.position.set(0, -0.2, 0.12);
      group.add(sBot);

      // Rim highlight
      const rimGeo = new THREE.TorusGeometry(1.3, 0.04, 8, 32);
      const rimMat = new THREE.MeshBasicMaterial({
        color: colorSet.edge,
        transparent: true,
        opacity: 0.35,
      });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.x = Math.PI / 2;
      group.add(rim);

      group.position.set(
        (Math.random() - 0.5) * 55,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20 - 8
      );
      group.rotation.set(
        Math.random() * Math.PI * 0.4,
        Math.random() * Math.PI,
        Math.random() * 0.3
      );

      group.userData = {
        type: 'coin',
        baseY: group.position.y,
        speed: Math.random() * 0.35 + 0.15,
        amplitude: Math.random() * 2.5 + 1,
        rotSpeed: (Math.random() - 0.5) * 0.01,
        phase: Math.random() * Math.PI * 2,
      };

      this.objects.push(group);
      this.scene.add(group);
    }
  }

  createBills() {
    const colors = [
      { main: 0x00C48C, border: 0x009B6E },
      { main: 0x635BFF, border: 0x4A44CC },
      { main: 0x00C48C, border: 0x009B6E },
    ];

    for (let i = 0; i < 5; i++) {
      const colorSet = colors[i % colors.length];
      const group = new THREE.Group();

      // Bill rectangle
      const billGeo = new THREE.BoxGeometry(2.8, 1.4, 0.04);
      const billMat = new THREE.MeshPhongMaterial({
        color: colorSet.main,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
      });
      const bill = new THREE.Mesh(billGeo, billMat);
      group.add(bill);

      // Bill border (edges)
      const edges = new THREE.EdgesGeometry(billGeo);
      const edgeMat = new THREE.LineBasicMaterial({
        color: colorSet.border,
        transparent: true,
        opacity: 0.35,
      });
      group.add(new THREE.LineSegments(edges, edgeMat));

      // Inner border rectangle
      const innerGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.4, 1.0, 0.02));
      const innerMat = new THREE.LineBasicMaterial({
        color: colorSet.border,
        transparent: true,
        opacity: 0.2,
      });
      group.add(new THREE.LineSegments(innerGeo, innerMat));

      // Dollar circle on bill
      const circleGeo = new THREE.RingGeometry(0.25, 0.32, 24);
      const circleMat = new THREE.MeshBasicMaterial({
        color: colorSet.border,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      });
      const circle = new THREE.Mesh(circleGeo, circleMat);
      circle.position.z = 0.03;
      group.add(circle);

      group.position.set(
        (Math.random() - 0.5) * 55,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20 - 8
      );
      group.rotation.set(
        Math.random() * 0.4,
        Math.random() * Math.PI,
        Math.random() * 0.4
      );

      group.userData = {
        type: 'float',
        baseY: group.position.y,
        speed: Math.random() * 0.3 + 0.12,
        amplitude: Math.random() * 2 + 1,
        rotSpeed: (Math.random() - 0.5) * 0.006,
        phase: Math.random() * Math.PI * 2,
      };

      this.objects.push(group);
      this.scene.add(group);
    }
  }

  createChartGroups() {
    for (let g = 0; g < 4; g++) {
      const group = new THREE.Group();
      const barCount = 4;
      const colors = [0x00C48C, 0x635BFF, 0xFFB800, 0x0A2540];

      for (let i = 0; i < barCount; i++) {
        const height = Math.random() * 2.0 + 0.6;
        const geometry = new THREE.BoxGeometry(0.45, height, 0.45);
        const material = new THREE.MeshPhongMaterial({
          color: colors[i % colors.length],
          transparent: true,
          opacity: 0.25,
          shininess: 60,
        });

        const bar = new THREE.Mesh(geometry, material);
        bar.position.x = i * 0.6 - (barCount * 0.3);
        bar.position.y = height / 2 - 0.5;

        const edges = new THREE.EdgesGeometry(geometry);
        const edgeMat = new THREE.LineBasicMaterial({
          color: colors[i % colors.length],
          transparent: true,
          opacity: 0.35,
        });
        bar.add(new THREE.LineSegments(edges, edgeMat));
        group.add(bar);
      }

      // Base line under bars
      const baseGeo = new THREE.BoxGeometry(barCount * 0.6 + 0.4, 0.04, 0.45);
      const baseMat = new THREE.MeshBasicMaterial({
        color: 0x0A2540,
        transparent: true,
        opacity: 0.15,
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = -0.5;
      group.add(base);

      group.position.set(
        (Math.random() - 0.5) * 55,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20 - 8
      );

      group.userData = {
        type: 'float',
        baseY: group.position.y,
        speed: Math.random() * 0.3 + 0.1,
        amplitude: Math.random() * 1.5 + 0.8,
        rotSpeed: (Math.random() - 0.5) * 0.004,
        phase: Math.random() * Math.PI * 2,
      };

      this.objects.push(group);
      this.scene.add(group);
    }
  }

  createUpArrows() {
    const colors = [0x00C48C, 0x635BFF, 0xFFB800];

    for (let i = 0; i < 5; i++) {
      const group = new THREE.Group();
      const color = colors[i % colors.length];

      // Arrow shaft
      const shaftGeo = new THREE.BoxGeometry(0.15, 1.5, 0.15);
      const shaftMat = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.25,
      });
      const shaft = new THREE.Mesh(shaftGeo, shaftMat);
      shaft.position.y = -0.15;
      group.add(shaft);

      // Arrow head
      const headGeo = new THREE.ConeGeometry(0.4, 0.6, 4);
      const headMat = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
      });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 0.75;
      group.add(head);

      group.position.set(
        (Math.random() - 0.5) * 55,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20 - 8
      );

      group.rotation.z = (Math.random() - 0.5) * 0.4;

      group.userData = {
        type: 'arrow',
        basePos: group.position.clone(),
        speed: Math.random() * 0.4 + 0.2,
        radius: Math.random() * 2 + 1,
        phase: Math.random() * Math.PI * 2,
      };

      this.objects.push(group);
      this.scene.add(group);
    }
  }

  createParticles() {
    const count = 400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color(0x00C48C),
      new THREE.Color(0x635BFF),
      new THREE.Color(0xFFB800),
      new THREE.Color(0x0A2540),
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
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.25,
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
      this.particles.rotation.y = elapsed * 0.006;
      this.particles.rotation.x = Math.sin(elapsed * 0.003) * 0.03;
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
      }
    });

    this.camera.position.x += (this.mouse.x * 2 - this.camera.position.x) * 0.01;
    this.camera.position.y += (this.mouse.y * 1.5 - this.camera.position.y) * 0.01;
    this.camera.lookAt(this.scene.position);

    this.renderer.render(this.scene, this.camera);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('three-canvas')) {
    new FintraScene();
  }
});
