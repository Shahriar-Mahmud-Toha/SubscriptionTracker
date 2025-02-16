<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Authentication extends Authenticatable implements JWTSubject, MustVerifyEmail
{
    use HasFactory, Notifiable;

    protected $table = 'authentications';
    protected $fillable = ['role', 'email', 'password', 'email_verified_at'];
    protected $hidden = ['password'];

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }

    //One to one
    public function user()
    {
        return $this->hasOne(User::class, 'auth_id', 'id');
    }
    //One to Many
    public function apiSessions()
    {
        return $this->hasMany(ApiSession::class, 'auth_id', 'id');
    }
    //One to Many
    public function subscriptions()
    {
        return $this->hasMany(ApiSession::class, 'auth_id', 'id');
    }

    //JWT Implemented Methods
    public function getJWTIdentifier()
    {
        return $this->getKey(); // Typically returns the primary key (e.g., 'id')
    }

    /**
     * Return a key-value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return []; // Add custom claims if needed
    }
}
