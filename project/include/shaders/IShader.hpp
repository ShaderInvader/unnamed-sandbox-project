#if !defined(ISHADER_HPP)
#define ISHADER_HPP

enum class ShaderType 
{
    Vertex,
    Fragment,
    Geometry
};

class IShader
{
public:
    virtual ~IShader() {};

    virtual void LoadShaderSource(const char* shaderCode, ShaderType type) = 0;
    virtual void CreateProgram() = 0;
    virtual void Cleanup() = 0;
    virtual void Use() = 0;

    virtual void SetFloat(const char* name, float value) = 0;
    virtual void SetVec3(const char* name, float x, float y, float z) = 0;
};

#endif // ISHADER_HPP
