import { Head, router } from '@inertiajs/react';
import { useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { UserForm } from '@/components/users/user-form';
import { CREATE_USER } from '@/graphql/users/mutations';
import { GET_USERS } from '@/graphql/users/queries';
import { useUserForm } from '@/hooks/use-user-form';
import { apolloClient } from '@/lib/apollo';
import { getGraphQLErrorMessage } from '@/lib/graphql-errors';
import { validateUserForm } from '@/lib/user-validation';
import { create as createUserRoute, index as usersIndex } from '@/routes/users';

export default function CreateUser() {
    const { values, setField, reset } = useUserForm();
    const [createUser, { loading }] = useMutation(CREATE_USER);

    const handleSubmit = async () => {
        const payload = {
            name: values.name.trim(),
            email: values.email.trim(),
            password: values.password,
        };

        const validationError = validateUserForm({
            ...payload,
            requirePassword: true,
        });

        if (validationError) {
            toast.error(validationError);
            return;
        }

        try {
            await createUser({
                variables: payload,
            });

            await apolloClient.refetchQueries({ include: [GET_USERS] });

            toast.success('User created successfully.');
            reset();
            router.visit(usersIndex().url);
        } catch (error) {
            toast.error(getGraphQLErrorMessage(error));
        }
    };

    return (
        <>
            <Head title="Create user" />
            <div className="space-y-6 p-4">
                <Heading
                    title="Create user"
                    description="Add a new user account."
                />
                <UserForm
                    values={values}
                    submitting={loading}
                    submitLabel="Create user"
                    passwordRequired
                    onChange={setField}
                    onSubmit={handleSubmit}
                />
            </div>
        </>
    );
}

CreateUser.layout = {
    breadcrumbs: [
        { title: 'Users', href: usersIndex() },
        { title: 'Create', href: createUserRoute() },
    ],
};
