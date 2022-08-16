#include "PlayerInput.hpp"

void PlayerInput::InputEvent(KeyCode keyCode, KeyAction keyAction)
{
    std::cout << "Key event " << (int)keyCode << " key action " << (int)keyAction << std::endl;
}