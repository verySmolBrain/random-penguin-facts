import { useWASM } from '../utils/wasm.utils.js';

test('Checks cat', async () => {
    const WASM_instance = await useWASM();

    expect(WASM_instance.cat()).toBe("Cats like fish!");
});