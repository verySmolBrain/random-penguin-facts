import wasm_module from '../../../build/src/app/penguin_app.js'

async function useWASM() {
    return await wasm_module();
}

export { useWASM };