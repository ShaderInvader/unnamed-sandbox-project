add_library(
    imgui
    include/imconfig.h
    include/imgui_impl_glfw.h
    include/imgui_impl_opengl3.h
    include/imgui_impl_opengl3_loader.h
    include/imgui_internal.h
    include/imgui.h
    include/imstb_rectpack.h
    include/imstb_textedit.h
    include/imstb_truetype.h
    src/imgui_demo.cpp
    src/imgui_draw.cpp
    src/imgui_impl_glfw.cpp
    src/imgui_impl_opengl3.cpp
    src/imgui_tables.cpp
    src/imgui_widgets.cpp
    src/imgui.cpp
)

target_include_directories(imgui PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/include")

target_link_libraries(imgui PRIVATE glfw)