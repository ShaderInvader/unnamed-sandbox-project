#if !defined(OPEN_GL_RENDERER_HPP)
#define OPEN_GL_RENDERER_HPP

#include "IRenderer.hpp"

class OpenGLRenderer : public IRenderer
{
private:
    
public:
    OpenGLRenderer(/* args */);
    ~OpenGLRenderer();

    void Initialize();
    void Render();
    void Cleanup();
};

OpenGLRenderer::OpenGLRenderer(/* args */)
{
}

OpenGLRenderer::~OpenGLRenderer()
{
}


#endif // OPEN_GL_RENDERER_HPP
