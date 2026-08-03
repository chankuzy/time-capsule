# Digital Time Capsule

A production-grade capsule system built on **Laravel 11 + Inertia.js + React**.
Users seal photos, videos, audio, documents, and written messages into a
capsule, pick a future date, and the capsule unlocks itself automatically —
notifying the owner and every recipient by email and in-app notification.

## Stack

- **Backend:** Laravel 11 (PHP 8.2+), MySQL/Postgres, database-driven queue + scheduler
- **Frontend:** React 18 via Inertia.js (no separate API layer — controllers return Inertia responses directly)
- **Styling:** Tailwind CSS, custom "sealing wax" design system (`tailwind.config.js`)
- **Storage:** local disk for development, S3-compatible disk for production (`config/filesystems.php`)

## Why the code isn't runnable out of the box here

This project was generated in a sandboxed environment without access to
Packagist or a database, so `composer install` could not be executed here.
Every application file (migrations, models, controllers, policies,
notifications, the scheduled unlock command, and all React/Inertia pages) is
complete and production-ready — you just need to run the installs below on
your own machine.

## First-time setup

```bash
# 1. Install PHP dependencies
composer install

# 2. Install JS dependencies
npm install

# 3. Environment
cp .env.example .env
php artisan key:generate

# 4. Point .env at a real MySQL/Postgres database, then:
php artisan migrate

# (optional) seed a demo user + capsules — login: khalifa@example.com / password
php artisan db:seed

# 5. Storage — capsule files are stored under storage/app/public in dev
php artisan storage:link

# 6. Build frontend assets
npm run dev      # for local development (Vite HMR)
# or
npm run build    # for production

# 7. Serve
php artisan serve
```

Visit `http://localhost:8000`.

## Making unlocking actually happen

Capsules unlock via `php artisan capsules:unlock`, scheduled to run every
minute in `routes/console.php`. For this to fire automatically you need
**one** cron entry pointed at Laravel's scheduler:

```bash
* * * * * cd /path-to-project && php artisan schedule:run >> /dev/null 2>&1
```

Notifications (email + in-app) are queued, so you also need a queue worker
running in production:

```bash
php artisan queue:work --tries=3
```

In local development, `QUEUE_CONNECTION=sync` in `.env` will run jobs inline
if you don't want to run a worker.

## Project structure

```
app/
  Console/Commands/UnlockDueCapsules.php   # the unlock heartbeat
  Http/Controllers/                        # Capsule, CapsuleFile, CapsuleRecipient, Dashboard, Auth/*
  Http/Requests/                           # validation for capsule + file + recipient forms
  Models/                                  # User, Capsule, CapsuleFile, CapsuleRecipient, CapsuleActivity
  Notifications/                           # CapsuleUnlocked, CapsuleSharedWithYou
  Policies/CapsulePolicy.php               # view / update / contribute / manageRecipients rules
  Listeners/LinkRecipientRecordsToNewUser.php  # email-based delivery: backfills user_id on signup
database/migrations/                       # full schema
resources/js/
  Pages/                                   # Welcome, Auth/*, Dashboard, Capsules/{Index,Create,Show,Edit}
  Components/                              # WaxSeal, Countdown, CapsuleCard, form inputs, toasts
  Layouts/                                 # AppLayout (authenticated), GuestLayout (auth pages)
```

## Key design decisions

- **Email-based delivery, not user IDs.** `capsule_recipients` stores the
  recipient's email always, and `user_id` is filled in immediately if the
  account exists, or later via the `Registered` event listener when they sign
  up. This is what lets you invite someone who doesn't have an account yet.
- **Locking is enforced server-side.** `CapsulePolicy` and the `is_locked`
  flag control who can view contents, edit the schedule, or contribute — the
  frontend never decides this on its own; it just reflects what the
  controller sends down.
- **Shared capsules distinguish viewers from contributors.** A recipient's
  `role` on `capsule_recipients` determines whether they can only view once
  unlocked, or add photos/messages while it's still sealed.
- **Files are never served from a public, guessable path.** `CapsuleFile::temporaryUrl()`
  returns a signed, time-limited URL when using S3; on the local disk it falls
  back to the public storage symlink for convenience in development.

## Extending this

- Swap `FILESYSTEM_DISK=public` for `FILESYSTEM_DISK=s3` and fill in the
  `AWS_*` values in `.env` to move file storage to S3 without touching any
  application code.
- Add a `capsules:remind` command + notification if you want a "capsule
  unlocks in 7 days" heads-up before the actual unlock.
- The `CapsuleActivity` model already logs `created`, `file_uploaded`,
  `recipient_added`, and `unlocked` — a per-capsule timeline view on the Show
  page is a natural next feature.
