import { FormPlugin } from '../index';

export const PluginValidate: FormPlugin = {
    registerd: (config, run) => {
        const { custom, name, on } = config;
        custom.bind(`errors.${name}`);
        on(
            'batchDirty',
            () => {
                run('beforeChange', {
                    ...config,
                    value: config.dataGetter(config.name),
                });
            },
            `${name}__dirty`
        );
    },
    beforeChange: (() => {
        let showMsg = true;

        return (config, run) => {
            const { value, name, custom, on, options = {} } = config;
            on(
                'clearDirty',
                () => {
                    showMsg = false;
                    run('beforeChange', config);
                    showMsg = true;
                },
                `${name}__undirty`
            );
            const onError = (msg?: string) => {
                custom.emit(`errors.${name}`, showMsg ? msg : undefined);
            };
            if (options.required) {
                if (!value) {
                    return onError(
                        options?.$validMessages?.required || '请输入'
                    );
                }
            }

            if (options.pattern) {
                if (!options.pattern.test(value)) {
                    return onError(
                        options?.$validMessages?.pattern || 'pattern invalid'
                    );
                }
            }

            if (options.maxLength !== undefined) {
                if ((value?.length | 0) > options.maxLength) {
                    return onError(
                        options.$validMessages?.maxLength ||
                            name + ' more than maxLength: ' + options.maxLength
                    );
                }
            }

            if (options.minLength !== undefined) {
                if ((value?.length | 0) < options.minLength) {
                    return onError(
                        options.$validMessages?.minLength ||
                            name + ' less than minLength: ' + options.maxLength
                    );
                }
            }

            if (options.$validators?.length) {
                for (let validator of options.$validators) {
                    const msg = validator(value);
                    if (msg !== true) {
                        return onError(msg as string);
                    }
                }
            }

            onError();
        };
    })(),
};
