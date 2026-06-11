import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Category } from '@/types/category';

type CategorySelectProps = {
    categories: Category[];
    value: string;
    onChange: (value: string) => void;
};

export function CategorySelect({
    categories,
    value,
    onChange,
}: CategorySelectProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                            {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
