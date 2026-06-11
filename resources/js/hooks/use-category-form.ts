import { useState } from 'react';

export type CategoryFormValues = {
    name: string;
    slug: string;
    description: string;
};

const defaultValues: CategoryFormValues = {
    name: '',
    slug: '',
    description: '',
};

export function useCategoryForm(
    initialValues: Partial<CategoryFormValues> = {},
) {
    const [values, setValues] = useState<CategoryFormValues>({
        ...defaultValues,
        ...initialValues,
    });

    const setField = <K extends keyof CategoryFormValues>(
        key: K,
        value: CategoryFormValues[K],
    ) => {
        setValues((current) => ({ ...current, [key]: value }));
    };

    const reset = (nextValues: Partial<CategoryFormValues> = {}) => {
        setValues({ ...defaultValues, ...nextValues });
    };

    return {
        values,
        setField,
        setValues,
        reset,
    };
}
