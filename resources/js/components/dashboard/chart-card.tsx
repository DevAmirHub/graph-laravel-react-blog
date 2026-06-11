import type { ReactNode } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type ChartCardProps = {
    title: string;
    description?: string;
    loading?: boolean;
    children: ReactNode;
};

export function ChartCard({
    title,
    description,
    loading = false,
    children,
}: ChartCardProps) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/30">
                <CardTitle className="text-base">{title}</CardTitle>
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}
            </CardHeader>
            <CardContent className="p-4">
                {loading ? (
                    <Skeleton className="h-64 w-full rounded-lg" />
                ) : (
                    <div className="h-64">{children}</div>
                )}
            </CardContent>
        </Card>
    );
}
