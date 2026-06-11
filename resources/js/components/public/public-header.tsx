import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { dashboard, home, login } from '@/routes';
import { index as blogIndex } from '@/routes/blog';

type AuthPageProps = {
    auth: {
        user: {
            name: string;
        } | null;
    };
};

export function PublicHeader() {
    const { auth } = usePage<AuthPageProps>().props;

    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
                <Link
                    href={home()}
                    className="flex items-center gap-2 font-semibold"
                >
                    <AppLogoIcon className="size-7 fill-current" />
                    <span>GraphQL Blog</span>
                </Link>

                <nav className="flex items-center gap-1 sm:gap-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={home()}>Home</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={blogIndex()}>Blog</Link>
                    </Button>
                    {auth.user ? (
                        <Button size="sm" asChild>
                            <Link href={dashboard()}>Dashboard</Link>
                        </Button>
                    ) : (
                        <Button size="sm" variant="outline" asChild>
                            <Link href={login()}>Log in</Link>
                        </Button>
                    )}
                </nav>
            </div>
        </header>
    );
}
