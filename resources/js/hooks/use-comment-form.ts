import { useState } from 'react';
import type { CommentStatus } from '@/types/comment';

export type CommentFormValues = {
    content: string;
    status: CommentStatus;
};

const defaultValues: CommentFormValues = {
    content: '',
    status: 'pending',
};

export function useCommentForm(
    initialValues: Partial<CommentFormValues> = {},
) {
    const [values, setValues] = useState<CommentFormValues>({
        ...defaultValues,
        ...initialValues,
    });

    const setField = <K extends keyof CommentFormValues>(
        key: K,
        value: CommentFormValues[K],
    ) => {
        setValues((current) => ({ ...current, [key]: value }));
    };

    const setValuesAll = (nextValues: Partial<CommentFormValues>) => {
        setValues((current) => ({ ...current, ...nextValues }));
    };

    const reset = (nextValues: Partial<CommentFormValues> = {}) => {
        setValues({ ...defaultValues, ...nextValues });
    };

    return {
        values,
        setField,
        setValues: setValuesAll,
        reset,
    };
}
