<?php

namespace App\Observers;

use App\parents;

class NameObserver
{
    /**
     * Handle the parents "created" event.
     *
     * @param  \App\parents  $parents
     * @return void
     */
    public function created(parents $parents)
    {
        //
    }

    /**
     * Handle the parents "updated" event.
     *
     * @param  \App\parents  $parents
     * @return void
     */
    public function updated(parents $parents)
    {
        //
    }

    /**
     * Handle the parents "deleted" event.
     *
     * @param  \App\parents  $parents
     * @return void
     */
    public function deleted(parents $parents)
    {
        //
    }

    /**
     * Handle the parents "restored" event.
     *
     * @param  \App\parents  $parents
     * @return void
     */
    public function restored(parents $parents)
    {
        //
    }

    /**
     * Handle the parents "force deleted" event.
     *
     * @param  \App\parents  $parents
     * @return void
     */
    public function forceDeleted(parents $parents)
    {
        //
    }
}
