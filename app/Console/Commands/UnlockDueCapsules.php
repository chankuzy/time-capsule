<?php

namespace App\Console\Commands;

use App\Models\Capsule;
use App\Notifications\CapsuleUnlocked;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

/**
 * Runs every minute (see routes/console.php). Finds every capsule whose
 * unlock_at has arrived, flips it open, records it, and notifies the
 * owner plus every recipient by mail + in-app notification.
 */
class UnlockDueCapsules extends Command
{
    protected $signature = 'capsules:unlock';

    protected $description = 'Unlock capsules whose scheduled date has arrived and notify everyone involved';

    public function handle(): int
    {
        $due = Capsule::dueForUnlock()->with(['owner', 'recipients.user'])->get();

        if ($due->isEmpty()) {
            $this->info('No capsules due for unlock.');

            return self::SUCCESS;
        }

        foreach ($due as $capsule) {
            $capsule->forceFill([
                'is_locked' => false,
                'unlocked_at' => now(),
            ])->save();

            $capsule->activities()->create([
                'action' => 'unlocked',
                'meta' => ['unlocked_at' => now()->toIso8601String()],
            ]);

            $recipientUsers = $capsule->recipients->pluck('user')->filter();

            Notification::send(
                collect([$capsule->owner])->merge($recipientUsers)->unique('id'),
                new CapsuleUnlocked($capsule)
            );

            $capsule->recipients()->whereNull('notified_at')->update(['notified_at' => now()]);

            $this->info("Unlocked capsule #{$capsule->id}: {$capsule->title}");
        }

        return self::SUCCESS;
    }
}
