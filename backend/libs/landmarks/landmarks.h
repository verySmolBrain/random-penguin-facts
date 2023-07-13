#ifndef LM_H
#define LM_H

#include <iostream>
#include <string>
#include <typeindex>
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

struct ElementWrapper : public emscripten::wrapper<Element> {
    EMSCRIPTEN_WRAPPER(ElementWrapper);
    void accept(Visitor* visitor) {
        call<void>("accept", visitor);
    }
};

class CatHabitat : public Element {
public:
    void accept(Visitor* visitor) override {
        std::cout << visitor->visit(this) << std::endl;
    }

    // bool operator==(const CatHabitat& other) const {
    //     return true;
    // }

    // ~CatHabitat() {
    //     std::cout << "CatHabitat is being destroyed." << std::endl;
    // }
};

class PenguinHabitat : public Element {
public:
    void accept(Visitor* visitor) override {
        std::cout << visitor->visit(this) << std::endl;
    }
};

class FlexibleVisitor : public Visitor {
    std::unordered_map<std::type_index, std::function<std::string()>> callbacks;

public:
    void register_habitat(Element* element, emscripten::val js_func) {
        // wrapper? around std::function and emscripten::val
        auto callback = [js_func]() -> std::string {
            return js_func().as<std::string>();
        };

        callbacks[typeid(*element)] = callback;
    }

    std::string visit(CatHabitat* element) override {
        return "Change this later please. Called FlexibleVisitor visit CatHabitat.";
    }

    std::string visit(PenguinHabitat* element) override {
        return "Change this later please. Called FlexibleVisitor visit PenguinHabitat.";
    }

    std::string visit(Element* element) {
        auto it = callbacks.find(typeid(*element));
        if (it != callbacks.end()) {
            return it->second();
        }
        return "Visitor is visiting Habitat.";
    }
};

EMSCRIPTEN_BINDINGS(main_module) {
    emscripten::class_<Visitor>("Visitor")
        .smart_ptr<std::shared_ptr<Visitor>>("shared_ptr<Visitor>")
        .function("visit", emscripten::select_overload<std::string(CatHabitat*)>(&Visitor::visit), emscripten::pure_virtual(), emscripten::allow_raw_pointers())
        .function("visit", emscripten::select_overload<std::string(PenguinHabitat*)>(&Visitor::visit), emscripten::pure_virtual(), emscripten::allow_raw_pointers())
        .allow_subclass<VisitorWrapper>("VisitorWrapper");

    emscripten::class_<ConcreteVisitor, emscripten::base<Visitor>>("ConcreteVisitor")
        .smart_ptr_constructor("ConcreteVisitor", &std::make_shared<ConcreteVisitor>)
        .function("visit", emscripten::select_overload<std::string(CatHabitat*)>(&ConcreteVisitor::visit), emscripten::allow_raw_pointers())
        .function("visit", emscripten::select_overload<std::string(PenguinHabitat*)>(&ConcreteVisitor::visit), emscripten::allow_raw_pointers());

    emscripten::class_<Element>("Element")
        .smart_ptr<std::shared_ptr<Element>>("shared_ptr<Element>")
        .function("accept", &Element::accept, emscripten::allow_raw_pointers())
        .allow_subclass<ElementWrapper, std::shared_ptr<ElementWrapper>>("ElementWrapper", "ElementWrapperPtr");

    emscripten::class_<CatHabitat, emscripten::base<Element>>("CatHabitat")
        .smart_ptr_constructor("CatHabitat", &std::make_shared<CatHabitat>)
        .function("accept", &CatHabitat::accept, emscripten::allow_raw_pointers());

    emscripten::class_<PenguinHabitat, emscripten::base<Element>>("PenguinHabitat")
        .smart_ptr_constructor("PenguinHabitat", &std::make_shared<PenguinHabitat>)
        .function("accept", &PenguinHabitat::accept, emscripten::allow_raw_pointers());
    
    emscripten::class_<FlexibleVisitor, emscripten::base<Visitor>>("FlexibleVisitor")
        .smart_ptr_constructor("FlexibleVisitor", &std::make_shared<FlexibleVisitor>)
        .function("register_habitat", &FlexibleVisitor::register_habitat, emscripten::allow_raw_pointers())
        .function("visit", emscripten::select_overload<std::string(Element*)>(&FlexibleVisitor::visit), emscripten::allow_raw_pointers());

    emscripten::register_vector<std::shared_ptr<Element>>("VectorHabitat");
}

#endif