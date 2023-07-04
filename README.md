# random-penguin-facts

# Description

Small experimental project to learn QT and WebAssembly.


- Don't hardcode CMakeLists.txt variables for subdirectories


- Finish Setup CI/CD

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

- Object lifetimes
- Calling Javascript Class in Function


Stuff to Think About
- ESM vs commonjs (ESM better for React Vite but commonjs better for HTML. Also ESM unstable.)
- CMake vs NPM
- Getting TypeScript to work with Jest + WASM Module
- Fix Jest Tests (Jest Runner Not Working For Individual + Linting not recognising jest) -> (Is it even possible? Or worth it?)
- Fix caching thing with CMakeLists
- Build warnings with WASM
- Bug have to have binding in main (Linking issue?)

Directly bypassing the JSON Glue Code and use the thing?



# Environment Setup


# VSCode Setup

## Extensions

- CMake Tools (Automatically configures intellisense)
- C/C++ Extension Pack (Intellisense + Normal Tools)

## Setup

Your .vscode should contain 3 files:

### c_cpp_properties.json

This should be automatically generated for you. It will differ based on your OS etc. For compiler I'm using `Clang 14.0.0 x86_64-pc-linux-gnu` but
since I'm not doing anything overly complex as long as you're using a QT + Emscripten compatible Compiler for C++ it should be ok (As of the time
of writing). I'll list the QT + Emscripten versions in the [Environment Setup](#environment-setup) section.

```
{
    "configurations": [
        {
            "name": "Linux",
            "includePath": [
                "${workspaceFolder}/**"
            ],
            "defines": [],
            "compilerPath": "/usr/bin/clang",
            "cStandard": "c17",
            "cppStandard": "c++14",
            "intelliSenseMode": "linux-clang-x64",
            "configurationProvider": "ms-vscode.cmake-tools"
        }
    ],
    "version": 4
}
```

### cmake_variants.json



## Issues I Ran Into

- ClangD Extension intellisense doesn't detect Emscripten library. [This](https://stackoverflow.com/questions/76250587/vscode-clangd-failed-to-find-my-header-file-not-found-clangpp-file-not-found) stackoverflow post has some explanation
regarding this issue. I think? it has something to do with ClangD ignoring / not having some options in the
`includePaths` settings.json file in .vscode so it relies purely on the CMake file. Problem is I've offset some of
the flags required to build in .vscode since I've run into a few issues with CMake since it uses QT CMake Macros if I don't
do it that way.

## Known Bugs

- CMake Tools extension for VSCode requires you to use `CMake: Delete Cache and Reconfigure` each time you build. I'm not sure
what's causing this.
- Typescript linter doesn't work because of issues with ts-jest + node. I'm not sure what's causing this exactly and I'm also
not sure how to fix it.
- Jest runner doesn't work because I'm using an experimental flag so ts-jest is compatible with node.



# Building Issues

## CMake + Emscripten + QT + Singlethreaded + ESM

- [x] Jest
- [x]

- So far works for everything. Downside is no webworker.

## EMCC + Multithreaded + ESM
- Works for everything except Vite Build. Vite bug with web workers.

## CMake + Emscripten + QT + Multithreaded + ESM
- Doesn't work on Vite Dev (QT-CMAKE Compiles weirdly. Has to do with the way it's compiled as worker.js uses commonjs imports.)

## EMCC | CMake + CommonJS
- Works for everything except Vite Dev. Can't import CommonJS because Vite works mostly with ESM modules. 
Tried webpack but I don't know how to set it up to work with wasm.



# ES6 Issues + Typescript Issue


https://github.com/emscripten-core/emscripten/issues/18626


cmake --no-warn-unused-cli -DCMAKE_TOOLCHAIN_FILE:STRING=/opt/qt6-emscripten-threadless/lib/cmake/Qt6/qt.toolchain.cmake "-DCMAKE_CXX_FLAGS:STRING=${CMAKE_CXX_FLAGS} -lembind -s MODULARIZE=1 -s EXPORT_ES6=1 --no-entry" -DCMAKE_EXPORT_COMPILE_COMMANDS:BOOL=TRUE -DCMAKE_BUILD_TYPE:STRING=Release -DCMAKE_C_COMPILER:FILEPATH=/usr/bin/clang -DCMAKE_CXX_COMPILER:FILEPATH=/usr/bin/clang++ -S . -B build



# WIP


## Misc

- Include Binaryen (Or alternatives) to view readable WASM file
- Setup config files for easy building (export paths)
- Finalise CI/CD

## VSCode

- 