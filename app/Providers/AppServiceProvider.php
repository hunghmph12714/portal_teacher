<?php

namespace App\Providers;
use App\Entrance;
use App\StudentSession;
use App\Transaction;
use App\StudentClass;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

use App\Observers\EntranceObserver;
use App\Observers\TransactionObserver;
use App\Observers\StudentSessionObserver;
use App\Observers\StudentClassObserver;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
        Schema::defaultStringLength(191);
        Entrance::observe(EntranceObserver::class);
        Transaction::observe(TransactionObserver::class);
        StudentSession::observe(StudentSessionObserver::class);
        StudentClass::observe(StudentClassObserver::class);
    }
}
