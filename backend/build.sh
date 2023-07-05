#!/bin/bash

rm -rf build
source ../setup_env.sh

cmake -DCMAKE_TOOLCHAIN_FILE=${QT_LIB}/lib/cmake/Qt6/qt.toolchain.cmake -DCMAKE_CXX_FLAGS="${CMAKE_CXX_FLAGS}" \
      -G Ninja -S . -B build

cd build && ninja

cd ..