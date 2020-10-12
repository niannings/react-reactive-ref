import React, { ReactElement, useState, cloneElement } from "react";
import useForm from "./index";

interface IFormItemProps {
  children: ReactElement;
  register: ReturnType<
    ReturnType<typeof useForm>["register"]
  >;
  label?: string;
  $parser?: (viewValue: any, setViewValue: (value: any) => any) => any;
}

export function FormItem({
  children,
  register: { name, emit, customGetter },
  label,
  $parser
}: IFormItemProps) {
  const [value, setValue] = useState();

  const onChange = (v) => {
    if ("target" in v) {
      v = v.target?.value;
    }

    let modelValue = v

    if ($parser) {
      modelValue = $parser(v, (_v) => v = _v)
    }

    setValue(v);
    emit(name!, modelValue);
  };

  return (
    <div>
      <p style={{ fontSize: 12 }}>{label}</p>
      {cloneElement(children, { value, onChange })}
      <p style={{ color: 'red' }}>{customGetter(`errors.${name}`)}</p>
    </div>
  );
}
