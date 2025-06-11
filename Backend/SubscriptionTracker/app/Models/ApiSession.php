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
        'ip_address',
        'device_info',
    ];

    // public function setRefreshTokenAttribute($value)
    // { 
    //     $this->attributes['refresh_token'] = Crypt::encryptString($value);
    // }

    //One to one
    public function authentication()
    {
        return $this->belongsTo(Authentication::class, 'auth_id', 'id');
    }
}
