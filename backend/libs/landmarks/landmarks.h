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
