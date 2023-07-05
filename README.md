# random-penguin-facts

# Description

Small experimental project to learn QT and WebAssembly.

# Quick Setup Guide

Note I've only included installation instructions for Ubuntu right now. It should be roughly the same for other OS though.

1. Install Emscripten (Skip if already installed) (Instructions [here](#emscripten))
2. Install CMake (Skip if already installed) (Instructions [here](#cmake))
3. Build QT for Emscripten (Skip if already installed) (Instructions [here](#qt))
4. Install npm (Skip if already installed) (Instructions [here](#node))
5. Update variables in `setup_env.sh` to point to your installations

To get started you can try to run `npm run test` or `npm run dev_frontend` in the project root directory. In ./frontend you can run `npm run dev` to start the frontend and `npm run build && npm run preview` to see a compiled version. In ./backend you can run `npm run build_lib` to build the library and `npm run test` to run the tests.

Docker WIP


# Environment Setup

## Emscripten

For instructions on how to install Emscripten you can go [here](https://emscripten.org/docs/getting_started/downloads.html). I've noted down the instructions for Ubuntu though it's very similar on other OS. Current project is using `Emscripten version 3.1.40`. Personally I like to install this in /opt/.

```shell
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk

git pull

./emsdk install latest
./emsdk activate latest

# Activate PATH and other environment variables in the current terminal
# Not necessary for us but it does print out all the paths you need to update `setup_env.sh` with
source ./emsdk_env.sh
```

## CMake

There are a few ways of doing this. I just used the prebuilt binaries:

```shell
sudo apt install cmake
```

Also install ninja:

```shell
sudo apt install ninja-build
```

## QT

For instructions on how to setup QT with WASM you can go [here](https://doc.qt.io/qt-6/wasm.html). The guide to [building QT from source through git](https://wiki.qt.io/Building_Qt_6_from_Git) is also going to come in handy. Note that there's an alternative and possibly easier option if you already have QT Creator already installed or if you have a QT account. You can simply use the QT Online Installer by logging into your QT account and selecting the binary you want to install.

Personally I just built it from git since I don't need to setup any account or download anything more than I need. I'm using `Qt version 6.7.0` along with `Emscripten version 3.1.40`.

Note that since wasm-emscripten requires cross-compiling you'll need a native existing build (Correct me if I'm wrong because I couldn't find documentation for what is actually needed for the `-qt-host-path`). If you don't already have a QT version installed then just run the instructions below but without `-qt-host-path` and `-platform`. Then your `-qt-host-path` when you compile for Emscripten is the `-prefix` you used for the native build. Personally I like to set the path to /opt/. Note you might need to clean up qt6-build folder if you're building multiple times.

```shell
git clone https://code.qt.io/qt/qt5.git qt6

cd qt6
git switch dev

# Depends on which modules you require
./init-repository -f --module-subset=qtbase,qtdeclarative,qtwebsockets

cd ..

mkdir qt6-build
cd qt6-build

# If you don't have an existing native build run this without -qt-host-path and -platform then repeat again with them.
# Make sure to clean qt6-build folder if you're building multiple times.

# Add -feature-thread to enable pthreads and web worker
../qt6/./configure -qt-host-path /path/to/existing/native/build -platform wasm-emscripten -prefix /path/to/installation

# Edit 4 to whatever amount of threads you want to use. Or leave it out
cmake --build . --parallel 4
cmake --install .
```

## Node

There's a few different ways of installing this. You can install directly or you can use a manager like nvm. Personally I use Volta so I'll have the installation instructions be based on that:

```shell
curl https://get.volta.sh | bash
```

Open a new terminal then run this in the project root directory folder:

```shell
volta install node@19.4.0
npm install
```

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

This part is optional and more WIP. I still need to add an option to compile a multi-threaded version. With QT CMake you need to build a completely different installation if you want pthreads enabled. I'm not sure this is worth setting up since I've delegated most of the building to npm scripts and the CMake Extension is mainly for intellisense. I'm also debating whether I should just offset these to the CMake Kits and use arguments in `setup_env.sh` instead.

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
                "short": "Executable"
            },
            "library": {
                "short": "Library",
                "settings": {
                    "CMAKE_CXX_FLAGS": "${CMAKE_CXX_FLAGS} -lembind -s MODULARIZE=1 -s EXPORT_ES6=1 --no-entry"
                }
            }
        }
    }
}
```

### settings.json

This should be mostly generated for you as well. For `cmake.emscriptenSearchDirs` it doesn't actually do anything. You can read about the issue [here](https://github.com/microsoft/vscode-cmake-tools/issues/1551) but I left it in as a reminder to checkup on this because it's a nice QOL.

The JestRunner command is required because otherwise it won't work with ES6 modules. I've talked more about this in [Frontend](#es6--typescript--frontend-reflection). This is optional ofc based on whether you're actually using the Jest test runner extension.

``` json
{
    "cmake.cmakePath": "/usr/bin/cmake",
    "cmake.emscriptenSearchDirs": [],
    "cmake.generator": "Ninja",
    "cmake.sourceDirectory": "${workspaceFolder}/backend",

    "jestrunner.runOptions": ["--coverage", "--colors"],
    "jestrunner.jestCommand": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
}
```

### cmake-tools-kits.json

You also have to set `cmake-tools-kits.json` by going to command palette `CMake: Edit User-Local CMake Kits` and appending this to the list:

```json
  {
    "name": "random_emscripten_facts (QT Emscripten Threadless Clang) (Outer)",
    "compilers": {
      "C": "/usr/bin/clang",
      "CXX": "/usr/bin/clang++"
    },
    "environmentSetupScript": "${workspaceFolder}/setup_env.sh",
    "isTrusted": true
  },
  {
    "name": "random_emscripten_facts (QT Emscripten Threadless Clang) (Inner)",
    "compilers": {
      "C": "/usr/bin/clang",
      "CXX": "/usr/bin/clang++"
    },
    "environmentSetupScript": "${workspaceFolder}/../setup_env.sh",
    "isTrusted": true
  }
```

Feel free to change the compilers to whatever you're using. The reason we have 2 is one is for opening in the root directory and the other is for opening in the backend directory. I haven't found a way to make it work with just one yet.

Unfortunately you'll have to do this in the global one instead of the local .vscode version since there's an issue with CMake Tool extension's file watcher that doesn't detect `cmake-tools-kits.json` in the local .vscode folder. You can read more about the issue [here](https://github.com/microsoft/vscode-cmake-tools/issues/1416#issuecomment-733889401) but it's essentially still on the backlog to be fixed. Note this might just be unique to me based on my VSCode setup so you might have better luck with detecting the custom kit.

The reason we need to do this is to set the environment variables for .vscode to detect the right folders to use for intellisense without hardcoding it. The `cmake-tools-kits.json` allows for a `"environmentSetupScript": "${workspaceFolder}/setup_env.sh",` which I've found to be the cleanest way of doing this. VSCode has a weird quirk where it won't detect the environment variables unless they're loaded before the workspace is actually opened.

I've looked into a few alternatives. One is to just have the user export the environment variables in their global `.bashrc` or `.zshrc` file but I personally do not like polluting those files much with too many things. I've also looked into running a regex script that automatically copies the environment variables to .vscode/settings.json but I feel this was too intrusive and I didn't want to accidentally overwrite important settings.

## VSCode Issues

- ClangD Extension intellisense doesn't detect Emscripten library. [This](https://stackoverflow.com/questions/76250587/vscode-clangd-failed-to-find-my-header-file-not-found-clangpp-file-not-found) stackoverflow post has some explanation regarding this issue. I think? it has something to do with ClangD ignoring / not having some options in the `includePaths` settings.json file in .vscode so it relies purely on the CMake file which doesn't have all the information required. (I didn't explore this path much since I wasn't too invested in the ClangD extension so feel free to explore this).

- If you use QT CMake tools and their macros (In particular `qt_standard_project_setup`), it requires you to use `CMake: Delete Cache and Reconfigure` from the VSCode CMake extension each time you build with the CMake extension otherwise it complains that it can't find `qt_standard_project_setup`. I'm not sure what's causing the problem but my suspicion is it has something to do with the flags that `qt_standard_project_setup` sets. I've decided to just not use their macros since I'm not comfortable with it doing so many things under the hood (And so far it runs fine but I've also not gone very indepth with QT at all). This shouldn't affect anything in the project even if you do set it up (Since we mainly use a script to build instead of the CMake extension) but it was a minor annoyance to me.

- Jest test runner extension works only with a hacky workaround. This is because to get Jest working with ES6 modules, the official workaround is to call Jest with node --experimental-vm-modules. You'll get Warnings about it being an experimental feature because as of the time of writing the ES6 standard has many basic features still being experimental. It's a minor annoyance and I've talked more about this issue in [Frontend](#es6--typescript--frontend-reflection).

- Typescript linter doesn't work if you try to import modules using ES6 imports like `import module from 'path'` even if it compiles fine with Jest. It also compiles and runs fine if you add `.ts` to the end of `path` but the linter doesn't like it. I've talked more about this issue in [Frontend](#es6--typescript--frontend-reflection).

- Intellisense and CMakeTools doesn't work well in nested folders (eg. If you're in project root directory intellisense won't work if you open ./backend/src). Personally I just open new separate workspaces for backend and frontend.



# Building Issues

## Rundown of How Combinations of QT CMake + Emscripten vs Emcc + Threadless vs PThreads + ESM vs CommonJS Performs

### CMake + Emscripten + QT + Singlethreaded + ESM

- [x] Typescript Jest
- [x] Vite + React Development
- [x] Vite + React Build

So far this has been the most stable setup for me. The downside is you don't get web workers for true multithreading.

### EMCC + Multithreaded + ESM

- [x] Typescript Jest
- [x] Vite + React Development
- [ ] Vite + React Build

There's an issue with Emscripten + pthreads not meshing well in a node environment where it just hangs forever. You can read about the issue [here](https://github.com/emscripten-core/emscripten/issues/12801) which can be resolved by using the `-s EXIT_RUNTIME=1` flag. This would maybe require more fixes once I actually code up something to do with threads later on.

This combination works for Vite + React using npm run dev but fails with `Unexpected early exit. This happens when Promises returned by plugins cannot resolve. Unfinished hook action(s) on exit:` when you try to build it. I'm not sure what's causing this but I suspect it has something to do with the way Vite handles web workers. You can read more [here](https://github.com/vitejs/vite/issues/13367) though I'm not sure whether this is entirely relevant. Apparently it's an issue with Rollup since Vite uses it under the hood.

### CMake + Emscripten + QT + Multithreaded + ESM

- [ ] Typescript Jest
- [ ] Vite + React Development
- [ ] Vite + React Build

There's still the same issue with Emscripten + pthreads not meshing well so `-s EXIT_RUNTIME=1` flag is still required. However there's another problem caused by QT CMake where it doesn't respect the `-s EXPORT_ES6=1` flag for the web worker file and instead outputs it using CommonJS. This means you'll need to first rename the worker.js file to worker.cjs so it gets treated as CommonJS and then manually update your wasm.js file to import the renamed web worker file instead of worker.js. This works but is a bit hacky.

The same issue also happens in Vite + React environment with QT CMake exporting in the wrong format so you'll need to update the .cjs manually. You'll still run into the same Web Worker bug with Vite. There might potentially be a fix by using some combination of Emscripten flags or modifying the worker.cjs file or using some Vite settings to make it compatible but this is WIP.

### EMCC | CMake + CommonJS

- [x] Typescript Jest
- [ ] Vite + React Development
- [ ] Vite + React Build

This works ok with Typescript Jest (Once you modify your node environment to use CommonJS) but not so well on the actual frontend. I've tried to update the .js files to .cjs files manually but I get import errors from vite when it actually tries to dynamically load it. I've seen some articles about either using Vite transform or WebPack that might make it compatible but that's WIP.

## Emscripten Flags

Do note there's an issue? with QT CMake where you can pass it flags and it will do either nothing or break everything. Here's
a rundown of issues I've gotten with flags:

- QT CMake automatically injects a few flags into emcc when it compiles. ~I haven't narrowed down the exact flags but I do know it uses an optimisation flag because it spits out compiled .js files whereas if you compile with emcc it compiles readable .js files.~ (I don't know what I did but this is no longer the case. I think I removed the QT CMake macros and now it generates code slightly different to Emscripten without optimisation but still readable). This might be helpful to know since I've tracked down a few issues I had involving ES6 exports / imports by manually compiling and reading some of the comments / code. It also does something weird with web worker if you use pthreads that is incompatible with 
ES6 imports (Or at least I haven't been able to get it to work with Vite).

- If you use a certain combination of flags as described [here](https://github.com/emscripten-core/emscripten/issues/18626) to export multithreaded ES6 then you have to manually add support for ES6 to the generated worker file.

If you want more information I find that `settings.js` in the src folder of Emscripten has comments that have clarified a few things for me.

## QT CMake Flags

- If you pass in an invalid flag (Sometimes?) then QT CMake will give a really obscure message about R_WRAP not existing or QT6_NOTFOUND that has
nothing to do with the issue. For example I got this flag after I accidentally passed in `-no-entry` instead of `--no-entry` and only realised after reinstalling and building QT + Emscripten multiple times that this was causing the issue.

- Make sure your environment variables are properly setup before building. You'll need to either use `qt-cmake` from the QT CMake tools or pass it the toolchain file it links to. You also have to setup Emscripten environment variables properly. I ran into a few issues initially with getting this working with VSCode. I've talked more about this in [VSCode Setup](#vscode-setup).


# QT CMake Reflection

If you read the official guide of QT CMake they'll recommend using their CMake macros such as:

- `qt_standard_project_setup()`
- `qt_add_library()`
- `qt_add_executable()`

I found this caused issues as described [here](#issues-i-ran-into). You might also run into a few minor issues such as `VULKAN_HEADER` missing
when building. [This](https://stackoverflow.com/questions/48014518/why-is-vulkan-library-set-to-vulkan-library-notfound-yet-vulkan-found-is-true)
post explains why and though it's a minor inconvenience it shouldn't affect the resulting output.

I've already listed this in [build issues](#qt-cmake-flags) but if you run into an issue regarding a missing R_WRAP not existing or QT6_NOTFOUND file then this might have to do with an invalid flag that is passed into CMake. Try that first before rebuilding.

The official QT CMake documentation recommends using `qt_cmake`. I've looked at the code for that file and it essentially redirects to the QT CMake toolchain file. Personally I like things to be more explicit so I've decided to just use normal CMake and just pass it the toolchain file instead as an argument.

QT CMake also generates extra things like .html file and a `qtloader.js` file. I've found that it makes things more confusing instead and it's redundant for our project. There were some issues I ran into early on where I thought the bug was with Emscripten but it was actually that the QT CMake extra files weren't compatible with the flags I used to compile and I'd have to go in and manually edit their generated code. I've since just abandoned the .html files and moved the frontend completely to Vite + React instead.

# ES6 + Typescript + Frontend Reflection

For the node side it's unfortunate that a lot of common features in ES6 are still not finalised (As of the time of writing) especially on the node side of things which means it can be a bit hard to setup. Though from what I've read ES6 is the path JS is going down now and most modern frontend frameworks are already using it so this might be worth it over CommonJS for a newer project.

Jest does not work well with anything other than standard JavaScript with CommonJS requires imports. You'll need to install ts-jest or have a babel setup for Typescript support. If you want to setup Typescript + ES6 imports with ts-jest you should have a jest.config.js file that looks something like this:

```js
/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: "ts-jest",
    testEnvironment: 'jest-environment-node',
    transform: {
        '^.+\\.tsx?$': [
        'ts-jest',
            {
                useESM: true,
            },
        ],
    },
    extensionsToTreatAsEsm: ['.ts'],
};
```

and make sure you have `"type": "module"` in your package.json file. Note you'll also have to run Jest using `node --experimental-vm-modules node_modules/jest/bin/jest.js` instead of `jest` because of the way Jest handles ES6 modules which will give you a bunch of harmless warnings that I still haven't figured out how to turn off. 

There's also an issue with ts-jest where linting where it compiles and runs fine if you leave in a .ts extension or just leave our the extension completely however the linter complains it can't find the module. To fix this I converted the file to a .js file instead and used a .js extension. I suspect this is because ts-jest compiles things under the hood which means it works fine but because it's not integrated into VSCode properly, the linter doesn't actually detect this. I'm pretty sure there's a way to fix this but I haven't looked into it yet.

This should work as of now but also note that there have been lots of changes and development happening in this area so this can change pretty fast. I've read articles from 2022 that are already outdated regarding the setup for this.

I should also note alternatives like Vitest and Mocha + Chai that I've had pleasant experiences with as they run ES6 and TypeScript (For the most part) straight out of the box whereas Jest carries a lot of baggage and still hasn't developed well in this aspect. Though do note that Jest is by far the more popular option and has a lot more support and documentation and a proven track-record.

Regarding TypeScript it's also a bit hard to setup if you don't have background knowledge of the history of JavaScript. You should have a tsconfig.json similar to this:

```json
{
    "compilerOptions": {
        "target": "es2022",
        "lib": [
            "ESNext" 
        ],
      
        "module": "NodeNext",
        "outDir": "./dist",
        "rootDir": "./tests",

        "moduleResolution": "NodeNext",
        "esModuleInterop": true,
        
        "strict": false,
        "forceConsistentCasingInFileNames": true,
        "skipLibCheck": true,
        "noUnusedParameters": true,
        "noUnusedLocals": true, 
    },

    "include": [
        "tests/**/*.ts", "tests/js_tests/utils/wasm.utils.js",
    ],
    "exclude": [
        "node_modules",
        "./dist/"
    ],
}
```

Note `"target"` is what your TypeScript compiles to and `"module"` is what defines whether you're using CommonJS or ES6. I've used NodeNext because it offers experimental features like module resolution that have come in handy.


Now with frontend I've just used a standard default Vite + React setup that's been working well for the most part. I haven't tried testing other bundlers but this might be something interesting to look into. To get CORS working on Vite simple append this:

```js
server: {
    headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
    },
},
```

to `defineConfig()` in vite.config.ts.


Note that from my experience with it so far, Vite reacts poorly to CommonJS files. I haven't been able to figure a way to export Emscripten as CommonJS and be able to import it into a component because it complains without just changing it to an ES6 import. Especially true if pthreads is enabled and it generates a web worker.js file. An alternative is to try out WebPack or another bundler but from what I've read and tried, Vite has the best developer experience so far.

I've also setup a few scripts in `package.json` that essentially call nested npm scripts in ./backend and ./frontend that can build + test an environment. What I've learnt is to separate the commands as much as possible since .json doesn't let you do new lines and use `prefix-path` instead of cd since it's a lot cleaner.

# Emscripten Reflection

Emscripten by itself works pretty nicely (Most of the time). 

The main issues I ran into were from weird ES6 vs CommonJS compatibility. I've mentioned most of them in [Emscripten Build Flags](#emscripten-flags).
So far with Emscripten, porting it over to ES6 seems like the only way to get it working with a modern build tool like Vite which all seem to expect ES6 modules instead of CommonJS. I've talked more about this in [Frontend](#es6--typescript--frontend-reflection) but essentially if you want to use CommonJS you either stick it straight into a .html file, you try to use some weird .vite settings to configure CommonJS imports or you try another bundler like WebPack. 

I've also found a hacky method where you edit the .js file output by Emscripten directly and modify it to use ES6 syntax at the very bottom of the file. I found this worked for single-threaded Emscripten but once you include webworker.js it's very hard to get it working because of the way the imports are generated by Emscripten. Note also I ran into issues when trying to rename my files to something other than what Emscripten generated. You can adjust this pretty easily if you don't have optimised output. An issue I ran into with QT CMake is that it automatically optimises the output which makes it harder to do things like this with it.

For Emscripten make sure you load the .js file it outputs with async because it needs time to instantiate the .wasm file. The way you do this depends on which flags you use for the project and where you're loading it eg. in a Node environment vs HTML environment vs React environment. An important distinction is between using or not using the `modularize=1` flag. Without the `modularize=1` flag, Emscripten generates the script in the global scope with default name `Module` unless you've set it to something else with `EXPORT_NAME`. You then simply call `onRunTimeInitialised` (This is essentially a function from the Module wrapper class generated by Emscripten). If you use `modularize=1` then you can initialise multiple instances of the WASM
object which means you should instead just use `await MyModuleName()` instead. Note that the default generated HTML file does not support this and you'll have to modify it. I've found that once you get a proper Frontend setup like React and have a generated workflow the HTML file becomes largely irrelevant. 

A common issue you'll find documented is CORS issue with SharedArrayBuffer if you decide to use pthreads and web workers (Personally I've struggled to get web workers running with QT + Emscripten). A solution if you want to play with standard HTML files is the `qtwasmserver.py` that you can download from Python pip. Emscripten also has a built in tool for this. I've talked about how to resolve this easily in Vite + React in [Frontend](#es6--typescript--frontend-reflection) without needing to setup and certificates.

This is more of a personal note but make sure you link your libraries properly if you're using Embind. I've found that the Embind doesn't actually generate if you don't do this. This means linking your libraries as OBJECT instead of STATIC in CMake.


I've found the best way to pass clases between JavaScript and C++ is to use `.implement()` on an abstract class. What I realised is that if you `.extend()` a JavaScript class on a C++ exported class with Embind, you can't pass this back into a C++ function that expects the base class. You'll get an error along the lines of:

```
Binding Error: Expected Visitor got Visitor
```

I think what happens is `.extend()` creates a JavaScript class that inherits from the C++ class but it's technically a JavaScript wrapper class so you can't pass it back into a C++ function. If you use `.implement()` it constructs the class as a C++ class that calls the JavaScript function so you can pass back into a C++ function. This is my understanding at least but the [official documentation](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html#classes) has more information about this.

Note if you do do this, you won't be able to use instanceof to compare C++ classes with Javascript classes because of Embind wrappers. There should be a way of doing this but I'll have to look into it. So far I've just been hardcoding checking the equality for the class constructor name.


Note for Emscripten Embind it doesn't clean up automatically after you. This is documented in the [official Embind documentation](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html) where automatic deletion comes from a feature in ECMAScript 2021 and relies on the `FinalizationRegistry` API as well as requirements for a shared pointer constructor and they have noted this still does not offer a guarantee for cleanup. It is recommended to manually call `.delete()` for any C++ handlers you've created. 

If you don't use a `smart_pointer_constructor` then I think what happens is Javascript creates everything on the stack so no warning is created even if you don't call `.delete`. If you do use `smart_pointer_constructor` then it creates it on the heap which results in the following message if `.delete()` is not called on the C++ handler:

```md
Embind found a leaked C++ instance PenguinHabitat <0x0080e384>.
      We'll free it automatically in this case, but this functionality is not reliable across various environments.
```

Note this is pure speculation on my part because I haven't dug deep into this yet and I'm not familiar with the JavaScript garbage collector.

# WIP

## Misc

- Include Binaryen (Or alternatives) to view readable WASM file
- Implement TypeScript properly 
- Remember more specific issues I ran into
- Installation instructions for other OS
- Potentially setup a github test runner (Not sure if this is worth since QT takes a loooong time to build)

# Compatibility

Tested on Ubuntu 22.04



