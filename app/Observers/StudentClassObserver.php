<?php

namespace App\Observers;

use App\StudentClass;
use App\Student;
use App\Classes;
use App\StudentSession;
use App\Session;
use App\Transaction;
use App\Account;
use App\Discount;
class StudentClassObserver
{
    /**
     * Handle the student class "created" event.
     *
     * @param  \App\StudentClass  $studentClass
     * @return void
     */
    protected function applyFeeAdjustment($session_id, $student_id){
        $session = Session::find($session_id);
        if($session){
            $discount = Discount::where('class_id', $session->class_id)->whereNull('student_class_id')
                ->where('active_at','<=',$session->date)->where('expired_at', '>=', $session->date)->get();
            foreach($discount as $d){
                if($d->amount < 0){
                    $t['debit'] = Account::Where('level_2', '511')->first()->id;
                    $t['credit'] = Account::Where('level_2', '131')->first()->id;
                }
                else{
                    $t['debit'] = Account::Where('level_2', '131')->first()->id;
                    $t['credit'] = Account::Where('level_2', '3387')->first()->id;
                }
                $t['amount'] = abs($d->amount);
                $t['time'] = Date('Y-m-d', strtotime($session->date));
                $t['student_id'] = $student_id; 
                $t['class_id'] = $d->class_id;
                $t['user'] = auth()->user()->id;
                $t['content'] = $d->content;
                Transaction::create($t);
            }
        }
    }

    public function generateTransactions($sessions, $student, $class_id){
        $fees = [];
        $class = Classes::find($class_id);
        $fee_per_session = 0;
        foreach($sessions as $s){
            $month = date('m-Y', strtotime($s['date']));
            if(!array_key_exists($month, $fees)){
                $fees[$month]['amount'] = 0;
                $fees[$month]['count'] = 0;
            }
            else{
                $fees[$month]['amount'] += $s['fee'];
                $fees[$month]['count']++;
            }
            $fee_per_session = $s['fee'];
            $this->applyFeeAdjustment($s['id'], $student->id);
        }
        // print_r($fees);
        foreach($fees as $key => $fee){
            if($fee != 0){
                $s = $student;
                                    //Create new transaction for fee
                //Find account 131
                $t['debit'] = Account::Where('level_2', '131')->first()->id;
                $t['credit'] = Account::Where('level_2', '3387')->first()->id;
                $t['amount'] = $fee['amount'];
                $t['time'] = Date('Y-m-d', strtotime('1-'.$key));
                $t['student_id'] = $s->id;
                $t['class_id'] = $class_id;
                $t['user'] = auth()->user()->id;
                $t['content'] = 'Học phí lớp ' .($class ? $class->code : ''). ' tháng '. $key .': '. $fee['count']. ' ca*'.$fee_per_session.'đ';
                Transaction::create($t);
                //Check Discount
                $student_class = StudentClass::where('student_id', $s->id)->where('class_id', $class_id)->first();
                $discounts = Discount::where('student_class_id', $student_class->id)
                                    ->where('status', 'active')
                                    ->where('max_use','>',0)
                                    ->where('expired_at', '>', $t['time'])->get();
                foreach($discounts as $d){
                    //Check discount available
                    $dt['credit'] = Account::Where('level_2', '131')->first()->id;
                    $dt['debit'] = Account::Where('level_2', '511')->first()->id;
                    $dt['time'] = Date('Y-m-d', strtotime('1-'.$key));
                    $dt['student_id'] = $s->id;
                    $dt['class_id'] = $class_id;
                    $dt['user'] = auth()->user()->id;                                           
                    if($d['percentage']){
                        $dt['amount'] = $fee['amount']/100*intval($d['percentage']);
                        $dt['content'] = 'Miễn giảm học phí '. $key . ' '.$d['percentage'].'%';     
                    }
                    if($d['amount']){
                        $dt['amount'] = intval($d['amount']);
                        $dt['content'] = 'Miễn giảm học phí '. $key . ' '.intval($d['amount']).'đ';     
                        $discount = Discount::find($d['id']);
                        $discount->max_use= $discount->max_use - 1;
                        $discount->save();
                    }
                    Transaction::create($dt);
                }
                    
            }
        }
    }
    public function created(StudentClass $studentClass)
    {
        //
        $student = Student::find($studentClass->student_id);
        if($studentClass->status == "active" && $student){
            //Create attendance for that student
            $sessions = Session::where('class_id', $studentClass->class_id)->whereDate('date','>=', $studentClass->entrance_date)->get();
            $sessions_id = array_column($sessions->toArray(), 'id');
            $student->sessions()->sync($sessions_id);
            $students = Student::where('id', $student->id)->first();
            //Create fee (transaction)
            $this->generateTransactions($sessions, $students,  $studentClass->class_id);

            $class = Classes::find($studentClass->class_id);
            $class->student_number++;
            $class->save();
        }        
        
    }

    /**
     * Handle the student class "updated" event.
     *
     * @param  \App\StudentClass  $studentClass
     * @return void
     */
    public function updated(StudentClass $studentClass)
    {
        //
        if($studentClass->getOriginal('status') == 'waiting'){
            if($studentClass->status == 'active'){
                $student = Student::find($studentClass->student_id);
                if($student){
                    //Create attendance for that student
                    $sessions = Session::where('class_id', $studentClass->class_id)->whereDate('date','>=', $studentClass->entrance_date)->get();
                    $sessions_id = array_column($sessions->toArray(), 'id');
                    $student->sessions()->sync($sessions_id);
                    $students = Student::where('id', $student->id)->first();
                    //Create fee (transaction)
                    $this->generateTransactions($sessions, $students,  $studentClass->class_id);
                }
            }
        }
        if($studentClass->getOriginal('status') == 'active'){
            
        }
    }

    /**
     * Handle the student class "deleted" event.
     *
     * @param  \App\StudentClass  $studentClass
     * @return void
     */
    public function deleted(StudentClass $studentClass)
    {
        //
    }

    /**
     * Handle the student class "restored" event.
     *
     * @param  \App\StudentClass  $studentClass
     * @return void
     */
    public function restored(StudentClass $studentClass)
    {
        //
    }

    /**
     * Handle the student class "force deleted" event.
     *
     * @param  \App\StudentClass  $studentClass
     * @return void
     */
    public function forceDeleted(StudentClass $studentClass)
    {
        //
        
    }
}
