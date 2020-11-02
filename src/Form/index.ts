import createReactive from "../reactive";
import { PluginValidate } from "./Plugin/validate";

interface IFormItemOptions {
    required?: boolean;
    pattern?: RegExp;
    maxLength?: number;
    minLength?: number;
    $validMessages?: Partial<
        Record<"required" | "pattern" | "maxLength" | "minLength", string>
    >;
    $validators?: Array<(value: any) => boolean | string | void>;
}

const useFormReactive = createReactive<IFormItemOptions>();

export type FormPlugin = Parameters<typeof useFormReactive.use>[0];

// 校验插件
useFormReactive.use(PluginValidate);

export default function useForm<Data extends object = object>(
    initialData?: Data
) {
    interface Formutils {
        errors: {};
        setValue: (path: any, value: any) => void;
        setError: (name: any, value: any) => void;
        batchDirty: (dirty: any) => void;
    }

    const formutils = useFormReactive<Data, Formutils>(initialData, (emit) => {
        const utils = {
            errors: {},
            setValue: (path, value) => {
                if (path) {
                    emit(path, value);
                }
            },
            setError: (name, value) => {
                if (name) {
                    emit(`errors.${name}`, value);
                }
            },
            batchDirty: (dirty) => {
                dirty ? emit("batchDirty") : emit("clearDirty");
            },
        };

        return utils;
    });

    return formutils;
}
