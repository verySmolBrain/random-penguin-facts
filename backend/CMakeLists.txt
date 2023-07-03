# Minimum CMake version required
cmake_minimum_required(VERSION 3.21.1)

# Project Name | Version Number | Language
project(penguins_app VERSION 0.0.1 LANGUAGES CXX)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Import Qt6
find_package(Qt6 REQUIRED COMPONENTS Widgets)
qt_standard_project_setup()

# Add subdirectories
add_subdirectory(src/app)
add_subdirectory(libs)