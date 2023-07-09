import { useWASM } from '../utils/wasm.utils.js';

test('Checks vector string', async () => {
    const wasmInstance = await useWASM();
    
    const vector = new wasmInstance.VectorString();
    vector.push_back("Hello");
    vector.push_back("World");

    expect(vector.get(0)).toBe("Hello");
    expect(vector.get(1)).toBe("World");
});

test('Checks hashmap string', async () => {
    const wasmInstance = await useWASM();
    
    const hashmap = new wasmInstance.UnorderedMapStringString();
    hashmap.set("Hello", "World");

    expect(hashmap.get("Hello")).toBe("World");
});