#if !defined(LOADER_HPP)
#define LOADER_HPP

class IRenderer;
class IInputHandler;

class IWindowHandler
{
public:
    virtual int Initialize(int width, int height) = 0;
    virtual void SetRenderer(IRenderer* renderer) = 0;
    virtual void SetInputHandler(IInputHandler* inputHandler) = 0;
    virtual void ProcessInput() = 0;
    virtual bool IsRunning() = 0;
    virtual void PresentFrame() = 0;
    virtual void Cleanup() = 0;
    virtual void* GetWindow() = 0;
};

#endif // LOADER_HPP
