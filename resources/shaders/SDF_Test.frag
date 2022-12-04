#version 460 core

in vec2 uv;
in vec2 ndc; // Normalized device coordinates

out vec4 FragColor;

vec3 cameraOrigin = vec3(0.0, 0.0, -5.0);
vec3 cameraDirection = vec3(0.0, 0.0, -1.0);

uniform float aspectRatio;
uniform float iTime;

float[][4][4] chunk =  {
	{
		{
			0.0, 0.0, 0.0, 0.0
		},
		{
			0.0, 0.0, 1.0, 0.0
		},
		{
			0.0, 0.0, 1.0, 0.0
		},
		{
			0.0, 0.0, 1.0, 0.0
		},
	},
	{
		{
			0.0, 0.0, 1.0, 0.0
		},
		{
			0.0, 0.0, 1.0, 0.0
		},
		{
			0.0, 0.0, 1.0, 0.0
		},
		{
			0.0, 0.0, 1.0, 0.0
		},
	},
	{
		{
			0.0, 0.0, 1.0, 0.0
		},
		{
			0.0, 0.0, 1.0, 0.0
		},
		{
			0.0, 0.0, 1.0, 0.0
		},
		{
			0.0, 0.0, 1.0, 0.0
		},
	},
	{
		{
			0.0, 0.0, 1.0, 0.0
		},
		{
			0.0, 0.0, 1.0, 0.0
		},
		{
			0.0, 0.0, 1.0, 0.0
		},
		{
			0.0, 0.0, 1.0, 0.0
		},
	},
	{
		{
			0.0, 0.0, 1.0, 0.0
		},
		{
			0.0, 0.0, 1.0, 0.0
		},
		{
			0.0, 0.0, 1.0, 0.0
		},
		{
			0.0, 0.0, 0.0, 0.0
		},
	},
};

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

