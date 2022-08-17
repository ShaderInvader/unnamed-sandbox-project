#include "GlslShader.hpp"

#include <glad/glad.h>

#include <iostream>

const char* GlslShader::defaultVertexSource = 
    "#version 330 core\n"
    "layout (location = 0) in vec3 aPos;\n"
    "void main()\n"
    "{\n"
    "   gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);\n"
    "}\0";

const char* GlslShader::defaultFragmentSource = 
    "#version 330 core\n"
    "out vec4 FragColor;\n"
    "void main()\n"
    "{\n"
    "    FragColor = vec4(1.0f, 0.5f, 0.2f, 1.0f);\n"
    "}\0";

void GlslShader::LoadShaderSource(const char* shaderCode, ShaderType type)
{
    unsigned int* shaderId = nullptr;
    const char* source = nullptr;
    GLenum glShaderType = 0;

    switch (type)
    {
    case ShaderType::Vertex:
        glShaderType = GL_VERTEX_SHADER;
        shaderId = &vertexShader;
        source = shaderCode == nullptr ? defaultVertexSource : shaderCode;
        break;
    case ShaderType::Fragment:
        glShaderType = GL_FRAGMENT_SHADER;
        shaderId = &fragmentShader;
        source = shaderCode == nullptr ? defaultFragmentSource : shaderCode;
        break;
    case ShaderType::Geometry:
        glShaderType = GL_GEOMETRY_SHADER;
        shaderId = &geometryShader;
        source = shaderCode;
        if (source == nullptr)
        {
            std::cout << "ERROR::SHADER::NO_GEOMETRY_SOURCE_PROVIDED\n" << std::endl;
            return;
        }
        break;
    }

    *shaderId = glCreateShader(glShaderType);
    glShaderSource(*shaderId, 1, &source, nullptr);
    glCompileShader(*shaderId);

    DebugCompilation(*shaderId);
}

void GlslShader::CreateProgram()
{
    shaderProgram = glCreateProgram();

    if (vertexShader == 0)
    {
        LoadShaderSource(nullptr, ShaderType::Vertex);
    }
    glAttachShader(shaderProgram, vertexShader);

    if (fragmentShader == 0)
    {
        LoadShaderSource(nullptr, ShaderType::Fragment);
    }
    glAttachShader(shaderProgram, fragmentShader);

    if (geometryShader != 0)
    {
        glAttachShader(shaderProgram, geometryShader);
    }

    glLinkProgram(shaderProgram);

    DebugLinking(shaderProgram);

    glDeleteShader(vertexShader);
    glDeleteShader(fragmentShader); 
    if (geometryShader != 0)
    {
        glDeleteShader(geometryShader);
    }
}

void GlslShader::Use()
{
    glUseProgram(shaderProgram);
}

void GlslShader::SetFloat(const char* name, float value)
{
    glUniform1f(glGetUniformLocation(shaderProgram, name), value);
}

void GlslShader::Cleanup()
{
    
}

void GlslShader::DebugCompilation(unsigned int shader)
{
    int  success;
    char infoLog[512];

    glGetShaderiv(shader, GL_COMPILE_STATUS, &success);

    if(!success)
    {
        glGetShaderInfoLog(shader, 512, NULL, infoLog);
        std::cout << "ERROR::SHADER::COMPILATION_FAILED\n" << infoLog << std::endl;
    }
}

void GlslShader::DebugLinking(unsigned int shaderProgram)
{
    int  success;
    char infoLog[512];

    glGetProgramiv(shaderProgram, GL_LINK_STATUS, &success);

    if(!success) 
    {
        glGetProgramInfoLog(shaderProgram, 512, NULL, infoLog);
        std::cout << "ERROR::SHADER::LINKING_FAILED\n" << infoLog << std::endl;
    }
}