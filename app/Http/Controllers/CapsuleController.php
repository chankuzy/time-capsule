<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCapsuleRequest;
use App\Http\Requests\UpdateCapsuleRequest;
use App\Models\Capsule;
use App\Models\CapsuleRecipient;
use App\Notifications\CapsuleSharedWithYou;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class CapsuleController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $filter = $request->string('filter', 'all')->toString(); // all|locked|unlocked|shared

        $owned = $user->capsules()->withCount('files');
        $shared = $user->receivedCapsules()->withCount('files');

        $capsules = $owned->get()->merge($shared->get())->unique('id')
            ->when($filter === 'locked', fn ($c) => $c->where('is_locked', true))
            ->when($filter === 'unlocked', fn ($c) => $c->where('is_locked', false))
            ->when($filter === 'shared', fn ($c) => $c->where('user_id', '!=', $user->id))
            ->sortByDesc('created_at')
            ->values()
            ->map(fn ($c) => [
                'id' => $c->id,
                'title' => $c->title,
                'description' => $c->description,
                'type' => $c->type,
                'event_label' => $c->event_label,
                'is_locked' => $c->is_locked,
                'unlock_at' => $c->unlock_at,
                'cover_color' => $c->cover_color,
                'files_count' => $c->files_count,
                'is_owner' => $c->user_id === $user->id,
            ]);

        return Inertia::render('Capsules/Index', [
            'capsules' => $capsules,
            'filter' => $filter,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Capsules/Create');
    }

    public function store(StoreCapsuleRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $recipients = collect($validated['recipients'] ?? [])->unique()->values();

        $capsule = DB::transaction(function () use ($request, $validated, $recipients) {
            $capsule = $request->user()->capsules()->create([
                ...collect($validated)->except('recipients')->all(),
                'is_locked' => true,
            ]);

            $capsule->activities()->create(['user_id' => $request->user()->id, 'action' => 'created']);

            $recipientModels = $recipients->map(function (string $email) use ($capsule, $validated) {
                return CapsuleRecipient::create([
                    'capsule_id' => $capsule->id,
                    'email' => $email,
                    'user_id' => optional(\App\Models\User::firstWhere('email', $email))->id,
                    'role' => $validated['type'] === 'shared' && ($validated['allow_contributions'] ?? false)
                        ? 'contributor'
                        : 'viewer',
                ]);
            });

            return $capsule->setRelation('recipients', $recipientModels);
        });

        // Notify anyone who already has an account; others get linked + notified on signup.
        $capsule->recipients->whereNotNull('user_id')->each(function (CapsuleRecipient $r) use ($capsule) {
            Notification::send($r->user, new CapsuleSharedWithYou($capsule, $r->role));
        });

        return redirect()->route('capsules.show', $capsule)
            ->with('success', 'Capsule sealed. It unlocks on '.$capsule->unlock_at->format('F j, Y').'.');
    }

    public function show(Request $request, Capsule $capsule): Response
    {
        $this->authorize('view', $capsule);

        $capsule->load(['files.uploader', 'recipients.user', 'owner']);

        return Inertia::render('Capsules/Show', [
            'capsule' => [
                'id' => $capsule->id,
                'title' => $capsule->title,
                'description' => $capsule->description,
                'type' => $capsule->type,
                'event_label' => $capsule->event_label,
                'cover_color' => $capsule->cover_color,
                'unlock_at' => $capsule->unlock_at,
                'unlocked_at' => $capsule->unlocked_at,
                'is_locked' => $capsule->is_locked,
                'allow_contributions' => $capsule->allow_contributions,
                'is_owner' => $capsule->user_id === $request->user()->id,
                'can_contribute' => $capsule->canBeContributedToBy($request->user()),
                'owner' => ['id' => $capsule->owner->id, 'name' => $capsule->owner->name],
                'created_at' => $capsule->created_at,
                'files' => $capsule->is_locked ? [] : $capsule->files->map(fn ($f) => [
                    'id' => $f->id,
                    'type' => $f->type,
                    'caption' => $f->caption,
                    'body' => $f->body,
                    'original_name' => $f->original_name,
                    'size' => $f->humanSize(),
                    'url' => $f->temporaryUrl(),
                    'uploader' => $f->uploader->name,
                    'created_at' => $f->created_at,
                ]),
                'files_locked_count' => $capsule->is_locked ? $capsule->files()->count() : null,
                'recipients' => $capsule->user_id === $request->user()->id
                    ? $capsule->recipients->map(fn ($r) => [
                        'id' => $r->id,
                        'email' => $r->email,
                        'role' => $r->role,
                        'has_account' => (bool) $r->user_id,
                    ])
                    : [],
            ],
        ]);
    }

    public function edit(Capsule $capsule): Response
    {
        $this->authorize('update', $capsule);

        return Inertia::render('Capsules/Edit', [
            'capsule' => $capsule->only([
                'id', 'title', 'description', 'type', 'event_label',
                'cover_color', 'unlock_at', 'allow_contributions', 'is_locked',
            ]),
        ]);
    }

    public function update(UpdateCapsuleRequest $request, Capsule $capsule): RedirectResponse
    {
        // Once opened, a capsule is a historical record — its schedule and
        // framing can no longer be edited, only its future contributions.
        if (! $capsule->is_locked) {
            return back()->with('error', 'This capsule has already unlocked and can no longer be edited.');
        }

        $capsule->update($request->validated());

        return redirect()->route('capsules.show', $capsule)->with('success', 'Capsule updated.');
    }

    public function destroy(Request $request, Capsule $capsule): RedirectResponse
    {
        $this->authorize('delete', $capsule);

        $capsule->delete();

        return redirect()->route('capsules.index')->with('success', 'Capsule deleted.');
    }
}
