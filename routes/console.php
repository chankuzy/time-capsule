<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// The heartbeat of the whole product: check every minute for capsules
// whose unlock date has arrived and release them automatically.
Schedule::command('capsules:unlock')->everyMinute()->withoutOverlapping();
