// Simplex noise 3D — Ashima Arts / Stefan Gustavson (MIT).
const noise = /* glsl */ `
vec4 permute(vec4 x){ return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0 / 7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

export const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uShape;
uniform float uNoise;
uniform float uSize;
uniform float uPixelRatio;

attribute vec3 aShape1;
attribute vec3 aShape2;
attribute vec3 aShape3;
attribute vec3 aShape4;
attribute float aRandom;

varying float vAlpha;
varying float vMix;

${noise}

// Cada partícula começa o morph num momento levemente diferente (aRandom),
// o que dá a sensação de "enxame" em vez de uma interpolação linear.
float morph(float k){
  return smoothstep(0.0, 1.0, clamp((uShape - k) * 1.5 - aRandom * 0.5, 0.0, 1.0));
}

void main(){
  vec3 p = position;
  p = mix(p, aShape1, morph(0.0));
  p = mix(p, aShape2, morph(1.0));
  p = mix(p, aShape3, morph(2.0));
  p = mix(p, aShape4, morph(3.0));

  float n = snoise(p * 0.55 + vec3(0.0, uTime * 0.12, uTime * 0.05));
  p += normalize(p + 0.0001) * n * uNoise;
  p.y += sin(uTime * 0.6 + aRandom * 6.2831) * 0.03;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.45 + aRandom) * uPixelRatio * (10.0 / -mv.z);

  vAlpha = 0.35 + 0.65 * aRandom;
  vMix = clamp(0.5 + n * 0.9 + p.y * 0.12, 0.0, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;

varying float vAlpha;
varying float vMix;

void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float strength = pow(1.0 - d * 2.0, 1.6);
  vec3 color = mix(uColorA, uColorB, vMix);
  gl_FragColor = vec4(color, strength * vAlpha * uOpacity);
}
`;
