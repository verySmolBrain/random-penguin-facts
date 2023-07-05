#include <iostream>
#include <string>
#include <emscripten/bind.h>

class CatHabitat;
class PenguinHabitat;

class Visitor {
public:
    virtual ~Visitor() {}

    virtual std::string visit(CatHabitat* element) = 0;
    virtual std::string visit(PenguinHabitat* element) = 0;
};

struct VisitorWrapper : public emscripten::wrapper<Visitor> {
    EMSCRIPTEN_WRAPPER(VisitorWrapper);
    std::string visit(CatHabitat* element) {
        return call<std::string>("visit", element);
    }
    std::string visit(PenguinHabitat* element) {
        return call<std::string>("visit", element);
    }
};

// struct Interface {
//     virtual ~Interface() {}

//     virtual void invoke(const std::string& str) = 0;
// };

// struct InterfaceWrapper : public emscripten::wrapper<Interface> {
//     EMSCRIPTEN_WRAPPER(InterfaceWrapper);
//     void invoke(const std::string& str) {
//         return call<void>("invoke", str);
//     }
// };

class ConcreteVisitor : public Visitor {
public:
    std::string visit(CatHabitat* element) override {
        return "Visitor is visiting CatHabitat.";
    }

    std::string visit(PenguinHabitat* element) override {
        return "Visitor is visiting PenguinHabitat.";
    }
};

class Element {
public:
    virtual ~Element() {}

    virtual void accept(Visitor* visitor) = 0;
};

class CatHabitat : public Element {
public:
    void accept(Visitor* visitor) override {
        std::cout << visitor->visit(this) << std::endl;
    }
};

class PenguinHabitat : public Element {
public:
    void accept(Visitor* visitor) override {
        std::cout << visitor->visit(this) << std::endl;
    }
};

EMSCRIPTEN_BINDINGS(main_module) {
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

// Fix CMake binding issue

// Abstract Classes Implementation -> Shared Pointers
// Extending a C++ Class in Javascript and Passing it Back Into C++
// Object Lifetime (Check whether destructor is called) -> Look into exit
// Containers like Vectors