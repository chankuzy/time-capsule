<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'avatar'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function capsules()
    {
        return $this->hasMany(Capsule::class);
    }

    /** Capsules this user is entitled to view because they were named as a recipient/contributor. */
    public function receivedCapsules()
    {
        return $this->belongsToMany(Capsule::class, 'capsule_recipients')
            ->withPivot(['role', 'notified_at', 'viewed_at'])
            ->withTimestamps();
    }
}
