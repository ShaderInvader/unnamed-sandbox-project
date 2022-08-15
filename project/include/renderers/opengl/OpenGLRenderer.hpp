#if !defined(OPEN_GL_RENDERER_HPP)
#define OPEN_GL_RENDERER_HPP

#include "IRenderer.hpp"

class OpenGLRenderer : public IRenderer
{
private:
    
public:
    OpenGLRenderer();
    ~OpenGLRenderer();

    bool Initialize(void* windowHandle, int width, int height);
    void ResizeFramebuffer(int width, int height);
    void Render();
    void Cleanup();
};

#endif // OPEN_GL_RENDERER_HPP
