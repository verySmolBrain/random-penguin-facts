# Static vs Dynamic vs Shared Library -> Look Into
add_library(cat_facts STATIC
    cats.cpp
    cats.h
)

target_link_libraries(cat_facts PRIVATE Qt6::Core)
target_include_directories(cat_facts INTERFACE ${CMAKE_CURRENT_SOURCE_DIR})