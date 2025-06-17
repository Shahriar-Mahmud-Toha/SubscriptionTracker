<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ServerVerification
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $serverSecret = $request->header('X-Server-Secret');
            if (!$serverSecret || ($serverSecret !== env('FRONTEND_SECRET'))) {
                throw new \Exception('Unauthorized server request.');
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Server verification failed.",
            ], 401);
        }
        return $next($request);
    }
}
