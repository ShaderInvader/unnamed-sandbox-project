#if !defined(IRENDERER_HPP)
#define IRENDERER_HPP

__interface IRenderer
{
public:
    void Initialize();
    void Render();
    void Cleanup();
};

#endif // IRENDERER_HPP
