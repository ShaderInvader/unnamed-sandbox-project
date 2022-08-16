#if !defined(PLAYER_INPUT_HPP)
#define PLAYER_INPUT_HPP

#include <iostream>
#include <glad/glad.h>

#include "IInputListener.hpp"

class PlayerInput : public IInputListener
{
public:
    virtual ~PlayerInput() = default;

    void InputEvent(KeyCode keyCode, KeyAction keyAction);
    void UpdatePlayer();

private:
    float xVel = 0;
    float yVel = 0;
    float zVel = 0;

    float xPos = 0;
    float yPos = 0;
    float zPos = 0;
};

#endif // PLAYER_INPUT_HPP
