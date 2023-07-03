import wasm_module from '../build/src/app/penguin_app.js'

async function useWASM() {
    return await wasm_module();
}

test('Checks cat', async () => {
    const WASM_instance = await useWASM();

    expect(WASM_instance.cat()).toBe("Cats like fish!");
});

test('Checks penguin', async () => {
    const WASM_instance = await useWASM();

    expect(WASM_instance.penguin()).toBe("Penguins are excellent swimmers!");
});