#ifndef DS_H
#define DS_H

#include <emscripten/bind.h>

EMSCRIPTEN_BINDINGS(std_vector) {
    emscripten::register_vector<std::string>("VectorString");
}

EMSCRIPTEN_BINDINGS(std_unordered_map) {
    emscripten::register_map<std::string, std::string>("UnorderedMapStringString");
}

#endif