cmake_minimum_required(VERSION 3.0.0)
project(unnamed-sandbox-project)
set(CMAKE_CXX_STANDARD 14)

set(GLFW_BUILD_DOCS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)

add_subdirectory(thirdparty/glfw)
add_subdirectory(thirdparty/glad)

include_directories(project/include/loader)
include_directories(project/include/renderers)
include_directories(project/include/shaders)
include_directories(project/include/utilities)

set(PROJECT_DIR project)
set(SOURCES ${PROJECT_DIR}/main.cpp
            ${PROJECT_DIR}/src/loader/GlfwHandler.cpp
            ${PROJECT_DIR}/src/renderers/opengl/OpenGLRenderer.cpp
            ${PROJECT_DIR}/src/shaders/GlslShader.cpp
            ${PROJECT_DIR}/include/loader/IWindowHandler.hpp
            ${PROJECT_DIR}/include/loader/GlfwHandler.hpp
            ${PROJECT_DIR}/include/renderers/IRenderer.hpp
            ${PROJECT_DIR}/include/renderers/opengl/OpenGLRenderer.hpp
            ${PROJECT_DIR}/include/shaders/IShader.hpp
            ${PROJECT_DIR}/include/shaders/GlslShader.hpp
            ${PROJECT_DIR}/include/utilities/Utilities.hpp
            )
            
add_executable(unnamed-sandbox-project ${SOURCES})

add_custom_command(TARGET unnamed-sandbox-project PRE_BUILD
                    COMMAND ${CMAKE_COMMAND} -E copy_directory
                    ${CMAKE_SOURCE_DIR}/resources/ $<TARGET_FILE_DIR:unnamed-sandbox-project>)

#target_include_directories(unnamed-sandbox-project PRIVATE include/loader)

target_link_libraries(unnamed-sandbox-project glad glfw)