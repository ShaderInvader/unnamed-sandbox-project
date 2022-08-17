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
    void SetInputHandler(IInputHandler* inputHandler);
    void ProcessInput();
    bool IsRunning();
    void PresentFrame();
    void Cleanup();
    void* GetWindow();
    float GetTime();

private:
    GLFWwindow* _window;
    int _width;
    int _height;

    static IInputHandler* _inputHandler;

    static IRenderer* _renderer;
    static void error_callback(int error, const char* description);
    static void key_callback(GLFWwindow* window, int key, int scancode, int action, int mods);
    static void framebuffer_size_callback(GLFWwindow* window, int width, int height);
};

#endif // GLFW_HANDLER_HPP
