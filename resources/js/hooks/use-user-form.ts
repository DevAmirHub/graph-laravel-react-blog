import { useState } from 'react';

export type UserFormValues = {
    name: string;
    email: string;
    password: string;
};

const defaultValues: UserFormValues = {
    name: '',
    email: '',
    password: '',
};

export function useUserForm(initialValues: Partial<UserFormValues> = {}) {
    const [values, setValues] = useState<UserFormValues>({
        ...defaultValues,
        ...initialValues,
    });

    const setField = <K extends keyof UserFormValues>(
        key: K,
        value: UserFormValues[K],
    ) => {
        setValues((current) => ({ ...current, [key]: value }));
    };

    const setValuesAll = (nextValues: Partial<UserFormValues>) => {
        setValues((current) => ({ ...current, ...nextValues }));
    };

    const reset = (nextValues: Partial<UserFormValues> = {}) => {
        setValues({ ...defaultValues, ...nextValues });
    };

    return {
        values,
        setField,
        setValues: setValuesAll,
        reset,
    };
}
