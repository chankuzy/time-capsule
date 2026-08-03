<?php

return [
    'default' => env('CACHE_STORE', 'database'),

    'stores' => [
        'database' => [
            'driver' => 'database',
            'connection' => env('DB_CACHE_CONNECTION'),
            'table' => env('DB_CACHE_TABLE', 'cache'),
            'lock_connection' => env('DB_CACHE_LOCK_CONNECTION'),
        ],
        'redis' => [
            'driver' => 'redis',
            'connection' => env('REDIS_CACHE_CONNECTION', 'cache'),
        ],
        'array' => ['driver' => 'array'],
    ],

    'prefix' => env('CACHE_PREFIX', 'timecapsule_cache'),
];
