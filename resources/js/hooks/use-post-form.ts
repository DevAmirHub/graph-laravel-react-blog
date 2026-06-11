import { useState } from 'react';
import type { PostStatus } from '@/types/post';

export type PostFormValues = {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    cover_image: string;
    status: PostStatus;
    category_id: string;
    tag_ids: string[];
};

const defaultValues: PostFormValues = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    status: 'draft',
    category_id: '',
    tag_ids: [],
};

export function usePostForm(initialValues: Partial<PostFormValues> = {}) {
    const [values, setValues] = useState<PostFormValues>({
        ...defaultValues,
        ...initialValues,
    });

    const setField = <K extends keyof PostFormValues>(
        key: K,
        value: PostFormValues[K],
    ) => {
        setValues((current) => ({ ...current, [key]: value }));
    };

    const reset = (nextValues: Partial<PostFormValues> = {}) => {
        setValues({ ...defaultValues, ...nextValues });
    };

    return {
        values,
        setField,
        setValues,
        reset,
    };
}
