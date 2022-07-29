<?php

namespace App\Http\Controllers;

use App\ClassConfig;
use App\Classes;
use DateTime;
use Illuminate\Http\Request;

class ClassConfigController extends Controller
{
    public function move()
    {
        // dd(ClassConfig::find(1894));        
        $classes = Classes::where('year', 2021)->get();
        function formatTimeUnix(string $value)
        {
            if ($value) {
                $unix = strstr($value, '.', true);
                $datetime = new DateTime("@$unix");
                return $datetime->format('Y-m-d H:i:00');
            }
            return null;
        }
        $i = 1;
        foreach ($classes as $class) {
            $j = 0;
            if ($class->config == null) {
                continue;
            }
            foreach ($class->config as $cfg) {
                echo ' <pre>';
                // print_r($cfg) ;
                if ($cfg['room'] != null) {
                    $room = $cfg['room']['value'];
                } else {
                    $room = null;
                }
                if ($cfg['teacher'] != null) {
                    $teacher = $cfg['teacher']['value'];
                } else {
                    $teacher = null;
                }

                if ($cfg['from'] != null) {
                    $from = $cfg['from'];
                } else {
                    $from = null;
                }
                if ($cfg['to'] != null) {
                    $to = $cfg['to'];
                } else {
                    $to = null;
                }
                if ($cfg['date'] != null) {
                    $date = $cfg['date']['value'];
                } else {
                    $date = null;
                }
              $cc=  ClassConfig::create([
                    'class_id' => $class->id,
                    'teacher_id' => $teacher,
                    'from' => formatTimeUnix($from . '.0'),
                    'to' => formatTimeUnix($to . '.0'),
                    'date' =>  $date,
                    'room_id' => $room
                ]);
                // $cc->date=$date;
                // $cc->save();
                // echo $date,'<br>';
                $j++;
            }
            $i++;
            echo $i . ' ' . $class->code . ' - ' . $j . ' config';
            echo '<pre>';
        }
        dd($i);
    }
}
