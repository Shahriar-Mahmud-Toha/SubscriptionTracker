<?php

namespace App\Http\Middleware;

use App\Constants\TokenConstants;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Auth\GenericUser;

class Authentication
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $data = $this->validateToken($request);
            $this->checkAllowedToken($data['payload']);
            $this->validateRefreshToken($request, $data['payload']);
            // $user = JWTAuth::authenticate();
            // if (!$user->email_verified_at) {
            //     throw new \Exception('Account is inactive. Access denied.', 403);
            // }
            $user = new GenericUser([
                'id' => $data['payload']['sub'],
                'role' => $data['payload']['role'],
            ]);
            Auth::setUser($user);
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
            throw new \Exception('This token is Invalid or Expired.', 401);
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
    protected function checkAllowedToken($payload): void
    {
        if ($payload->get('type') !== 'refresh') {
            return; // Only check refresh tokens for banning
        }

        $jti = $payload->get('jti');
        $sub = $payload->get('sub');

        $allowedToken = Redis::get("allowed_refresh_token:{$jti}");
        $bannedUser = Redis::get("banned_user:{$sub}");
        if (!$allowedToken) {
            throw new \Exception('This token is not allowed.');
        }
        if ($bannedUser) {
            throw new \Exception('This user is suspended.');
        }
    }
    protected function validateRefreshToken(Request $request, $payload): void
    {
        $type = $payload->get('type');
        $issuedAt = $payload->get('iat');

        if ($request->is('api/refresh_token')) {
            if ($type === 'access') {
                throw new \Exception('Refresh token cannot be generated with an access token.');
            }

            $accessTokenValidity = $issuedAt + ((TokenConstants::ACCESS_TOKEN_VALIDITY * 60) - (TokenConstants::TOKEN_EXPIRE_BUFFER + 2));
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
