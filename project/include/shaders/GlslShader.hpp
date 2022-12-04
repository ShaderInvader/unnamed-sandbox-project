#if !defined(GLSL_SHADER_HPP)
#define GLSL_SHADER_HPP

#include "IShader.hpp"

class GlslShader : public IShader
{
public:
    virtual ~GlslShader() = default;

    virtual void LoadShaderSource(const char* shaderCode, ShaderType type);
    virtual void CreateProgram();
    virtual void Use();
    virtual void Cleanup();

    void SetFloat(const char* name, float value);
    void SetVec3(const char* name, float x, float y, float z);

private:
    void DebugCompilation(unsigned int shader);
    void DebugLinking(unsigned int shaderProgram);

    static const char* defaultVertexSource;
    static const char* defaultFragmentSource;

    unsigned int vertexShader = 0;
    unsigned int fragmentShader = 0;
    unsigned int geometryShader = 0;

    unsigned int shaderProgram = 0;
};

#endif // GLSL_SHADER_HPP
