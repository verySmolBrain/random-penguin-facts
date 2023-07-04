# random-penguin-facts

# Description

Small experimental project to learn QT and WebAssembly.



# Environment Setup

## QT

## Emscripten

## Node

## Vite



# VSCode Setup

## Extensions

- CMake Tools (Automatically configures intellisense based on CMake file. Not technically required for building but you can use it.)
- C/C++ Extension Pack (Intellisense + Normal C++ Tools)

## Setup

Your .vscode should contain 3 files:

### c_cpp_properties.json

This should be automatically generated for you. It will differ based on your OS etc. For compiler I'm using `Clang 14.0.0 x86_64-pc-linux-gnu` but
since I'm not doing anything overly complex as long as you're using a QT + Emscripten compatible Compiler for C++ it should be ok (As of the time
of writing). I'll note the QT + Emscripten versions in the [Environment Setup](#environment-setup) section.

```json
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


```json
{
    "buildType": {
        "default": "debug",
        "choices": {
            "debug": {
                "short": "Debug",
                "buildType": "Debug",
                "settings": {
                    "CMAKE_FIND_DEBUG_MODE": "TRUE"
                }
            },
            "release": {
                "short": "Release",
                "buildType": "Release"
            }
        }
    },
    "targetType": {
        "default": "executable",
        "description": "The target type to build",
        "choices": {
            "executable": {
                "short": "Executable",
                "settings": {
                    "CMAKE_TOOLCHAIN_FILE": "/opt/qt6-emscripten-threadless/lib/cmake/Qt6/qt.toolchain.cmake"
                }
            },
            "library": {
                "short": "Library",
                "settings": {
                    "CMAKE_TOOLCHAIN_FILE": "/opt/qt6-emscripten-threadless/lib/cmake/Qt6/qt.toolchain.cmake",
                    "CMAKE_CXX_FLAGS": "${CMAKE_CXX_FLAGS} -lembind -s MODULARIZE=1 -s EXPORT_ES6=1 --no-entry"
                }
            }
        }
    }
}
```


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

## Rundown of How Combinations of QT CMake + Emscripten vs Emcc + Threadless vs PThreads + ESM vs CommonJS Performs

### CMake + Emscripten + QT + Singlethreaded + ESM

- [x] Jest
- [x]

- So far works for everything. Downside is no webworker.

### EMCC + Multithreaded + ESM
- Works for everything except Vite Build. Vite bug with web workers.

### CMake + Emscripten + QT + Multithreaded + ESM
- Doesn't work on Vite Dev (QT-CMAKE Compiles weirdly. Has to do with the way it's compiled as worker.js uses commonjs imports.)

### EMCC | CMake + CommonJS
- Works for everything except Vite Dev. Can't import CommonJS because Vite works mostly with ESM modules. 
Tried webpack but I don't know how to set it up to work with wasm.

## Emscripten Flags

Do note there's an issue? with QT CMake where you can pass it flags and it will do either nothing or break everything. Here's
a rundown of issues I've gotten with flags:

- If you pass in an invalid flag (Sometimes?) then QT CMake will give a really obscure message about R_WRAP not existing that has
nothing to do with the issue. For example I accidentally passed in -no-entry and only realised after reinstalling and building
QT + Emscripten multiple times.

- QT CMake automatically injects a few flags into emcc when it compiles. I haven't narrowed down the exact flags but I do know
it uses an optimisation flag because it spits out unreadable / compiled .js files whereas if you compile with emcc it compiles readable .js files.
This might be helpful to know since I've tracked down a few issues I had involving ES6 exports / imports by manually compiling and
reading some of the comments / code. It also does something weird with web worker if you use --feature-threads that is incompatible with 
ES6 imports (Or at least I haven't been able to get it to work)



If you want more information I find that `settings.js` in the src folder of Emscripten has comments that have clarified a few things for me.

# ES6 Issues + Typescript Issue

https://github.com/emscripten-core/emscripten/issues/18626

cmake --no-warn-unused-cli -DCMAKE_TOOLCHAIN_FILE:STRING=/opt/qt6-emscripten-threadless/lib/cmake/Qt6/qt.toolchain.cmake "-DCMAKE_CXX_FLAGS:STRING=${CMAKE_CXX_FLAGS} -lembind -s MODULARIZE=1 -s EXPORT_ES6=1 --no-entry" -DCMAKE_EXPORT_COMPILE_COMMANDS:BOOL=TRUE -DCMAKE_BUILD_TYPE:STRING=Release -DCMAKE_C_COMPILER:FILEPATH=/usr/bin/clang -DCMAKE_CXX_COMPILER:FILEPATH=/usr/bin/clang++ -S . -B build





## Emscripten



# WIP

## Misc

- Include Binaryen (Or alternatives) to view readable WASM file
- Setup config files for easy building (export paths)
- github actions (Install + Run npm run test)

## VSCode

- Fix CMake Tools Bug