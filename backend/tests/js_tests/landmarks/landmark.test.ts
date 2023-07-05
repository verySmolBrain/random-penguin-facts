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

    for (let i = 0; i < 10000; i++) {
        { // start new scope
            // @ts-ignore
            let catHabitat = new WASM_instance.CatHabitat();
            // @ts-ignore
            let penguinHabitat = new WASM_instance.PenguinHabitat();

            // catHabitat.delete();
            // penguinHabitat.delete();
        } // end scope
    }

    // @ts-ignore
    let penguinHabitat = new WASM_instance.PenguinHabitat();
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
     * Visitor pattern. PriceVisitor implements the visitor interface
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
// Capture stdout later instead of random printing in test