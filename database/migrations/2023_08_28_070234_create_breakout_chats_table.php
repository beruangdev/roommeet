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
        Schema::create('breakout_chats', function (Blueprint $table) {
            $table->id();
            $table->text("message");
            $table->foreignId('breakout_room_id')->constrained("breakout_rooms")->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained("users")->cascadeOnDelete();
            $table->string('participant_uuid');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('breakout_chats');
    }
};
