import { useRef, useEffect } from 'react';
import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  PlaneGeometry,
  Mesh,
  ShaderMaterial,
  Vector3,
  Vector2,
  Clock,
} from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// Layer 1 – Squares (scrolling 2D grid, canvas)
// ─────────────────────────────────────────────────────────────────────────────

const Squares = ({
  direction = 'diagonal',
  speed = 0.5,
  borderColor = '#1a1a2e',
  squareSize = 48,
  hoverFillColor = '#16213e',
}) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const gridOffset = useRef({ x: 0, y: 0 });
  const hoveredSquareRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const drawGrid = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize);
          const squareY = y - (gridOffset.current.y % squareSize);

          if (
            hoveredSquareRef.current &&
            Math.floor((x - startX) / squareSize) === hoveredSquareRef.current.x &&
            Math.floor((y - startY) / squareSize) === hoveredSquareRef.current.y
          ) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
          }

          ctx.strokeStyle = borderColor;
          ctx.strokeRect(squareX, squareY, squareSize, squareSize);
        }
      }

      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2,
        Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, '#060010');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const updateAnimation = () => {
      const s = Math.max(speed, 0.1);
      switch (direction) {
        case 'right':    gridOffset.current.x = (gridOffset.current.x - s + squareSize) % squareSize; break;
        case 'left':     gridOffset.current.x = (gridOffset.current.x + s + squareSize) % squareSize; break;
        case 'up':       gridOffset.current.y = (gridOffset.current.y + s + squareSize) % squareSize; break;
        case 'down':     gridOffset.current.y = (gridOffset.current.y - s + squareSize) % squareSize; break;
        case 'diagonal':
          gridOffset.current.x = (gridOffset.current.x - s + squareSize) % squareSize;
          gridOffset.current.y = (gridOffset.current.y - s + squareSize) % squareSize;
          break;
        default: break;
      }
      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;
      hoveredSquareRef.current = {
        x: Math.floor((mouseX + gridOffset.current.x - startX) / squareSize),
        y: Math.floor((mouseY + gridOffset.current.y - startY) / squareSize),
      };
    };
    const handleMouseLeave = () => { hoveredSquareRef.current = null; };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', border: 'none' }}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Layer 2 – FloatingLines (Three.js GLSL shader)
// ─────────────────────────────────────────────────────────────────────────────

const FL_VERT = `
precision highp float;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FL_FRAG = `
precision highp float;

uniform float iTime;
uniform vec3  iResolution;
uniform float animationSpeed;

uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;

uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;

const vec3 BLACK = vec3(0.0);
const vec3 PINK  = vec3(233.0, 71.0, 245.0) / 255.0;
const vec3 BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 background_color(vec2 uv) {
  vec3 col = vec3(0.0);
  float y = sin(uv.x - 0.2) * 0.3 - 0.1;
  float m = uv.y - y;
  col += mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(m)));
  col += mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(m - 0.8)));
  return col * 0.5;
}

vec3 getLineColor(float t, vec3 baseColor) {
  if (lineGradientCount <= 0) return baseColor;
  if (lineGradientCount == 1) return lineGradient[0] * 0.5;
  float clampedT = clamp(t, 0.0, 0.9999);
  float scaled = clampedT * float(lineGradientCount - 1);
  int idx = int(floor(scaled));
  float f = fract(scaled);
  int idx2 = min(idx + 1, lineGradientCount - 1);
  return mix(lineGradient[idx], lineGradient[idx2], f) * 0.5;
}

