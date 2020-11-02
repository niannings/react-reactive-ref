import { useState, useRef, useMemo, useEffect } from 'react';
import createEventEmitter from '../eventEmitter';
import { get, set } from '../utils';

export * from './Watch';

function createReactive<
    RegisterOptions extends object = object,
    StableCustomData extends object = object
>(
    stableInitialCustomData?: (
        emit: ReturnType<typeof createEventEmitter>['emit']
    ) => StableCustomData
) {
    interface ICustom {
        bind: (name: string) => void;
        emit: ReturnType<typeof createEventEmitter>['emit'];
        getter: (name: string) => any;
    }
    interface IReactivePluginConfig {
        value?: any;
        name?: string;
        data?: any;
        dataGetter?: (name?: string) => any;
        custom?: ICustom;
        options?: RegisterOptions;
        on: ReturnType<typeof createEventEmitter>['on'];
        emit: ReturnType<typeof createEventEmitter>['emit'];
    }
    type PluginHook = (
        options: IReactivePluginConfig,
        run: typeof runPlugin
    ) => void;
    interface IReactivePlugin {
        registerd?: PluginHook;
        beforeChange?: PluginHook;
        onChange?: PluginHook;
    }

    const runPlugin = (
        name: keyof IReactivePlugin,
        config: IReactivePluginConfig
    ) =>
        useReactiveRef.plugins.forEach((plugin) =>
            plugin[name]?.(config, runPlugin)
        );

    function useReactiveRef<
        Data extends object = object,
        CustomData extends StableCustomData = StableCustomData
    >(
        initialData?: Data,
        initialCustomData?: (
            emit: ReturnType<typeof createEventEmitter>['emit']
        ) => CustomData & StableCustomData
    ) {
        const [, update] = useState();
        const { current: data } = useRef(initialData || {});
        const emitter = useMemo<ReturnType<typeof createEventEmitter>>(
            () => createEventEmitter(),
            []
        );
        const { current: prefix } = useRef(Date.now().toString(16));
        const [customData] = useState<CustomData & StableCustomData>(() => {
            let data: CustomData & StableCustomData = {} as CustomData &
                StableCustomData;

            if (stableInitialCustomData) {
                Object.assign(data, stableInitialCustomData(emitter.emit));
            }

            if (initialCustomData) {
                Object.assign(data, initialCustomData(emitter.emit));
            }

            return data;
        });
        const { current: custom } = useRef<ICustom>({
            bind: (name: string) =>
                emitter.on(
                    name,
                    (value) => set(customData, name, value),
                    `${prefix}__${name}__custom`
                ),
            getter: (prop?: string) =>
                prop ? get(customData, prop) : customData,
            emit: emitter.emit,
        });

        const dataGetter = (prop?: string) => (prop ? get(data, prop) : data);
        const reactive = <T = any>(
            dataRef: T,
            name?: string,
            options?: RegisterOptions
        ) => {
            if (name) {
                emitter.on(
                    name,
                    (value) => {
                        const config = {
                            value,
                            name,
                            data,
                            options,
                            custom,
                            on: emitter.on,
                            emit: emitter.emit,
                            dataGetter,
                        };
                        runPlugin('beforeChange', config);
                        set(dataRef, name, value);
                        runPlugin('onChange', config);
                    },
                    `${prefix}__${name}`
                );
            }

            runPlugin('registerd', {
                name,
                options,
                custom,
                on: emitter.on,
                emit: emitter.emit,
                dataGetter,
            });

            return {
                name,
                on: emitter.on,
                emit: emitter.emit,
                dataGetter,
                customGetter: custom.getter,
            };
        };
        const register = (name?: string, options?: RegisterOptions) =>
            reactive(data, name, options);
        const watch = (name?: string) => {
            const tag = `${prefix}__${name}__watch`;

            if (name === undefined) {
                emitter.on(createEventEmitter.__ON_CHANGE__, update, tag);

                return data;
            }

            emitter.on(name, update, tag);

            return dataGetter(name);
        };

        return { register, watch, dataGetter, ...customData };
    }

    useReactiveRef.plugins = [] as IReactivePlugin[];
    useReactiveRef.use = (...plugins: IReactivePlugin[]) =>
        useReactiveRef.plugins.push(...plugins);

    return useReactiveRef;
}

export default createReactive;
