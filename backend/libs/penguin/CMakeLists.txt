# Static vs Dynamic vs Shared Library -> Look Into
add_library(penguin_facts STATIC
    penguins.cpp 
    penguins.h
)

target_link_libraries(penguin_facts PRIVATE Qt6::Core)
target_include_directories(penguin_facts INTERFACE ${CMAKE_CURRENT_SOURCE_DIR})