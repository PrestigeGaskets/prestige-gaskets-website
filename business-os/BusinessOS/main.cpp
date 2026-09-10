#include "Application.h"

#include <iostream>

int main() {
    try {
        bos::Application app;
        return app.run();
    } catch (const std::exception& ex) {
        std::cerr << "Fatal: " << ex.what() << '\n';
        return 1;
    }
}
