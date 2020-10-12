import React from "react";
import { Watch } from "../../reactive";
import { FormItem } from "../FormItem";
import useForm from "../index";

export default function DemoValidate() {
    const { register, customGetter } = useForm();

    console.log(customGetter("errors"));

    return (
        <>
            <h1>表单校验测试</h1>
            <ol>
                <li>简单使用</li>
                <li>内置校验</li>
                <li>类似formutil $parser</li>
            </ol>
            <div className="debug-block">
                <Watch register={register()}>
                    {({ watch }) => (
                        <>
                            <pre>{JSON.stringify(watch(), null, 2)}</pre>
                            <pre>
                                {JSON.stringify(
                                    customGetter("errors"),
                                    null,
                                    2
                                )}
                            </pre>
                        </>
                    )}
                </Watch>
            </div>
            <div className="flex">
                <FormItem
                    label="必填校验"
                    register={register("required", {
                        required: true,
                        $validMessages: {
                            required: "此项必填",
                        },
                    })}
                >
                    <input />
                </FormItem>
                <FormItem
                    label="正则校验"
                    register={register("pattern", {
                        pattern: /^[\d]*$/,
                        $validMessages: {
                            pattern: "请输入数字",
                        },
                    })}
                >
                    <input />
                </FormItem>
                <FormItem
                    label="最大长度校验"
                    register={register("maxLength", {
                        maxLength: 10,
                        $validMessages: {
                            maxLength: "超过输入限制：10 位",
                        },
                    })}
                >
                    <input />
                </FormItem>
                <FormItem
                    label="最小长度校验"
                    register={register("minLength", {
                        minLength: 2,
                        $validMessages: {
                            minLength: "至少输入 2 位",
                        },
                    })}
                >
                    <input />
                </FormItem>
                <FormItem
                    label="15或18位身份证号码"
                    register={register("id-card", {
                        required: true,
                        pattern: /^([0-9a-zA-Z]{15})$|^([0-9a-zA-Z]{18})$/,
                        $validMessages: {
                            pattern: "请输入15或18位身份证号码",
                        },
                    })}
                >
                    <input />
                </FormItem>
                <FormItem
                    label="自定义校验"
                    register={register("custom", {
                        $validators: [(value) => !!value || "请输入自定义校验"],
                    })}
                >
                    <input />
                </FormItem>
                <div style={{ width: "100%" }}>
                    <h5>三个加起来需要等于100%</h5>
                    <Watch register={register()}>
                        {({ watch }) => {
                            const validator = () =>
                                (watch("a") | 0) + (watch("b") | 0) + (watch("c") | 0) === 100 ||
                                "三个加起来需要等于100%";

                                console.log((watch("a") | 0) + (watch("b") | 0) + (watch("c") | 0))

                            return (
                                <div className="flex">
                                    <FormItem
                                        label="依赖校验-1"
                                        register={register("a", {
                                            $validators: [validator],
                                        })}
                                    >
                                        <input />
                                    </FormItem>
                                    <FormItem
                                        label="依赖校验-2"
                                        register={register("b", {
                                            $validators: [validator],
                                        })}
                                    >
                                        <input />
                                    </FormItem>
                                    <FormItem
                                        label="依赖校验-3"
                                        register={register("c", {
                                            $validators: [validator],
                                        })}
                                    >
                                        <input />
                                    </FormItem>
                                </div>
                            );
                        }}
                    </Watch>
                </div>
            </div>
        </>
    );
}
