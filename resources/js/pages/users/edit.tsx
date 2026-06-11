import { Head, router, usePage } from '@inertiajs/react';
import { useMutation, useQuery } from '@apollo/client/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { UserForm } from '@/components/users/user-form';
import { Spinner } from '@/components/ui/spinner';
import { UPDATE_USER } from '@/graphql/users/mutations';
import { GET_USER_BY_ID, GET_USERS } from '@/graphql/users/queries';
import { useUserForm } from '@/hooks/use-user-form';
import { apolloClient } from '@/lib/apollo';
import { getGraphQLErrorMessage } from '@/lib/graphql-errors';
import { validateUserForm } from '@/lib/user-validation';
import { index as usersIndex } from '@/routes/users';
import type { User } from '@/types/user';

type PageProps = {
    user: string;
};

type UserQueryResult = {
    user: User;
};

export default function EditUser() {
    const { user: userId } = usePage<PageProps>().props;
    const { values, setField, setValues } = useUserForm();
    const { data, loading, error } = useQuery<UserQueryResult>(GET_USER_BY_ID, {
        variables: { id: userId },
        skip: !userId,
    });
    const [updateUser, { loading: saving }] = useMutation(UPDATE_USER);

    useEffect(() => {
        if (!data?.user) {
            return;
        }

        setValues({
            name: data.user.name,
            email: data.user.email,
            password: '',
        });
    }, [data?.user, setValues]);

    const handleSubmit = async () => {
        const payload = {
            name: values.name.trim(),
            email: values.email.trim(),
            password: values.password,
        };

        const validationError = validateUserForm({
            ...payload,
            requirePassword: false,
        });

        if (validationError) {
            toast.error(validationError);
            return;
        }

        try {
            await updateUser({
                variables: {
                    id: userId,
                    name: payload.name,
                    email: payload.email,
                    password: payload.password || undefined,
                },
            });

            await apolloClient.refetchQueries({ include: [GET_USERS] });

            toast.success('User updated successfully.');
            router.visit(usersIndex().url);
        } catch (updateError) {
            toast.error(getGraphQLErrorMessage(updateError));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Spinner className="size-6" />
            </div>
        );
    }

    if (error || !data?.user) {
        return (
            <p className="p-4 text-sm text-destructive">
                {error?.message ?? 'User not found.'}
            </p>
        );
    }

    return (
        <>
            <Head title={`Edit ${data.user.name}`} />
            <div className="space-y-6 p-4">
                <Heading
                    title="Edit user"
                    description="Update account details. Leave password blank to keep it unchanged."
                />
                <UserForm
                    values={values}
                    submitting={saving}
                    submitLabel="Update user"
                    passwordRequired={false}
                    onChange={setField}
                    onSubmit={handleSubmit}
                />
            </div>
        </>
    );
}

EditUser.layout = {
    breadcrumbs: [
        { title: 'Users', href: usersIndex() },
        { title: 'Edit', href: '#' },
    ],
};
