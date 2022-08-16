#if !defined(UTILITIES_HPP)
#define UTILITIES_HPP

#include <string>
#include <sstream>
#include <fstream>

class Utilities
{
public:
    Utilities() = delete;
    ~Utilities() = delete;

    static std::string LoadTextFile(std::string path)
    {
        std::string result;
        
        std::fstream file;
        file.open(path);

        std::stringstream stream;
        stream << file.rdbuf();

        result = stream.str();

        return result;
    }
};

#endif // UTILITIES_HPP
