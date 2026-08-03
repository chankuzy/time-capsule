<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRecipientRequest;
use App\Models\Capsule;
use App\Models\CapsuleRecipient;
use App\Models\User;
use App\Notifications\CapsuleSharedWithYou;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Notification;

class CapsuleRecipientController extends Controller
{
    public function store(StoreRecipientRequest $request, Capsule $capsule): RedirectResponse
    {
        $this->authorize('manageRecipients', $capsule);

        $recipient = CapsuleRecipient::firstOrCreate(
            ['capsule_id' => $capsule->id, 'email' => $request->validated('email')],
            [
                'role' => $request->validated('role'),
                'user_id' => optional(User::firstWhere('email', $request->validated('email')))->id,
            ]
        );

        $capsule->activities()->create([
            'user_id' => $request->user()->id,
            'action' => 'recipient_added',
            'meta' => ['email' => $recipient->email],
        ]);

        if ($recipient->user_id) {
            Notification::send($recipient->user, new CapsuleSharedWithYou($capsule, $recipient->role));
        }

        return back()->with('success', $recipient->email.' added to this capsule.');
    }

    public function destroy(Capsule $capsule, CapsuleRecipient $recipient): RedirectResponse
    {
        $this->authorize('manageRecipients', $capsule);

        $recipient->delete();

        return back()->with('success', 'Recipient removed.');
    }
}
