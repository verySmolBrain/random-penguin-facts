#!/bin/bash

export PATH="${PATH}:/home/smolbrain/emsdk:/home/smolbrain/emsdk/upstream/emscripten"
export EMSDK="/home/smolbrain/emsdk"
export EMSDK_NODE="/home/smolbrain/emsdk/node/15.14.0_64bit/bin/node"

cmake -DCMAKE_TOOLCHAIN_FILE=/opt/qt6-emscripten-threadless/lib/cmake/Qt6/qt.toolchain.cmake -DCMAKE_CXX_FLAGS="${CMAKE_CXX_FLAGS} -lembind -s MODULARIZE=1 -s EXPORT_ES6=1 --no-entry" \
      -G Ninja -S . -B build

cd build && ninja

cd ..