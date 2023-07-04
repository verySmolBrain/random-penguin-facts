#include <QtCore/QCoreApplication>
#include <QDebug>

#include <penguins.h>
#include <cats.h>
#include <landmarks.h>

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

    emscripten::class_<Visitor>("Visitor")
        .function("visit", emscripten::select_overload<std::string(CatHabitat*)>(&Visitor::visit), emscripten::pure_virtual(), emscripten::allow_raw_pointers())
        .function("visit", emscripten::select_overload<std::string(PenguinHabitat*)>(&Visitor::visit), emscripten::pure_virtual(), emscripten::allow_raw_pointers())
        .allow_subclass<VisitorWrapper>("VisitorWrapper");

    emscripten::class_<ConcreteVisitor, emscripten::base<Visitor>>("ConcreteVisitor")
        .constructor<>()
        .function("visit", emscripten::select_overload<std::string(CatHabitat*)>(&ConcreteVisitor::visit), emscripten::allow_raw_pointers())
        .function("visit", emscripten::select_overload<std::string(PenguinHabitat*)>(&ConcreteVisitor::visit), emscripten::allow_raw_pointers());

    emscripten::class_<Element>("Element")
        .function("accept", &Element::accept, emscripten::allow_raw_pointers());

    emscripten::class_<CatHabitat, emscripten::base<Element>>("CatHabitat")
        .constructor<>()
        .function("accept", &CatHabitat::accept, emscripten::allow_raw_pointers());

    emscripten::class_<PenguinHabitat, emscripten::base<Element>>("PenguinHabitat")
        .constructor<>()
        .function("accept", &PenguinHabitat::accept, emscripten::allow_raw_pointers());
    
    // emscripten::class_<Interface>("Interface")
    //     .function("invoke", &Interface::invoke, emscripten::pure_virtual())
    //     .allow_subclass<InterfaceWrapper>("InterfaceWrapper");
}