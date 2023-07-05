import { useWASM } from '../utils/wasm.utils.js';

test('Checks cat', async () => {
    const WASM_instance = await useWASM();
    console.log(WASM_instance)

    expect(WASM_instance.cat()).toBe("Cats like fish!");
});