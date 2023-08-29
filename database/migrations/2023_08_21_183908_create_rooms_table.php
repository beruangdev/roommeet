<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('uuid');
            $table->string('name');
            $table->string('password')->nullable();
            $table->string('creator_uuid');
            $table->boolean('video_enabled')->default(true);
            $table->boolean('audio_enabled')->default(true);
            $table->boolean('participant_timeline_enabled')->default(false);
            $table->boolean('cam_timeline_enabled')->default(false);
            $table->boolean('face_timeline_enabled')->default(false);
            $table->boolean('lobby_enabled')->default(false);
            $table->json('timelines')->nullable();
            $table->json('cam_timelines')->nullable();
            $table->json('face_timelines')->nullable();
            $table->timestamp('started_at');
            $table->timestamp('ended_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
