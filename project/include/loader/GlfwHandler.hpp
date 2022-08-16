#if !defined(GLFW_HANDLER_HPP)
#define GLFW_HANDLER_HPP

#include "IWindowHandler.hpp"

#define GLFW_INCLUDE_NONE
#include <GLFW/glfw3.h>

class IRenderer;

class GlfwHandler : public IWindowHandler
{
public:
    int Initialize(int width, int height);
    void SetRenderer(IRenderer* renderer);
    void ProcessInput();
    bool IsRunning();
    void PresentFrame();
    void Cleanup();
    void* GetWindow();

private:
    GLFWwindow* _window;
    int _width;
    int _height;

    static IRenderer* _renderer;
    static void error_callback(int error, const char* description);
    static void framebuffer_size_callback(GLFWwindow* window, int width, int height);
};


#endif // GLFW_HANDLER_HPP
