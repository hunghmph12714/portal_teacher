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
  
    public function generateTransactions($sessions, $student, $class_id){
        $fees = [];
        $class = Classes::find($class_id);
        $fee_per_session = 0;
        foreach($sessions as $s){
            $month = date('m-Y', strtotime($s['date']));
            if(!array_key_exists($month, $fees)){
                $fees[$month]['amount'] = $s['fee'];
                $fees[$month]['count'] = 1;
            }
            else{
                $fees[$month]['amount'] += $s['fee'];
                $fees[$month]['count']++;
            }
            $fee_per_session = $s['fee'];
            
            if(!array_key_exists('adjust',$fees[$month] )){$fees[$month]['adjust'] = [];}
            $discount = Discount::where('class_id', $s->class_id)->whereNull('student_class_id')->where('status', 'expired')
                ->where('active_at','<=',$s->date)->where('expired_at', '>=', $s->date)->get();
            foreach($discount as $d){
                if(!array_key_exists($d->id, $fees[$month]['adjust'])){
                    if($d->amount){
                        $fees[$month]['adjust'][$d->id]['amount'] = $d->amount;
                        $fees[$month]['adjust'][$d->id]['content'] = $d->content;                        
                    }
                    if($d->percentage){
                        $fees[$month]['adjust'][$d->id]['amount'] = $s['fee']/100 * (intval($d->percentage));
                        $fees[$month]['adjust'][$d->id]['content'] = $d->content;            
                    }
                }
                else{
                    if($d->amount){
                        $fees[$month]['adjust'][$d->id]['amount'] +=  $d->amount;
                    }
                    if($d->percentage){
                        $fees[$month]['adjust'][$d->id]['amount'] += $s['fee']/100 * (intval($d->percentage));
                    }
                }
            }
            // $this->applyFeeAdjustment($s['id'], $student->id);
        }
        // print_r($fees);
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
                $t['content'] = 'Học phí lớp ' .($class ? $class->code : ''). ' tháng '. $key .': '. $fee['count']. ' ca*'.$fee_per_session.'đ';
                Transaction::create($t);
                //Apply Ajust Fee
                
                foreach($fee['adjust'] as $a => $adjust){
                    $total_adjust += $adjust['amount'];
                    if($adjust['amount'] > 0){
                        $ta['debit'] = Account::Where('level_2', '131')->first()->id;
                        $ta['credit'] = Account::Where('level_2', '3387')->first()->id;
                    }
                    if($adjust['amount'] < 0){
                        $ta['debit'] = Account::Where('level_2', '511')->first()->id;
                        $ta['credit'] = Account::Where('level_2', '131')->first()->id;
                    }
                    $ta['amount'] = abs($adjust['amount']);
                    $ta['time'] = Date('Y-m-t', strtotime('1-'.$key));
                    $ta['student_id'] = $s->id;
                    $ta['class_id'] = $class_id;
                    $ta['user'] = auth()->user()->id;
                    $ta['content'] = $adjust['content'];
                    print_r($ta);
                    Transaction::create($ta);
                }
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
                        $dt['amount'] = ($fee['amount'] + $total_adjust)/100*intval($d['percentage']);
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
        $class = Classes::find($studentClass->class_id);
        $this->updateClassCount($class);

        $student = Student::find($studentClass->student_id);
        if($studentClass->status == "active" && $student){
            //Create attendance for that student
            $sessions = Session::where('class_id', $studentClass->class_id)->whereDate('date','>=', $studentClass->entrance_date)->get();
            $sessions_id = array_column($sessions->toArray(), 'id');
            $student->sessions()->attach($sessions_id);
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
        // $c = Classes::all();
        // foreach($c as $class){
        //     $this->updateClassCount($class);
        // }
        $this->updateClassCount($class);
        $student = Student::find($studentClass->student_id);
        if($studentClass->getOriginal('status') == 'waiting'){
            if($studentClass->status == 'active'){
                
                if($student){
                    //Create attendance for that student
                    $sessions = Session::where('class_id', $studentClass->class_id)->whereDate('date','>=', $studentClass->entrance_date)->get();
                    $sessions_id = array_column($sessions->toArray(), 'id');
                    $student->sessions()->syncWithoutDetaching($sessions_id);
                    $students = Student::where('id', $student->id)->first();
                    //Create fee (transaction)
                    $this->generateTransactions($sessions, $students,  $studentClass->class_id);
                }
            }
        }
        if($studentClass->getOriginal('status') == 'active'){
            if($studentClass->status == 'droped'){
                $sessions = Session::where('class_id', $studentClass->class_id)
                                    ->whereDate('date','>=', $studentClass->drop_time)->get();
                $sessions_id = array_column($sessions->toArray(), 'id');
                // Xóa điểm danh
                $student->sessions()->detach($sessions_id);

                // Hoàn tiền theo session
                $total_fee = 0;
                foreach($sessions as $s){
                    $fee = $s->fee;
                    //Get class adjust;
                    $adjusts = Discount::where('class_id', $studentClass->class_id)->whereNull('student_class_id')
                    ->where('active_at','<=',$s->date)->where('expired_at', '>=', $s->date)->get();
                    foreach($adjusts as $d){
                        if($d->amount){
                            $fee += $d->amount;
                        }
                        if($d->percentage){
                            $fee += $fee/100*(intval($d->percentage));
                        }
                    }
                    //Get student discount;
                    $discounts = Discount::where('student_class_id', $studentClass->id)
                        ->where('status', 'active')
                        ->where('max_use','>',0)
                        ->where('expired_at', '>', $s->date)->get();
                    foreach($discounts as $d){
                        if($d->amount){
                            $fee -= $d->amount;
                        }
                        if($d->percentage){
                            $fee -= $fee/100*(intval($d->percentage));
                        }
                    }
                    $total_fee += $fee;
                }
                if($total_fee > 0){
                    $input['debit'] = Account::Where('level_2', '3387')->first()->id;
                    $input['credit'] = Account::Where('level_2', '131')->first()->id;
                    $input['amount'] = $total_fee;
                    $input['time'] = $s->date;
                    $input['student_id'] = $studentClass->student_id;
                    $input['class_id'] = $studentClass->class_id;
                    $input['user'] = auth()->user()->id;
                    $input['content'] = 'Hoàn tiền học phí do nghỉ học từ ngày: ' . $s->date;
                    Transaction::create($input);
                }
            }
            if($studentClass->status == 'waiting'){
                $sessions = Session::where('class_id', $studentClass->class_id)->get();
                $sessions_id = array_column($sessions->toArray(), 'id');
                // Xóa điểm danh
                $student->sessions()->detach($sessions_id);
                $transactions = Transaction::whereNull('paper_id')->where('student_id', $student->id)->where('class_id', $studentClass->class_id)->forceDelete();
            }
        }
        if($studentClass->getOriginal('status') == 'droped'){
            if($studentClass->status == 'active'){
                $sessions = Session::where('class_id', $studentClass->class_id)->whereDate('date','>=', $studentClass->entrance_date)->get();
                $sessions_id = array_column($sessions->toArray(), 'id');
                $student->sessions()->syncWithoutDetaching($sessions_id);
                $students = Student::where('id', $student->id)->first();
                //Create fee (transaction)
                $this->generateTransactions($sessions, $students,  $studentClass->class_id);
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
        
    }
}
