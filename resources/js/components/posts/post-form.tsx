import { CategorySelect } from '@/components/categories/category-select';
import { TagInput } from '@/components/tags/tag-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import type { PostFormValues } from '@/hooks/use-post-form';
import type { Category } from '@/types/category';
import type { Tag } from '@/types/tag';

type PostFormProps = {
    values: PostFormValues;
    categories: Category[];
    tags: Tag[];
    submitting?: boolean;
    submitLabel?: string;
    onChange: <K extends keyof PostFormValues>(
        key: K,
        value: PostFormValues[K],
    ) => void;
    onCoverUpload: (file: File) => Promise<void>;
    onSubmit: () => void;
};

export function PostForm({
    values,
    categories,
    tags,
    submitting = false,
    submitLabel = 'Save post',
    onChange,
    onCoverUpload,
    onSubmit,
}: PostFormProps) {
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
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        value={values.title}
                        onChange={(event) =>
                            onChange('title', event.target.value)
                        }
                        minLength={5}
                        required
                    />
                    <p className="text-xs text-muted-foreground">
                        Minimum 5 characters.
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
                <Label htmlFor="excerpt">Excerpt</Label>
                <Input
                    id="excerpt"
                    value={values.excerpt}
                    onChange={(event) =>
                        onChange('excerpt', event.target.value)
                    }
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <textarea
                    id="content"
                    value={values.content}
                    onChange={(event) =>
                        onChange('content', event.target.value)
                    }
                    className="min-h-40 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    minLength={20}
                    required
                />
                <p className="text-xs text-muted-foreground">
                    Minimum 20 characters ({values.content.trim().length}/20).
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="cover">Cover image</Label>
                    <Input
                        id="cover"
                        type="file"
                        accept="image/*"
                        onChange={async (event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                                await onCoverUpload(file);
                            }
                        }}
                    />
                    {values.cover_image && (
                        <p className="text-sm text-muted-foreground">
                            {values.cover_image}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={values.status}
                        onValueChange={(value) =>
                            onChange('status', value as PostFormValues['status'])
                        }
                    >
                        <SelectTrigger id="status">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <CategorySelect
                categories={categories}
                value={values.category_id}
                onChange={(value) => onChange('category_id', value)}
            />

            <TagInput
                tags={tags}
                value={values.tag_ids}
                onChange={(value) => onChange('tag_ids', value)}
            />

            <Button type="submit" disabled={submitting}>
                {submitting && <Spinner />}
                {submitLabel}
            </Button>
        </form>
    );
}
