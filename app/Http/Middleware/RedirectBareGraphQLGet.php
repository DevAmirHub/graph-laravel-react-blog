<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectBareGraphQLGet
{
    /**
     * Redirect browser visits to /graphql (GET without query params) to GraphiQL.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (
            $request->isMethod('GET')
            && ! $request->has('query')
            && ! $request->has('queryId')
            && ! $request->expectsJson()
        ) {
            return redirect()->route('graphiql');
        }

        return $next($request);
    }
}
