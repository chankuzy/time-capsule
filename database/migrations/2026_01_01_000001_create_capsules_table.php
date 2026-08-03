<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('capsules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // creator / owner
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['personal', 'event', 'shared'])->default('personal');
            $table->string('event_label')->nullable(); // e.g. "Graduation", "Ramadan Reflections"
            $table->string('cover_color', 7)->default('#C99A3E');
            $table->timestamp('unlock_at');
            $table->timestamp('unlocked_at')->nullable(); // set once the unlock job actually runs
            $table->boolean('is_locked')->default(true);
            $table->boolean('allow_contributions')->default(false); // shared capsules only
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_locked', 'unlock_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('capsules');
    }
};
