import { useWASM } from '../utils/wasm.utils.js';

// @ts-ignore
let consoleOutput = [];
// @ts-ignore
let originalLog;

// beforeEach(() => {
//     originalLog = console.log;
//     console.log = (output) => consoleOutput.push(output);
// });
  
// afterEach(() => {
//     expect(consoleOutput).toMatchSnapshot();

//     consoleOutput = [];
//     console.log = originalLog;
// });

test('Checks landmark', async () => {
    const wasmInstance = await useWASM();

    let visitor = new wasmInstance.ConcreteVisitor();

    let catHabitat = new wasmInstance.CatHabitat();
    let penguinHabitat = new wasmInstance.PenguinHabitat();
    
    catHabitat.accept(visitor);
    penguinHabitat.accept(visitor);

    catHabitat.delete();
    penguinHabitat.delete();
    visitor.delete();
});

test("Check memory is garbage collected properly", async () => {
    const wasmInstance = await useWASM();
    // @ts-ignore
    let visitor = new wasmInstance.ConcreteVisitor();

    for (let i = 0; i < 10000; i++) {
        { // start new scope
            // @ts-ignore
            let catHabitat = new wasmInstance.CatHabitat();
            // @ts-ignore
            let penguinHabitat = new wasmInstance.PenguinHabitat();

            catHabitat.delete();
            penguinHabitat.delete();
        } // end scope
    }

    // @ts-ignore
    let penguinHabitat = new wasmInstance.PenguinHabitat();

    penguinHabitat.delete();
    visitor.delete();
})

const wasmInstance = await useWASM();

// @ts-ignore
class CatHabitat extends wasmInstance.CatHabitat {
    // Update this to use TypeScript and as a wrapper function
    getClassName() : string {
        return "PenguinHabitat"
    }
}

// @ts-ignore
class PenguinHabitat extends wasmInstance.PenguinHabitat {
    // Update this to use TypeScript and as a wrapper function
    getClassName() : string {
        return "PenguinHabitat"
    }
}

test('Checks landmark run with Javascript Classes using implement', async () => {
    /**
     * Visitor pattern. PriceVisitor implements the visitor interface
     * from C++ (The visit function). It is passed into the accept function of the habitat 
     * which is a C++ class that takes in a C++ Visitor interface.
     * 
     * Example of passing things between C++ and Javascript.
     */
    const wasmInstance = await useWASM();

    let x = {
        visit: function(habitat: CatHabitat | PenguinHabitat | object) {
            if (habitat.constructor.name === "CatHabitat") {
                return 'CatHabitat is \$10 CatBucks';
            } else if (habitat.constructor.name === "PenguinHabitat") {
                return 'PenguinHabitat is \$7 PenguinBucks';
            } 
    
            return "Visit function given non-habitat"
        }
    }

    let PriceVisitor = wasmInstance.Visitor.implement(x);

    // @ts-ignore
    let catHabitat = new wasmInstance.CatHabitat();
    // @ts-ignore
    let penguinHabitat = new wasmInstance.PenguinHabitat();
    
    catHabitat.accept(PriceVisitor);
    penguinHabitat.accept(PriceVisitor);

    catHabitat.delete();
    penguinHabitat.delete();
});

test('Checks landmark run with Javascript Classes using extend', async () => {
    /**
     * Visitor pattern. PriceVisitor implements the visitor interface
     * from C++ (The visit function). It is passed into the accept function of the habitat 
     * which is a C++ class that takes in a C++ Visitor interface.
     * 
     * Example of passing things between C++ and Javascript.
     */
    const wasmInstance = await useWASM();

    let RatingVisitorClass = wasmInstance.Visitor.extend("Visitor", {
        visit: function(habitat: CatHabitat | PenguinHabitat | object) {
            // Figure out a way to not hardcode this
            if (habitat instanceof wasmInstance.CatHabitat) {
                return 'CatHabitat is 5 CatStars';
            } else if (habitat instanceof wasmInstance.PenguinHabitat) {
                return 'PenguinHabitat is 5 PenguinStars';
            } 

            return "Visit function given non-habitat"
        }
    });

    let RatingVisitor = new RatingVisitorClass();

    // @ts-ignore
    let catHabitat = new wasmInstance.CatHabitat();
    // @ts-ignore
    let penguinHabitat = new wasmInstance.PenguinHabitat();
    
    catHabitat.accept(RatingVisitor);
    penguinHabitat.accept(RatingVisitor);

    let nonHabitat = {};

    console.log(RatingVisitor.visit(nonHabitat));

    catHabitat.delete();
    penguinHabitat.delete();
});

