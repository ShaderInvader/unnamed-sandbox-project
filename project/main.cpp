#include <iostream>

#include "imgui.h"
#include "imgui_impl_glfw.h"
#include "imgui_impl_opengl3.h"

#include "glfw/GlfwHandler.hpp"
#include "glfw/GlfwInputHandler.hpp"
#include "opengl/OpenGLRenderer.hpp"
#include "GlslShader.hpp"
#include "Utilities.hpp"

#include "PlayerInput.hpp"

constexpr int WIDTH = 1920;
constexpr int HEIGHT = 1080;

int main(int, char**) 
{
    IWindowHandler* windowHandler = new GlfwHandler();
    IInputHandler* inputHandler = new GlfwInputHandler();
    windowHandler->SetInputHandler(inputHandler);
    windowHandler->Initialize(WIDTH, HEIGHT);

    IInputListener* playerInput = new PlayerInput();
    inputHandler->AddListener(playerInput);

    IRenderer* renderer = new OpenGLRenderer();
    renderer->Initialize(glfwGetProcAddress, WIDTH, HEIGHT);
    windowHandler->SetRenderer(renderer);

    std::string vertexShader = Utilities::LoadTextFile("shaders/SDF_Test.vert");
    //std::string fragmentShader = Utilities::LoadTextFile("shaders/SDF_Test.frag");
    std::string fragmentShader = Utilities::LoadTextFile("shaders/VoxelLodTest.frag");

    IShader* shader = new GlslShader();
    shader->LoadShaderSource(vertexShader.c_str(), ShaderType::Vertex);
    shader->LoadShaderSource(fragmentShader.c_str(), ShaderType::Fragment);
    shader->CreateProgram();

    GLFWwindow* window = (GLFWwindow*)windowHandler->GetWindow();

    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGuiIO& io = ImGui::GetIO();
    ImGui::StyleColorsDark();
    ImGui_ImplGlfw_InitForOpenGL(window, true);
    ImGui_ImplOpenGL3_Init("#version 400");

    // Update loop
    while (windowHandler->IsRunning())
    {
        ImGui_ImplOpenGL3_NewFrame();
        ImGui_ImplGlfw_NewFrame();
        ImGui::NewFrame();
        
        int width, height;
        renderer->GetScreenSize(width, height);

        shader->SetFloat("iTime", windowHandler->GetTime());
        shader->SetFloat("aspectRatio", static_cast<float>(height) / width);
        shader->SetVec3("iResolution", static_cast<float>(width), static_cast<float>(height), 0.0f);
        shader->SetVec3("iMouse", 0.0f, 0.0f, 0.0f);
        renderer->Render(shader);

        ImGui::Begin("A glorious ImGui window.");
        ImGui::Text("This is a test");
        ImGui::End();
        ImGui::ShowMetricsWindow();
        ImGui::Render();
        ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());

        windowHandler->PresentFrame();
    }

    ImGui_ImplOpenGL3_Shutdown();
    ImGui_ImplGlfw_Shutdown();
    ImGui::DestroyContext();

    shader->Cleanup();
    renderer->Cleanup();
    windowHandler->Cleanup();

    delete shader;
    delete renderer;
    delete inputHandler;
    delete windowHandler;
}