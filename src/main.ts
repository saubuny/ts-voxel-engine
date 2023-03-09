const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl2");
if (!gl) throw new Error("Failed to get WebGL rendering context");

// CSS size = canvas display size (put this into a function and call in draw loop)
function resizeCanvasToDisplay(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio;
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
}

// Vertex shaders are responsible for computing vertex positions
const vertexShaderSource = `#version 300 es
     
    // an attribute is an input (in) to a vertex shader.
    // It will receive data from a buffer
    in vec4 a_position;
     
    // all shaders have a main function
    void main() {
     
      // gl_Position is a special variable a vertex shader
      // is responsible for setting
      gl_Position = a_position;
    }
`;

// Fragment shaders are responsible for computing the color of each pixel
const fragmentShaderSource = `#version 300 es
     
    // fragment shaders don't have a default precision so we need
    // to pick one. highp is a good default. It means "high precision"
    precision highp float;
     
    // we need to declare an output for the fragment shader
    out vec4 outColor;
     
    void main() {
      // Just set the output to a constant reddish-purple
      outColor = vec4(1, 0, 0.5, 1);
    }
`;

// Compile a shader from a given source and return it
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

// Create the shaders for our program
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

// Link shaders to a program
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

// Now we have something to work with :)
const program = createProgram(gl, vertexShader, fragmentShader);

// Our vertex shader takes in a vec4 a_position, getting attrib locations should NOT be done in a loop
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

// Store value in a buffer
const positionBuffer = gl.createBuffer();
if (!positionBuffer) throw new Error("Failed to create buffer");
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const positions = [0, 0, 0, 0.5, 0.7, 0];

// WebGL needs strongly typed data, so we convert to a Float32Array
// gl.STATIC_DRAW helps with optimization, as we tell it that this data will not change much
// gl.bufferData copies data to the currently binded buffer (positionBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// Create Vertex Array Object, a collection of attribute state
// This tells our attribute how to get data from a buffer
const vao = gl.createVertexArray();
if (!vao) throw new Error("Failed to create Vertex Array Object");

// Make this VAO our current one
gl.bindVertexArray(vao);

// Enable the attribute, telling WebGL that we want to get data from out of a buffer
gl.enableVertexAttribArray(positionAttributeLocation);

const size = 2; // Amount of components per iterations
const type = gl.FLOAT; //  We use 32 bit floats in our data
const normalize = false; // ???
const stride = 0; // How far we move each iteration
const offset = 0; // Start from beggining of buffer

// a_position is a vec4, so it'd look something like { x: 0, y: 0, z: 0, w: 1 } in JavaScript
// size = 2 means we get the first two values (x and y) from the buffer
// z and w are set to their default of 0 and 1 respectively

// Specify how to pull data out from the buffer
// gl.vertexAttribPointer also binds the current ARRAY_BUFFER to the attribute
// This attribute is now bound to positionBuffer, and ARRAY_BUFFER is free to be used elsewhere
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

// Loop

// Resize Display
resizeCanvasToDisplay(gl.canvas as HTMLCanvasElement);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Clear Canvas
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Use shaders
gl.useProgram(program);

// Use our set of buffers
gl.bindVertexArray(vao);

// Run our vertex shader 3 times
// 1. a_position.x and a_position.y set to first two values in positionBuffer
// 2. Then the second two values
// 3. Then the last two values
const count = 3;

// Because we use triangles, WebGL will draw a triangle for every three vertex shader runs
// Based on the three values we set gl_Position to
// The coordinates go from -1 to 1 in either direction
const primitiveType = gl.TRIANGLES;

// Draw to the screen
const drawOffset = 0;
gl.drawArrays(primitiveType, drawOffset, count);

export {};
