import { useState, useRef, useMemo } from "react";
import createEventEmitter from "../eventEmitter";
import { get, set } from "../utils";

export * from "./Watch";

function createReactive<
  CustomData extends object = object,
  RegisterOptions extends object = object
>() {
  interface IReactivePlugin {
    beforeChange?: (
      value: any,
      name: string,
      data: object,
      options?: RegisterOptions
    ) => void;
    onChange?: (
      value: any,
      name: string,
      data: object,
      options?: RegisterOptions
    ) => void;
  }

  function useReactiveRef<Data extends object = object>(initialData?: Data) {
    const [, update] = useState();
    const { current: data } = useRef(initialData || {});
    const { current: customData } = useRef({} as CustomData);
    const emitter = useMemo<ReturnType<typeof createEventEmitter>>(
      () => createEventEmitter(),
      []
    );
    const { current: prefix } = useRef(Date.now().toString(16));

    const dataGetter = (prop?: string) => (prop ? get(data, prop) : data);

    const listen = (handler: (...args: any[]) => any, prop?: string) =>
      prop
        ? emitter.on(prop, handler)
        : emitter.on(createEventEmitter.__ON_CHANGE__, handler);

    const register = (name?: string, options?: RegisterOptions) => {
      if (name) {
        emitter.on(
          name,
          (value) => {
            useReactiveRef.plugins.forEach((plugin) =>
              plugin.beforeChange?.(value, name, data, options)
            );
            set(data, name, value);
            useReactiveRef.plugins.forEach((plugin) =>
              plugin.onChange?.(value, name, data, options)
            );
          },
          `${prefix}__${name}`
        );
      }

      return { name, listen, emit: emitter.emit, dataGetter, ...customData };
    };
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
  useReactiveRef.use = (plugin: IReactivePlugin) =>
    useReactiveRef.plugins.push(plugin);

  return useReactiveRef;
}

export default createReactive;
