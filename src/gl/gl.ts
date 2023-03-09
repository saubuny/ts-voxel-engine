// Compile our shader from source
export function createShader(
  gl: WebGL2RenderingContext,
  type: GLenum,
  source: string
): WebGLShader {
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
export function createProgram(
  gl: WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram {
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
