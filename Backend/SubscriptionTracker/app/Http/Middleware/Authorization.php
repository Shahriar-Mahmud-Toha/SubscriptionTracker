<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;

class Authorization
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        try {
            $role = JWTAuth::parseToken()->getClaim('role');

            // Check if the user has any of the roles specified in the route
            if (!in_array($role, $roles)) {
                return response()->json([
                    'message' => 'You do not have permission to access this resource.',
                ], 403);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'An unexpected error occurred', 'details' => $e->getMessage()], 500);
        }
        return $next($request);
    }
}
