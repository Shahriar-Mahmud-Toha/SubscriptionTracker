<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;

class Authentication
{
    private int $accessTokenValidity = 50;
    
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $data = $this->validateToken($request);
            $this->checkBannedToken($data['payload']);
            $this->validateRefreshToken($request, $data['payload']);
            $user = JWTAuth::authenticate();
            if (!$user->email_verified_at) {
                throw new \Exception('Account is inactive. Access denied.', 403);
            }
            Auth::setUser($user); // Setting the authenticated user in the request context
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 401);
        }

        // Proceed with the request
        return $next($request);
    }

    /**
     * Validate the token.
     *
     * @param  Request $request
     * @return string
     * @throws \Exception
     */
    protected function validateToken(Request $request): array
    {
        $token = $request->bearerToken();

        if (!$token) {
            throw new \Exception('Unauthenticated response. Please log in to access this resource.');
        }

        // Parse and verify the token's validity
        try {
            JWTAuth::parseToken();
            $payload = JWTAuth::getPayload();
        } catch (\Exception $e) {
            throw new \Exception('This token is Invalid or Expired.');
        }

        return [
            'token' => $token,
            'payload' => $payload
        ];
    }

    /**
     * Check if the token is banned.
     *
     * @param  string $token
     * @throws \Exception
     */
    protected function checkBannedToken($payload): void
    {
        $jti = $payload->get('jti');

        // Check Redis for banned token
        $bannedToken = Redis::get("banned_token:{$jti}");
        if ($bannedToken) {
            throw new \Exception('This token has been restricted.');
        }
    }
    protected function validateRefreshToken(Request $request, $payload): void
    {
        $type = $payload->get('type');
        $issuedAt = $payload->get('iat');
        // Check if the route matches "api/refresh_token"
        if ($request->is('api/refresh_token')) {
            if ($type === 'access') {
                throw new \Exception('Refresh token cannot be generated with an access token.');
            }

            $accessTokenValidity = $issuedAt + ($this->accessTokenValidity * 60); 
            if (time() < $accessTokenValidity) {
                throw new \Exception('Token cannot be refreshed until existing token is valid.');
            }
        } else {
            if ($type === 'refresh') {
                throw new \Exception('Refresh token cannot be used to access resources.');
            }
        }
    }
}
