<?php

use App\Services\PqrAutoArchiveService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('pqrs:auto-archive-expired', function (PqrAutoArchiveService $service) {
    $count = $service->archiveExpiredPending();
    $this->info("PQRs archivadas por vencimiento: {$count}");
})->purpose('Archive pending PQRs that are past due date');

Schedule::command('pqrs:auto-archive-expired')
    ->everyTenMinutes()
    ->withoutOverlapping();
