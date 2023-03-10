import vertexShaderSource from "./shaders/vertex.glsl?raw";
import fragmentShaderSource from "./shaders/frag.glsl?raw";
import { resizeCanvasToDisplay } from "./gl/utils";
import { createShader, createProgram } from "./gl/gl";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl2");
if (!gl) throw new Error("Failed to get WebGL rendering context");

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

// The Vertex Array Object stores our attribute's state
const vao = gl.createVertexArray();
if (!vao) throw new Error("Failed to create Vertex Array Object");
gl.bindVertexArray(vao);
gl.enableVertexAttribArray(positionAttributeLocation);

// Tell attribute how to read the information it's recieving
// Binds the current buffer binded to ARRAY_BUFFER to the attribute, ARRAY_BUFFER is empty now
const size = 2;
const type = gl.FLOAT;
const normalize = false;
const stride = 0;
const offset = 0;
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

// Fill the buffer currently bound to ARRAY_BUFFER with values
function setGeometry(gl: WebGLRenderingContext) {
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 40, 150, 125, 175, 100]), gl.STATIC_DRAW);
}

resizeCanvasToDisplay(gl.canvas as HTMLCanvasElement);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program);
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
gl.bindVertexArray(vao);

// Draw
function draw(gl: WebGLRenderingContext) {
  // const randomInt = (range: number) => Math.floor(Math.random() * range);

  // Set buffer data
  setGeometry(gl);

  // Set a random color (colors are 0-1 values)
  gl.uniform4f(colorUniformLocation, Math.random(), Math.random(), Math.random(), 1);

  // Draw the rectangle
  const primitiveType = gl.TRIANGLES;
  const offset = 0;
  const count = 3;
  gl.drawArrays(primitiveType, offset, count);
}

gl.canvas.addEventListener("click", () => {
  draw(gl);
});

draw(gl);
