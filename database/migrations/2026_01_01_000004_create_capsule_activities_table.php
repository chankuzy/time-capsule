<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Lightweight audit trail: created, file added, opened, shared, etc.
        // Powers the "recent activity" feed on the dashboard.
        Schema::create('capsule_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('capsule_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action'); // created, file_uploaded, recipient_added, unlocked, viewed
            $table->json('meta')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('capsule_activities');
    }
};
