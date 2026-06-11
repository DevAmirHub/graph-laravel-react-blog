import { slugify } from '@/lib/post-form-validation';

export { slugify };

export function validateCategoryForm(values: {
    name: string;
    slug: string;
}): string | null {
    if (values.name.trim().length < 2) {
        return 'Name must be at least 2 characters.';
    }

    if (values.slug.trim().length < 3) {
        return 'Slug must be at least 3 characters.';
    }

    return null;
}

export function validateTagForm(values: {
    name: string;
    slug: string;
}): string | null {
    if (values.name.trim().length < 2) {
        return 'Name must be at least 2 characters.';
    }

    if (values.slug.trim().length < 3) {
        return 'Slug must be at least 3 characters.';
    }

    return null;
}
