import vertexShaderSource from "./shaders/vertex.glsl?raw";
import fragmentShaderSource from "./shaders/frag.glsl?raw";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl2");
if (!gl) throw new Error("Failed to get WebGL rendering context");

// Resize the CSS canvas size to match its rendering size
function resizeCanvasToDisplay(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio;
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
}

// Compile our shader from source
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

// Create a program from our shaders
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
const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
const colorUniformLocation = gl.getUniformLocation(program, "u_color");

const positionBuffer = gl.createBuffer();
if (!positionBuffer) throw new Error("Failed to create buffer");
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30];
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

// Fill the buffer with values that define a rectangle
function setRectangle(
  gl: WebGLRenderingContext,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;

  // NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect
  // whatever buffer is bound to the `ARRAY_BUFFER` bind point
  // but so far we only have one buffer. If we had more than one
  // buffer we'd want to bind that buffer to `ARRAY_BUFFER` first.

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  );
}

resizeCanvasToDisplay(gl.canvas as HTMLCanvasElement);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program);
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
gl.bindVertexArray(vao);

// Draw
for (let i = 0; i < 1000; i++) {
  const randomInt = (range: number) => Math.floor(Math.random() * range);

  // Set buffer data
  setRectangle(
    gl,
    randomInt(gl.canvas.width),
    randomInt(gl.canvas.height),
    randomInt(300),
    randomInt(300)
  );

  // Set a random color (colors are 0-1 values)
  gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

  // Draw the rectangle
  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 6;
  gl.drawArrays(primitiveType, offset, count);
}
