<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'creator_uuid',
        'name',
        'password',
        'video_enabled',
        'audio_enabled',
        'participant_timeline_enabled',
        'cam_timeline_enabled',
        'face_timeline_enabled',
        'lobby_enabled',
        'timelines',
        'cam_timelines',
        'face_timelines',
        'started_at',
        'ended_at',
    ];

    protected $casts = [
        'video_enabled' => 'boolean',
        'audio_enabled' => 'boolean',
        'participant_timeline_enabled' => 'boolean',
        'cam_timeline_enabled' => 'boolean',
        'face_timeline_enabled' => 'boolean',
        'lobby_enabled' => 'boolean',
        'timelines' => 'json',
        'cam_timelines' => 'json',
        'face_timelines' => 'json',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    protected function timelines(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => json_decode($value, true),
            set: fn ($value) => json_encode($value),
        );
    }
    protected function camTimelines(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => json_decode($value, true),
            set: fn ($value) => json_encode($value),
        );
    }
    protected function faceTimelines(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => json_decode($value, true),
            set: fn ($value) => json_encode($value),
        );
    }
}
