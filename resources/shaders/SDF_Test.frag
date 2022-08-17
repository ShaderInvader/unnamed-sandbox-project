#version 400 core

in vec2 uv;
in vec3 ndc; // Normalized device coordinates

out vec4 FragColor;

vec3 cameraOrigin = vec3(0.0, 0.0, -5.0);
vec3 cameraDirection = vec3(0.0, 0.0, -1.0);

uniform float iTime;
uniform vec2 screenSize = vec2(1280.0, 800.0);

float sdSphere(vec3 p, float d) 
{ 
    return length(p) - d;
}

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

bool getVoxel(ivec3 c) 
{
	vec3 p = vec3(c) + vec3(0.5);
    //float d = sdSphere(p, 7.5);
	float d = min(max(-sdSphere(p, 7.5), sdBox(p, vec3(6.0))), -sdSphere(p, 25.0));
	return d < 0.0;
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

float worldDistance(vec3 point)
{
    float displacement = cos(5.0 * point.x) * sin(5.0 * point.y) * sin(5.0 * point.z) * 0.25;
    float sphere_0 = sdSphere(point, 2.0);

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

vec2 rotate2d(vec2 v, float a) 
{
	float sinA = sin(a);
	float cosA = cos(a);
	return vec2(v.x * cosA - v.y * sinA, v.y * cosA + v.x * sinA);	
}

vec3 voxelRaycasting(vec2 fragCoord)
{
    float distanceTraveled = 0.0;
    const int MAX_STEPS = 64;
    const float MAX_DISTANCE = 1000.0;
    const float HIT_THRESHOLD = 0.01;
    const bool USE_BRANCHLESS_DDA = false;

	vec2 screenPos = fragCoord;//(fragCoord.xy / screenSize.xy) * 2.0 - 1.0;
	vec3 cameraDir = vec3(0.0, 0.0, 0.8);
	vec3 cameraPlaneU = vec3(1.0, 0.0, 0.0);
	vec3 cameraPlaneV = vec3(0.0, 1.0, 0.0) * screenSize.y / screenSize.x;
	vec3 rayDir = cameraDir + screenPos.x * cameraPlaneU + screenPos.y * cameraPlaneV;
	vec3 rayPos = vec3(0.0, 2.0 * sin(iTime * 2.7), -12.0);
		
	rayPos.xz = rotate2d(rayPos.xz, iTime);
	rayDir.xz = rotate2d(rayDir.xz, iTime);
	
	ivec3 mapPos = ivec3(floor(rayPos + 0.));

	vec3 deltaDist = abs(vec3(length(rayDir)) / rayDir);
	
	ivec3 rayStep = ivec3(sign(rayDir));

	vec3 sideDist = (sign(rayDir) * (vec3(mapPos) - rayPos) + (sign(rayDir) * 0.5) + 0.5) * deltaDist; 
	
	bvec3 mask;
	
	for (int i = 0; i < MAX_STEPS; i++) 
    {
		if (getVoxel(mapPos)) continue;
		if (USE_BRANCHLESS_DDA) 
        {
            //Thanks kzy for the suggestion!
            mask = lessThanEqual(sideDist.xyz, min(sideDist.yzx, sideDist.zxy));
			/*bvec3 b1 = lessThan(sideDist.xyz, sideDist.yzx);
			bvec3 b2 = lessThanEqual(sideDist.xyz, sideDist.zxy);
			mask.x = b1.x && b2.x;
			mask.y = b1.y && b2.y;
			mask.z = b1.z && b2.z;*/
			//Would've done mask = b1 && b2 but the compiler is making me do it component wise.
			
			//All components of mask are false except for the corresponding largest component
			//of sideDist, which is the axis along which the ray should be incremented.			
			
			sideDist += vec3(mask) * deltaDist;
			mapPos += ivec3(vec3(mask)) * rayStep;
		}
		else {
			if (sideDist.x < sideDist.y) {
				if (sideDist.x < sideDist.z) {
					sideDist.x += deltaDist.x;
					mapPos.x += rayStep.x;
					mask = bvec3(true, false, false);
				}
				else {
					sideDist.z += deltaDist.z;
					mapPos.z += rayStep.z;
					mask = bvec3(false, false, true);
				}
			}
			else {
				if (sideDist.y < sideDist.z) {
					sideDist.y += deltaDist.y;
					mapPos.y += rayStep.y;
					mask = bvec3(false, true, false);
				}
				else {
					sideDist.z += deltaDist.z;
					mapPos.z += rayStep.z;
					mask = bvec3(false, false, true);
				}
			}
		}
	}
	
	vec3 color;
	if (mask.x) {
		color = vec3(0.5);
	}
	if (mask.y) {
		color = vec3(1.0);
	}
	if (mask.z) {
		color = vec3(0.75);
	}
	return color;
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
            return vec3(diffIntensity);
            //return normal * 0.5 + 0.5;
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
    //vec3 sdf = rayMarch(cameraOrigin, vec3(rayDir, 1.0));
    vec3 sdf = voxelRaycasting(rayDir);
    FragColor = vec4(sdf, 1.0);
}