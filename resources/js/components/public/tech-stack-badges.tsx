import { Badge } from '@/components/ui/badge';

const STACK = [
    'Laravel',
    'Lighthouse',
    'GraphQL',
    'React',
    'Inertia',
    'Apollo Client',
    'TypeScript',
    'Tailwind CSS',
] as const;

export function TechStackBadges() {
    return (
        <div className="flex flex-wrap justify-center gap-2">
            {STACK.map((item) => (
                <Badge key={item} variant="secondary">
                    {item}
                </Badge>
            ))}
        </div>
    );
}
