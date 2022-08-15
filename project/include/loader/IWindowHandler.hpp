#if !defined(LOADER_HPP)
#define LOADER_HPP

#define GLFW_INCLUDE_NONE
#include <GLFW/glfw3.h>

__interface IRenderer;

__interface IWindowHandler
{
public:
    int Initialize(int width, int height);
    void SetRenderer(IRenderer* renderer);
    void ProcessInput(GLFWwindow* window);
    bool IsRunning();
    void PresentFrame();
    void Cleanup();
    GLFWwindow* GetWindow();
};

#endif // LOADER_HPP
