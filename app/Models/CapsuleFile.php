<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class CapsuleFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'capsule_id', 'uploaded_by', 'type', 'disk', 'path',
        'original_name', 'mime_type', 'size_bytes', 'caption', 'body',
    ];

    public function capsule()
    {
        return $this->belongsTo(Capsule::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /** A short-lived signed URL — files are never served from a public, guessable path. */
    public function temporaryUrl(int $minutes = 15): ?string
    {
        if (! $this->path) {
            return null;
        }

        $disk = Storage::disk($this->disk);

        if ($disk->providesTemporaryUrls()) {
            return $disk->temporaryUrl(
                $this->path,
                now()->addMinutes($minutes)
            );
        }

        return $disk->url($this->path);
    }

    public function humanSize(): string
    {
        $bytes = $this->size_bytes ?? 0;
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }

        return round($bytes, 1).' '.$units[$i];
    }
}
