import { useWASM } from '../utils/wasm.utils.js';

test('Checks penguin', async () => {
    const wasmInstance = await useWASM();

    expect(wasmInstance.penguin()).toBe("Penguins are excellent swimmers!");
});