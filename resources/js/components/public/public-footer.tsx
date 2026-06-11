import { Link } from '@inertiajs/react';
import { graphiql } from '@/routes';
import { login } from '@/routes';

export function PublicFooter() {
    return (
        <footer className="border-t py-8">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row">
                <p>
                    Laravel + React + GraphQL blog demo. Built with Inertia and
                    Apollo Client.
                </p>
                <div className="flex items-center gap-4">
                    <Link
                        href={graphiql()}
                        className="hover:text-foreground"
                        target="_blank"
                    >
                        GraphiQL
                    </Link>
                    <Link href={login()} className="hover:text-foreground">
                        Admin login
                    </Link>
                </div>
            </div>
        </footer>
    );
}
