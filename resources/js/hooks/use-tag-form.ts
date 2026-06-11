import { useState } from 'react';

export type TagFormValues = {
    name: string;
    slug: string;
};

const defaultValues: TagFormValues = {
    name: '',
    slug: '',
};

export function useTagForm(initialValues: Partial<TagFormValues> = {}) {
    const [values, setValues] = useState<TagFormValues>({
        ...defaultValues,
        ...initialValues,
    });

    const setField = <K extends keyof TagFormValues>(
        key: K,
        value: TagFormValues[K],
    ) => {
        setValues((current) => ({ ...current, [key]: value }));
    };

    const reset = (nextValues: Partial<TagFormValues> = {}) => {
        setValues({ ...defaultValues, ...nextValues });
    };

    return {
        values,
        setField,
        setValues,
        reset,
    };
}
