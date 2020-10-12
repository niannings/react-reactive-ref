import React, { ReactNode, useState } from "react";
import createReactive from "./index";

interface WatchProps {
  register: Pick<
    ReturnType<ReturnType<ReturnType<typeof createReactive>>["register"]>,
    "on" | "dataGetter"
  >;
  children: (props: { watch: (prop?: string) => any }) => ReactNode;
}

export function Watch({ children, register }: WatchProps) {
  const { dataGetter, on } = register;
  const [, update] = useState();

  const watch = (prop?: string) => {
    on(prop, update);

    return dataGetter(prop);
  };

  return <>{children({ watch })}</>;
}
