import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { CommentStatus } from '@/types/comment';

type CommentFiltersProps = {
    status: CommentStatus | 'all';
    onStatusChange: (value: CommentStatus | 'all') => void;
};

export function CommentFilters({
    status,
    onStatusChange,
}: CommentFiltersProps) {
    return (
        <div className="space-y-2 md:max-w-xs">
            <Label htmlFor="comment-status-filter">Status</Label>
            <Select
                value={status}
                onValueChange={(value) =>
                    onStatusChange(value as CommentStatus | 'all')
                }
            >
                <SelectTrigger id="comment-status-filter">
                    <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
