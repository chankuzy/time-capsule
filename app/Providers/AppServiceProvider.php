<?php

namespace App\Providers;

use App\Models\Capsule;
use App\Policies\CapsulePolicy;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Gate::policy(Capsule::class, CapsulePolicy::class);

        Event::listen(
            Registered::class,
            \App\Listeners\LinkRecipientRecordsToNewUser::class
        );
    }
}
