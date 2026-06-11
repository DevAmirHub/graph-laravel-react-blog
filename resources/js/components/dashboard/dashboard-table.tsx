import type { ReactNode } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export type DashboardTableColumn<T> = {
    key: string;
    header: string;
    className?: string;
    render: (row: T) => ReactNode;
};

type DashboardTableProps<T> = {
    title: string;
    description?: string;
    rows: T[];
    total?: number;
    columns: DashboardTableColumn<T>[];
    loading?: boolean;
    emptyMessage?: string;
};

export function DashboardTable<T>({
    title,
    description,
    rows,
    total,
    columns,
    loading = false,
    emptyMessage = 'No records found.',
}: DashboardTableProps<T>) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/30">
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                        <CardTitle className="text-base">{title}</CardTitle>
                        {description && (
                            <CardDescription>{description}</CardDescription>
                        )}
                    </div>
                    {total !== undefined && (
                        <Badge variant="secondary">
                            {total.toLocaleString()} total
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="max-h-80 overflow-auto">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
                            <tr className="border-b text-left">
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className={`px-4 py-3 font-medium text-muted-foreground ${column.className ?? ''}`}
                                    >
                                        {column.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading &&
                                Array.from({ length: 6 }).map((_, index) => (
                                    <tr
                                        key={`skeleton-${index}`}
                                        className="border-b last:border-0"
                                    >
                                        {columns.map((column) => (
                                            <td
                                                key={column.key}
                                                className="px-4 py-3"
                                            >
                                                <Skeleton className="h-4 w-full max-w-32" />
                                            </td>
                                        ))}
                                    </tr>
                                ))}

                            {!loading && rows.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-4 py-10 text-center text-muted-foreground"
                                    >
                                        {emptyMessage}
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                rows.map((row, index) => (
                                    <tr
                                        key={index}
                                        className="border-b transition-colors last:border-0 hover:bg-muted/40"
                                    >
                                        {columns.map((column) => (
                                            <td
                                                key={column.key}
                                                className={`px-4 py-3 align-top ${column.className ?? ''}`}
                                            >
                                                {column.render(row)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
