<?php

namespace App\Notifications;

use App\Models\Capsule;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CapsuleSharedWithYou extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Capsule $capsule, public string $role) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $verb = $this->role === 'contributor' ? 'invited to contribute to' : 'added as a recipient of';

        return (new MailMessage)
            ->subject('You were '.$verb.' a time capsule')
            ->greeting('Someone is thinking ahead, with you in mind.')
            ->line('"'.$this->capsule->owner->name.'" has '.$verb.' the capsule "'.$this->capsule->title.'".')
            ->line('It unlocks on '.$this->capsule->unlock_at->format('F j, Y').'.')
            ->action('View details', url('/capsules/'.$this->capsule->id));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'capsule_shared',
            'capsule_id' => $this->capsule->id,
            'title' => $this->capsule->title,
            'role' => $this->role,
        ];
    }
}
