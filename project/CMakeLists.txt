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
# include_directories(include/window)
# include_directories(include/renderers)
# include_directories(include/shaders)
# include_directories(include/utilities)
# include_directories(include/game)

add_executable(unnamed-sandbox-project ${SOURCES})

add_custom_command(TARGET unnamed-sandbox-project PRE_BUILD
                    COMMAND ${CMAKE_COMMAND} -E copy_directory
                    ${CMAKE_SOURCE_DIR}/resources/ $<TARGET_FILE_DIR:unnamed-sandbox-project>)

target_link_libraries(unnamed-sandbox-project PRIVATE glad glfw imgui)