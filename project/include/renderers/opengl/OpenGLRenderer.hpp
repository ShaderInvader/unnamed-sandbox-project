#if !defined(OPEN_GL_RENDERER_HPP)
#define OPEN_GL_RENDERER_HPP

#include "IRenderer.hpp"

class OpenGLRenderer : public IRenderer
{
public:
    OpenGLRenderer();
    ~OpenGLRenderer();

    bool Initialize(void* windowHandle, int width, int height);
    void ResizeFramebuffer(int width, int height);
    void Render(IShader* shader);
    void Cleanup();

private:
    unsigned int vao;
    unsigned int vbo;

    void SetupQuad();
};


#endif // OPEN_GL_RENDERER_HPP
