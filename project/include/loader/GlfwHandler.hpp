#if !defined(GLAD_LOADER_HPP)
#define GLAD_LOADER_HPP

#include "IWindowHandler.hpp"

class GlfwHandler : public IWindowHandler
{
public:
    int Initialize(int width, int height);
    void Cleanup();
    GLFWwindow* GetWindow();

private:
    GLFWwindow* _window;
    int _width;
    int _height;
};

#endif // GLAD_LOADER_HPP
