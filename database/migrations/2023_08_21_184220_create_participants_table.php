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
        Schema::create('participants', function (Blueprint $table) {
            $table->id();

            $table->string('uuid');
            $table->string('name');
            $table->foreignId('user_id')->nullable()->constrained("users")->cascadeOnDelete();
            $table->foreignId('room_id')->constrained("rooms")->cascadeOnDelete();
            $table->enum('status', ['in_lobby', 'in_room', 'left'])->default('in_lobby')->comment("Menentukan apakah partisipan berada di dalam lobby, ruangan, atau telah meninggalkan ruangan");
            $table->boolean('approved')->default(false);
            $table->boolean('is_creator')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participants');
    }
};
