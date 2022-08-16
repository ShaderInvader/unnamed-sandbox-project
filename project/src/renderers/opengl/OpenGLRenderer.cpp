#include "opengl/OpenGLRenderer.hpp"

#include <glad/glad.h>
#include <iostream>

#include "IShader.hpp"

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

    SetupQuad();

    return true;
}

void OpenGLRenderer::ResizeFramebuffer(int width, int height)
{
    glViewport(0, 0, width, height);
}

void OpenGLRenderer::Render(IShader* shader)
{
    glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT);

    shader->Use();
    glBindVertexArray(vao);
    glDrawArrays(GL_TRIANGLE_STRIP, 0, 4);
}

void OpenGLRenderer::Cleanup()
{
    
}

void OpenGLRenderer::SetupQuad()
{
    float vertices[] = {
        // position xyz, texcoord uv
        -1.0f, 1.0f, 0.0f, 0.0f, 0.0f,
        -1.0f, -1.0f, 0.0f, 0.0f, 1.0f,
        1.0f, 1.0f, 0.0f, 1.0f, 0.0f,
        1.0f, -1.0f, 0.0f, 1.0f, 1.0f
    };

    glGenVertexArrays(1, &vao);
    glBindVertexArray(vao);

    glGenBuffers(1, &vbo);
    glBindBuffer(GL_ARRAY_BUFFER, vbo);

    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)0);
    glEnableVertexAttribArray(0); 

    glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)(3 * sizeof(float)));
    glEnableVertexAttribArray(1); 
}