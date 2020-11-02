import React, {
    ReactElement,
    useState,
    cloneElement,
    useEffect,
    useRef,
} from 'react';
import { Watch } from '../reactive';
import useForm from './index';

interface IFormItemProps {
    children: ReactElement;
    register: ReturnType<ReturnType<typeof useForm>['register']>;
    onFiledChange?: (value: any) => void;
    label?: string;
    $parser?: (viewValue: any, setViewValue: (value: any) => any) => any;
    $formatter?: (modalValue: any, setModalValue: (value: any) => any) => any;
}

export function FormItem({
    children,
    register,
    label,
    $parser,
    $formatter,
    onFiledChange,
}: IFormItemProps) {
    const { name, emit, on } = register;
    const [value, setValue] = useState();
    const statusRef = useRef<{ setting: boolean }>({ setting: false });

    const onChange = (v) => {
        if ('target' in v) {
            v = v.target?.value;
        }

        let modelValue = v;
        let viewValue = v;

        if ($parser) {
            modelValue = $parser(v, (_v) => (viewValue = _v));
        }

        statusRef.current.setting = true;
        setValue(viewValue);
        onFiledChange?.(modelValue);
        emit(name, modelValue);
        statusRef.current.setting = false;
    };

    useEffect(() => {
        on(name, (value) => {
            if (!statusRef.current.setting) {
                let modelValue = value;
                let viewValue = value;

                if ($formatter) {
                    viewValue = $formatter(
                        value,
                        (_value) => (modelValue = _value)
                    );
                }
                setValue(viewValue);
                setTimeout(() => {
                    statusRef.current.setting = true;
                    emit(name, modelValue);
                    statusRef.current.setting = false;
                });
            }
        });
    }, []);

    return (
        <div>
            <p style={{ fontSize: 12 }}>{label}</p>
            {cloneElement(children, { value, onChange })}
            <Watch register={{ on, dataGetter: register.customGetter }}>
                {({ watch }) => (
                    <p style={{ color: 'red' }}>{watch(`errors.${name}`)}</p>
                )}
            </Watch>
        </div>
    );
}
