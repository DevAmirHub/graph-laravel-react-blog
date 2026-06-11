import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { PostStatus } from '@/types/post';

type PostFiltersProps = {
    title: string;
    status: PostStatus | 'all';
    onTitleChange: (value: string) => void;
    onStatusChange: (value: PostStatus | 'all') => void;
};

export function PostFilters({
    title,
    status,
    onTitleChange,
    onStatusChange,
}: PostFiltersProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="post-title-filter">Search title</Label>
                <Input
                    id="post-title-filter"
                    value={title}
                    onChange={(event) => onTitleChange(event.target.value)}
                    placeholder="Search posts..."
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="post-status-filter">Status</Label>
                <Select
                    value={status}
                    onValueChange={(value) =>
                        onStatusChange(value as PostStatus | 'all')
                    }
                >
                    <SelectTrigger id="post-status-filter">
                        <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
