#include "opengl/OpenGLRenderer.hpp"

#include <glad/glad.h>

#include <iostream>

OpenGLRenderer::OpenGLRenderer()
{

}

OpenGLRenderer::~OpenGLRenderer()
{

}

bool OpenGLRenderer::Initialize(void* windowHandle, int width, int height)
{
    if (!gladLoadGLLoader((GLADloadproc) windowHandle)) 
    {
        std::cout << "Failed to initialize OpenGL context" << std::endl;
        return false;
    }

    glViewport(0, 0, width, height);

    return true;
}

void OpenGLRenderer::ResizeFramebuffer(int width, int height)
{
    glViewport(0, 0, width, height);
}

void OpenGLRenderer::Render()
{
    
}

void OpenGLRenderer::Cleanup()
{
    
}