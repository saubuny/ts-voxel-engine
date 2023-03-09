const canvas = document.createElement("canvas");
const gl = canvas.getContext("webgl2")!;

console.log(gl);

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
function createShader(
  gl: WebGL2RenderingContext,
  type: GLenum,
  source: string
): WebGLShader | undefined {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Failed to create Shader");

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success: boolean = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) return shader;

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return;
}

export {};
