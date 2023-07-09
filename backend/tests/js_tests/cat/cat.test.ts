import { useWASM } from '../utils/wasm.utils.js';

test('Checks cat', async () => {
    const wasmInstance = await useWASM();
    
    expect(wasmInstance.cat()).toBe("Cats like fish!");
});