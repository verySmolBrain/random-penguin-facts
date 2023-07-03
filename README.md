# random-penguin-facts

## Description

Small experimental project to learn QT and WebAssembly.

- Binaryen to check WASM
- Don't hardcode CMakeLists.txt variables for subdirectories


- Finish Setup CI/CD
- Visitor Pattern + Visitor Pattern Tests (Classes)


Setup CI/CD
- npm run test_cxx (Build + Catch tests)
- npm run test_wasm (Build + Jest tests)
- npm run test_backend (Both Catch + Jest)
- npm run test_frontend (Do nothing for now)
- npm run test (Do nothing for now)
- npm run dev_frontend (Should build_backend -> cp generated files to frontend -> run vite with npm run dev)
- npm run build_backend (CMake Build)
- npm run build_frontend (Should build_backend -> cp generated files to frontend -> run vite with npm run build)
- npm run build (Should just be npm run build_frontend)
- npm run preview (Should just call npm run preview in frontend)

(Installing Emscripten + QT + Everything is Pain)
- github actions (Install + Run npm run test)






Stuff to Think About
- ESM vs commonjs (ESM better for React Vite but commonjs better for HTML. Also ESM unstable.)
- CMake vs NPM
- Getting TypeScript to work with Jest + WASM Module
- Fix Jest Tests (Jest Runner Not Working For Individual + Linting not recognising jest) -> (Is it even possible? Or worth it?)
- Fix caching thing with CMakeLists
- Build warnings with WASM
- Bug have to have binding in main (Linking issue?)

Directly bypassing the JSON Glue Code and use the thing?

CMake + Emscripten + QT + Singlethreaded + ESM
- So far works for everything. Downside is no webworker.

EMCC + Multithreaded + ESM
- Works for everything except Vite Build. Vite bug with web workers.

CMake + Emscripten + QT + Multithreaded + ESM
- Doesn't work on Vite Dev (QT-CMAKE Compiles weirdly. Has to do with the way it's compiled as worker.js uses commonjs imports.)

EMCC | CMake + CommonJS
- Works for everything except Vite Dev. Can't import CommonJS because Vite works mostly with ESM modules. 
Tried webpack but I don't know how to set it up to work with wasm.


https://github.com/emscripten-core/emscripten/issues/18626


cmake --no-warn-unused-cli -DCMAKE_TOOLCHAIN_FILE:STRING=/opt/qt6-emscripten-threadless/lib/cmake/Qt6/qt.toolchain.cmake "-DCMAKE_CXX_FLAGS:STRING=${CMAKE_CXX_FLAGS} -lembind -s MODULARIZE=1 -s EXPORT_ES6=1 --no-entry" -DCMAKE_EXPORT_COMPILE_COMMANDS:BOOL=TRUE -DCMAKE_BUILD_TYPE:STRING=Release -DCMAKE_C_COMPILER:FILEPATH=/usr/bin/clang -DCMAKE_CXX_COMPILER:FILEPATH=/usr/bin/clang++ -S . -B build