import { Activity, Clock, Database, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type QueryPerformanceBarProps = {
    loading: boolean;
    loadTimeMs: number | null;
    fetchedAt: Date | null;
    onRefresh: () => void;
    refreshing?: boolean;
};

export function QueryPerformanceBar({
    loading,
    loadTimeMs,
    fetchedAt,
    onRefresh,
    refreshing = false,
}: QueryPerformanceBarProps) {
    return (
        <Card className="border-dashed bg-gradient-to-r from-muted/50 via-background to-muted/50">
            <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Activity className="size-4 text-primary" />
                            GraphQL dashboard load
                        </CardTitle>
                        <CardDescription>
                            Single query fetching counts, relations, and paginated
                            lists in one round trip.
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={loading || refreshing}
                        onClick={onRefresh}
                    >
                        <RefreshCw
                            className={
                                loading || refreshing
                                    ? 'size-4 animate-spin'
                                    : 'size-4'
                            }
                        />
                        Refresh
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                    <div className="flex items-center gap-3 rounded-lg border bg-background/80 px-4 py-3">
                        <Clock className="size-4 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Query time
                            </p>
                            {loading ? (
                                <Skeleton className="mt-1 h-5 w-16" />
                            ) : (
                                <p className="font-semibold">
                                    {loadTimeMs !== null
                                        ? `${loadTimeMs.toFixed(0)} ms`
                                        : '—'}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border bg-background/80 px-4 py-3">
                        <Database className="size-4 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Data source
                            </p>
                            <p className="font-semibold">GraphQL /graphql</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border bg-background/80 px-4 py-3">
                        <Activity className="size-4 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Last fetched
                            </p>
                            {loading ? (
                                <Skeleton className="mt-1 h-5 w-28" />
                            ) : (
                                <p className="font-semibold">
                                    {fetchedAt
                                        ? fetchedAt.toLocaleTimeString()
                                        : '—'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
