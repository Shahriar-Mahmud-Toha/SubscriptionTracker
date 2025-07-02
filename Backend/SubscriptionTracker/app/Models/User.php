<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = true;
    public $timestamps = true;
    protected $fillable = ['auth_id', 'first_name', 'last_name', 'dob', 'timezone_preferred', 'timezone_last_known'];

    //One to one
    public function authentication()
    {
        return $this->belongsTo(Authentication::class, 'auth_id', 'id');
    }
}
