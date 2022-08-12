#include <iostream>

#include "GlfwHandler.hpp"

constexpr int WIDTH = 1280;
constexpr int HEIGHT = 800;

int main(int, char**) 
{
    IWindowHandler* windowHandler = new GlfwHandler();
    windowHandler->Initialize(WIDTH, HEIGHT);

    GLFWwindow* window = windowHandler->GetWindow();

    while (!glfwWindowShouldClose(window))
    {
        glfwSwapBuffers(window);
        glfwPollEvents();
    }

    windowHandler->Cleanup();
}