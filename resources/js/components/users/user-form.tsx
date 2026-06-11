import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import type { UserFormValues } from '@/hooks/use-user-form';

type UserFormProps = {
    values: UserFormValues;
    submitting?: boolean;
    submitLabel?: string;
    passwordRequired?: boolean;
    onChange: <K extends keyof UserFormValues>(
        key: K,
        value: UserFormValues[K],
    ) => void;
    onSubmit: () => void;
};

export function UserForm({
    values,
    submitting = false,
    submitLabel = 'Save user',
    passwordRequired = true,
    onChange,
    onSubmit,
}: UserFormProps) {
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
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={values.email}
                        onChange={(event) =>
                            onChange('email', event.target.value)
                        }
                        required
                    />
                </div>
            </div>

            <div className="space-y-2 md:max-w-md">
                <Label htmlFor="password">
                    Password{passwordRequired ? '' : ' (optional)'}
                </Label>
                <Input
                    id="password"
                    type="password"
                    value={values.password}
                    onChange={(event) =>
                        onChange('password', event.target.value)
                    }
                    minLength={passwordRequired ? 8 : undefined}
                    required={passwordRequired}
                    autoComplete="new-password"
                />
                <p className="text-xs text-muted-foreground">
                    {passwordRequired
                        ? 'Minimum 8 characters.'
                        : 'Leave blank to keep the current password.'}
                </p>
            </div>

            <Button type="submit" disabled={submitting}>
                {submitting && <Spinner />}
                {submitLabel}
            </Button>
        </form>
    );
}
