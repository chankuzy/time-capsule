<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Recipients (and shared-capsule contributors) are addressed by email,
        // never by user_id directly — user_id is resolved opportunistically,
        // either immediately if the account exists, or later when they register.
        Schema::create('capsule_recipients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('capsule_id')->constrained()->cascadeOnDelete();
            $table->string('email');
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('role', ['viewer', 'contributor'])->default('viewer');
            $table->timestamp('notified_at')->nullable();
            $table->timestamp('viewed_at')->nullable();
            $table->timestamps();

            $table->unique(['capsule_id', 'email']);
            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('capsule_recipients');
    }
};
