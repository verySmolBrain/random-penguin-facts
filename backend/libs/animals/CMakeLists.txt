# Static vs Dynamic vs Shared Library -> Look Into
add_library(animals OBJECT
    animals.cpp
    animals.h
)

target_link_libraries(animals PRIVATE Qt6::Core)
target_include_directories(animals INTERFACE ${CMAKE_CURRENT_SOURCE_DIR})