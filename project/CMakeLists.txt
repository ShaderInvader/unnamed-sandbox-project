set(SOURCES main.cpp
    src/window/glfw/GlfwHandler.cpp
    src/window/glfw/GlfwInputHandler.cpp
    src/renderers/opengl/OpenGLRenderer.cpp
    src/shaders/GlslShader.cpp
    src/game/PlayerInput.cpp
    include/window/IWindowHandler.hpp
    include/window/IInputHandler.hpp
    include/window/IInputListener.hpp
    include/window/glfw/GlfwHandler.hpp
    include/window/glfw/GlfwInputHandler.hpp
    include/renderers/IRenderer.hpp
    include/renderers/opengl/OpenGLRenderer.hpp
    include/shaders/IShader.hpp
    include/shaders/GlslShader.hpp
    include/utilities/Utilities.hpp
    include/utilities/KeyCodes.hpp
    include/game/PlayerInput.hpp
)

target_include_directories(imgui PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/include/window")
target_include_directories(imgui PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/include/renderers")
target_include_directories(imgui PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/include/shaders")
target_include_directories(imgui PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/include/utilities")
target_include_directories(imgui PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/include/game")

add_executable(unnamed-sandbox-project ${SOURCES})

add_custom_target(copy_assets
    COMMAND ${CMAKE_COMMAND} -P ${CMAKE_SOURCE_DIR}/copy-assets.cmake
)
add_dependencies(unnamed-sandbox-project copy_assets)

target_link_libraries(unnamed-sandbox-project PRIVATE glad glfw imgui)