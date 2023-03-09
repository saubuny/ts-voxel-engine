#version 300 es

in vec2 a_position;

// This is for our canvas' resolution in pixel
uniform vec2 u_resolution;

void main() {
    // Convert from pixels to Clip Space (-1, 1)
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;

    // Move (-1, -1) to top left
    vec2 clipSpaceLeft = clipSpace * vec2(1, -1); 

    gl_Position = vec4(clipSpaceLeft, 0, 1);
}

