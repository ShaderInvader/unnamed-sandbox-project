#if !defined(IINPUT_LISTENER_HPP)
#define IINPUT_LISTENER_HPP

#include "KeyCodes.hpp"

class IInputListener
{
public:
    virtual void InputEvent(KeyCode keyCode, KeyAction keyAction) = 0;
};

#endif // IINPUT_LISTENER_HPP
