<?php

namespace App\Observers;

use App\Entrance;
use App\Student;
use App\Relationship;
use Auth;
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

        $entrance->status()->attach([
            $entrance->status_id => ['active' => '1', 'user_id' => (Auth::user() ? auth()->user()->id : '')]
        ]);

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
        //Find current active status
        // if($entrance->getOriginal('status_id') != $entrance->status_id){
        //     $active_status = $entrance->status()->where('active', '1')->first();
        //     if($active_status){
        //         if($active_status->status_id != $entrance->status_id){
        //             $entrance->status()->updateExistingPivot($active_status->status_id, ['active' => '0'] );
        //             $entrance->status()->attach([
        //                 $entrance->status_id => ['active' => '1', 'user_id' => auth()->user()->id]
        //             ]);
        //         }
        //     }else{
        //         $entrance->status()->attach([
        //             $entrance->status_id => ['active' => '1', 'user_id' => auth()->user()->id]
        //         ]);
        //     }
        // }
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
