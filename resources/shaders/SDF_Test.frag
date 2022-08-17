#version 400 core

in vec2 uv;
in vec3 ndc; // Normalized device coordinates

out vec4 FragColor;

vec3 cameraOrigin = vec3(0.0, 0.0, -5.0);
vec3 cameraDirection = vec3(0.0, 0.0, -1.0);

uniform vec2 screenSize = vec2(1280.0, 800.0);

float distanceFromSphere(vec3 point, vec3 sphereCenter, float sphereRadius)
{
    return length(point - sphereCenter) - sphereRadius;
}

float worldDistance(vec3 point)
{
    float displacement = cos(5.0 * point.x) * sin(5.0 * point.y) * sin(5.0 * point.z) * 0.25;
    float sphere_0 = distanceFromSphere(point, vec3(0.0), 1.0);

    return sphere_0 + displacement;
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
    const float HIT_THRESHOLD = 0.001;

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
            return vec3(diffIntensity);
            //return normal * 0.5 + 0.5;
            //return vec3(1.0, 1.0, 1.0);
        }

        if (distanceTraveled > MAX_DISTANCE)
        {
            // Break out of the loop as we exceeded the maximum ray distance
            break;
        }

        // Accumulate the distance
        distanceTraveled += closestDistance;
    }

    // Nothing hit, return black
    return vec3(0.0);
}

void main()
{
    vec2 rayDir = ndc.xy * screenSize * 0.001;
    vec3 sdf = rayMarch(cameraOrigin, vec3(rayDir, 1.0));
    FragColor = vec4(sdf, 1.0);
}