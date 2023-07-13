#!/bin/bash

# This should already be set by the Emscripten SDK if you used their script so comment this out if you did
# Otherwise update this to your paths
export PATH="${PATH}:/home/smolbrain/emsdk:/home/smolbrain/emsdk/upstream/emscripten"
export EMSDK="/home/smolbrain/emsdk"
export EMSDK_NODE="/home/smolbrain/emsdk/node/15.14.0_64bit/bin/node"

# Modify this to adjust using threadless or multithreaded Qt. I'll update this to be more dynamic later
export QT_LIB="/opt/qt6-emscripten-threadless"
#export QT_LIB="/opt/qt6-emscripten-multithread"

# Modify this to adjust Emscripten flags
# export EMCC_DEBUG=1 # Debug change this to be option later
export CMAKE_CXX_FLAGS="${CMAKE_CXX_FLAGS} -lembind -s MODULARIZE=1 -s EXPORT_ES6=1 --no-entry -s EXIT_RUNTIME=1 -g"
export CMAKE_TOOLCHAIN_FILE="${QT_LIB}/lib/cmake/Qt6/qt.toolchain.cmake"