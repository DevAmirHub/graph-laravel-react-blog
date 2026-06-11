import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import type { CategoryFormValues } from '@/hooks/use-category-form';

type CategoryFormProps = {
    values: CategoryFormValues;
    submitting?: boolean;
    submitLabel?: string;
    onChange: <K extends keyof CategoryFormValues>(
        key: K,
        value: CategoryFormValues[K],
    ) => void;
    onSubmit: () => void;
};

export function CategoryForm({
    values,
    submitting = false,
    submitLabel = 'Save category',
    onChange,
    onSubmit,
}: CategoryFormProps) {
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

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                    id="description"
                    value={values.description}
                    onChange={(event) =>
                        onChange('description', event.target.value)
                    }
                    className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
            </div>

            <Button type="submit" disabled={submitting}>
                {submitting && <Spinner />}
                {submitLabel}
            </Button>
        </form>
    );
}
