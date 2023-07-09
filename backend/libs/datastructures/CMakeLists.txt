# Static vs Dynamic vs Shared Library -> Look Into
add_library(why OBJECT
    datastructures.cpp
    datastructures.h
)

target_link_libraries(why PRIVATE Qt6::Core)
target_include_directories(why INTERFACE ${CMAKE_CURRENT_SOURCE_DIR})