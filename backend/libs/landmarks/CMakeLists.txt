# Static vs Dynamic vs Shared Library -> Look Into
add_library(visiting_landmarks OBJECT
    landmarks.cpp
    landmarks.h
)

target_link_libraries(visiting_landmarks PRIVATE Qt6::Core)
target_include_directories(visiting_landmarks INTERFACE ${CMAKE_CURRENT_SOURCE_DIR})