test('Checks can also extend habitat', async () => {
    const wasmInstance = await useWASM();

    let DogHabitat = wasmInstance.Element.extend("DogHabitat", {
        accept: function(visitor: object) {
            // @ts-ignore
            if (visitor?.visit) {
                // @ts-ignore
                console.log(visitor.visit(this));
            } else {
                console.log("Visitor does not have visit function")
            }
        }
    });

    let RatingVisitorClass = wasmInstance.Visitor.extend("Visitor", {
        visit: function(habitat: CatHabitat | PenguinHabitat | object) {
            // Figure out a way to not hardcode this
            if (habitat instanceof wasmInstance.CatHabitat) {
                return 'CatHabitat is 5 CatStars';
            } else if (habitat instanceof wasmInstance.PenguinHabitat) {
                return 'PenguinHabitat is 5 PenguinStars';
            } else if (habitat instanceof DogHabitat) {
                return 'DogHabitat is 5 DogStars';
            }

            return "Visit function given non-habitat"
        }
    });

    let dogHabitat = new DogHabitat();
    let ratingVisitor = new RatingVisitorClass();

    dogHabitat.accept(ratingVisitor);
});

test('Vector of penguin habitats', async () => {
    const wasmInstance = await useWASM();

    // @ts-ignore
    let DogHabitat = wasmInstance.Element.extend("DogHabitat", {
        accept: function(visitor: object) {
            // @ts-ignore
            if (visitor?.visit) {
                // @ts-ignore
                console.log(visitor.visit(this));
            } else {
                console.log("Visitor does not have visit function")
            }
        }
    });

    let habitatVector = new wasmInstance.VectorHabitat();
    for (let i = 0; i < 1; i++) {
        let penguinHabitat = new wasmInstance.PenguinHabitat();
        habitatVector.push_back(penguinHabitat);
        penguinHabitat.delete();
    }

    // -> Passing raw pointer to smart pointer is illegal
    habitatVector.push_back(new DogHabitat());

    let visitor = new wasmInstance.FlexibleVisitor();
    let dogHabitat = new DogHabitat();
    visitor.register_habitat(dogHabitat, function() : string {
        return "DogHabitat is 5 DogStars";
    })

    for (let i = 0; i < habitatVector.size(); i++) {
        let habitat = habitatVector.get(i);
        habitat.accept(visitor);
        habitat.delete();
    }

    for (let i = 0; i < habitatVector.size(); i++) {
        habitatVector.get(i).delete();
    }

    // habitatVector.delete();
    // visitor.delete();
});

test('Check equality', async () => {
    const wasmInstance = await useWASM();

    let cat = new wasmInstance.Cat("Puss in Boots");
    let cat2 = new wasmInstance.Cat("Tom")
    let penguin = new wasmInstance.Penguin("Alfred");

    let object = {}

    console.log(cat.equals(cat))
    console.log(cat.equals(cat2))
    console.log(penguin.equals(penguin))

    console.log(cat.equals(object))

    // cat.delete()
    // cat2.delete()
    // penguin.delete()
});





// shared_pointer means you have to delete when you get otherwise it's not actually deleted
// for (let i = 0; i < habitatVector.size(); i++) {
//     let penguinHabitat = habitatVector.get(i);
//     penguinHabitat.accept(visitor);
//     penguinHabitat.delete();
// }
// weak pointer but that doesn't exactly manage memory?
// export a weak pointer and assign it?
// BindingError: Expected null or instance of PenguinHabitat, got an instance of Element
// It works if you don't use a shared pointer but instead a normal pointer
// There's a fix if you do wrapperptr instead

// Note DogHabitat returns a raw pointer instead of a shared pointer for construction
// ConcreteVisitor takes in Element but because there's no upcasting it doesn't work and
// you get error. What if instead of overloads I just use Element + Dynamic Cast + callback function?

// So make a class that stores a hashmap of habitats -> callback function and it does stuff

// FlexibleVisitor -> Inherited overload
// Overloading equality js vs c++ other options
// Shared pointer issue + C++17 deprecation of std::auto_ptr
// Passing raw pointer to smart pointer is illegal so do abstract class wrapper so extend returns smart pointer
// You have to use a pointer for each habitat if you want dynamic polymorphism
// jest snapshot test
// doghabitat and pricevisitor
// vite revert version nested worker