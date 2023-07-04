# random-penguin-facts

# Description

Small experimental project to learn QT and WebAssembly.

# Quick Setup

Follow this

and this

and this


# Environment Setup

## QT

./init-repository -f --module-subset=qtbase,qtdeclarative,qtwebsockets

../qt6/./configure -qt-host-path /opt/qt6 -platform wasm-emscripten -prefix /opt/qt6-emscripten-threadless 

## Emscripten

## Node

## Vite



# VSCode Setup

## Extensions

Required (For a reasonable setup)

- CMake Tools (Automatically configures intellisense based on CMake file. Can also be used to build but recommend using npm build instead.)
- C/C++ Extension Pack (Intellisense + Normal C++ Tools)

Optional

- Jest Test Runner (Note I've only tried this one and there's a lot of other Jest test runner extesions. I've found the Jest extension that first pops up to be a bit more painful to configure since it treats every single workspace you open as a Jest workspace whereas I've had no problems with this particular one.)

## Setting Up C++ Intellisense

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

You also have to set `cmake-tools-kits.json` by going to command palette `CMake: Edit User-Local CMake Kits` and appending this to the list:

```json
{
    "name": "random_emscripten_facts (QT Emscripten Threadless Clang)",
    "compilers": {
        "C": "/usr/bin/clang",
        "CXX": "/usr/bin/clang++"
    },
    "environmentSetupScript": "${workspaceFolder}/setup_env.sh",
}
```

Feel free to change the compilers to whatever you're using.

Unfortunately you'll have to do this in the global one instead of the local .vscode version since there's an issue with CMake Tool extension's file watcher that doesn't detect `cmake-tools-kits.json` in the local .vscode folder. You can read more about the issue [here](https://github.com/microsoft/vscode-cmake-tools/issues/1416#issuecomment-733889401) but it's essentially still on the backlog to be fixed. Note this might just be unique to me based on my VSCode setup so you might have better luck with detecting the custom kit.

The reason we need to do this is to set the environment variables for .vscode to detect the right folders to use for intellisense without hardcoding it. The `cmake-tools-kits.json` allows for a `"environmentSetupScript": "${workspaceFolder}/setup_env.sh",` which I've found to be the cleanest way of doing this. VSCode has a weird quirk where it won't detect the environment variables unless they're loaded before the workspace is actually opened.

I've looked into a few alternatives. One is to just have the user export the environment variables in their global `.bashrc` or `.zshrc` file but I personally do not like polluting those files too much with too many variables. I've also looked into running a regex script that automatically copies the environment variables to .vscode/settings.json but I feel this was too intrusive and I didn't want to accidentally overwrite important settings.

## VSCode Issues

- ClangD Extension intellisense doesn't detect Emscripten library. [This](https://stackoverflow.com/questions/76250587/vscode-clangd-failed-to-find-my-header-file-not-found-clangpp-file-not-found) stackoverflow post has some explanation
regarding this issue. I think? it has something to do with ClangD ignoring / not having some options in the
`includePaths` settings.json file in .vscode so it relies purely on the CMake file which doesn't have all the information
required. (I didn't explore this path much since I wasn't too invested in the ClangD extension so feel free to explore
this).

- If you use QT CMake tools and their macros (In particular `qt_standard_project_setup`), it requires you to use `CMake: Delete Cache and Reconfigure` from the VSCode CMake extension each time you build with the CMake extension otherwise it complains that it can't find `qt_standard_project_setup`. I'm not sure what's causing the problem but my suspicion is it has something to do with the flags that `qt_standard_project_setup` sets. I've decided to just not use their macros since I'm not comfortable with it doing so many things under the hood (And so far it runs fine but I've also not gone very indepth with QT at all). This shouldn't affect anything in the project even if you do set it up (Since we use a shellscript to build instead of the extension with npm) but it was a minor annoyance to me.

- Jest test runner extension only partially works. This is because to get Jest working with ES6 modules, the official workaround is to call

- Typescript linter doesn't work because of issues with ts-jest + node. I'm not sure what's causing this exactly and I'm also
not sure how to fix it.

- Intellisense and CMakeTools doesn't work well in nested folders (eg. If you're in project root directory intellisense won't work if you open ./backend/src). Personally I just open new separate workspaces for backend and frontend.



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

