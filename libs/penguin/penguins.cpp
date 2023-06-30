#include "penguins.h"
#include <emscripten/bind.h>

std::string generate_penguin_fact() {
    return "Penguins are excellent swimmers!";
}

EMSCRIPTEN_BINDINGS(penguin_module) {
    emscripten::function("penguin", &generate_penguin_fact);
}

//         "-DCMAKE_CXX_FLAGS='${CMAKE_CXX_FLAGS} -lembind -s EXPORT_ES6=1'"
// "/opt/qt6-emscripten-threadless/lib/cmake/Qt6/qt.toolchain.cmake"