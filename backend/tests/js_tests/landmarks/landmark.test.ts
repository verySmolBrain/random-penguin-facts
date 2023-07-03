import { useWASM } from '../utils/wasm.utils';

test('Checks penguin', async () => {
    const WASM_instance = await useWASM();

    let visitor = new WASM_instance.ConcreteVisitor();

    // Instantiate CatHabitat and PenguinHabitat
    let catHabitat = new WASM_instance.CatHabitat();
    let penguinHabitat = new WASM_instance.PenguinHabitat();

    console.log("AAA")
    
    // Call accept method of habitats
    catHabitat.accept(visitor); // Outputs: "Visitor is visiting CatHabitat."
    penguinHabitat.accept(visitor);
});