float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * animationSpeed;
  float x_offset   = offset;
  float x_movement = time * 0.1;
  float amp        = sin(offset + time * 0.2) * 0.3;
  float y          = sin(uv.x + x_offset + x_movement) * amp;
  if (shouldBend) {
    vec2 d = screenUv - mouseUv;
    float influence = exp(-dot(d, d) * bendRadius);
    float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
    y += bendOffset;
  }
  float m = uv.y - y;
  return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;
  if (parallax) baseUv += parallaxOffset;

  vec3 col = vec3(0.0);
  vec3 b = lineGradientCount > 0 ? vec3(0.0) : background_color(baseUv);

  vec2 mouseUv = vec2(0.0);
  if (interactive) {
    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
  }

  if (enableBottom) {
    for (int i = 0; i < bottomLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(bottomLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
        1.5 + 0.2 * fi, baseUv, mouseUv, interactive
      ) * 0.2;
    }
  }

  if (enableMiddle) {
    for (int i = 0; i < middleLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(middleLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * fi, baseUv, mouseUv, interactive
      );
    }
  }

  if (enableTop) {
    for (int i = 0; i < topLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(topLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      float angle = topWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      ruv.x *= -1.0;
      col += lineCol * wave(
        ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
        1.0 + 0.2 * fi, baseUv, mouseUv, interactive
      ) * 0.1;
    }
  }

  fragColor = vec4(col, 1.0);
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

const MAX_GRADIENT_STOPS = 8;

function hexToVec3(hex) {
  let value = hex.trim().replace(/^#/, '');
  if (value.length === 3) {
    value = value.split('').map(c => c + c).join('');
  }
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  return new Vector3(r, g, b);
}

const FloatingLines = ({
  linesGradient,
  enabledWaves = ['top', 'middle', 'bottom'],
  lineCount = [6],
  lineDistance = [5],
  topWavePosition,
  middleWavePosition,
  bottomWavePosition = { x: 2.0, y: -0.7, rotate: -1 },
  animationSpeed = 1,
  interactive = true,
  bendRadius = 5.0,
  bendStrength = -0.5,
  mouseDamping = 0.05,
  parallax = true,
  parallaxStrength = 0.2,
  mixBlendMode = 'screen',
}) => {
  const containerRef = useRef(null);
  const targetMouseRef = useRef(new Vector2(-1000, -1000));
  const currentMouseRef = useRef(new Vector2(-1000, -1000));
  const targetInfluenceRef = useRef(0);
  const currentInfluenceRef = useRef(0);
  const targetParallaxRef = useRef(new Vector2(0, 0));
  const currentParallaxRef = useRef(new Vector2(0, 0));

  const getLineCount = (waveType) => {
    if (typeof lineCount === 'number') return lineCount;
    if (!enabledWaves.includes(waveType)) return 0;
    const index = enabledWaves.indexOf(waveType);
    return lineCount[index] ?? 6;
  };

  const getLineDistance = (waveType) => {
    if (typeof lineDistance === 'number') return lineDistance;
    if (!enabledWaves.includes(waveType)) return 0.1;
    const index = enabledWaves.indexOf(waveType);
    return lineDistance[index] ?? 0.1;
  };

  const topLineCount    = enabledWaves.includes('top')    ? getLineCount('top')    : 0;
  const middleLineCount = enabledWaves.includes('middle') ? getLineCount('middle') : 0;
  const bottomLineCount = enabledWaves.includes('bottom') ? getLineCount('bottom') : 0;
  const topLineDistance    = enabledWaves.includes('top')    ? getLineDistance('top')    * 0.01 : 0.01;
  const middleLineDistance = enabledWaves.includes('middle') ? getLineDistance('middle') * 0.01 : 0.01;
  const bottomLineDistance = enabledWaves.includes('bottom') ? getLineDistance('bottom') * 0.01 : 0.01;

  useEffect(() => {
    if (!containerRef.current) return;

    const scene    = new Scene();
    const camera   = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset    = '0';
    renderer.domElement.style.width    = '100%';
    renderer.domElement.style.height   = '100%';
    renderer.domElement.style.mixBlendMode = mixBlendMode;
    containerRef.current.appendChild(renderer.domElement);

    const uniforms = {
      iTime:            { value: 0 },
      iResolution:      { value: new Vector3(1, 1, 1) },
      animationSpeed:   { value: animationSpeed },
      enableTop:        { value: enabledWaves.includes('top') },
      enableMiddle:     { value: enabledWaves.includes('middle') },
      enableBottom:     { value: enabledWaves.includes('bottom') },
      topLineCount:     { value: topLineCount },
      middleLineCount:  { value: middleLineCount },
      bottomLineCount:  { value: bottomLineCount },
      topLineDistance:  { value: topLineDistance },
      middleLineDistance: { value: middleLineDistance },
      bottomLineDistance: { value: bottomLineDistance },
      topWavePosition: {
        value: new Vector3(topWavePosition?.x ?? 10.0, topWavePosition?.y ?? 0.5, topWavePosition?.rotate ?? -0.4)
      },
      middleWavePosition: {
        value: new Vector3(middleWavePosition?.x ?? 5.0, middleWavePosition?.y ?? 0.0, middleWavePosition?.rotate ?? 0.2)
      },
      bottomWavePosition: {
        value: new Vector3(bottomWavePosition?.x ?? 2.0, bottomWavePosition?.y ?? -0.7, bottomWavePosition?.rotate ?? 0.4)
      },
      iMouse:           { value: new Vector2(-1000, -1000) },
      interactive:      { value: interactive },
      bendRadius:       { value: bendRadius },
      bendStrength:     { value: bendStrength },
      bendInfluence:    { value: 0 },
      parallax:         { value: parallax },
      parallaxStrength: { value: parallaxStrength },
      parallaxOffset:   { value: new Vector2(0, 0) },
      lineGradient: {
        value: Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1))
      },
      lineGradientCount: { value: 0 },
    };

    if (linesGradient && linesGradient.length > 0) {
      const stops = linesGradient.slice(0, MAX_GRADIENT_STOPS);
      uniforms.lineGradientCount.value = stops.length;
      stops.forEach((hex, i) => {
        const c = hexToVec3(hex);
        uniforms.lineGradient.value[i].set(c.x, c.y, c.z);
      });
    }

    const material = new ShaderMaterial({ uniforms, vertexShader: FL_VERT, fragmentShader: FL_FRAG });
    const geometry = new PlaneGeometry(2, 2);
    scene.add(new Mesh(geometry, material));

    const clock = new Clock();

    const setSize = () => {
      const el  = containerRef.current;
      if (!el) return;
      const w   = el.clientWidth  || 1;
      const h   = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      const cw  = renderer.domElement.width;
      const ch  = renderer.domElement.height;
      uniforms.iResolution.value.set(cw, ch, 1);
    };
    setSize();

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(setSize) : null;
    if (ro && containerRef.current) ro.observe(containerRef.current);

    const handlePointerMove = (event) => {
      const rect   = renderer.domElement.getBoundingClientRect();
      const x      = event.clientX - rect.left;
      const y      = event.clientY - rect.top;
      const dpr    = renderer.getPixelRatio();
      targetMouseRef.current.set(x * dpr, (rect.height - y) * dpr);
      targetInfluenceRef.current = 1.0;
      if (parallax) {
        targetParallaxRef.current.set(
          ((x - rect.width  / 2) / rect.width)  * parallaxStrength,
          -((y - rect.height / 2) / rect.height) * parallaxStrength
        );
      }
    };
    const handlePointerLeave = () => { targetInfluenceRef.current = 0.0; };

    if (interactive) {
      renderer.domElement.addEventListener('pointermove',  handlePointerMove);
      renderer.domElement.addEventListener('pointerleave', handlePointerLeave);
    }

    let raf = 0;
    const renderLoop = () => {
      uniforms.iTime.value = clock.getElapsedTime();
      if (interactive) {
        currentMouseRef.current.lerp(targetMouseRef.current, mouseDamping);
        uniforms.iMouse.value.copy(currentMouseRef.current);
        currentInfluenceRef.current += (targetInfluenceRef.current - currentInfluenceRef.current) * mouseDamping;
        uniforms.bendInfluence.value = currentInfluenceRef.current;
      }
      if (parallax) {
        currentParallaxRef.current.lerp(targetParallaxRef.current, mouseDamping);
        uniforms.parallaxOffset.value.copy(currentParallaxRef.current);
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      cancelAnimationFrame(raf);
      if (ro && containerRef.current) ro.disconnect();
      if (interactive) {
        renderer.domElement.removeEventListener('pointermove',  handlePointerMove);
        renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    linesGradient, enabledWaves, lineCount, lineDistance,
    topWavePosition, middleWavePosition, bottomWavePosition,
    animationSpeed, interactive, bendRadius, bendStrength,
    mouseDamping, parallax, parallaxStrength, mixBlendMode,
  ]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Layer 3 – Particles (raw WebGL, no deps)
// ─────────────────────────────────────────────────────────────────────────────

const PARTICLE_VERT = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  varying vec4 vRandom;
  varying vec3 vColor;
  void main() {
    vRandom = random;
    vColor  = color;
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
    vec4 mvPos = viewMatrix * mPos;
    gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    gl_Position  = projectionMatrix * mvPos;
  }
`;

const PARTICLE_FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;
  void main() {
    vec2  uv = gl_PointCoord.xy;
    float d  = length(uv - vec2(0.5));
    if (uAlphaParticles < 0.5) {
      if (d > 0.5) discard;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;

const defaultParticleColors = ['#ffffff'];

const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const int = parseInt(hex, 16);
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
};

function compileShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}
function buildProgram(gl, vs, fs) {
  const p = gl.createProgram();
  gl.attachShader(p, compileShader(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compileShader(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  return p;
}

const Particles = ({
  particleCount = 1000,
  particleSpread = 12,
  speed = 0.1,
  particleColors,
  moveParticlesOnHover = true,
  particleHoverFactor = 0.5,
  alphaParticles = true,
  particleBaseSize = 120,
  sizeRandomness = 1.2,
  cameraDistance = 22,
  disableRotation = false,
}) => {
  const canvasRef       = useRef(null);
  const mouseRef        = useRef({ x: 0, y: 0 });
  const particlesPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener('resize', resize);
    resize();

    const count    = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms   = new Float32Array(count * 4);
    const colors    = new Float32Array(count * 3);
    const palette   = particleColors && particleColors.length > 0 ? particleColors : defaultParticleColors;

    for (let i = 0; i < count; i++) {
      let x, y, z, len;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);
      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      colors.set(hexToRgb(palette[Math.floor(Math.random() * palette.length)]), i * 3);
    }

    const program = buildProgram(gl, PARTICLE_VERT, PARTICLE_FRAG);
    gl.useProgram(program);

    const makeBuffer = (data, attrib, size) => {
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(program, attrib);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };
    makeBuffer(positions, 'position', 3);
    makeBuffer(randoms,   'random',   4);
    makeBuffer(colors,    'color',    3);

    const uLoc = (n) => gl.getUniformLocation(program, n);
    const fov  = 15 * Math.PI / 180;

    const mat4 = {
      perspective: (fov, aspect, near, far) => {
        const f = 1 / Math.tan(fov / 2), nf = 1 / (near - far);
        return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
      },
      translation: (tx, ty, tz) => new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, tx,ty,tz,1]),
      rotationX:   (a) => new Float32Array([1,0,0,0, 0,Math.cos(a),-Math.sin(a),0, 0,Math.sin(a),Math.cos(a),0, 0,0,0,1]),
      rotationY:   (a) => new Float32Array([Math.cos(a),0,Math.sin(a),0, 0,1,0,0, -Math.sin(a),0,Math.cos(a),0, 0,0,0,1]),
      rotationZ:   (a) => new Float32Array([Math.cos(a),-Math.sin(a),0,0, Math.sin(a),Math.cos(a),0,0, 0,0,1,0, 0,0,0,1]),
      multiply: (a, b) => {
        const o = new Float32Array(16);
        for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 4; k++) o[j*4+i] += a[k*4+i]*b[j*4+k];
        return o;
      },
    };

    gl.uniformMatrix4fv(uLoc('viewMatrix'), false, mat4.translation(0, 0, -cameraDistance));
    gl.uniform1f(uLoc('uSpread'),        particleSpread);
    gl.uniform1f(uLoc('uBaseSize'),      particleBaseSize);
    gl.uniform1f(uLoc('uSizeRandomness'), sizeRandomness);
    gl.uniform1f(uLoc('uAlphaParticles'), alphaParticles ? 1 : 0);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x:  ((e.clientX - rect.left) / rect.width)  * 2 - 1,
        y: -(((e.clientY - rect.top)  / rect.height) * 2 - 1),
      };
    };
    if (moveParticlesOnHover) canvas.addEventListener('mousemove', handleMouseMove);

    let animId, lastTime = performance.now(), elapsed = 0, rotZ = 0;

    const update = (t) => {
      animId = requestAnimationFrame(update);
      elapsed += (t - lastTime) * speed;
      lastTime = t;

      const aspect = canvas.width / canvas.height;
      gl.uniformMatrix4fv(uLoc('projectionMatrix'), false, mat4.perspective(fov, aspect, 0.1, 100));

      if (moveParticlesOnHover) {
        particlesPosRef.current.x += (-mouseRef.current.x * particleHoverFactor - particlesPosRef.current.x) * 0.1;
        particlesPosRef.current.y += (-mouseRef.current.y * particleHoverFactor - particlesPosRef.current.y) * 0.1;
      }

      const tx = moveParticlesOnHover ? particlesPosRef.current.x : 0;
      const ty = moveParticlesOnHover ? particlesPosRef.current.y : 0;
      let model = mat4.translation(tx, ty, 0);

      if (!disableRotation) {
        rotZ += 0.01 * speed;
        model = mat4.multiply(model, mat4.rotationX(Math.sin(elapsed * 0.0002) * 0.1));
        model = mat4.multiply(model, mat4.rotationY(Math.cos(elapsed * 0.0005) * 0.15));
        model = mat4.multiply(model, mat4.rotationZ(rotZ));
      }

      gl.uniformMatrix4fv(uLoc('modelMatrix'), false, model);
      gl.uniform1f(uLoc('uTime'), elapsed * 0.001);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, count);
    };
    animId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resize);
      if (moveParticlesOnHover) canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [particleCount, particleSpread, speed, moveParticlesOnHover, particleHoverFactor, alphaParticles, particleBaseSize, sizeRandomness, cameraDistance, disableRotation]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block',
        pointerEvents: moveParticlesOnHover ? 'auto' : 'none',
      }}
    />
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SquaresLinesParticles — all three layers composed
// ─────────────────────────────────────────────────────────────────────────────

/**
 * SquaresLinesParticles
 *
 * Stack (bottom → top):
 *   1. Squares      — scrolling 2D grid (canvas)
 *   2. FloatingLines — GLSL wave lines (Three.js, mixBlendMode: screen)
 *   3. Particles    — floating 3D dots (raw WebGL)
 *
 * ── Squares props ─────────────────────────────────────────────────────────
 *   direction        'right'|'left'|'up'|'down'|'diagonal'
 *   squaresSpeed     scroll speed (px/frame)
 *   borderColor      grid line color
 *   squareSize       cell size in px
 *   hoverFillColor   cell fill on hover
 *
 * ── FloatingLines props ───────────────────────────────────────────────────
 *   linesGradient    string[]  hex colors for line gradient
 *   enabledWaves     string[]  subset of ['top','middle','bottom']
 *   lineCount        number | number[]  lines per wave layer
 *   lineDistance     number | number[]  spacing between lines
 *   animationSpeed   float
 *   interactive      bool — bend lines toward cursor
 *   bendRadius       float
 *   bendStrength     float
 *   parallax         bool
 *   parallaxStrength float
 *   linesMixBlendMode CSS mix-blend-mode string
 *
 * ── Particles props ───────────────────────────────────────────────────────
 *   particleCount        number
 *   particleSpread       float
 *   particlesSpeed       float
 *   particleColors       string[]  hex colors
 *   moveParticlesOnHover bool
 *   particleHoverFactor  float
 *   alphaParticles       bool
 *   particleBaseSize     float
 *   sizeRandomness       float
 *   cameraDistance       float
 *   disableRotation      bool
 */
const SquaresLinesParticles = ({
  // Squares
  direction         = 'diagonal',
  squaresSpeed      = 0.5,
  borderColor       = '#1a1a2e',
  squareSize        = 48,
  hoverFillColor    = '#16213e',

  // FloatingLines
  linesGradient     = ['#a855f7', '#6366f1', '#ec4899'],
  enabledWaves      = ['top', 'middle', 'bottom'],
  lineCount         = [6],
  lineDistance      = [5],
  topWavePosition,
  middleWavePosition,
  bottomWavePosition = { x: 2.0, y: -0.7, rotate: -1 },
  animationSpeed    = 1,
  interactive       = true,
  bendRadius        = 5.0,
  bendStrength      = -0.5,
  mouseDamping      = 0.05,
  parallax          = true,
  parallaxStrength  = 0.2,
  linesMixBlendMode = 'screen',

  // Particles
  particleCount        = 1000,
  particleSpread       = 12,
  particlesSpeed       = 0.1,
  particleColors       = ['#a855f7', '#6366f1', '#ec4899', '#38bdf8', '#34d399', '#fb923c', '#f472b6', '#ffffff'],
  moveParticlesOnHover = true,
  particleHoverFactor  = 0.5,
  alphaParticles       = true,
  particleBaseSize     = 120,
  sizeRandomness       = 1.2,
  cameraDistance       = 22,
  disableRotation      = false,
}) => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#060010' }}>

      {/* ── Layer 1: Squares grid ── */}
      <Squares
        direction={direction}
        speed={squaresSpeed}
        borderColor={borderColor}
        squareSize={squareSize}
        hoverFillColor={hoverFillColor}
      />

      {/* ── Layer 2: Floating wave lines ── */}
      <FloatingLines
        linesGradient={linesGradient}
        enabledWaves={enabledWaves}
        lineCount={lineCount}
        lineDistance={lineDistance}
        topWavePosition={topWavePosition}
        middleWavePosition={middleWavePosition}
        bottomWavePosition={bottomWavePosition}
        animationSpeed={animationSpeed}
        interactive={interactive}
        bendRadius={bendRadius}
        bendStrength={bendStrength}
        mouseDamping={mouseDamping}
        parallax={parallax}
        parallaxStrength={parallaxStrength}
        mixBlendMode={linesMixBlendMode}
      />

      {/* ── Layer 3: Particles ── */}
      <Particles
        particleCount={particleCount}
        particleSpread={particleSpread}
        speed={particlesSpeed}
        particleColors={particleColors}
        moveParticlesOnHover={moveParticlesOnHover}
        particleHoverFactor={particleHoverFactor}
        alphaParticles={alphaParticles}
        particleBaseSize={particleBaseSize}
        sizeRandomness={sizeRandomness}
        cameraDistance={cameraDistance}
        disableRotation={disableRotation}
      />

    </div>
  );
};

export default SquaresLinesParticles;