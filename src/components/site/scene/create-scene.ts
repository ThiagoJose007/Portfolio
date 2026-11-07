import * as THREE from "three";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { sceneState } from "./scene-store";
import { fragmentShader, vertexShader } from "./shaders";
import { helix, lattice, monogram, seededRandom, sphere, torus } from "./shapes";

const COLOR_A = "#f3ede1"; // creme
const COLOR_B = "#ff5f2e"; // laranja de destaque

// Cria a cena e devolve a função de limpeza. Roda no ticker do GSAP para ficar
// sincronizada com o ScrollSmoother (mesmo frame, sem "tremidas").
export function createParticleScene(canvas: HTMLCanvasElement, initials: string) {
  const reduced = prefersReducedMotion();
  const isSmall = window.innerWidth < 768;
  const count = isSmall ? 6500 : 14000;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  const pixelRatio = Math.min(window.devicePixelRatio, 1.75);
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.z = 10;

  const rand = seededRandom(11);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(sphere(count, rand), 3));
  geometry.setAttribute("aShape1", new THREE.BufferAttribute(torus(count, rand), 3));
  geometry.setAttribute("aShape2", new THREE.BufferAttribute(lattice(count, rand), 3));
  geometry.setAttribute("aShape3", new THREE.BufferAttribute(helix(count, rand), 3));
  geometry.setAttribute("aShape4", new THREE.BufferAttribute(monogram(count, rand, initials), 3));
  const randoms = new Float32Array(count);
  for (let i = 0; i < count; i++) randoms[i] = rand();
  geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

  const uniforms = {
    uTime: { value: 0 },
    uShape: { value: sceneState.shape },
    uNoise: { value: sceneState.noise },
    uSize: { value: isSmall ? 2.4 : 2.1 },
    uPixelRatio: { value: pixelRatio },
    uOpacity: { value: sceneState.opacity },
    uColorA: { value: new THREE.Color(COLOR_A) },
    uColorB: { value: new THREE.Color(COLOR_B) },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  const group = new THREE.Group();
  group.add(points);
  scene.add(group);

  // Tamanho visível do plano z=0, usado para converter `x/y` do estado
  // (frações da viewport) em unidades do mundo.
  const view = { halfW: 1, halfH: 1 };
  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    view.halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    view.halfW = view.halfH * camera.aspect;
  };
  resize();
  window.addEventListener("resize", resize);

  const pointer = { x: 0, y: 0 };
  const tilt = { x: 0, y: 0 };
  const onPointerMove = (event: PointerEvent) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  };
  if (!reduced) window.addEventListener("pointermove", onPointerMove);

  // Em telas pequenas o objeto fica sempre centralizado e um pouco menor.
  const layoutFactor = isSmall ? 0 : 1;
  const sizeFactor = isSmall ? 0.62 : 1;
  let spinAngle = 0;

  const tick = (time: number, deltaMs: number) => {
    const dt = Math.min(deltaMs, 50) / 1000;
    uniforms.uTime.value = reduced ? 0 : time;
    uniforms.uShape.value = sceneState.shape;
    uniforms.uNoise.value = sceneState.noise;
    // No mobile o objeto fica atrás do texto: mais discreto.
    uniforms.uOpacity.value = sceneState.opacity * (isSmall ? 0.5 : 1);
    if (sceneState.opacity < 0.01) return;

    if (sceneState.shape > 3.5) {
      // O monograma precisa ficar de frente (de costas as letras aparecem
      // espelhadas): gira até a volta completa mais próxima.
      const facing = Math.round(spinAngle / (Math.PI * 2)) * Math.PI * 2;
      spinAngle += (facing - spinAngle) * Math.min(1, dt * 2.5);
    } else {
      spinAngle += sceneState.spin * dt * (reduced ? 0 : 1);
    }
    tilt.x += (pointer.y * 0.25 - tilt.x) * 0.04;
    tilt.y += (pointer.x * 0.35 - tilt.y) * 0.04;

    group.rotation.set(tilt.x, spinAngle + tilt.y, 0);
    group.position.set(
      sceneState.x * view.halfW * layoutFactor,
      sceneState.y * view.halfH,
      0,
    );
    group.scale.setScalar(sceneState.scale * sizeFactor);
    renderer.render(scene, camera);
  };
  gsap.ticker.add(tick);

  return () => {
    gsap.ticker.remove(tick);
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", onPointerMove);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}
