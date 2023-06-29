# Static vs Dynamic vs Shared Library -> Look Into
qt_add_library(helper_functions STATIC
    new_library.cpp
)

target_link_libraries(helper_functions PRIVATE Qt6::Core)
target_include_directories(helper_functions INTERFACE ${CMAKE_CURRENT_SOURCE_DIR})