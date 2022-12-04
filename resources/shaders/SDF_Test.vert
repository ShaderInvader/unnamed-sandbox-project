#version 400 core
layout (location = 0) in vec3 aPosition;
layout (location = 1) in vec2 aTexcoord;

out vec2 uv;
out vec2 ndc;

uniform float aspectRatio;

void main()
{
    uv = aTexcoord;
    ndc = aPosition.xy;
    //ndc.y *= aspectRatio;
    gl_Position = vec4(aPosition, 1.0);
}