<?php

namespace App\Observers;

use App\Session;

class SessionObserver
{
    /**
     * Handle the session "created" event.
     *
     * @param  \App\Session  $session
     * @return void
     */
    public function created(Session $session)
    {
        //
        $from = strtotime($session->from);
        $to = strtotime($session->to);
        $diff = ($to - $from)/3600;
        $diff= round($diff, 2);

        $session->duration = $diff;
        $session->save();
    }

    /**
     * Handle the session "updated" event.
     *
     * @param  \App\Session  $session
     * @return void
     */
    public function updated(Session $session)
    {
        //
        $from = strtotime($session->from);
        $to = strtotime($session->to);
        $diff = ($to - $from)/3600;
        $diff= round($diff, 2);

        $session->duration = $diff;
        $session->save();
    }

    /**
     * Handle the session "deleted" event.
     *
     * @param  \App\Session  $session
     * @return void
     */
    public function deleted(Session $session)
    {
        //
    }

    /**
     * Handle the session "restored" event.
     *
     * @param  \App\Session  $session
     * @return void
     */
    public function restored(Session $session)
    {
        //
    }

    /**
     * Handle the session "force deleted" event.
     *
     * @param  \App\Session  $session
     * @return void
     */
    public function forceDeleted(Session $session)
    {
        //
    }
}
