<?php

use App\Models\Entrance;

function KQEntrance($student_id, $class_id)
{

    $entrance = Entrance::where('student_id', $student_id)->where('class_id',$class_id)->first();

    if($entrance){
            return $entrance;
    }return '';
}
