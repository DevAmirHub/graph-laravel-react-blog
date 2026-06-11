export function validateCommentForm(content: string): string | null {
    if (content.trim().length < 3) {
        return 'Content must be at least 3 characters.';
    }

    return null;
}
