<?php

namespace App\Listeners;

use App\Models\CapsuleRecipient;
use Illuminate\Auth\Events\Registered;

/**
 * When someone signs up, any capsule they were invited to by email
 * (before they had an account) gets linked to their new user_id so
 * it shows up under "Shared with me" immediately.
 */
class LinkRecipientRecordsToNewUser
{
    public function handle(Registered $event): void
    {
        CapsuleRecipient::where('email', $event->user->email)
            ->whereNull('user_id')
            ->update(['user_id' => $event->user->id]);
    }
}
