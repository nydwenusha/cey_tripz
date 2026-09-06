<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // Check the current database record, not potentially stale JWT role claims.
        $user = $request->user('api');
        if (! $user || $user->role !== 'admin' || $user->status !== 'active') {
            return response()->json(['message' => 'An active administrator account is required.'], 403);
        }

        return $next($request);
    }
}