float hash12(vec2 p)
{
	vec3 p3  = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

vec3 random3(vec3 c) 
{
	float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
	vec3 r;
	r.z = fract(512.0*j);
	j *= .125;
	r.x = fract(512.0*j);
	j *= .125;
	r.y = fract(512.0*j);
	return r-0.5;
}

const float F3 =  0.3333333;
const float G3 =  0.1666667;

float simplex3d(vec3 p) {
	 /* 1. find current tetrahedron T and it's four vertices */
	 /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
	 /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/
	 
	 /* calculate s and x */
	 vec3 s = floor(p + dot(p, vec3(F3)));
	 vec3 x = p - s + dot(s, vec3(G3));
	 
	 /* calculate i1 and i2 */
	 vec3 e = step(vec3(0.0), x - x.yzx);
	 vec3 i1 = e*(1.0 - e.zxy);
	 vec3 i2 = 1.0 - e.zxy*(1.0 - e);
	 	
	 /* x1, x2, x3 */
	 vec3 x1 = x - i1 + G3;
	 vec3 x2 = x - i2 + 2.0*G3;
	 vec3 x3 = x - 1.0 + 3.0*G3;
	 
	 /* 2. find four surflets and store them in d */
	 vec4 w, d;
	 
	 /* calculate surflet weights */
	 w.x = dot(x, x);
	 w.y = dot(x1, x1);
	 w.z = dot(x2, x2);
	 w.w = dot(x3, x3);
	 
	 /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
	 w = max(0.6 - w, 0.0);
	 
	 /* calculate surflet components */
	 d.x = dot(random3(s), x);
	 d.y = dot(random3(s + i1), x1);
	 d.z = dot(random3(s + i2), x2);
	 d.w = dot(random3(s + 1.0), x3);
	 
	 /* multiply d by w^4 */
	 w *= w;
	 w *= w;
	 d *= w;
	 
	 /* 3. return the sum of the four surflets */
	 return dot(d, vec4(52.0));
}

float hash(vec3 p)  // replace this by something better
{
    p  = fract( p*0.3183099+.1 );
	p *= 17.0;
    return fract( p.x*p.y*p.z*(p.x+p.y+p.z) );
}

float noise( in vec3 x )
{
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
	
    return mix(mix(mix( hash(i+vec3(0,0,0)), 
                        hash(i+vec3(1,0,0)),f.x),
                   mix( hash(i+vec3(0,1,0)), 
                        hash(i+vec3(1,1,0)),f.x),f.y),
               mix(mix( hash(i+vec3(0,0,1)), 
                        hash(i+vec3(1,0,1)),f.x),
                   mix( hash(i+vec3(0,1,1)), 
                        hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}

float sd2dNoise(vec3 p)
{
    //float noise = hash12(p.xz * 0.005);
	float noise = step(1.0 - simplex3d(p * 0.05), 0.5);
    //float yFade = clamp(0.0, 1.0, p.y * .02);
    //float terrain = mix(1.0, noise, 0.2);
    return noise;
}

float getFromArray(ivec3 p)
{
	// int x = clamp(p.x, 0, 3);
	// int y = clamp(p.y, 0, 3);
	// int z = clamp(p.z, 0, 3);
	int x = p.x % 3;
	int y = p.y % 3;
	int z = p.z % 3;
	return chunk[x][y][z];
}

bool getVoxel(ivec3 c) 
{
    //float d = sdSphere(p, 7.5);
	//float d = min(max(-sdSphere(p, 7.5), sdBox(p, vec3(6.0))), -sdSphere(p, 25.0));
	float d = sd2dNoise(c);
	//float d = getFromArray(c);
	return d > 0.0;
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

vec3 voxelRaycasting(vec2 screenPosNdc)
{
	const int LOD_LEVELS = 4;
    const int MAX_RAY_STEPS = 512;
    const float MAX_DISTANCE = 2000.0;

	const int INCREMENT_THRESHOLD = MAX_RAY_STEPS / LOD_LEVELS;
	int currentThreshold = INCREMENT_THRESHOLD;

	vec3 cameraDir = vec3(0.0, 0.0, 0.8);
	vec3 cameraPlaneU = vec3(1.0, 0.0, 0.0);
	vec3 cameraPlaneV = vec3(0.0, 1.0, 0.0) * aspectRatio;

	vec3 rayDir = cameraDir + screenPosNdc.x * cameraPlaneU + screenPosNdc.y * cameraPlaneV;

	vec3 rayPos = vec3(0.0, 2.0 * sin(iTime), -12.0);

	rayPos.xz = rotate2d(rayPos.xz, iTime * 0.25);
	rayDir.xz = rotate2d(rayDir.xz, iTime * 0.25);

	ivec3 mapPos = ivec3(floor(rayPos));

	vec3 color = vec3(1.0);
	vec3 sideDist;
	bvec3 mask;
	vec3 deltaDist;

    
	deltaDist = 1.0 / abs(rayDir);
	ivec3 rayStep = ivec3(sign(rayDir));
	sideDist = (sign(rayDir) * (vec3(mapPos) - rayPos) + (sign(rayDir) * 0.5) + 0.5) * deltaDist; 

	float distanceTraveled = 0;
	float rayLength = length(rayStep);

	// The actual raymarching here:
	int i;
	for (i = 0; i < MAX_RAY_STEPS; i++)
	{
		if (distanceTraveled > MAX_DISTANCE)
		{
			color *= 0.0;
			break;
		}
		if (getVoxel(mapPos)) break; // forked shader used continue here

		distanceTraveled += rayLength;
		//Thanks kzy for the suggestion!
		mask = lessThanEqual(sideDist.xyz, min(sideDist.yzx, sideDist.zxy));
		sideDist += vec3(mask) * deltaDist;
		mapPos += ivec3(vec3(mask)) * rayStep;
	}

	color *= mask.x ? vec3(0.5) : mask.y ? vec3(1.0) : mask.z ? vec3(0.75) : vec3(0.0);
	//color = vec3((i * 1.0) / MAX_RAY_STEPS, 0.0, 0.0);
    

	return color;
}

void main()
{
    //vec2 rayDir = (ndc.xy / screenSize);
	// float stepX = step(-ndc.x, 0.0);
	// float stepY = step(-ndc.y, 0.0);
	// float stepX = clamp(ndc.x, 0.0, 1.0);
	// float stepY = clamp(ndc.y * ndc.x, 0.0, 1.0);
	// float noise = step(simplex3d(vec3(rayDir.x, rayDir.y, 0.0) * 2.0), 0.2);
	// FragColor = vec4(noise, noise, noise, 1.0);
	// FragColor = vec4(stepX, stepY, 0.0, 1.0);



    vec3 sdf = voxelRaycasting(ndc.xy);
    FragColor = vec4(sdf, 1.0);
}