// Geradores de nuvens de pontos. Cada função devolve `count * 3` floats
// (x, y, z) com raio ~2 unidades, para que todas as formas tenham escala parecida
// e o morph entre elas fique equilibrado.

type Rand = () => number;

const TAU = Math.PI * 2;

export function sphere(count: number, rand: Rand) {
  const out = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    // Casca fina com um pouco de "poeira" para dentro e para fora.
    const radius = 2 * (rand() < 0.85 ? 1 + (rand() - 0.5) * 0.08 : 0.6 + rand() * 0.7);
    out[i * 3] = Math.cos(theta) * r * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return out;
}

export function torus(count: number, rand: Rand) {
  const out = new Float32Array(count * 3);
  const R = 1.75;
  for (let i = 0; i < count; i++) {
    const u = rand() * TAU;
    const v = rand() * TAU;
    const r = 0.38 + (rand() - 0.5) * 0.18;
    out[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
    out[i * 3 + 1] = r * Math.sin(v);
    out[i * 3 + 2] = (R + r * Math.cos(v)) * Math.sin(u);
  }
  // Inclinado para não aparecer de perfil.
  return rotateX(out, 1.1);
}

// Estrutura "wireframe": arestas de dois cubos aninhados ligados pelos vértices.
export function lattice(count: number, rand: Rand) {
  const out = new Float32Array(count * 3);
  const segments: Array<[number[], number[]]> = [];
  const cubeEdges = (s: number) => {
    const v = [-s, s];
    for (const a of v)
      for (const b of v) {
        segments.push([[-s, a, b], [s, a, b]]);
        segments.push([[a, -s, b], [a, s, b]]);
        segments.push([[a, b, -s], [a, b, s]]);
      }
  };
  cubeEdges(1.55);
  cubeEdges(0.8);
  for (const x of [-1, 1])
    for (const y of [-1, 1])
      for (const z of [-1, 1])
        segments.push([[x * 0.8, y * 0.8, z * 0.8], [x * 1.55, y * 1.55, z * 1.55]]);

  for (let i = 0; i < count; i++) {
    const [a, b] = segments[Math.floor(rand() * segments.length)];
    const t = rand();
    const jitter = 0.025;
    out[i * 3] = a[0] + (b[0] - a[0]) * t + (rand() - 0.5) * jitter;
    out[i * 3 + 1] = a[1] + (b[1] - a[1]) * t + (rand() - 0.5) * jitter;
    out[i * 3 + 2] = a[2] + (b[2] - a[2]) * t + (rand() - 0.5) * jitter;
  }
  return rotateX(rotateY(out, 0.6), 0.45);
}

export function helix(count: number, rand: Rand) {
  const out = new Float32Array(count * 3);
  const height = 4.6;
  const turns = 2.2;
  for (let i = 0; i < count; i++) {
    const isStrand = rand() < 0.78;
    // Degraus ficam em posições fixas ao longo da hélice; fitas são contínuas.
    const t = isStrand ? rand() : Math.round(rand() * 28) / 28;
    const angle = t * turns * TAU;
    let radius: number;
    let offset = 0;
    if (isStrand) {
      offset = rand() < 0.5 ? 0 : Math.PI;
      radius = 1 + (rand() - 0.5) * 0.12;
    } else {
      radius = rand() * 2 - 1;
    }
    out[i * 3] = Math.cos(angle + offset) * radius;
    out[i * 3 + 1] = (t - 0.5) * height;
    out[i * 3 + 2] = Math.sin(angle + offset) * radius;
  }
  return rotateZ(out, 0.35);
}

// Amostra os pixels de um texto desenhado num canvas 2D (as iniciais) e
// transforma em pontos com um pouco de profundidade.
export function monogram(count: number, rand: Rand, text: string) {
  const out = new Float32Array(count * 3);
  const w = 512;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return sphere(count, rand);

  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "800 210px Helvetica, Arial, sans-serif";
  ctx.fillText(text, w / 2, h / 2 + 8);

  const data = ctx.getImageData(0, 0, w, h).data;
  const filled: number[] = [];
  for (let y = 0; y < h; y += 2)
    for (let x = 0; x < w; x += 2) if (data[(y * w + x) * 4 + 3] > 128) filled.push(x, y);

  if (filled.length === 0) return sphere(count, rand);

  const scale = 4.4 / w;
  for (let i = 0; i < count; i++) {
    const p = Math.floor(rand() * (filled.length / 2)) * 2;
    out[i * 3] = (filled[p] - w / 2 + rand() * 2) * scale;
    out[i * 3 + 1] = -(filled[p + 1] - h / 2 + rand() * 2) * scale;
    out[i * 3 + 2] = (rand() - 0.5) * 0.45;
  }
  return out;
}

// Gerador determinístico para o resultado ser igual a cada carregamento.
export function seededRandom(seed = 7) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function rotateX(points: Float32Array, a: number) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  for (let i = 0; i < points.length; i += 3) {
    const y = points[i + 1];
    const z = points[i + 2];
    points[i + 1] = y * c - z * s;
    points[i + 2] = y * s + z * c;
  }
  return points;
}

function rotateY(points: Float32Array, a: number) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  for (let i = 0; i < points.length; i += 3) {
    const x = points[i];
    const z = points[i + 2];
    points[i] = x * c + z * s;
    points[i + 2] = -x * s + z * c;
  }
  return points;
}

function rotateZ(points: Float32Array, a: number) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  for (let i = 0; i < points.length; i += 3) {
    const x = points[i];
    const y = points[i + 1];
    points[i] = x * c - y * s;
    points[i + 1] = x * s + y * c;
  }
  return points;
}
