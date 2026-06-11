import { CombinedGraphQLErrors } from '@apollo/client/errors';

export function getGraphQLErrorMessage(error: unknown): string {
    if (CombinedGraphQLErrors.is(error)) {
        const validationMessages = error.errors.flatMap((graphQLError) => {
            const validation = graphQLError.extensions?.validation;

            if (!validation || typeof validation !== 'object') {
                return graphQLError.message ? [graphQLError.message] : [];
            }

            return Object.values(validation as Record<string, string[]>)
                .flat()
                .filter(Boolean);
        });

        if (validationMessages.length > 0) {
            return validationMessages.join(' ');
        }

        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Something went wrong.';
}
