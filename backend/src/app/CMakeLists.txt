# Generates the penguins executable
qt_add_executable(penguin_app
    mainwindow.ui
    mainwindow.cpp
    main.cpp
)

target_link_libraries(penguin_app PRIVATE
    cat_facts
    penguin_facts
    visiting_landmarks
    why
    Qt6::Widgets
)

set_target_properties(penguin_app PROPERTIES
    WIN32_EXECUTABLE ON
    MACOSX_BUNDLE ON
)