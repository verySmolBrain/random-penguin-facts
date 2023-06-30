#include <QtCore/QCoreApplication>
#include <QDebug>

#include <penguins.h>
#include <cats.h>

#include <emscripten/bind.h>

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QString mStr = "Hello World";

    qDebug() << mStr;

    qDebug() << "Hello Testing";

    qDebug() << generate_penguin_fact().c_str();

    qDebug() << generate_cat_fact().c_str();

    qDebug() << "Hello Again";

    return a.exec();
}

EMSCRIPTEN_BINDINGS(main_module) {
    emscripten::function("penguin_main", &generate_penguin_fact);
    emscripten::function("cat_main", &generate_cat_fact);
}