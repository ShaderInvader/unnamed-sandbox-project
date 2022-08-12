#if !defined(LOADER_HPP)
#define LOADER_HPP

#define GLFW_INCLUDE_NONE
#include <GLFW/glfw3.h>
#include <glad/glad.h>

__interface IWindowHandler
{
public:
    int Initialize(int width, int height);
    void Cleanup();
    GLFWwindow* GetWindow();
};

#endif // LOADER_HPP
