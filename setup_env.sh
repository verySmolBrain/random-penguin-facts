#!/bin/bash

export PATH="${PATH}:/home/smolbrain/emsdk:/home/smolbrain/emsdk/upstream/emscripten"
export EMSDK="/home/smolbrain/emsdk"
export EMSDK_NODE="/home/smolbrain/emsdk/node/15.14.0_64bit/bin/node"

export QT_LIB="/opt/qt6-emscripten-threadless"

# Modify this to adjust Emscripten flags
export CMAKE_CXX_FLAGS="${CMAKE_CXX_FLAGS} -lembind -s MODULARIZE=1 -s EXPORT_ES6=1 --no-entry"