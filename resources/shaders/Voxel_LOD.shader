//Based on: https://www.shadertoy.com/view/sdy3RW

#define m(p) (length(mod(p, 4.0) - 2.0 ) - 2.0)

void mainImage(vec2 fragCoord)
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
    L = float(4 << int(e));
    z = L;
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
    fragColor *= 1.2-.8*pow(abs(mod(e+e,2.)-1.),3.);
    return fragColor;
}

void main()
{
    FragColor = mainImage(ndc.xy);
}