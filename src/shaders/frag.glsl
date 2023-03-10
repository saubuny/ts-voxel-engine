#version 300 es

precision highp float;

// Attributes are per-vertex and uniforms are per-primitive
uniform vec4 u_color;

out vec4 outColor;
in vec4 v_color;

void main() {
    // outColor = vec4(1, 0, 0.5, 1);
    outColor = v_color;
}
