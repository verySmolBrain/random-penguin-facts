import { useEffect, useState } from "react";
import useWasm from "../utils/useWasm.js";
import Module from "../utils/penguin_app_threadless.js";

interface YourOutputMethods {
    penguin: () => string;
    cat: () => string;
}

export const useYourOutput = () => {
    const module = useWasm<YourOutputMethods>(Module);

    const [output, setOutput] = useState<string | null>(null);

    useEffect(() => {
        if (module) {
            console.log(module)

            console.log(Module)

            const result = module.cat();
            setOutput(result);
        }
    }, [module]);
    
    return output;
};