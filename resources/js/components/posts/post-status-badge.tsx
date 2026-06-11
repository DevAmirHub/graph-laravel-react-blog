import { Badge } from '@/components/ui/badge';
import type { PostStatus } from '@/types/post';

const labels: Record<PostStatus, string> = {
    draft: 'Draft',
    published: 'Published',
    archived: 'Archived',
};

const variants: Record<PostStatus, 'secondary' | 'default' | 'outline'> = {
    draft: 'secondary',
    published: 'default',
    archived: 'outline',
};

export function PostStatusBadge({ status }: { status: PostStatus }) {
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
