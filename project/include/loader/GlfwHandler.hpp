#if !defined(GLFW_HANDLER_HPP)
#define GLFW_HANDLER_HPP

#include "IWindowHandler.hpp"

__interface IRenderer;

class GlfwHandler : public IWindowHandler
{
public:
    int Initialize(int width, int height);
    void SetRenderer(IRenderer* renderer);
    void ProcessInput(GLFWwindow* window);
    bool IsRunning();
    void PresentFrame();
    void Cleanup();
    GLFWwindow* GetWindow();

private:
    GLFWwindow* _window;
    int _width;
    int _height;

    static IRenderer* _renderer;
    static void error_callback(int error, const char* description);
    static void framebuffer_size_callback(GLFWwindow* window, int width, int height); 
};


#endif // GLFW_HANDLER_HPP
