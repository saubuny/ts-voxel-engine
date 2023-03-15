#version 300 es

precision highp float;

// Attributes are per-vertex and uniforms are per-primitive
uniform vec4 u_color;

out vec4 outColor;
in vec4 v_color;

void main() {
    outColor = u_color;
}
