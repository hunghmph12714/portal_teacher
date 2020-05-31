<?php

namespace App\Observers;

use App\StudentSession;
use App\Session;
use App\Student;

class StudentSessionObserver
{
    /**
     * Handle the student session "created" event.
     *
     * @param  \App\StudentSession  $studentSession
     * @return void
     */
    public function created(StudentSession $studentSession)
    {
        //
        $session = Session::find($studentSession->session_id);
        if($session){
            $session->ss_number += 1;
            $session->save();
        }
    }

    /**
     * Handle the student session "updated" event.
     *
     * @param  \App\StudentSession  $studentSession
     * @return void
     */
    public function updated(StudentSession $studentSession)
    {
        //
    }

    /**
     * Handle the student session "deleted" event.
     *
     * @param  \App\StudentSession  $studentSession
     * @return void
     */
    public function deleted(StudentSession $studentSession)
    {
        //
    }

    /**
     * Handle the student session "restored" event.
     *
     * @param  \App\StudentSession  $studentSession
     * @return void
     */
    public function restored(StudentSession $studentSession)
    {
        //
    }

    /**
     * Handle the student session "force deleted" event.
     *
     * @param  \App\StudentSession  $studentSession
     * @return void
     */
    public function forceDeleted(StudentSession $studentSession)
    {
        //
    }
}
