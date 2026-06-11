import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UserFormValues } from '@/hooks/use-user-form';

type UserFiltersProps = {
    name: string;
    onNameChange: (value: string) => void;
};

export function UserFilters({ name, onNameChange }: UserFiltersProps) {
    return (
        <div className="space-y-2 md:max-w-sm">
            <Label htmlFor="user-name-filter">Search name</Label>
            <Input
                id="user-name-filter"
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                placeholder="Search users..."
            />
        </div>
    );
}
