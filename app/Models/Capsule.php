<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Capsule extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'title', 'description', 'type', 'event_label',
        'cover_color', 'unlock_at', 'is_locked', 'allow_contributions',
    ];

    protected function casts(): array
    {
        return [
            'unlock_at' => 'datetime',
            'unlocked_at' => 'datetime',
            'is_locked' => 'boolean',
            'allow_contributions' => 'boolean',
        ];
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function files()
    {
        return $this->hasMany(CapsuleFile::class)->orderBy('created_at');
    }

    public function recipients()
    {
        return $this->hasMany(CapsuleRecipient::class);
    }

    public function activities()
    {
        return $this->hasMany(CapsuleActivity::class)->latest();
    }

    public function scopeLocked($query)
    {
        return $query->where('is_locked', true);
    }

    public function scopeUnlocked($query)
    {
        return $query->where('is_locked', false);
    }

    /** Capsules due to unlock right now — used by the scheduled unlock command. */
    public function scopeDueForUnlock($query)
    {
        return $query->locked()->where('unlock_at', '<=', now());
    }

    public function isOverdue(): bool
    {
        return $this->is_locked && $this->unlock_at->isPast();
    }

    public function daysUntilUnlock(): int
    {
        return $this->is_locked ? max(0, now()->diffInDays($this->unlock_at, false)) : 0;
    }

    /** Anyone allowed to see the sealed metadata (owner + named recipients/contributors). */
    public function canBeViewedBy(?User $user): bool
    {
        if (! $user) {
            return false;
        }

        if ($this->user_id === $user->id) {
            return true;
        }

        return $this->recipients()->where('email', $user->email)->exists();
    }

    /** Only contributors (or the owner) may add content to a shared capsule. */
    public function canBeContributedToBy(?User $user): bool
    {
        if (! $user || $this->is_locked === false) {
            return false;
        }

        if ($this->user_id === $user->id) {
            return true;
        }

        return $this->allow_contributions
            && $this->recipients()->where('email', $user->email)->where('role', 'contributor')->exists();
    }
}
