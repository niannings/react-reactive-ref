const isIndex = (n: any) => /^[0-9]+$/.test(n);
const parsePath = (path: string) =>
  path
    .replace(/\[([^\[\]]*)\]/g, ".$1.")
    .split(".")
    .filter(Boolean);

export const get = (target: any, path: string) =>
  parsePath(path).reduce((prev, cur) => prev && prev[cur], target);

export const set = (target: any, path: string, value: any) => {
  let prevValue: any;
  let prevKey: string;

  parsePath(path).reduce((prev, key, index) => {
    if (!prevKey) {
      if (prev === null || prev === undefined) {
        target = prev = isIndex(key) ? [] : {};
      }

      prevKey = key;
      prevValue = prev;

      return prevValue;
    }

    if (!prev[prevKey]) {
      prev[prevKey] = isIndex(key) ? [] : {};
    }

    prevValue = prev[prevKey];
    prevKey = key;

    return prevValue;
  }, target);

  prevValue[prevKey] = value;

  return target;
};
