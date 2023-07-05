#include "penguins.h"
#include <emscripten/bind.h>

std::string generate_penguin_fact() {
    return "Penguins are excellent swimmers!";
}

EMSCRIPTEN_BINDINGS(penguin_module) {
    emscripten::function("penguin", &generate_penguin_fact);
}