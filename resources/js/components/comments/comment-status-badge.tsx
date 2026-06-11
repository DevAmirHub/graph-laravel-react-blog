import { Badge } from '@/components/ui/badge';
import type { CommentStatus } from '@/types/comment';

const labels: Record<CommentStatus, string> = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
};

const variants: Record<
    CommentStatus,
    'secondary' | 'default' | 'destructive' | 'outline'
> = {
    pending: 'secondary',
    approved: 'default',
    rejected: 'destructive',
};

export function CommentStatusBadge({ status }: { status: CommentStatus }) {
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
