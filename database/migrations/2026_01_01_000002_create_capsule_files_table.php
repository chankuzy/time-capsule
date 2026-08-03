<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('capsule_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('capsule_id')->constrained()->cascadeOnDelete();
            $table->foreignId('uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->enum('type', ['photo', 'video', 'audio', 'document', 'message']);
            $table->string('disk')->default('public');
            $table->string('path')->nullable(); // null for pure text 'message' entries
            $table->string('original_name')->nullable();
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size_bytes')->nullable();
            $table->text('caption')->nullable();
            $table->longText('body')->nullable(); // written message content
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('capsule_files');
    }
};
