#include "GlfwHandler.hpp"

#include <iostream>

#include "IRenderer.hpp"

IRenderer* GlfwHandler::_renderer = nullptr;

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
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    glfwWindowHint(GLFW_RESIZABLE, GLFW_FALSE);

    _window = glfwCreateWindow(_width, _height, "Unnamed Sandbox Project Test", NULL, NULL);
    if (!_window)
    {
        std::cout << "Failed to initialize GLFW window" << std::endl;
        glfwTerminate();
        return -2;
    }

    glfwSetFramebufferSizeCallback(_window, framebuffer_size_callback); 
    glfwMakeContextCurrent(_window);

    return 0;
}

void GlfwHandler::SetRenderer(IRenderer* renderer)
{
    _renderer = renderer;
}

void GlfwHandler::ProcessInput(GLFWwindow* window)
{
    if(glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
    {
        glfwSetWindowShouldClose(window, true);
    }
}

bool GlfwHandler::IsRunning()
{
    return !glfwWindowShouldClose(_window);
}

void GlfwHandler::PresentFrame()
{
    glfwSwapBuffers(_window);
    glfwPollEvents();
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

void GlfwHandler::error_callback(int error, const char* description)
{
    fprintf(stderr, "Error: %s\n", description);
}

void GlfwHandler::framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
    _renderer->ResizeFramebuffer(width, height);
}