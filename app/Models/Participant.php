<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'uuid',
        'user_id',
        'room_id',
        'status',
        'approved',
        'is_creator',
    ];

    protected $casts = [
        'approved' => 'boolean',
        'is_creator' => 'boolean',
    ];
}
