// ============================================
// Fintra - Three.js 3D Background
// Realistic floating coins, dollar bills, and bar graphs
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
    this.scene.fog = new THREE.FogExp2(0xF6F9FC, 0.012);

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

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.6);
    mainLight.position.set(5, 10, 10);
    this.scene.add(mainLight);

    const greenLight = new THREE.PointLight(0x00C48C, 0.4, 80);
    greenLight.position.set(-15, 10, 10);
    this.scene.add(greenLight);

    const goldLight = new THREE.PointLight(0xFFB800, 0.4, 80);
    goldLight.position.set(15, -10, 10);
    this.scene.add(goldLight);

    this.createCoins();
    this.createDollarBills();
    this.createBarGraphs();

    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    this.animate();
  }

  // ---- REALISTIC COINS ----
  createCoins() {
    for (let i = 0; i < 8; i++) {
      const isGold = i % 2 === 0;
      const group = new THREE.Group();

      // Thick coin disc
      const coinGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.18, 48);
      const coinMat = new THREE.MeshPhongMaterial({
        color: isGold ? 0xFFD700 : 0xC0C0C0,
        transparent: true,
        opacity: 0.45,
        shininess: 150,
        specular: isGold ? 0xFFEE88 : 0xDDDDDD,
      });
      const coin = new THREE.Mesh(coinGeo, coinMat);
      group.add(coin);

      // Raised rim
      const rimGeo = new THREE.TorusGeometry(1.15, 0.06, 12, 48);
      const rimMat = new THREE.MeshPhongMaterial({
        color: isGold ? 0xDAA520 : 0xA0A0A0,
        transparent: true,
        opacity: 0.5,
        shininess: 120,
      });
      const rimTop = new THREE.Mesh(rimGeo, rimMat);
      rimTop.rotation.x = Math.PI / 2;
      rimTop.position.y = 0.09;
      group.add(rimTop);

      const rimBot = new THREE.Mesh(rimGeo, rimMat);
      rimBot.rotation.x = Math.PI / 2;
      rimBot.position.y = -0.09;
      group.add(rimBot);

      // Inner circle detail on face
      const innerRingGeo = new THREE.TorusGeometry(0.75, 0.03, 8, 32);
      const innerRingMat = new THREE.MeshPhongMaterial({
        color: isGold ? 0xDAA520 : 0x999999,
        transparent: true,
        opacity: 0.4,
      });
      const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
      innerRing.rotation.x = Math.PI / 2;
      innerRing.position.y = 0.1;
      group.add(innerRing);

      // $ sign on coin - vertical bar
      const barMat = new THREE.MeshPhongMaterial({
        color: isGold ? 0xB8860B : 0x808080,
        transparent: true,
        opacity: 0.5,
      });

      const vBarGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.0, 8);
      const vBar = new THREE.Mesh(vBarGeo, barMat);
      vBar.position.set(0, 0.1, 0);
      vBar.rotation.z = 0; // vertical
      // Rotate to face up on coin face
      const dollarGroup = new THREE.Group();
      dollarGroup.add(vBar);

      // Top curve of S
      const sCurveGeo = new THREE.TorusGeometry(0.22, 0.035, 8, 12, Math.PI);
      const sTop = new THREE.Mesh(sCurveGeo, barMat);
      sTop.position.set(0.0, 0.18, 0);
      dollarGroup.add(sTop);

      // Bottom curve of S (flipped)
      const sBot = new THREE.Mesh(sCurveGeo, barMat);
      sBot.position.set(0.0, -0.18, 0);
      sBot.rotation.y = Math.PI;
      dollarGroup.add(sBot);

      dollarGroup.rotation.x = -Math.PI / 2;
      dollarGroup.position.y = 0.1;
      group.add(dollarGroup);

      group.position.set(
        (Math.random() - 0.5) * 55,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20 - 5
      );
      group.rotation.set(
        Math.random() * Math.PI * 0.3 + 0.3,
        Math.random() * Math.PI * 2,
        Math.random() * 0.3
      );

      group.userData = {
        type: 'coin',
        baseY: group.position.y,
        speed: Math.random() * 0.3 + 0.15,
        amplitude: Math.random() * 2 + 1,
        rotSpeed: (Math.random() - 0.5) * 0.012,
        phase: Math.random() * Math.PI * 2,
      };

      this.objects.push(group);
      this.scene.add(group);
    }
  }

  // ---- REALISTIC DOLLAR BILLS ----
  createDollarBills() {
    for (let i = 0; i < 6; i++) {
      const group = new THREE.Group();

      // Bill body - green rectangle
      const billGeo = new THREE.BoxGeometry(3.0, 1.3, 0.02);
      const billMat = new THREE.MeshPhongMaterial({
        color: 0x3B7A3B,
        transparent: true,
        opacity: 0.35,
        shininess: 30,
        side: THREE.DoubleSide,
      });
      const bill = new THREE.Mesh(billGeo, billMat);
      group.add(bill);

      // White inner border
      const borderGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.6, 0.95, 0.01));
      const borderMat = new THREE.LineBasicMaterial({
        color: 0x7CBA7C,
        transparent: true,
        opacity: 0.4,
      });
      const border = new THREE.LineSegments(borderGeo, borderMat);
      border.position.z = 0.011;
      group.add(border);

      // Outer edge
      const outerGeo = new THREE.EdgesGeometry(billGeo);
      const outerMat = new THREE.LineBasicMaterial({
        color: 0x2D5F2D,
        transparent: true,
        opacity: 0.5,
      });
      group.add(new THREE.LineSegments(outerGeo, outerMat));

      // Center circle (like portrait oval on a bill)
      const ovalGeo = new THREE.RingGeometry(0.28, 0.35, 32);
      const ovalMat = new THREE.MeshBasicMaterial({
        color: 0x5A9A5A,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      });
      const oval = new THREE.Mesh(ovalGeo, ovalMat);
      oval.position.z = 0.012;
      group.add(oval);

      // Inner filled circle (portrait area)
      const portraitGeo = new THREE.CircleGeometry(0.28, 32);
      const portraitMat = new THREE.MeshBasicMaterial({
        color: 0x4A8A4A,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
      });
      const portrait = new THREE.Mesh(portraitGeo, portraitMat);
      portrait.position.z = 0.012;
      group.add(portrait);

      // Corner denomination markers
      const cornerPositions = [
        { x: -1.1, y: 0.45 },
        { x: 1.1, y: 0.45 },
        { x: -1.1, y: -0.45 },
        { x: 1.1, y: -0.45 },
      ];
      cornerPositions.forEach((pos) => {
        const dotGeo = new THREE.CircleGeometry(0.06, 8);
        const dotMat = new THREE.MeshBasicMaterial({
          color: 0x7CBA7C,
          transparent: true,
          opacity: 0.35,
          side: THREE.DoubleSide,
        });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.set(pos.x, pos.y, 0.012);
        group.add(dot);
      });

      // Horizontal lines (like text lines on a bill)
      for (let l = 0; l < 3; l++) {
        const lineGeo = new THREE.BoxGeometry(0.8, 0.02, 0.005);
        const lineMat = new THREE.MeshBasicMaterial({
          color: 0x6AAA6A,
          transparent: true,
          opacity: 0.25,
        });
        const line = new THREE.Mesh(lineGeo, lineMat);
        line.position.set(0, -0.15 + l * 0.12, 0.012);
        group.add(line);
      }

      group.position.set(
        (Math.random() - 0.5) * 55,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20 - 5
      );
      group.rotation.set(
        (Math.random() - 0.5) * 0.4,
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 0.6
      );

      group.userData = {
        type: 'bill',
        baseY: group.position.y,
        speed: Math.random() * 0.25 + 0.1,
        amplitude: Math.random() * 2 + 1,
        rotSpeed: (Math.random() - 0.5) * 0.005,
        phase: Math.random() * Math.PI * 2,
      };

      this.objects.push(group);
      this.scene.add(group);
    }
  }

  // ---- BAR GRAPHS ----
  createBarGraphs() {
    for (let g = 0; g < 4; g++) {
      const group = new THREE.Group();
      const barCount = 5;
      const barColors = [0x00C48C, 0x635BFF, 0x00C48C, 0xFFB800, 0x635BFF];
      const barWidth = 0.35;
      const gap = 0.12;
      const totalWidth = barCount * barWidth + (barCount - 1) * gap;

      const heights = [];
      for (let i = 0; i < barCount; i++) {
        heights.push(Math.random() * 1.8 + 0.4);
      }

      for (let i = 0; i < barCount; i++) {
        const h = heights[i];
        const geometry = new THREE.BoxGeometry(barWidth, h, 0.3);
        const material = new THREE.MeshPhongMaterial({
          color: barColors[i],
          transparent: true,
          opacity: 0.3,
          shininess: 40,
        });

        const bar = new THREE.Mesh(geometry, material);
        bar.position.x = i * (barWidth + gap) - totalWidth / 2 + barWidth / 2;
        bar.position.y = h / 2;

        // Top highlight
        const topGeo = new THREE.BoxGeometry(barWidth, 0.03, 0.3);
        const topMat = new THREE.MeshBasicMaterial({
          color: barColors[i],
          transparent: true,
          opacity: 0.5,
        });
        const top = new THREE.Mesh(topGeo, topMat);
        top.position.y = h / 2;
        bar.add(top);

        group.add(bar);
      }

      // Base line
      const baseGeo = new THREE.BoxGeometry(totalWidth + 0.3, 0.04, 0.3);
      const baseMat = new THREE.MeshPhongMaterial({
        color: 0x0A2540,
        transparent: true,
        opacity: 0.2,
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      group.add(base);

      // Y-axis line
      const yAxisGeo = new THREE.BoxGeometry(0.03, 2.5, 0.03);
      const yAxisMat = new THREE.MeshBasicMaterial({
        color: 0x0A2540,
        transparent: true,
        opacity: 0.15,
      });
      const yAxis = new THREE.Mesh(yAxisGeo, yAxisMat);
      yAxis.position.set(-totalWidth / 2 - 0.2, 1.25, 0);
      group.add(yAxis);

      // Grid lines
      for (let gl = 1; gl <= 3; gl++) {
        const gridGeo = new THREE.BoxGeometry(totalWidth + 0.2, 0.015, 0.01);
        const gridMat = new THREE.MeshBasicMaterial({
          color: 0x8898AA,
          transparent: true,
          opacity: 0.1,
        });
        const gridLine = new THREE.Mesh(gridGeo, gridMat);
        gridLine.position.y = gl * 0.65;
        group.add(gridLine);
      }

      group.position.set(
        (Math.random() - 0.5) * 55,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20 - 5
      );
      group.rotation.set(
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.15
      );

      group.userData = {
        type: 'graph',
        baseY: group.position.y,
        speed: Math.random() * 0.2 + 0.1,
        amplitude: Math.random() * 1.5 + 0.8,
        rotSpeed: (Math.random() - 0.5) * 0.003,
        phase: Math.random() * Math.PI * 2,
      };

      this.objects.push(group);
      this.scene.add(group);
    }
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

    this.objects.forEach((obj) => {
      const d = obj.userData;
      if (d.type === 'coin') {
        obj.position.y = d.baseY + Math.sin(elapsed * d.speed + d.phase) * d.amplitude;
        obj.rotation.y += d.rotSpeed;
      } else if (d.type === 'bill') {
        obj.position.y = d.baseY + Math.sin(elapsed * d.speed + d.phase) * d.amplitude;
        obj.rotation.y += d.rotSpeed;
        // Gentle flutter
        obj.rotation.z += Math.sin(elapsed * d.speed * 2 + d.phase) * 0.0005;
      } else if (d.type === 'graph') {
        obj.position.y = d.baseY + Math.sin(elapsed * d.speed + d.phase) * d.amplitude;
        obj.rotation.y += d.rotSpeed;
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
