<?php

namespace App\Providers;
use App\Entrance;
use App\Transaction;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

use App\Observers\EntranceObserver;
use App\Observers\TransactionObserver;
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
    }
}
