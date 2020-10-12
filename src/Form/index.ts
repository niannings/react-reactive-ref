import createReactive from "../reactive";

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

const useForm = createReactive<
    {
        errors: Record<string, string>;
    },
    IFormItemOptions
>(() => ({ errors: {} }));

// 校验插件
useForm.use(
    {
        registerd: ({ custom, name }) => {
            custom?.bind(`errors.${name}`)
        }
    },
    {
        beforeChange: ({ value, name, custom, options = {} }) => {
            const onError = (msg?: string) => {
                custom.emit(`errors.${name}`, msg);
            }
            if (options.required) {
                if (!value) {
                    return onError(
                        options?.$validMessages?.required || "请输入"
                    );
                }
            }

            if (options.pattern) {
                if (!options.pattern.test(value)) {
                    return onError(
                        options?.$validMessages?.pattern || "pattern invalid"
                    );
                }
            }

            if (options.maxLength !== undefined) {
                if (value?.length > options.maxLength) {
                    return onError(
                        options.$validMessages?.maxLength ||
                            name + " more than maxLength: " + options.maxLength
                    );
                }
            }

            if (options.minLength !== undefined) {
                if (value?.length < options.minLength) {
                    return onError(
                        options.$validMessages?.minLength ||
                            name + " less than minLength: " + options.maxLength
                    );
                }
            }

            if (options.$validators?.length) {
                for (let validator of options.$validators) {
                    const msg = validator(value);
                    if (msg !== true) {
                        return onError(msg as string)
                    }
                }
            }

            onError();
        },
    },
);

export default useForm;
