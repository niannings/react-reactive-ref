import React, { useEffect } from 'react';
import { Watch } from '../../reactive';
import { FormItem } from '../FormItem';
import useForm from '../index';

const faker = (register: ReturnType<typeof useForm>['register'], n = 100) =>
    Array(n | 0)
        .fill(0)
        .map((_, index) => (
            <FormItem
                key={index}
                label="她说"
                register={register(`faker[${index}]`)}
                $parser={(v) => `是的，仙女说：${v}`}
                $formatter={(value, setModalValue) => {
                    setModalValue(`仙女好像说：${value}`);

                    return value;
                }}
            >
                <input />
            </FormItem>
        ));

export default function DemoNormal() {
    const { register, setValue } = useForm();

    useEffect(() => {
        setTimeout(() => {
            setValue('faker', [
                '太傻了',
                '太傻了',
                '太傻了',
                '太傻了',
                '太傻了',
                '太傻了',
                '太傻了',
                '太傻了',
                '太傻了',
                '太傻了',
                '太傻了',
                '太傻了',
                '太傻了',
                undefined,
                100,
                250,
            ]);
        }, 1000);
    }, []);

    console.log('父组件更新～');

    return (
        <div>
            <h1>表单测试</h1>
            <ol>
                <li>简单使用</li>
                <li>内置校验</li>
                <li>类似formutil $parser</li>
            </ol>
            <div className="debug-block">
                <Watch register={register()}>
                    {({ watch }) => (
                        <pre>{JSON.stringify(watch(), null, 2)}</pre>
                    )}
                </Watch>
            </div>
            <FormItem
                label="表单数量"
                register={register('count', {
                    required: true,
                    maxLength: 4,
                    $validMessages: {
                        required: '请输入表单数量',
                        maxLength: '太多了可能会卡',
                    },
                })}
                $parser={(v, setV) =>
                    setV(/^[0-9]*$/.test(v) ? v : v?.replace(/[^0-9]*/g, ''))
                }
            >
                <input />
            </FormItem>
            <div className="flex">
                <Watch register={register()}>
                    {({ watch }) => faker(register, watch('count'))}
                </Watch>
            </div>
        </div>
    );
}
