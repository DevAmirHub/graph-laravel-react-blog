export function validateUserForm(values: {
    name: string;
    email: string;
    password: string;
    requirePassword: boolean;
}): string | null {
    if (values.name.trim().length < 2) {
        return 'Name must be at least 2 characters.';
    }

    if (!values.email.trim() || !values.email.includes('@')) {
        return 'Please enter a valid email address.';
    }

    if (values.requirePassword && values.password.length < 8) {
        return 'Password must be at least 8 characters.';
    }

    if (!values.requirePassword && values.password && values.password.length < 8) {
        return 'Password must be at least 8 characters.';
    }

    return null;
}
