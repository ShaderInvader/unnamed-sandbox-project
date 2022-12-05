#version 460 core

in vec2 uv;
in vec2 ndc;

out vec4 FragColor;

vec3 cameraOrigin = vec3(0.0, 0.0, -5.0);
vec3 cameraDirection = vec3(0.0, 0.0, -1.0);

uniform float aspectRatio;
uniform float iTime;
uniform vec3 iResolution;
uniform vec3 iMouse;

// Supersampling setup
const int samples = 1;
const int samplesSqr = samples * samples;

// Block size setup
const float voxelSize = 1.0;

// Ray setup
const int maxRaySteps = 512;
const float maxRayDistance = 1.0;

const float sqrRootOfThree = 1.73205080757;

float sdSphere(vec3 p, float d) { return length(p) - d; } 

float sdBox( vec3 p, vec3 b ) 
{
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

int getVoxel(vec3 point, float size)
{
    float dist = min(max(-sdSphere(point, 0.218), sdBox(point, vec3(0.15))), -sdSphere(point, 0.5));
    return int(dist < size * sqrRootOfThree);
}

void main()
{
    // Supersampling loop - samples get squared and more rays per pixel get dispatched
    for (int j = 0; j < samplesSqr; ++j)
    {
        // ===== Supersampling based sampling coordinates =====
        // float dist = 1.0 / float(samples);
        // float xOffset = float(j % samples) * dist - 0.5;
        // float yOffset = float(j / samples) * dist - 0.5;
        // xOffset /= iResolution.x;
        // yOffset /= iResolution.y;
        // vec2 uv = ndc + vec2(xOffset, yOffset);

        vec2 uv = ndc;

        // ===== Ray configuration =====
        vec3 rayOrigin = vec3(0.0, 0.0, 0.0); //ro
        vec3 rayDirection = vec3(uv.x, uv.y, 1.0); //rd

        // ===== View rotation and controls section =====
        // TODO: Mouse look
        // float x = mod(iMouse.x/iResolution.x+0.5,1.), y = mod(iMouse.y/iResolution.y+0.5,1.);
        // rd.yz *= rot(y*pi-pi*0.5); rd.xz *= rot(iTime* 0.1-pi); rd.xz *= rot(x*pi*2.0-pi);

        vec3 lro = mod(rayOrigin, voxelSize);
        vec3 fro = rayOrigin - lro;
        vec3 ird = 1.0 / max(abs(rayDirection), 0.001);

        // ===== Parameter setup =====
        vec3 mask;
        vec3 lastMask;

        int recursions = 0;

        float dist = 0.0;
        float fdist = 0.0;

        bool exit = false;

        // ===== Actual raymarching loop =====
        for(int raySteps = 0; raySteps < maxRaySteps; ++raySteps)
        {
            // Break raymarching if we exceeded the maximum distance
            if (dist > maxRayDistance)
            {
                break;
            }

            if (exit)
            {
                vec3 newFro = floor(fro / (voxelSize * 2.0)) * (voxelSize * 2.0);
            }

            int vox = getVoxel(fro, voxelSize);
        }
    }
}