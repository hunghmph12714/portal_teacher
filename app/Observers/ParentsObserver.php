<?php

namespace App\Observers;

use App\Parents;

class ParentsObserver
{
    /**
     * Handle the parents "created" event.
     *
     * @param  \App\parents  $parents
     * @return void
     */
    public function created(Parents $parents)
    {
        //
    }

    /**
     * Handle the parents "updated" event.
     *
     * @param  \App\parents  $parents
     * @return void
     */
    public function updated(Parents $parents)
    {
        //
        if($parents->isDirty('email')){
            // email has changed
            $new_email = $user->email;
            $old_email = $user->getOriginal('email');
            if (strpos($new_email, '**') !== false && strpos($old_email, '**') == false) { 
                $parents->email = $old_email;
                $parents->save();
            }
            
        }
        if($parents->isDirty('phone')){
            // phone has changed
            $new_phone = $user->phone;
            $old_phone = $user->getOriginal('phone');
            if (strpos($new_phone, '**') !== false && strpos($old_phone, '**') == false) { 
                $parents->phone = $old_phone;
                $parents->save();
            }
            
        }
    }

    /**
     * Handle the parents "deleted" event.
     *
     * @param  \App\parents  $parents
     * @return void
     */
    public function deleted(Parents $parents)
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
    public function forceDeleted(Parents $parents)
    {
        //
    }
}
