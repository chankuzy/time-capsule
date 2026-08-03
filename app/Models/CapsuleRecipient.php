<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CapsuleRecipient extends Model
{
    protected $fillable = ['capsule_id', 'email', 'user_id', 'role', 'notified_at', 'viewed_at'];

    protected function casts(): array
    {
        return [
            'notified_at' => 'datetime',
            'viewed_at' => 'datetime',
        ];
    }

    public function capsule()
    {
        return $this->belongsTo(Capsule::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
