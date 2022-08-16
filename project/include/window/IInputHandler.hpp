#if !defined(IINPUT_HANDLER_HPP)
#define IINPUT_HANDLER_HPP

#include <vector>

#include "KeyCodes.hpp"

class IInputListener;

class IInputHandler
{
protected:
    std::vector<IInputListener*> listeners;
public:
    virtual ~IInputHandler() {}

    virtual void AddListener(IInputListener* listener) = 0;
    virtual void KeyEvent(KeyCode keyCode, KeyAction keyAction) = 0;
};

#endif // IINPUT_HANDLER_HPP