- QT CMake automatically injects a few flags into emcc when it compiles. I haven't narrowed down the exact flags but I do know
it uses an optimisation flag because it spits out unreadable / compiled .js files whereas if you compile with emcc it compiles readable .js files.
This might be helpful to know since I've tracked down a few issues I had involving ES6 exports / imports by manually compiling and
reading some of the comments / code. It also does something weird with web worker if you use --feature-threads that is incompatible with 
ES6 imports (Or at least I haven't been able to get it to work)

- If you use a certain combination of flags as described [here](https://github.com/emscripten-core/emscripten/issues/18626) to export multithreaded ES6 then you have to manually add support for ES6 to the generated worker file.

If you want more information I find that `settings.js` in the src folder of Emscripten has comments that have clarified a few things for me.

## QT CMake Flags

- If you pass in an invalid flag (Sometimes?) then QT CMake will give a really obscure message about R_WRAP not existing or QT6_NOTFOUND that has
nothing to do with the issue. For example got this flag after I accidentally passed in -no-entry and only realised after reinstalling and building
QT + Emscripten multiple times.

Make sure you set emcc environment



# QT CMake Reflection

If you read the official guide of QT CMake they'll recommend using their CMake macros such as:

- `qt_standard_project_setup()`
- `qt_add_library()`
- `qt_add_executable()`

I found this caused issues as described [here](#issues-i-ran-into). You might also run into a few minor issues such as `VULKAN_HEADER` missing
when building. [This](https://stackoverflow.com/questions/48014518/why-is-vulkan-library-set-to-vulkan-library-notfound-yet-vulkan-found-is-true)
post explains why and though it's a minor inconvenience it shouldn't affect the resulting output.

I've already listed this in [build issues](#qt-cmake-flags) but if you run into an issue regarding a missing R_WRAP not existing or QT6_NOTFOUND file then this might have to do with an invalid flag that is passed into CMake. Try that first before rebuilding.

The official QT CMake documentation recommends using `qt_cmake`. I've looked at the code for that file and it essentially redirects to
the QT CMake toolchain file. Personally I like things to be more explicit so I've decided to just use normal CMake and just pass it
the toolchain file instead as an argument.

# ES6 Issues + Typescript Issue + Frontend Reflection

https://github.com/emscripten-core/emscripten/issues/18626


es6 - good and bad

typescript

ts-jest

config

For Frontend I've been using Vite. 

Cors setup

I've setup the 

webpack


npm

https://github.com/vitejs/vite/issues/13367


Alternatives

# Emscripten

Emscripten by itself works pretty nicely (Most of the time). 

The main issues I ran into were from weird ES6 vs CommonJS compatibility. I've mentioned most of them in [Emscripten Build Flags](#emscripten-flags).
So far with Emscripten, porting it over to ES6 seems like the only way to get it working with a modern build tool like Vite which all seem to expect ES6 modules instead of CommonJS. I've talked more about this in [Frontend](#es6-issues--typescript-issue--frontend-reflection) but essentially if you want to use CommonJS you either stick it straight into a .html file, you try to use some weird .vite settings to configure CommonJS imports or you try another bundler like WebPack. 

I've also found a hacky method where you edit the .js file output by Emscripten directly and modify it to use ES6 syntax at the very bottom of the file. I found this worked for single-threaded Emscripten but once you include webworker.js it's very hard to get it working.

For Emscripten make sure you load the .js file it outputs with async because it needs time to instantiate the .wasm file. The way you do this depends on which flags you use for the project and where you're loading it eg. in a Node environment vs HTML environment vs React environment.

cors

embind make sure it is linked together in the build


html and html entry point


embind tips

# WIP

## Misc

- Include Binaryen (Or alternatives) to view readable WASM file
- Setup config files for easy building (export paths)
- github actions (Install + Run npm run test)
- proper typescript
- Organise thoughts

## VSCode

- Fix CMake Tools Bug

# Compatibility

Tested on Ubuntu + Mac


cmake --no-warn-unused-cli -DCMAKE_TOOLCHAIN_FILE:STRING=/opt/qt6-emscripten-threadless/lib/cmake/Qt6/qt.toolchain.cmake "-DCMAKE_CXX_FLAGS:STRING=${CMAKE_CXX_FLAGS} -lembind -s MODULARIZE=1 -s EXPORT_ES6=1 --no-entry" -DCMAKE_EXPORT_COMPILE_COMMANDS:BOOL=TRUE -DCMAKE_BUILD_TYPE:STRING=Release -DCMAKE_C_COMPILER:FILEPATH=/usr/bin/clang -DCMAKE_CXX_COMPILER:FILEPATH=/usr/bin/clang++ -S . -B build





c_cpp_properties
build.sh