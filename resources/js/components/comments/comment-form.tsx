import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import type { CommentFormValues } from '@/hooks/use-comment-form';
import type { CommentStatus } from '@/types/comment';

type CommentFormProps = {
    values: CommentFormValues;
    submitting?: boolean;
    submitLabel?: string;
    onChange: <K extends keyof CommentFormValues>(
        key: K,
        value: CommentFormValues[K],
    ) => void;
    onSubmit: () => void;
};

export function CommentForm({
    values,
    submitting = false,
    submitLabel = 'Save comment',
    onChange,
    onSubmit,
}: CommentFormProps) {
    return (
        <form
            className="space-y-6"
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
            }}
        >
            <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <textarea
                    id="content"
                    value={values.content}
                    onChange={(event) =>
                        onChange('content', event.target.value)
                    }
                    className="min-h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    minLength={3}
                    required
                />
                <p className="text-xs text-muted-foreground">
                    Minimum 3 characters ({values.content.trim().length}/3).
                </p>
            </div>

            <div className="space-y-2 md:max-w-xs">
                <Label htmlFor="status">Status</Label>
                <Select
                    value={values.status}
                    onValueChange={(value) =>
                        onChange('status', value as CommentStatus)
                    }
                >
                    <SelectTrigger id="status">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button type="submit" disabled={submitting}>
                {submitting && <Spinner />}
                {submitLabel}
            </Button>
        </form>
    );
}
