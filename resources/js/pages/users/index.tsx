import { Head, Link, usePage } from '@inertiajs/react';
import { useMutation, useQuery } from '@apollo/client/react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import Heading from '@/components/heading';
import { UserCard } from '@/components/users/user-card';
import { UserFilters } from '@/components/users/user-filters';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { DELETE_USER } from '@/graphql/users/mutations';
import { GET_USERS } from '@/graphql/users/queries';
import { apolloClient } from '@/lib/apollo';
import { getGraphQLErrorMessage } from '@/lib/graphql-errors';
import { create as createUser, index as usersIndex } from '@/routes/users';
import type { User, UserPaginator } from '@/types/user';

type UsersQueryResult = {
    users: UserPaginator;
};

type AuthPageProps = {
    auth: {
        user: {
            id: number;
        } | null;
    };
};

export default function UsersIndex() {
    const { auth } = usePage<AuthPageProps>().props;
    const currentUserId = auth.user?.id?.toString();
    const [name, setName] = useState('');
    const [page, setPage] = useState(1);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    useEffect(() => {
        setPage(1);
    }, [name]);

    const variables = useMemo(
        () => ({
            name: name.trim() ? `%${name.trim()}%` : undefined,
            first: 10,
            page,
        }),
        [name, page],
    );

    const { data, loading, error } = useQuery<UsersQueryResult>(GET_USERS, {
        variables,
        notifyOnNetworkStatusChange: true,
    });

    const [deleteUser, { loading: deleting }] = useMutation(DELETE_USER);

    const users = data?.users.data ?? [];
    const paginatorInfo = data?.users.paginatorInfo;

    const handleDelete = async () => {
        if (!userToDelete) {
            return;
        }

        try {
            await deleteUser({
                variables: { id: userToDelete.id },
            });

            await apolloClient.refetchQueries({ include: [GET_USERS] });

            toast.success('User deleted successfully.');
            setUserToDelete(null);
        } catch (deleteError) {
            toast.error(getGraphQLErrorMessage(deleteError));
        }
    };

    return (
        <>
            <Head title="Users" />
            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <Heading
                        title="Users"
                        description="Manage registered user accounts."
                    />
                    <Button asChild>
                        <Link href={createUser()}>Create user</Link>
                    </Button>
                </div>

                <UserFilters name={name} onNameChange={setName} />

                {loading && users.length === 0 && (
                    <div className="flex justify-center py-10">
                        <Spinner className="size-6" />
                    </div>
                )}

                {error && (
                    <p className="text-sm text-destructive">{error.message}</p>
                )}

                {!loading && users.length === 0 && !error && (
                    <p className="text-sm text-muted-foreground">
                        No users found.
                    </p>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    {users.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            deleting={deleting}
                            disableDelete={user.id === currentUserId}
                            onDelete={setUserToDelete}
                        />
                    ))}
                </div>

                {paginatorInfo && paginatorInfo.lastPage > 1 && (
                    <div className="flex items-center justify-between gap-4">
                        <Button
                            variant="outline"
                            disabled={page <= 1}
                            onClick={() => setPage((current) => current - 1)}
                        >
                            Previous
                        </Button>
                        <p className="text-sm text-muted-foreground">
                            Page {paginatorInfo.currentPage} of{' '}
                            {paginatorInfo.lastPage} ({paginatorInfo.total}{' '}
                            users)
                        </p>
                        <Button
                            variant="outline"
                            disabled={page >= paginatorInfo.lastPage}
                            onClick={() => setPage((current) => current + 1)}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>

            <DeleteConfirmDialog
                open={userToDelete !== null}
                title="Delete user"
                description={`Are you sure you want to delete "${userToDelete?.name}"? This action cannot be undone.`}
                deleting={deleting}
                onOpenChange={(open) => {
                    if (!open) {
                        setUserToDelete(null);
                    }
                }}
                onConfirm={handleDelete}
            />
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [{ title: 'Users', href: usersIndex() }],
};
