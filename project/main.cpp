#include <iostream>

#include "GlfwHandler.hpp"
#include "opengl/OpenGLRenderer.hpp"
#include "GlslShader.hpp"

constexpr int WIDTH = 1280;
constexpr int HEIGHT = 800;

int main(int, char**) 
{
    IWindowHandler* windowHandler = new GlfwHandler();
    windowHandler->Initialize(WIDTH, HEIGHT);

    IRenderer* renderer = new OpenGLRenderer();
    renderer->Initialize(glfwGetProcAddress, WIDTH, HEIGHT);
    windowHandler->SetRenderer(renderer);

    IShader* shader = new GlslShader();
    shader->CreateProgram();

    GLFWwindow* window = windowHandler->GetWindow();

    // Update loop
    while (windowHandler->IsRunning())
    {
        shader->Use();
        renderer->Render();

        windowHandler->PresentFrame();
    }

    renderer->Cleanup();
    windowHandler->Cleanup();
}