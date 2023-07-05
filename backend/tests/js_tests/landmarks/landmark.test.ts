import { useWASM } from '../utils/wasm.utils.js';

test('Checks landmark', async () => {
    const WASM_instance = await useWASM();

    let visitor = new WASM_instance.ConcreteVisitor();

    let catHabitat = new WASM_instance.CatHabitat();
    let penguinHabitat = new WASM_instance.PenguinHabitat();
    
    catHabitat.accept(visitor);
    penguinHabitat.accept(visitor);
});

test("Check memory is garbage collected properly", async () => {
    const WASM_instance = await useWASM();
    // @ts-ignore
    let visitor = new WASM_instance.ConcreteVisitor();

    console.log("Initial memory usage: ", process.memoryUsage().heapUsed);

    for (let i = 0; i < 10000; i++) {
    { // start new scope

        // @ts-ignore
        let catHabitat = new WASM_instance.CatHabitat();
        // @ts-ignore
        let penguinHabitat = new WASM_instance.PenguinHabitat();

        catHabitat.delete();
        penguinHabitat.delete();
    } // end scope

    if (i % 1000 === 0) {
        if (global.gc) {
            global.gc();  // manually trigger garbage collection
        }
        console.log("Memory usage after", i, "iterations: ", process.memoryUsage().heapUsed);
    }
    }

    console.log("Final memory usage: ", process.memoryUsage().heapUsed);

    /* 
        This is without shared pointers. Note it varies:
            Using delete: Final memory usage:  166048472
            Without delete: Final memory usage:  166121840
        

        WIP create a bigger datastructure so this is more notable
        Log deconstructor later
    */
})

const WASM_instance = await useWASM();

// @ts-ignore
class CatHabitat extends WASM_instance.CatHabitat {
    // Update this to use TypeScript
    getClassName() : string {
        return "PenguinHabitat"
    }
}

// @ts-ignore
class PenguinHabitat extends WASM_instance.PenguinHabitat {
    // Update this to use TypeScript
    getClassName() : string {
        return "PenguinHabitat"
    }
}

let x = {
    visit: function(habitat: CatHabitat | PenguinHabitat | object) {
        // Figure out a way to not hardcode this
        if (habitat.constructor.name === "CatHabitat") {
            return 'CatHabitat is \$10 CatBucks';
        } else if (habitat.constructor.name === "PenguinHabitat") {
            return 'PenguinHabitat is \$7 PenguinBucks';
        } 

        return "Visit function given non-habitat"
    }
}

// let PriceVisitor = WASM_instance.Visitor.implement(x);

test('Checks landmark run with Javascript Classes', async () => {
    /**
     * Visitor pattern. visitor is a class that implements the visitor interface
     * from C++ (The visit function). It is passed into the accept function of the habitat 
     * which is a C++ class that takes in a C++ Visitor interface.
     * 
     * Example of passing things between C++ and Javascript.
     */
    const WASM_instance = await useWASM();

    let PriceVisitor = WASM_instance.Visitor.implement(x);

    // @ts-ignore
    let catHabitat = new WASM_instance.CatHabitat();
    // @ts-ignore
    let penguinHabitat = new WASM_instance.PenguinHabitat();
    
    catHabitat.accept(PriceVisitor);
    penguinHabitat.accept(PriceVisitor);
});

// Try to remove smart_ptr_constructor and see if it still works?