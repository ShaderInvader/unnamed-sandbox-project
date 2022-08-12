cmake_minimum_required(VERSION 3.0.0)
project(unnamed-sandbox-project)
set(CMAKE_CXX_STANDARD 14)

set(GLFW_BUILD_DOCS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(GLFW_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)

add_subdirectory(thirdparty/glfw)
add_subdirectory(thirdparty/glad)

include_directories(project/include/loader)

set(PROJECT_DIR project)
set(SOURCES ${PROJECT_DIR}/main.cpp 
            ${PROJECT_DIR}/src/loader/GlfwHandler.cpp 
            ${PROJECT_DIR}/src/loader/GlfwCallbacks.cpp
            ${PROJECT_DIR}/include/loader/IWindowHandler.hpp
            ${PROJECT_DIR}/include/loader/GlfwHandler.hpp
            ${PROJECT_DIR}/include/loader/GlfwCallbacks.hpp
            )
            
add_executable(unnamed-sandbox-project ${SOURCES})

#target_include_directories(unnamed-sandbox-project PRIVATE include/loader)

target_link_libraries(unnamed-sandbox-project glad glfw)