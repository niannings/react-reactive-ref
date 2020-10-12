type Handler = (value: any) => void;
interface IEventPoolItem {
  nameHandlers: Record<string, Handler>;
  handlers: Handler[];
}

const __ON_CHANGE__ = "__ON_CHANGE__";

function createEventEmitter() {
  const pool: Record<string, IEventPoolItem> = {};
  const eventChecker = (name: string) => !!pool[name];
  const publish = (name: string) =>
    pool[name] || (pool[name] = { nameHandlers: {}, handlers: [] });
  const emit = (name: string, value: any) => {
    if (!eventChecker(name)) {
      throw new Error(`event【${name}】 is not published`);
    }

    const handler = (h: Handler) => h(value);

    pool[name].handlers.forEach(handler);
    Object.values(pool[name].nameHandlers).forEach(handler);

    pool[__ON_CHANGE__].handlers.forEach(handler);
    Object.values(pool[__ON_CHANGE__].nameHandlers).forEach(handler);
  };
  const on = (name: string | undefined = __ON_CHANGE__, eventHandler: Handler, handlerName?: string) => {
    if (!eventChecker(name)) {
      publish(name);
    }

    if (handlerName) {
      pool[name].nameHandlers[handlerName] = eventHandler;
    } else {
      pool[name].handlers.push(eventHandler);
    }
  };

  publish(__ON_CHANGE__);

  return { publish, emit, on };
}

createEventEmitter.__ON_CHANGE__ = __ON_CHANGE__;

export default createEventEmitter;
