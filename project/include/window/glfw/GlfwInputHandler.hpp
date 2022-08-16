#if !defined(GLFW_INPUT_HANDLER)
#define GLFW_INPUT_HANDLER

#include "IInputHandler.hpp"

class GlfwInputHandler : public IInputHandler
{
private:
    /* data */
public:
    virtual ~GlfwInputHandler() = default;

    void AddListener(IInputListener* listener);
    void KeyEvent(KeyCode keyCode, KeyAction keyAction);
};

#endif // GLFW_INPUT_HANDLER
