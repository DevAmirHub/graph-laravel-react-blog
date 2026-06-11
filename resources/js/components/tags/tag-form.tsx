import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import type { TagFormValues } from '@/hooks/use-tag-form';

type TagFormProps = {
    values: TagFormValues;
    submitting?: boolean;
    submitLabel?: string;
    onChange: <K extends keyof TagFormValues>(
        key: K,
        value: TagFormValues[K],
    ) => void;
    onSubmit: () => void;
};

export function TagForm({
    values,
    submitting = false,
    submitLabel = 'Save tag',
    onChange,
    onSubmit,
}: TagFormProps) {
    return (
        <form
            className="space-y-6"
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
            }}
        >
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={values.name}
                        onChange={(event) =>
                            onChange('name', event.target.value)
                        }
                        minLength={2}
                        required
                    />
                    <p className="text-xs text-muted-foreground">
                        Minimum 2 characters.
                    </p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                        id="slug"
                        value={values.slug}
                        onChange={(event) =>
                            onChange('slug', event.target.value)
                        }
                        minLength={3}
                        required
                    />
                    <p className="text-xs text-muted-foreground">
                        Use letters, numbers, and hyphens only.
                    </p>
                </div>
            </div>

            <Button type="submit" disabled={submitting}>
                {submitting && <Spinner />}
                {submitLabel}
            </Button>
        </form>
    );
}
