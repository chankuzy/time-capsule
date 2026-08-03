<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $owned = $user->capsules()->withCount('files')->get();
        $shared = $user->receivedCapsules()->withCount('files')->get();

        $all = $owned->merge($shared)->unique('id');

        return Inertia::render('Dashboard', [
            'stats' => [
                'total' => $all->count(),
                'locked' => $all->where('is_locked', true)->count(),
                'unlocked' => $all->where('is_locked', false)->count(),
                'upcoming' => $all->where('is_locked', true)
                    ->sortBy('unlock_at')
                    ->take(5)
                    ->values()
                    ->map(fn ($c) => [
                        'id' => $c->id,
                        'title' => $c->title,
                        'unlock_at' => $c->unlock_at,
                        'cover_color' => $c->cover_color,
                    ]),
            ],
            'recent' => $all->sortByDesc('created_at')->take(6)->values()->map(fn ($c) => [
                'id' => $c->id,
                'title' => $c->title,
                'type' => $c->type,
                'is_locked' => $c->is_locked,
                'unlock_at' => $c->unlock_at,
                'cover_color' => $c->cover_color,
                'files_count' => $c->files_count,
                'is_owner' => $c->user_id === $user->id,
            ]),
        ]);
    }
}
