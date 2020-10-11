import React from "react";
import { FormItem } from "./Form/FormItem";
import createReactive, { Watch } from "./reactive";

import "./App.css";

const useReactiveRef = createReactive<
  object,
  { validators: (value: string) => boolean | string | void }
>();

// 校验插件
useReactiveRef.use({
  beforeChange: (value, name, data, options) => {
    options?.validators(value);
  },
  // onChange: console.log,
});

const faker = (register, n = 100) =>
  Array(n | 0)
    .fill(0)
    .map((_, index) => (
      <FormItem
        key={index}
        label="仙女啊"
        register={register(`faker-${index}`, {
          validators: (value) => value || console.error("请输入"),
        })}
      >
        <input />
      </FormItem>
    ));

export default function Demo() {
  const { register } = useReactiveRef();

  console.log("父组件更新～");

  return (
    <>
      <Watch register={register()}>
        {({ watch }) => <pre>{JSON.stringify(watch(), null, 2)}</pre>}
      </Watch>
      <FormItem label="表单数量" register={register("count")}>
        <input />
      </FormItem>
      <div className="flex">
        <Watch register={register()}>
          {({ watch }) => faker(register, watch("count"))}
        </Watch>
      </div>
    </>
  );
}
