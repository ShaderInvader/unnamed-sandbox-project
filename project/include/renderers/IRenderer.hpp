#if !defined(IRENDERER_HPP)
#define IRENDERER_HPP

class IShader;

class IRenderer
{
public:
    virtual bool Initialize(void* windowHandle, int width, int height) = 0;
    virtual void ResizeFramebuffer(int width, int height) = 0;
    virtual void Render(IShader* shader) = 0;
    virtual void Cleanup() = 0;
};

#endif // IRENDERER_HPP
