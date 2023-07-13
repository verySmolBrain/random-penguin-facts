#ifndef AN_H
#define AN_H

#include <emscripten/bind.h>
#include <iostream>

class Animal {
public:
    virtual void speak() = 0;
};

class Penguin : public Animal {
private:
    std::string voice = "Penguin is speaking.";
    std::string name;

public:
    Penguin(const std::string& name) : name(name) {}

    void speak() override {
        std::cout << this->voice << std::endl;
    }

    bool operator==(const Penguin& other) const {
        return this->name == other.name;
    }

    bool operator==(const emscripten::val& other) const {
        
    }
};

class Cat : public Animal {
private:
    std::string voice = "Cat is speaking.";
    std::string name;

public:
    Cat(const std::string& name) : name(name) {}
    
    void speak() override {
        std::cout << this->voice << std::endl;
    }
    
    bool operator==(Cat * other) const {
        std::cout << "Cat" << std::endl;
        return this->name == other->name;
    }

    bool operator==(const emscripten::val& other) const {
        std::cout << "emscripten::val" << std::endl;
        return false;
    }
};

std::shared_ptr<Cat> createCat(const std::string& name) {
    return std::make_shared<Cat>(name);
}

std::shared_ptr<Penguin> createPenguin(const std::string& name) {
    return std::make_shared<Penguin>(name);
}

EMSCRIPTEN_BINDINGS(cat_class) {
    // emscripten::val? ["cat"]

    emscripten::class_<Cat>("Cat")
        .smart_ptr_constructor("Cat", &createCat)
        .function("speak", &Cat::speak)
        .function("equals", emscripten::select_overload<bool(Cat *) const>(&Cat::operator==), emscripten::allow_raw_pointers())
        .function("equals", emscripten::select_overload<bool(const emscripten::val&) const>(&Cat::operator==))
        ;
    
    emscripten::class_<Penguin>("Penguin")
        .smart_ptr_constructor("Penguin", &createPenguin)
        .function("speak", &Penguin::speak)
        
        .function("equals", emscripten::select_overload<bool(const Penguin&) const>(&Penguin::operator==))
        .function("equals", emscripten::select_overload<bool(const emscripten::val&) const>(&Penguin::operator==))
        ;
}

#endif