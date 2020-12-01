<?php

namespace App\Observers;

use App\StudentClass;
use App\Student;
use App\Classes;
use App\StudentSession;
use App\Session;
use App\Transaction;
use App\Account;
use App\TransactionSession;
use App\Discount;
class StudentClassObserver
{
    /**
     * Handle the student class "created" event.
     *
     * @param  \App\StudentClass  $studentClass
     * @return void
     */
  
    public function generateTransactions($sessions, $student, $class_id){
        $fees = [];
        $class = Classes::find($class_id);
        $fee_per_session = 0;
        foreach($sessions as $s){
            $month = date('m-Y', strtotime($s['date']));
            if(!array_key_exists($month, $fees)){
                $fees[$month]['amount'] = $s['fee'];
                $fees[$month]['count'] = 1;
                $fees[$month]['session_id'][$s['id']] =  ['amount' => $s['fee']] ;
            }
            else{
                $fees[$month]['amount'] += $s['fee'];
                $fees[$month]['count']++;
                $fees[$month]['session_id'][$s['id']] =  ['amount' => $s['fee']] ;
            }
            $fee_per_session = $s['fee'];
            
            if(!array_key_exists('adjust',$fees[$month] )){$fees[$month]['adjust'] = [];}
            $discount = Discount::where('class_id', $s->class_id)->whereNull('student_class_id')->where('status', 'expired')
                ->where('active_at','<=',$s->date)->where('expired_at', '>=', $s->date)->get();
            foreach($discount as $d){
                if(!array_key_exists($d->id, $fees[$month]['adjust'])){
                    if($d->amount){
                        $fees[$month]['adjust'][$d->id]['amount'] = $d->amount;
                        $fees[$month]['adjust'][$d->id]['session_ids'][$s['id']] = ['amount' => ($d->amount)];
                        $fees[$month]['adjust'][$d->id]['content'] = $d->content;                        
                    }
                    if($d->percentage){
                        $fees[$month]['adjust'][$d->id]['amount'] = $s['fee']/100 * (intval($d->percentage));
                        $fees[$month]['adjust'][$d->id]['session_ids'][$s['id']] = ['amount' => $s['fee']/100 * (intval($d->percentage))];
                        $fees[$month]['adjust'][$d->id]['content'] = $d->content;            
                    }
                }
                else{
                    if($d->amount){
                        $fees[$month]['adjust'][$d->id]['amount'] +=  $d->amount;
                        $fees[$month]['adjust'][$d->id]['session_ids'][$s['id']] = ['amount' => ($d->amount)];

                    }
                    if($d->percentage){
                        $fees[$month]['adjust'][$d->id]['amount'] += $s['fee']/100 * (intval($d->percentage));
                        $fees[$month]['adjust'][$d->id]['session_ids'][$s['id']] = ['amount' => $s['fee']/100 * (intval($d->percentage))];
                    }
                }
            }
            // $this->applyFeeAdjustment($s['id'], $student->id);
        }
        
        foreach($fees as $key => $fee){
            if($fee != 0){
                $s = $student;
                $total_adjust = 0;
                //Create new transaction for fee
                //Find account 131
                
                $t['debit'] = Account::Where('level_2', '131')->first()->id;
                $t['credit'] = Account::Where('level_2', '3387')->first()->id;
                $t['amount'] = $fee['amount'];
                $t['time'] = Date('Y-m-d', strtotime('1-'.$key));
                $t['student_id'] = $s->id;
                $t['class_id'] = $class_id;
                $t['user'] = auth()->user()->id;
                $t['content'] = 'Học phí lớp ' .($class ? $class->code : ''). ' tháng '. $key ;
                $created_transaction = Transaction::create($t);
                $created_transaction->tags()->syncWithoutDetaching([7]);
                $created_transaction->sessions()->syncWithoutDetaching($fee['session_id']);
                //Apply Ajust Fee
                
                foreach($fee['adjust'] as $a => $adjust){
                    $total_adjust += $adjust['amount'];
                    if($adjust['amount'] > 0){
                        $ta['debit'] = Account::Where('level_2', '131')->first()->id;
                        $ta['credit'] = Account::Where('level_2', '3387')->first()->id;
                    }
                    if($adjust['amount'] < 0){
                        $ta['debit'] = Account::Where('level_2', '3387')->first()->id;
                        $ta['credit'] = Account::Where('level_2', '131')->first()->id;
                    }
                    $ta['amount'] = abs($adjust['amount']);
                    $ta['time'] = Date('Y-m-t', strtotime('1-'.$key));
                    $ta['student_id'] = $s->id;
                    $ta['class_id'] = $class_id;
                    $ta['user'] = auth()->user()->id;
                    $ta['content'] = $adjust['content'];
                    $created_transaction = Transaction::create($ta);
                    $created_transaction->tags()->syncWithoutDetaching([8]);
                    $adj = [];
                    foreach($adjust['session_ids'] as $akey => $amo){
                        $adj[$akey] = ['amount' => abs($amo['amount'])];
                    }
                    $created_transaction->sessions()->syncWithoutDetaching($adj);
                }
                //Check Discount
                $student_class = StudentClass::where('student_id', $s->id)->where('class_id', $class_id)->first();
                $discounts = Discount::where('student_class_id', $student_class->id)
                                    ->where('status', 'active')
                                    ->where('max_use','>',0)
                                    ->where('expired_at', '>=', $t['time'])->where('active_at', '<=' , $t['time'])->get();
                // print_r($t);
                // print_r($discounts->toArray());
                foreach($discounts as $d){
                    //Check discount available
                    $dt['credit'] = Account::Where('level_2', '131')->first()->id;
                    $dt['debit'] = Account::Where('level_2', '511')->first()->id;
                    $dt['time'] = Date('Y-m-t', strtotime('1-'.$key));
                    $dt['student_id'] = $s->id;
                    $dt['class_id'] = $class_id;
                    $dt['user'] = auth()->user()->id;                                           
                    if($d['percentage']){
                        $dt['amount'] = ($fee['amount'] + $total_adjust) / 100 * intval($d['percentage']);
                        $dt['content'] = 'Miễn giảm học phí '.$d['percentage'].'%';
                        $sids = [];
                        foreach($fee['session_id'] as $sid => $f){
                            $discount_per_session = $f['amount'];
                            foreach($fee['adjust'] as $a){
                                foreach($a['session_ids'] as $sdid => $da){
                                    if($sdid == $sid){
                                        $discount_per_session += $da['amount'];
                                    }
                                }
                            }
                            $sids[$sid] = ['amount' => $discount_per_session/ 100 * intval($d['percentage']) ];
                        }
                        $created_transaction = Transaction::create($dt);
                        $created_transaction->tags()->syncWithoutDetaching([9]);
                        $created_transaction->sessions()->syncWithoutDetaching($sids);
                    }
                    if($d['amount']){
                        $dt['amount'] = intval($d['amount']);
                        $dt['content'] = 'Miễn giảm học phí '. $key . ' '.intval($d['amount']).'đ';     
                        $discount = Discount::find($d['id']);
                        $discount->max_use= $discount->max_use - 1;
                        $discount->save();
                        $created_transaction = Transaction::create($dt);
                        $created_transaction->tags()->syncWithoutDetaching([9]);
                    }
                    
                    
                }
                    
            }
        }
    }
    public function created(StudentClass $studentClass)
    {
        //
        $class = Classes::find($studentClass->class_id);
        $this->updateClassCount($class);

        $student = Student::find($studentClass->student_id);
        if($studentClass->status == "active" && $student && $class->type == "class"){
            //Create attendance for that student
            $sessions = Session::where('class_id', $studentClass->class_id)->where('type','!=', 'tutor')->where('type', '!=', 'tutor_online')->where('type', '!=', 'compensate')->whereDate('date','>=', $studentClass->entrance_date)->get();
            $sessions_id = array_column($sessions->toArray(), 'id');
            $student->sessions()->syncWithoutDetaching($sessions_id);
            $students = Student::where('id', $student->id)->first();
            //Create fee (transaction)
            $this->generateTransactions($sessions, $students,  $studentClass->class_id);

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
        $class = Classes::find($studentClass->class_id);
       
        $this->updateClassCount($class);
        $student = Student::find($studentClass->student_id);
        if($studentClass->getOriginal('status') == 'waiting'){
            if($studentClass->status == 'active'){
                if($student){
                    //Create attendance for that student
                    $sessions = Session::where('class_id', $studentClass->class_id)
                        ->where('type','!=', 'tutor')->where('type', '!=', 'tutor_online')->where('type', '!=', 'compensate')
                        ->whereDate('date','>=', $studentClass->entrance_date)->get();
                    $sessions_id = array_column($sessions->toArray(), 'id');
                    $student->sessions()->syncWithoutDetaching($sessions_id);
                    $students = Student::where('id', $student->id)->first();
                    //Create fee (transaction)
                    $this->generateTransactions($sessions, $students,  $studentClass->class_id);
                }
            }
        }
        if($studentClass->getOriginal('status') == 'active'){
            if($studentClass->status == 'droped' || $studentClass->status == 'transfer'){
                $sessions = Session::where('class_id', $studentClass->class_id)
                                    ->whereDate('date','>=', $studentClass->drop_time)->get();
                $sessions_id = array_column($sessions->toArray(), 'id');
                // Xóa điểm danh
                $student->sessions()->detach($sessions_id);
                
                // Hoàn tiền theo session
                $total_fee = 0;
                foreach($sessions as $s){
                    $fee = $s->fee;
                    //Get transactions of that session
                    $transactions = $s->transactions()->where('student_id', $studentClass->student_id)->get();
                    foreach($transactions as $t){
                        $ts = TransactionSession::where('transaction_id', $t->id)->where('session_id', $s->id)->first();
                        $ts->forceDelete();
                    }
                }
                
            }
            if($studentClass->status == 'waiting'){
                $sessions = Session::where('class_id', $studentClass->class_id)->get();
                $sessions_id = array_column($sessions->toArray(), 'id');
                // Xóa điểm danh
                // $student->sessions()->detach($sessions_id);
                $transactions = Transaction::whereNull('paper_id')->where('student_id', $student->id)->where('class_id', $studentClass->class_id)->forceDelete();
            }
        }
        if($studentClass->getOriginal('status') == 'droped'){
            if($studentClass->status == 'active'){
                $sessions = Session::where('class_id', $studentClass->class_id)->whereDate('date','>=', $studentClass->entrance_date)->get();
                $sessions_id = array_column($sessions->toArray(), 'id');
                $student->sessions()->syncWithoutDetaching($sessions_id);
                // //Create fee (transaction)
                $this->generateTransactions($sessions, $student,  $studentClass->class_id);
            }
        }
        if($studentClass->getOriginal('entrance_date') < $studentClass->entrance_date){
            // Xóa các attendance
            $from = $studentClass->getOriginal('entrance_date');
            $to = $studentClass->entrance_date;
            $sessions = $student->sessions()->whereBetween('date', [$from, $to])->where('class_id', $class->id)->get();
            
            $session_ids = array_column($sessions->toArray(), 'id');

            $student->sessions()->detach($session_ids);
            //Xóa học phí
            foreach($sessions as $s){
                $transactions = $s->transactions()->where('student_id', $student->id)->get();
                foreach($transactions as $t ){
                    $ts = TransactionSession::where('transaction_id', $t->id)->where('session_id', $s->id)->first();
                    $ts->forceDelete();
                }
            }
        }
    }
    public function updateClassCount(Classes $class){
        if($class){
            $class->student_number = $class->activeStudents()->count();
            $class->droped_number = $class->dropedStudents()->count();
            $class->waiting_number = $class->waitingStudents()->count();
            $class->transfer_number = $class->transferStudents()->count();
            $class->save();
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
        $student = Student::where($studentClass->student_id);
        $sessions = Session::where('class_id', $studentClass->class_id)->get();
        
    }
}
