import { get } from '../utils';

type Handler = (value: any, valueSpace?: any, notifyPrefix?: string) => void;
interface IEventPoolItem {
    nameHandlers: Record<string, Handler>;
    handlers: Handler[];
}

const __ON_CHANGE__ = '__ON_CHANGE__';

function createEventEmitter() {
    const pool: Record<string, IEventPoolItem> = {};
    const eventChecker = (name: string) => !!pool[name];
    const publish = (name: string) =>
        pool[name] || (pool[name] = { nameHandlers: {}, handlers: [] });
    const emit = (name: string, value?: any) => {
        const handler = (h: Handler) => h(value);

        if (pool[name]) {
            pool[name].handlers.forEach(handler);
            Object.values(pool[name].nameHandlers).forEach(handler);
        }

        for (let key in pool) {
            if (name !== key && key.startsWith(name)) {
                emit(key, get(value, key.replace(name, '')));
            }
        }

        pool[__ON_CHANGE__].handlers.forEach(handler);
        Object.values(pool[__ON_CHANGE__].nameHandlers).forEach(handler);
    };
    const on = (
        name: string | undefined = __ON_CHANGE__,
        eventHandler: Handler,
        handlerName?: string
    ) => {
        if (!eventChecker(name)) {
            publish(name);
        }

        if (handlerName) {
            pool[name].nameHandlers[handlerName] = eventHandler;
        } else {
            pool[name].handlers.push(eventHandler);
        }
    };
    const unpublish = (name: string) => {
        delete pool[name];
    };

    publish(__ON_CHANGE__);

    return { publish, emit, on, unpublish };
}

createEventEmitter.__ON_CHANGE__ = __ON_CHANGE__;

export default createEventEmitter;
