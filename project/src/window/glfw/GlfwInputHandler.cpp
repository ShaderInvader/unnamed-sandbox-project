#include "glfw/GlfwInputHandler.hpp"

#include "IInputListener.hpp"

void GlfwInputHandler::KeyEvent(KeyCode keyCode, KeyAction keyAction)
{
    for (auto &&listener : listeners)
    {
        listener->InputEvent(keyCode, keyAction);
    }
}

void GlfwInputHandler::AddListener(IInputListener* listener)
{
    listeners.push_back(listener);
}