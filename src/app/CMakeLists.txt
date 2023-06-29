# Generates the penguins executable
qt_add_executable(penguins
    mainwindow.ui
    mainwindow.cpp
    main.cpp
)

target_link_libraries(penguins PRIVATE Qt6::Widgets)

set_target_properties(penguins PROPERTIES
    WIN32_EXECUTABLE ON
    MACOSX_BUNDLE ON
)