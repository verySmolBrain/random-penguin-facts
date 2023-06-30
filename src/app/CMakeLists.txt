# Generates the penguins executable
qt_add_executable(penguin_app_threadless
    mainwindow.ui
    mainwindow.cpp
    main.cpp
)

target_link_libraries(penguin_app_threadless PRIVATE
    cat_facts
    penguin_facts
    Qt6::Widgets
)

set_target_properties(penguin_app_threadless PROPERTIES
    WIN32_EXECUTABLE ON
    MACOSX_BUNDLE ON
)