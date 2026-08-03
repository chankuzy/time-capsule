<?php

namespace App\Policies;

use App\Models\Capsule;
use App\Models\User;

class CapsulePolicy
{
    /** Owner + anyone named as a recipient/contributor by email can view. */
    public function view(User $user, Capsule $capsule): bool
    {
        return $capsule->canBeViewedBy($user);
    }

    /** Only the owner can rename, reschedule, or delete the capsule itself. */
    public function update(User $user, Capsule $capsule): bool
    {
        return $capsule->user_id === $user->id;
    }

    public function delete(User $user, Capsule $capsule): bool
    {
        return $capsule->user_id === $user->id;
    }

    /** Owner always; contributors only while the capsule is still locked. */
    public function contribute(User $user, Capsule $capsule): bool
    {
        return $capsule->canBeContributedToBy($user);
    }

    public function manageRecipients(User $user, Capsule $capsule): bool
    {
        return $capsule->user_id === $user->id;
    }
}
