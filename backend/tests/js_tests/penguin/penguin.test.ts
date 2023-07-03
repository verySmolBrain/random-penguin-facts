import { useWASM } from '../utils/wasm.utils';

test('Checks penguin', async () => {
    const WASM_instance = await useWASM();

    expect(WASM_instance.penguin()).toBe("Penguins are excellent swimmers!");
});
