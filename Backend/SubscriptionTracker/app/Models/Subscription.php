<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = true;
    public $timestamps = true;
    protected $fillable = ['auth_id', 'name', 'seller_info', 'reminder_time', 'date_of_purchase', 'reminder_job_id', 'duration', 'date_of_expiration', 'account_info', 'price', 'currency', 'comment', 'file_name'];

    protected $casts = [
        'reminder_time' => 'datetime',
        'date_of_purchase' => 'datetime',
        'date_of_expiration' => 'datetime',
    ];

    //One to one
    public function authentication()
    {
        return $this->belongsTo(Authentication::class, 'auth_id', 'id');
    }
}
