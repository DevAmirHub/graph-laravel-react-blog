import type { LucideIcon } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type StatCardProps = {
    title: string;
    value: number | string;
    description?: string;
    icon: LucideIcon;
    loading?: boolean;
    accent?: 'blue' | 'green' | 'amber' | 'violet' | 'rose';
};

const accentStyles: Record<
    NonNullable<StatCardProps['accent']>,
    { icon: string; ring: string }
> = {
    blue: {
        icon: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        ring: 'ring-blue-500/20',
    },
    green: {
        icon: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        ring: 'ring-emerald-500/20',
    },
    amber: {
        icon: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        ring: 'ring-amber-500/20',
    },
    violet: {
        icon: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
        ring: 'ring-violet-500/20',
    },
    rose: {
        icon: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
        ring: 'ring-rose-500/20',
    },
};

export function StatCard({
    title,
    value,
    description,
    icon: Icon,
    loading = false,
    accent = 'blue',
}: StatCardProps) {
    const styles = accentStyles[accent];

    return (
        <Card className={cn('ring-1 ring-inset', styles.ring)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div
                    className={cn(
                        'flex size-9 items-center justify-center rounded-lg',
                        styles.icon,
                    )}
                >
                    <Icon className="size-4" />
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="h-8 w-20" />
                ) : (
                    <div className="text-3xl font-bold tracking-tight">
                        {value.toLocaleString()}
                    </div>
                )}
                {description && (
                    <p className="mt-1 text-xs text-muted-foreground">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
