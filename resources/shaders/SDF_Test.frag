#version 400 core

in vec2 uv;
in vec3 ndc; // Normalized device coordinates

out vec4 FragColor;

vec3 cameraOrigin = vec3(-2.0, -2.0, -6.0);
vec3 cameraDirection = vec3(0.0, 0.0, -1.0);

uniform vec2 screenSize = vec2(1280.0, 800.0);

float sdBox( vec3 p, vec3 b )
{
    vec3 q = abs(p) - b;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float sdRoundBox( vec3 p, vec3 b, float r )
{
    vec3 q = abs(p) - b;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
}

float sdBoxFrame( vec3 p, vec3 b, float e )
{
    p = abs(p)-b;
    vec3 q = abs(p+e)-e;
    return min(min(
        length(max(vec3(p.x,q.y,q.z),0.0))+min(max(p.x,max(q.y,q.z)),0.0),
        length(max(vec3(q.x,p.y,q.z),0.0))+min(max(q.x,max(p.y,q.z)),0.0)),
        length(max(vec3(q.x,q.y,p.z),0.0))+min(max(q.x,max(q.y,p.z)),0.0));
}

float sdTorus( vec3 p, vec2 t )
{
    vec2 q = vec2(length(p.xz)-t.x,p.y);
    return length(q)-t.y;
}

float distanceFromSphere(vec3 point, vec3 sphereCenter, float sphereRadius)
{
    return length(point - sphereCenter) - sphereRadius;
}

float worldDistance(vec3 point)
{
    float displacement = cos(5.0 * point.x) * sin(5.0 * point.y) * sin(5.0 * point.z) * 0.25;
    float sphere_0 = distanceFromSphere(point, vec3(0.0), 1.0);
    float sphere_1 = distanceFromSphere(point, vec3(-0.7), 0.6);

    float box_0 = sdRoundBox(point, vec3(0.25), 0.2);

    float boxFrame = sdBoxFrame(point, vec3(0.5,0.3,0.5), 0.025);

    return sdTorus(point, vec2(1.0, 0.5));
    //return box_0;
    //return min(min(min(sphere_0 + displacement, sphere_1), box_0), boxFrame);
}

vec3 calculateNormal(vec3 point)
{
    const vec3 step = vec3(0.001, 0.0, 0.0);

    float grad_x = worldDistance(point + step.xyy) - worldDistance(point - step.xyy);
    float grad_y = worldDistance(point + step.yxy) - worldDistance(point - step.yxy);
    float grad_z = worldDistance(point + step.yyx) - worldDistance(point - step.yyx);

    vec3 normal = vec3(grad_x, grad_y, grad_z);

    return normalize(normal);
}

vec3 rayMarch(vec3 rayOrigin, vec3 rayDirection)
{
    float distanceTraveled = 0.0;
    const int MAX_STEPS = 64;
    const float MAX_DISTANCE = 1000.0;
    const float HIT_THRESHOLD = 0.01;

    for(int i = 0; i < MAX_STEPS; ++i)
    {
        // Calculate current position
        vec3 currentPosition = rayOrigin + distanceTraveled * rayDirection;

        // Calculate distance to closest object in world
        float closestDistance = worldDistance(currentPosition);

        if (closestDistance < HIT_THRESHOLD)
        {
            vec3 lightPositionTemp = vec3(2.0, -5.0, 3.0);
            vec3 directionToLight = normalize(currentPosition - lightPositionTemp);
            vec3 normal = calculateNormal(currentPosition);
            float diffIntensity = max(0.0, dot(normal, directionToLight));
            float steps = float(i) / MAX_STEPS;
            //return vec3(steps);
            //return vec3(diffIntensity);
            return normal * 0.5 + 0.5;
            //return vec3(1.0, 1.0, 1.0);
        }

        if (distanceTraveled > MAX_DISTANCE)
        {
            // Break out of the loop as we exceeded the maximum ray distance
            //return vec3(0.0, 0.0, 0.0);
            break;
        }

        // Accumulate the distance
        distanceTraveled += closestDistance;
    }

    // Nothing hit, return black
    //return vec3(1.0, 0.0, 0.0);
    return vec3(0.0);
}

void main()
{
    vec2 rayDir = ndc.xy * screenSize * 0.001;
    vec3 sdf = rayMarch(cameraOrigin, vec3(rayDir, 1.0));
    FragColor = vec4(sdf, 1.0);
}