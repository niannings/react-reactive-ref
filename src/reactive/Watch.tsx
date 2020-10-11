import React, { ReactNode, useState } from "react";
import createReactive from "./index";

interface WatchProps {
  register: Pick<
    ReturnType<ReturnType<ReturnType<typeof createReactive>>["register"]>,
    "listen" | "dataGetter"
  >;
  children: (props: { watch: (prop?: string) => any }) => ReactNode;
}

export function Watch({ children, register }: WatchProps) {
  const { dataGetter, listen } = register;
  const [, update] = useState();

  const watch = (prop?: string) => {
    listen(update, prop);

    return dataGetter(prop);
  };

  return <>{children({ watch })}</>;
}
