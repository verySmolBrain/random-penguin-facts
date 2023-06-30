#include "cats.h"
#include <emscripten/bind.h>

std::string generate_cat_fact() {
    return "Cats like fish!";
}

EMSCRIPTEN_BINDINGS(cat_module) {
    emscripten::function("cat", &generate_cat_fact);
}