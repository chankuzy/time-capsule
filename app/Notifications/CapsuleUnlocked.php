<?php

namespace App\Notifications;

use App\Models\Capsule;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CapsuleUnlocked extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Capsule $capsule) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('A capsule has unlocked: '.$this->capsule->title)
            ->greeting('Time to look back. 🕰️')
            ->line('"'.$this->capsule->title.'" has just unlocked and is ready to open.')
            ->when($this->capsule->description, fn ($mail) => $mail->line($this->capsule->description))
            ->action('Open capsule', url('/capsules/'.$this->capsule->id))
            ->line('This capsule was sealed on '.$this->capsule->created_at->format('F j, Y').'.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'capsule_unlocked',
            'capsule_id' => $this->capsule->id,
            'title' => $this->capsule->title,
        ];
    }
}
