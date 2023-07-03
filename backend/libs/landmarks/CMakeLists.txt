# Static vs Dynamic vs Shared Library -> Look Into
qt_add_library(visiting_landmarks STATIC
    landmarks.cpp
    landmarks.h
)

target_link_libraries(visiting_landmarks PRIVATE Qt6::Core)
target_include_directories(visiting_landmarks INTERFACE ${CMAKE_CURRENT_SOURCE_DIR})