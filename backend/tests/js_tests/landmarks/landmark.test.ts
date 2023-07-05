import { useWASM } from '../utils/wasm.utils.js';

// const WASM_instance = await useWASM();

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
    */
})




// class CatHabitat extends WASM_instance.CatHabitat {
//     // Update this to use TypeScript
// }

// class PenguinHabitat extends WASM_instance.PenguinHabitat {
//     // Update this to use TypeScript
// }

// var PriceVisitor = WASM_instance.Visitor.extend("Visitor", {
//     __construct: function() {
//         this.__parent.__construct.call(this);
//     },
//     __destruct: function() {
//         this.__parent.__destruct.call(this);
//     },
//     visit: function(habitat: CatHabitat | PenguinHabitat) {
//         if (habitat instanceof WASM_instance.CatHabitat) {
//             return 'CatHabitat is \$10 CatBucks';
//         } else if (habitat instanceof WASM_instance.PenguinHabitat) {
//             return 'PenguinHabitat is \$7 PenguinBucks';
//         } else {
//             console.log("I am called")
//         }
//     }
// });


test('Checks landmark run with Javascript Classes', async () => {
    // const WASM_instance = await useWASM();

    // let visitor = new PriceVisitor();
    // let catHabitat = new WASM_instance.CatHabitat();
    // let penguinHabitat = new WASM_instance.PenguinHabitat();

    // console.log("AAA")
    
    // catHabitat.accept(visitor);
    // penguinHabitat.accept(visitor);
});

// Extend doesn't work because Visitor != Visitor?
// Don't think it's possible for some scenarios https://github.com/emscripten-core/emscripten/issues/7200