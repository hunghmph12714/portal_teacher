<?php

namespace App\Observers;

use App\Entrance;
use App\Student;
use App\Relationship;
class EntranceObserver
{
    /**
     * Handle the entrance "created" event.
     *
     * @param  \App\Entrance  $entrance
     * @return void
     */
    public function created(Entrance $entrance)
    {
        //
        $relation_id = Student::find($entrance->student_id)->relationship_id;
        $weight = Relationship::find($relation_id) ? Relationship::find($relation_id)->weight: 0;
        $entrance->priority += $weight;
        $entrance->save();
    }

    /**
     * Handle the entrance "updated" event.
     *
     * @param  \App\Entrance  $entrance
     * @return void
     */
    public function updated(Entrance $entrance)
    {
        //
    }

    /**
     * Handle the entrance "deleted" event.
     *
     * @param  \App\Entrance  $entrance
     * @return void
     */
    public function deleted(Entrance $entrance)
    {
        //
    }

    /**
     * Handle the entrance "restored" event.
     *
     * @param  \App\Entrance  $entrance
     * @return void
     */
    public function restored(Entrance $entrance)
    {
        //
    }

    /**
     * Handle the entrance "force deleted" event.
     *
     * @param  \App\Entrance  $entrance
     * @return void
     */
    public function forceDeleted(Entrance $entrance)
    {
        //
    }
}
