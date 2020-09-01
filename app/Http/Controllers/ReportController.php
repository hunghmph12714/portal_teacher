<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Account;
use App\Transaction;
use App\Tag;
use App\Classes;
use App\Course;
class ReportController extends Controller
{
    //
    protected function getFinancial(){
        // $class_id = 45;
        // $month = '09';
        // $result = $this->report($class_id, $month);

        // print_r($result);
        $classes = Classes::where('student_number', '>' , 1)->get();
        $result = [];
        foreach($classes as $class){
            $grade = Course::find($class->course_id)->grade;
            $report_08 = $this->report($class->id, '08');
            $report_09 = $this->report($class->id, '09');
            $result[] = ['class' => $class->code , 'grade' => $grade , 't8' => $report_08, 't9' => $report_09];
        }
        return response()->json($result);
    }
    public function report($class_id, $month){
        $transactions = Transaction::where('class_id', $class_id)->whereMonth('time', $month)->get();
            $hp = 0;
            $dd = 0;
            $no = 0;
            $gc = 0;
        foreach($transactions as $t){
            //hp 
            $acc_no = Account::where('level_2', '131')->first()->id;
            $dtcth = Account::where('level_2','3387')->first()->id;
            $dt = Account::where('level_2', '511')->first()->id;
            
            // print_r($t->debit);
            if($t->debit == $acc_no){
                $hp += $t->amount;
            }
            if(($t->debit == $dtcth || $t->debit == $dt) && $t->credit == $acc_no){
                $hp -= $t->amount;
            }
            //DD
            $acc = Account::where('type','equity')->get('id')->toArray();
            
            if(in_array($t->debit, array_column($acc, 'id')) && $t->credit == $acc_no){
                $dd += $t->amount;
            }
            //giữ chỗ
            $tag = Tag::where('name', 'Giữ chỗ')->first()->id;
            $t_tag = $t->tags->toArray();
            if($t_tag){
                foreach($t_tag as $tt){
                    if($tt['id'] == $tag){
                        $gc += $t->amount;
                    }
                }
            }
        }
        $no = $hp - $dd + $gc;
        return ['cd' => $hp, 'dd'=> $dd , 'gc' => $gc, 'no' => $no];

    }
}
