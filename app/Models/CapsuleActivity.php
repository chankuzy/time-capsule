<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CapsuleActivity extends Model
{
    protected $fillable = ['capsule_id', 'user_id', 'action', 'meta'];

    protected function casts(): array
    {
        return ['meta' => 'array'];
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
