#include <iostream>

#include "GlfwHandler.hpp"
#include "opengl/OpenGLRenderer.hpp"
#include "GlslShader.hpp"
#include "Utilities.hpp"

constexpr int WIDTH = 1280;
constexpr int HEIGHT = 800;

int main(int, char**) 
{
    IWindowHandler* windowHandler = new GlfwHandler();
    windowHandler->Initialize(WIDTH, HEIGHT);

    IRenderer* renderer = new OpenGLRenderer();
    renderer->Initialize(glfwGetProcAddress, WIDTH, HEIGHT);
    windowHandler->SetRenderer(renderer);

    std::string vertexShader = Utilities::LoadTextFile("shaders/SDF_Test.vert");
    std::string fragmentShader = Utilities::LoadTextFile("shaders/SDF_Test.frag");

    IShader* shader = new GlslShader();
    shader->LoadShaderSource(vertexShader.c_str(), ShaderType::Vertex);
    shader->LoadShaderSource(fragmentShader.c_str(), ShaderType::Fragment);
    shader->CreateProgram();

    GLFWwindow* window = (GLFWwindow*)windowHandler->GetWindow();

    // Update loop
    while (windowHandler->IsRunning())
    {
        windowHandler->ProcessInput();
        renderer->Render(shader);

        windowHandler->PresentFrame();
    }

    renderer->Cleanup();
    windowHandler->Cleanup();
}