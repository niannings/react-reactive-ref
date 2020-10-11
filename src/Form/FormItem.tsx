import React, { ReactElement, useState, cloneElement } from "react";
import createReactive from "../reactive";

interface IFormItemProps {
  children: ReactElement;
  register: ReturnType<
    ReturnType<ReturnType<typeof createReactive>>["register"]
  >;
  label: string;
}

export function FormItem({
  children,
  register: { name, emit },
  label,
}: IFormItemProps) {
  const [value, setValue] = useState();

  const onChange = (v) => {
    if ("target" in v) {
      v = v.target?.value;
    }

    setValue(v);
    emit(name!, v);
  };

  return (
    <div>
      <span>{label}</span>
      {cloneElement(children, { value, onChange })}
    </div>
  );
}
