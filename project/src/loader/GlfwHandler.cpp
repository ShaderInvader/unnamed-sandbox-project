#include "GlfwHandler.hpp"

#include "GlfwCallbacks.hpp"

#include <iostream>

int GlfwHandler::Initialize(int width, int height)
{
    _width = width;
    _height = height;

    if (!glfwInit())
    {
        std::cout << "Failed to initialize GLFW context" << std::endl;
        return -1;
    }

    glfwSetErrorCallback(error_callback);

    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 0);

    _window = glfwCreateWindow(_width, _height, "Unnamed Sandbox Project Test", NULL, NULL);
    if (!_window)
    {
        std::cout << "Failed to initialize GLFW window" << std::endl;
        return -2;
    }

    glfwMakeContextCurrent(_window);

    // TODO: Make it non graphics API specific
    if (!gladLoadGLLoader((GLADloadproc) glfwGetProcAddress)) 
    {
        std::cout << "Failed to initialize OpenGL context" << std::endl;
        return -3;
    }
}

void GlfwHandler::Cleanup()
{
    glfwDestroyWindow(_window);
    glfwTerminate();
}

GLFWwindow* GlfwHandler::GetWindow()
{
    return _window;
}