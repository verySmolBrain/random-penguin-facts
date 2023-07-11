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
        // habitatVector.push_back(new DogHabitat()); -> Passing raw pointer to smart pointer is illegal
    }

    let visitor = new wasmInstance.ConcreteVisitor();
    for (let i = 0; i < habitatVector.size(); i++) {
        let penguinHabitat = habitatVector.get(i);
        penguinHabitat.accept(visitor);
        penguinHabitat.delete();
    }

    for (let i = 0; i < habitatVector.size(); i++) {
        habitatVector.get(i).delete();
    }

    habitatVector.delete();
    visitor.delete();
});



// test('Check equality', async () => {
//         /**
//      * Visitor pattern. PriceVisitor implements the visitor interface
//      * from C++ (The visit function). It is passed into the accept function of the habitat 
//      * which is a C++ class that takes in a C++ Visitor interface.
//      * 
//      * Example of passing things between C++ and Javascript.
//      */
//     const wasmInstance = await useWASM();

//     let RatingVisitorClass = wasmInstance.Visitor.extend("Visitor", {
//         visit: function(habitat: CatHabitat | PenguinHabitat | object) {
//             // Figure out a way to not hardcode this
//             // Check if it has .equals

//             if (habitat.constructor.name === "CatHabitat") {
//                 return 'CatHabitat is 5 CatStars';
//             } else if (habitat.constructor.name === "PenguinHabitat") {
//                 return 'PenguinHabitat is 5 PenguinStars';
//             } 
    
//             return "Visit function given non-habitat"
//         }
//     });

//     let RatingVisitor = new RatingVisitorClass();

//     // @ts-ignore
//     let catHabitat = new wasmInstance.CatHabitat();
//     // @ts-ignore
//     let penguinHabitat = new wasmInstance.PenguinHabitat();
    
//     catHabitat.accept(RatingVisitor);
//     penguinHabitat.accept(RatingVisitor);

//     let catHabitat2 = new wasmInstance.CatHabitat();

//     console.log(catHabitat.equals(catHabitat2));
//     console.log(catHabitat.equals(penguinHabitat));

//     catHabitat.delete();
//     penguinHabitat.delete();
//     catHabitat2.delete();
// });





// Make a Vector of CatHabitats and have a visitor visit all of them
// Make a more complex class that stores data and try using equality
// Play around with static functions and see what that offers
// Play around with overloaded functions and see what that offers
// Play around with friend functions and see what that offers
// Play around with emscripten::val and see what that offers



// shared_pointer means you have to delete when you get otherwise it's not actually deleted
// for (let i = 0; i < habitatVector.size(); i++) {
//     let penguinHabitat = habitatVector.get(i);
//     penguinHabitat.accept(visitor);
//     penguinHabitat.delete();
// }

// Passing raw pointer to smart pointer is illegal
// You have to use a pointer for each habitat if you want dynamic polymorphism
// vite revert version nested worker