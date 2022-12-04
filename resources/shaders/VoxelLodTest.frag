#version 460 core

in vec2 uv;
in vec2 ndc; // Normalized device coordinates

out vec4 FragColor;

vec3 cameraOrigin = vec3(0.0, 0.0, -5.0);
vec3 cameraDirection = vec3(0.0, 0.0, -1.0);

uniform float aspectRatio;
uniform float iTime;
uniform vec3 iResolution;
uniform vec3 iMouse;

#define m(p) (length(mod(p, 4.0) - 2.0 ) - 2.0)

vec4 mainImage(vec2 fragCoord)
{
    vec3 screenRes = iResolution;
    vec3 mousePos = iMouse.xyz;
    vec3 c = 3.0 * (mousePos / screenRes - 0.5) * sign(mousePos);
    vec3 d = vec3(screenRes.y / 0.5, fragCoord + fragCoord - screenRes.xy);
    vec3 p = d - d; 
    p.x = iTime;
    d.xy *= mat2(sin(vec4(0, 11, 33, 0) + c.x)); 
    d /= length(d);

    c = p;
    float e = fragCoord.x / screenRes.x * 4.0;
    float L = float(4 << int(e));
    float z = L;
    for(int i = 0; i++ < 999 && z <= L;)
    {
        screenRes = sign(d);
        mousePos = fract(-c * z * screenRes);
        mousePos += step(mousePos, -mousePos);
        screenRes *= mousePos / d;
        mousePos = min(screenRes.xxx, min(screenRes.y, screenRes.z));
        c += d * mousePos / z;
        z *= m(ceil(c * z + d * step(screenRes, mousePos)) / z - 0.5 / z) * z < 0.8 ? 2.0 : 1.0;
    }

    vec4 fragColor;
    fragColor.rgb = (mod(ceil(c * z / 2.0), 3.0) + 0.5) / vec3(8.0 + dot( p - c, p - c)) * (m(c)* z);
    fragColor *= 1.2 - 0.8 * pow(abs(mod(e + e, 2.0) - 1.0), 3.0);
    return fragColor;
}

void main()
{
    FragColor = mainImage(ndc.xy);
}