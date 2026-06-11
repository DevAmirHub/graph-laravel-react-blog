import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { edit as editUser } from '@/routes/users';
import type { User } from '@/types/user';

type UserCardProps = {
    user: User;
    deleting?: boolean;
    disableDelete?: boolean;
    onDelete: (user: User) => void;
};

export function UserCard({
    user,
    deleting = false,
    disableDelete = false,
    onDelete,
}: UserCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                        <CardTitle>{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </div>
                    <div className="flex shrink-0 gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={editUser({ user: user.id })}>Edit</Link>
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={deleting || disableDelete}
                            onClick={() => onDelete(user)}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>{user.postsCount ?? 0} posts</span>
                <span>{user.commentsCount ?? 0} comments</span>
                {user.created_at && (
                    <span>
                        Joined{' '}
                        {new Date(user.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </span>
                )}
            </CardContent>
        </Card>
    );
}
