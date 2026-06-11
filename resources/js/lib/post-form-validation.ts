export function slugify(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export function validatePostForm(values: {
    title: string;
    slug: string;
    content: string;
    category_id: string;
}): string | null {
    if (values.title.trim().length < 5) {
        return 'Title must be at least 5 characters.';
    }

    if (values.slug.trim().length < 3) {
        return 'Slug must be at least 3 characters.';
    }

    if (values.content.trim().length < 20) {
        return 'Content must be at least 20 characters.';
    }

    if (!values.category_id) {
        return 'Please select a category.';
    }

    return null;
}
