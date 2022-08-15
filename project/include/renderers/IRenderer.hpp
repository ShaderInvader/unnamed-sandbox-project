#if !defined(IRENDERER_HPP)
#define IRENDERER_HPP

__interface IRenderer
{
public:
    bool Initialize(void* windowHandle, int width, int height);
    void ResizeFramebuffer(int width, int height);
    void Render();
    void Cleanup();
};

#endif // IRENDERER_HPP
