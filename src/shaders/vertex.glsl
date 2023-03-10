#version 300 es

in vec2 a_position;

// This is our canvas' resolution in pixel
uniform vec2 u_resolution;

// This is a varying
out vec4 v_color;

void main() {
    // Convert from pixels to Clip Space (-1, 1)
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;

    // Move (-1, -1) to top left
    vec2 clipSpaceLeft = clipSpace * vec2(1, -1); 

    gl_Position = vec4(clipSpaceLeft, 0, 1);

    // Clip space goes -1.0 to +1.0
    // Color space goes from 0.0 to 1.0
    v_color = gl_Position * 0.5 + 0.5;
}

