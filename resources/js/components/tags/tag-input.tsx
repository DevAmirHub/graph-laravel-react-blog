import { Label } from '@/components/ui/label';
import type { Tag } from '@/types/tag';

type TagInputProps = {
    tags: Tag[];
    value: string[];
    onChange: (value: string[]) => void;
};

export function TagInput({ tags, value, onChange }: TagInputProps) {
    const toggleTag = (tagId: string) => {
        if (value.includes(tagId)) {
            onChange(value.filter((id) => id !== tagId));
            return;
        }

        onChange([...value, tagId]);
    };

    return (
        <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                    const selected = value.includes(tag.id);

                    return (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleTag(tag.id)}
                            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                                selected
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-input bg-background hover:bg-accent'
                            }`}
                        >
                            {tag.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
