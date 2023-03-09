import vertexShaderSource from "./shaders/vertex.glsl?raw";
import fragmentShaderSource from "./shaders/frag.glsl?raw";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl2");
if (!gl) throw new Error("Failed to get WebGL rendering context");

function resizeCanvasToDisplay(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio;
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
}

function createShader(gl: WebGL2RenderingContext, type: GLenum, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Failed to create shader");

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS) as boolean;
  if (success) return shader;

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  throw new Error("Failed to compile shader");
}

function createProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const program = gl.createProgram();
  if (!program) throw new Error("Failed to create program");

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS) as boolean;
  if (success) return program;

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  throw new Error("Failed to attach shaders");
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = createProgram(gl, vertexShader, fragmentShader);
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
const positionBuffer = gl.createBuffer();
if (!positionBuffer) throw new Error("Failed to create buffer");
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const positions = [0, 0, 0, 0.5, 0.7, 0];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

const vao = gl.createVertexArray();
if (!vao) throw new Error("Failed to create Vertex Array Object");
gl.bindVertexArray(vao);
gl.enableVertexAttribArray(positionAttributeLocation);

const size = 2;
const type = gl.FLOAT;
const normalize = false;
const stride = 0;
const offset = 0;
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

// Draw

resizeCanvasToDisplay(gl.canvas as HTMLCanvasElement);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program);
gl.bindVertexArray(vao);

const count = 3;
const primitiveType = gl.TRIANGLES;
const drawOffset = 0;

gl.drawArrays(primitiveType, drawOffset, count);

export {};
