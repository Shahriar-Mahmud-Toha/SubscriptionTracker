<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class ApiSession extends Model
{
    use HasFactory;

    protected $table = 'api_sessions';

    protected $primaryKey = 'id'; 

    public $incrementing = true;

    public $timestamps = true;

    protected $fillable = [
        'auth_id',
        'access_token',
        'refresh_token',
        'ip_address',
        'user_agent',
        'device_name',
        'expires_at',
    ];
    protected $casts = [
        'expires_at' => 'datetime',
    ];
    public function setAccessTokenAttribute($value)
    {
        $this->attributes['access_token'] = Crypt::encryptString($value);
    }

    public function setRefreshTokenAttribute($value)
    { 
        $this->attributes['refresh_token'] = Crypt::encryptString($value);
    }

    //One to one
    public function authentication()
    {
        return $this->belongsTo(Authentication::class, 'auth_id', 'id');
    }
}
