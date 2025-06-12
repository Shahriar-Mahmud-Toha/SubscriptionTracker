<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Symfony\Component\HttpFoundation\Response;

class EmailUpdateVerification
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try{
            $hash = $request->query('hash');
            if(!$hash) {
                return response()->json([
                    'message' => 'Invalid Request. Hash is required.',
                ], 400);
            }
            if (!Redis::get("updated_email:{$hash}")) {
                return response()->json([
                    'message' => 'Invalid, expired or already verified email update request.',
                ], 400);
            }
        }
        catch (\Exception $e) {
            return response()->json([
                'message' => 'Invalid request.',
            ], 400);
        }
        return $next($request);
    }
}
