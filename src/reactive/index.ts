import { useState, useRef, useMemo } from "react";
import createEventEmitter from "../eventEmitter";
import { get, set } from "../utils";

export * from "./Watch";

function createReactive<
    CustomData extends object = object,
    RegisterOptions extends object = object
>(initialCustomData?: () => CustomData) {
    interface ICustom {
        bind: (name: string) => void;
        emit: ReturnType<typeof createEventEmitter>["emit"];
        getter: (name: string) => any;
    }
    interface IReactivePluginConfig {
        value?: any;
        name?: string;
        data?: any;
        custom?: ICustom;
        options?: RegisterOptions;
    }
    interface IReactivePlugin {
        registerd?: (options: IReactivePluginConfig) => void;
        beforeChange?: (options: IReactivePluginConfig) => void;
        onChange?: (options: IReactivePluginConfig) => void;
    }

    const runPlugin = (
        name: keyof IReactivePlugin,
        config: IReactivePluginConfig
    ) => useReactiveRef.plugins.forEach((plugin) => plugin[name]?.(config));

    function useReactiveRef<Data extends object = object>(initialData?: Data) {
        const [, update] = useState();
        const { current: data } = useRef(initialData || {});
        const emitter = useMemo<ReturnType<typeof createEventEmitter>>(
            () => createEventEmitter(),
            []
        );
        const { current: prefix } = useRef(Date.now().toString(16));
        const customDataRef = useRef<CustomData>(initialCustomData());
        const { current: custom } = useRef<ICustom>({
            bind: (name: string) =>
                emitter.on(
                    name,
                    (value) => {
                        console.log(JSON.stringify(customDataRef.current));
                        set(customDataRef.current, name, value);
                    },
                    `${prefix}__${name}__custom`
                ),
            getter: (prop?: string) =>
                prop ? get(customDataRef.current, prop) : customDataRef.current,
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
                        const config = { value, name, data, options, custom };
                        runPlugin("beforeChange", config);
                        set(dataRef, name, value);
                        runPlugin("onChange", config);
                    },
                    `${prefix}__${name}`
                );
            }

            runPlugin("registerd", { name, options, custom });

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

        return { register, watch, dataGetter, customGetter: custom.getter };
    }

    useReactiveRef.plugins = [] as IReactivePlugin[];
    useReactiveRef.use = (...plugins: IReactivePlugin[]) =>
        useReactiveRef.plugins.push(...plugins);

    return useReactiveRef;
}

export default createReactive;
