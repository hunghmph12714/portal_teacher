<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Session;
use App\StudentSession;
use App\StudentClass;
use App\Classes;
use App\Account;
use App\Transaction;
use App\Student;
use App\Discount;
use DateTime;
use DateInterval;
use DatePeriod;
use App\TransactionSession;
class SessionController extends Controller
{
    //
    protected function getLastSession(Request $request){
        $rules = ['class_id' => 'required'];
        $this->validate($request, $rules);
        
        $last_session = Session::where('class_id', $class_id)->orderBy('date','desc')->first();
        if($last_session){
            return response()->json($last_session);
        }
        else{
            return response()->json('Chưa có ca học mới', 412);
        }
    }
    public function generateSessionFromConfig($from, $to, $class_id){
        $from_date = new DateTime($from);
        $to_date = new DateTime($to);
        $interval = DateInterval::createFromDateString('1 day');
        $to_date = $to_date->modify('+1 day'); 
        $period = new DatePeriod($from_date, $interval, $to_date);
        $class = Classes::find($class_id);
        $sessions = [];
        if($class){
            $config = \json_decode( $class->config);            
            $sessionsInWeek = array_unique(array_column(array_column($config, 'date'), 'value')); // [0,2,4]
            foreach ($period as $dt) {
                $dayInWeek = $dt->format('N')-1;
                if(in_array($dayInWeek, $sessionsInWeek)){
                    foreach($config as $index => $c){
                        if($dayInWeek == $c->date->value){
                            $from_time = date('H:i:00', $c->from);
                            $to_time = date('H:i:00', $c->to);
                            $input['date'] = $dt->format('Y-m-d');
                            $input['from'] = $dt->format('Y-m-d')." ".$from_time;
                            $input['to'] = $dt->format('Y-m-d')." ".$to_time;
                            $input['teacher_id'] =(is_object($c->teacher))?$c->teacher->value:NULL;
                            $input['center_id'] = $class->center_id;
                            $input['room_id'] = (is_object($c->room))?$c->room->value:NULL;
                            $input['class_id'] = $class_id;
                            $input['ss_number'] = $index;
                            $input['fee'] = $class->fee;
                            $x = Session::create($input);
                            array_push($sessions, $x->toArray());
                        } 
                    }
                }
            }
            // $sessions = Session::insert($sessions);
            return $sessions;
        }
        else return $sessions;
    }
    public function generateAttendances($sessions, $students){
        $student_attendance = [];
        foreach($students as $st){
            $s_a['student'] = $st->toArray();
            $s_a['sessions'] = [];
            foreach($sessions as $s){
                //Với mỗi ca học 
                //Check xem ca học đó có điều chỉnh học phí không ?
                $ss['session_id'] = $s['id'];
                $sc = StudentClass::where('class_id', $s['class_id'])->where('student_id', $st->id)->first();
                if($sc){
                    $at = $sc->entrance_date;
                    $dt = $sc->drop_time;
                    $tt = $sc->transfer_date;
                    if($s['date'] >= $at && ($sc->status == 'active' || $sc->status == 'droped')){ //
                        if(!$dt || $dt >= $s['date'] || $tt >= $s['date']){
                            // echo $dt. ' - '.$s['date'];
                            // echo "<br>";
                            $ss['student_id'] = $st->id;
                            $ss['type'] = 'official';                        
                            StudentSession::create($ss);
                            array_push($s_a['sessions'], $s);
                        }
                    }
                }
            }
            if(sizeof($s_a['sessions']) != 0){
                array_push($student_attendance, $s_a);
            }
        }
        return $student_attendance;

    }
    public function generateTransactions($class_id, $student_attendance){       
        $class = Classes::find($class_id);
        foreach($student_attendance as $sa){
            $fees = [];            
            $fee_per_session = 0;
            //Dồn all session vào 1 tháng
            foreach($sa['sessions'] as $s){
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
                // Kiểm tra có điều chỉnh học phí tại ca học này không ? 
                if(!array_key_exists('adjust',$fees[$month] )){$fees[$month]['adjust'] = [];}
                $discount = Discount::where('class_id', $s['class_id'])->whereNull('student_class_id')->where('status', 'expired')
                    ->where('active_at','<=',$s['date'])->where('expired_at', '>=', $s['date'])->get();
                    foreach($discount as $d){
                        if(!array_key_exists($d->id, $fees[$month]['adjust'])){
                            if($d->amount){
                                $fees[$month]['adjust'][$d->id]['amount'] = $d->amount;
                                $fees[$month]['adjust'][$d->id]['session_ids'][$s['id']] = ['amount' => abs($d->amount), 'subamount' => $d->amount];
                                $fees[$month]['adjust'][$d->id]['content'] = $d->content;                        
                            }
                            if($d->percentage){
                                $fees[$month]['adjust'][$d->id]['amount'] = $s['fee']/100 * (intval($d->percentage));
                                $fees[$month]['adjust'][$d->id]['session_ids'][$s['id']] = ['amount' => $s['fee']/100 * abs(intval($d->percentage)), 'subamount' => $s['fee']/100 * abs(intval($d->percentage))];
                                $fees[$month]['adjust'][$d->id]['content'] = $d->content;            
                            }
                        }
                        else{
                            if($d->amount){
                                $fees[$month]['adjust'][$d->id]['amount'] +=  $d->amount;
                                $fees[$month]['adjust'][$d->id]['session_ids'][$s['id']] = ['amount' => abs($d->amount), 'subamount' => $d->amount];

                            }
                            if($d->percentage){
                                $fees[$month]['adjust'][$d->id]['amount'] += $s['fee']/100 * (intval($d->percentage));
                                $fees[$month]['adjust'][$d->id]['session_ids'][$s['id']] = ['amount' => $s['fee']/100 * abs(intval($d->percentage)), 'subamount' => $s['fee']/100 * abs(intval($d->percentage))];
                            }
                        }
                    }
            }
            // echo "<pre>";
            // print_r($fees);
            foreach($fees as $key => $fee){
                if($fee != 0){
                    $s = Student::find($sa['student']['id']);
                    $total_adjust = 0;
                    $sc = StudentClass::where('student_id', $s->id)->where('class_id', $class_id)->first();
                    if($s && $sc){
                        $t['debit'] = Account::Where('level_2', '131')->first()->id;
                        $t['credit'] = Account::Where('level_2', '3387')->first()->id;
                        $t['amount'] = $fee['amount'];
                        $t['time'] = Date('Y-m-d', strtotime('1-'.$key));
                        $t['student_id'] = $s->id;
                        $t['class_id'] = $class_id;
                        $t['user'] = auth()->user()->id;
                        $t['content'] = 'Học phí lớp ' .($class ? $class->code : ''). ' tháng '. $key .': '. $fee['count']. ' ca*'.$fee_per_session.'đ';
                        $created_transaction = Transaction::create($t);
                        $created_transaction->tags()->syncWithoutDetaching([7]);
                        $created_transaction->sessions()->syncWithoutDetaching($fee['session_id']);
                        //Apply adjust 
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
                        //Check Discount of student
                        $discounts = Discount::where('student_class_id', $sc->id)
                                            ->where('status', 'active')
                                            ->where('max_use','>',0)
                                            ->where('expired_at', '>', $t['time'])->get()->toArray();

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
                                $dt['content'] = 'Miễn giảm học phí '. $key . ' '.$d['percentage'].'%';
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
        }
    }
    protected function reGenerateFee(){
        $classes = Classes::where('student_number', '>', 0)->get();
        foreach($classes as $c){
            // $sessions = Session::where('class_id', $c->id)->whereBetween()
            $students = $c->students;
            foreach($students as $s){
                $result = [];
                $entrance_date = strtotime($s->detail['entrance_date']);
                $first_date = strtotime('01-08-2020');
                $from = date('Y-m-d', ($entrance_date > $first_date) ? $entrance_date : $first_date);
                
                if($s->detail['status'] == 'active'){
                    $to = date('Y-m-d', strtotime('30-09-2020'));
                }
                if($s->detail['status'] == 'waiting'){
                    continue;
                }
                if($s->detail['status'] == 'droped' || $s->detail['status'] == 'transfer'){
                    $to = date('Y-m-d', strtotime($s->detail['drop_time']));
                }
                if($s->detail['status'] == 'retain') continue;
                $sessions = Session::where('class_id', $c->id)->whereBetween('date', [$from, $to])->get();
                $sa['student'] = $s->toArray();
                $sa['sessions'] = $sessions;
                $result[] = $sa;

                $this->generateTransactions($c->id, $result);
                // print_r($sessions->toArray());
                // echo "<pre>";
            }
        }
    }
    protected function deleteFee(){
        $t1 = Transaction::where('content','like', '%Học phí lớp%')->where('debit', 10)->where('credit', 70)->forceDelete();
        $t2 = Transaction::where('content','like', '%học phí ONLINE%')->forceDelete();
        $t3 = Transaction::where('content','like', '%Nhận học phí dư có%')->forceDelete();
        $t3 = Transaction::where('content','like', '%Chuyển học phí dư có%')->forceDelete();
        $t4 = Transaction::where('content','like', '%HỖ TRỢ%')->forceDelete();
        $t5 = Transaction::where('content', 'like', '%Miễn giảm học phí%')->forceDelete();
        $t5 = Transaction::where('content', 'like', '%Hoàn tiền học phí do nghỉ %')->forceDelete();
        $t5 = Transaction::where('content', 'like', '%HP tháng 8%')->forceDelete();
        $t5 = Transaction::where('content', 'like', '%Học phí tháng 07%')->forceDelete();
        $t5 = Transaction::where('content', 'like', '%Học phí tháng 08%')->forceDelete();
    }
    protected function getSession(Request $request){
        $rules = [
            'class_id' => 'required',
            'from_date' => 'required',
            'to_date' => 'required',    
        ];
        $this->validate($request, $rules);

        $from = date('Y-m-d', strtotime($request->from_date));
        $to = date('Y-m-d', strtotime($request->to_date));
        $result = [];
        $sessions = Session::where('class_id', $request->class_id)->whereBetween('sessions.date',[$from, $to])->
            select('sessions.id as id','sessions.class_id as cid','sessions.teacher_id as tid','sessions.room_id as rid','sessions.center_id as ctid',
                'sessions.from','sessions.to','sessions.date','center.name as ctname','room.name as rname','teacher.name as tname','teacher.phone','teacher.email',
                'sessions.stats','sessions.document','sessions.type','sessions.exercice','sessions.note','sessions.status','sessions.content','sessions.btvn_content')->
            leftJoin('teacher','sessions.teacher_id','teacher.id')->
            leftJoin('center','sessions.center_id','center.id')->
            leftJoin('room','sessions.room_id','room.id')->
            get();
        foreach($sessions as $key => $value){
            $result[$key] = $value->toArray();
            $result[$key]['students'] = $value->students()->select('students.fullname as label', 'students.id as value')->get()->toArray();
        }
       
        //s
        return response()->json($result);
    }
    protected function editSession(Request $request){
        $rules = ['ss_id' => 'required', 
            'from_date' => 'required',
            'to_date' => 'required',
            'fee' => 'required'
        ];
        $this->validate($request, $rules);

        $session = Session::find($request->ss_id);
        if($session){
            $session->teacher_id = $request->teacher_id;
            $session->center_id = $request->center_id;
            $session->room_id = $request->room_id;
            $session->date = date('Y-m-d', $request->from_date);
            $session->from = date('Y-m-d H:i:00', $request->from_date);
            $session->to = date('Y-m-d H:i:00', $request->to_date);
            $session->note = $request->note;

            $document = $request->old_document;
            //Upload document
            for($i = 0 ; $i < $request->document_count; $i++){
                if($request->has('document'.$i)){
                    $ans = $request->file('document'.$i);
                    $name = $session->id."_document_".$i."_".time();
                    $ans->move(public_path(). "/document/",$name.".".$ans->getClientOriginalExtension());
                    $path = "/public/document/".$name.".".$ans->getClientOriginalExtension();
                    if($i == 0 && $document == ''){
                        $document = str_replace(',','',$path);
                    }else{
                        $document = $document.",".str_replace(',','',$path);
                    } 
                }
            }
            $exercice = $request->old_exercice;
            for($i = 0 ; $i < $request->exercice_count ; $i++){
                if($request->has('exercice'.$i)){
                    $ans = $request->file('exercice'.$i);
                    $name = $session->id."_exercice_".$i."_".time();
                    $ans->move(public_path(). "/document/",$name.".".$ans->getClientOriginalExtension());
                    $path = "/public/document/".$name.".".$ans->getClientOriginalExtension();
                    if($i == 0 && $exercice == ''){
                        $exercice = str_replace(',','',$path);
                    }else{
                        $exercice = $exercice.",". str_replace(',','',$path);
                    } 
                }
            }
            $session->document = $document;
            $session->exercice = $exercice;
            $session->btvn_content = $request->btvn_content;
            $session->content = $request->content;
            $session->save();
        }
    }
    protected function createSession(Request $request){
       $rules = [
            'class_id' => 'required',
            'from_date' => 'required',
            'to_date' => 'required',  
        ];
        $this->validate($request, $rules);

        $from_date = date('Y-m-d', $request->from_date);
        $to_date = date('Y-m-d', $request->to_date);
        $sessions = $this->generateSessionFromConfig($from_date, $to_date, $request->class_id);
        

        $students = Classes::find($request->class_id)->students;
        $sa = $this->generateAttendances($sessions, $students);
        $this->generateTransactions($request->class_id, $sa);
        return response()->json(count($sessions));
        // return response()->json($sa);
    }
    protected function addSession(Request $request){
        $rules = ['class_id' => 'required', 
            'from_date' => 'required',
            'to_date' => 'required',
            'fee' => 'required'
        ];
        $this->validate($request, $rules);
        $class_id = $request->class_id;
        $input['class_id'] = $request->class_id;
        $input['teacher_id'] = $request->teacher_id;
        $input['center_id'] = $request->center_id;
        $input['room_id'] = $request->room_id;
        $input['status'] = ($request->student_involved && $request->transaction_involved) ? '1' : '0';
        $input['date'] = date('Y-m-d', $request->from_date);
        $input['from'] = date('Y-m-d H:i:00', $request->from_date);
        $input['to'] = date('Y-m-d H:i:00', $request->to_date);
        $input['ss_number'] = 0;
        $input['note'] = $request->note;
        //Create new session
        $session = Session::create($input);

        $document = '';
        //Upload document
        for($i = 0 ; $i < $request->document_count; $i++){
            if($request->has('document'.$i)){
                $ans = $request->file('document'.$i);
                $name = $session->id."_document_".$i."_".time();
                $ans->move(public_path(). "/document/",$name.".".$ans->getClientOriginalExtension());
                $path = "/public/document/".$name.".".$ans->getClientOriginalExtension();
                if($i == 0){
                    $document = $path;
                }else{
                    $document = $document.",".$path;
                } 
            }
        }
        $exercice = '';
        for($i = 0 ; $i < $request->exercice_count ; $i++){
            if($request->has('exercice'.$i)){
                $ans = $request->file('exercice'.$i);
                $name = $session->id."_exercice_".$i."_".time();
                $ans->move(public_path(). "/document/",$name.".".$ans->getClientOriginalExtension());
                $path = "/public/document/".$name.".".$ans->getClientOriginalExtension();
                if($i == 0){
                    $exercice = str_replace(',','',$path);
                }else{
                    $exercice = $exercice.",". str_replace(',','',$path);
                } 
            }
        }
        $session->document = $document;
        $session->exercice = $exercice;
        $session->btvn_content = $request->btvn_content;
        $session->content = $request->content;
        $session->save();
        //Add student to session
        if($request->student_involved){
            //Get all active student from class
            $class = Classes::find($class_id);
            if($class){
                $students = $class->activeStudents;
                foreach($students as $student){
                    $s['student_id'] = $student->id;
                    $s['session_id'] = $session->id;
                    $s['attendance'] = 'holding';
                    $s['type'] = 'official';
                    StudentSession::create($s);
                    if($request->transaction_involved){
                        //get account 131
                        $debit = Account::where('level_2', '131')->first();
                        $credit = Account::where('level_2', '3387')->first();
                        $transaction['debit'] = $debit->id;
                        $transaction['credit'] = $credit->id;
                        $transaction['amount'] = intval($request->fee);
                        $transaction['time'] = $session->from;
                        $transaction['content'] = 'Học phí tháng '.date('m', $request->from_date) . ' - Buổi '.date('d/m', $request->from_date);
                        $transaction['student_id'] = $student->id;
                        $transaction['class_id'] = $class_id;
                        $transaction['session_id'] = $session->id;
                        $transaction['user'] = auth()->user()->id;
                        $trans = Transaction::create($transaction);
                    }
                }
            }
        }      
    }
    protected function checkDate(Request $request){
        $date = date('Y-m-d', strtotime($request->date));
        $session = Session::where('class_id', $request->class_id)->where('date', $date)->first();
        if($session){
            return response()->json(['result' => false]);
        }
        else{
            return response()->json(['result'=>true]);
        }
    }
   
    protected function deleteSession(Request $request){
        $rules = ['session_id' => 'required'];
        $this->validate($request, $rules);

        
        $session = Session::find($request->session_id);
        if($session){
        //Xóa điểm danh
            $session->students()->detach();
        
        // Xóa học phí
            $transactions = $session->transactions;
            foreach($transactions as $t){
                TransactionSession::where('transaction_id', $t->id)->where('session_id', $session->id)->first()->forceDelete();
            }
            $session->forceDelete();
        }
        return response()->json('ok');
    }
    
    protected function applyAdjustment(Request $request){
        $rules = ['discount_id' => 'required'];
        $this->validate($request, $rules);
        
        $discount = Discount::find($request->discount_id);
        if($discount){
            $t = [];
            $session = Session::where('class_id', $discount->class_id)->where('date', '>=', $discount->active_at)->where('date','<=', $discount->expired_at)
                ->get();
            $session_ids = [];

            foreach($session as $s){
                $students = $s->students;
                foreach($students as $ss){
                    
                    $amount = 0;                    
                    if($discount->amount){
                        $amount = abs($discount->amount);
                    }
                    if($discount->percentage != NULL){
                        $amount = $s->fee/100 * abs(intval($discount->percentage));
                    }
                    if(!array_key_exists($ss->id, $t)){
                        $t[$ss->id] = $amount;
                        $session_ids[$ss->id][$s->id] = ['amount' => $amount];
                    }
                    else{
                        $t[$ss->id] += $amount;
                        $session_ids[$ss->id][$s->id] = ['amount' => $amount];
                    }
                }
            }
            foreach($t as $sid => $value){
                if($discount->amount < 0 || $discount->percentage < 0){
                    $trans['debit'] = Account::Where('level_2', '3387')->first()->id;
                    $trans['credit'] = Account::Where('level_2', '131')->first()->id;
                }
                else{
                    $trans['debit'] = Account::Where('level_2', '131')->first()->id;
                    $trans['credit'] = Account::Where('level_2', '3387')->first()->id;
                }
                $trans['class_id'] = $discount->class_id;
                $trans['user'] = auth()->user()->id;
                $trans['content'] = $discount->content;
                $trans['time'] = $discount->expired_at;
                $trans['student_id'] = $sid;
                $trans['amount'] = $value;

                $tr = Transaction::create($trans);
                print_r($session_ids[$sid]);
             
                $tr->sessions()->syncWithoutDetaching($session_ids[$sid]);
            }
            $discount->status = 'expired';
            $discount->save();
            return response()->json();
        }
    }
    protected function testS(){
        $session_id = 2713;
        $session = Session::find($session_id);
        $transaction = $session->transactions()->where('student_id', 4258)->get();
        
        echo "<pre>";
        print_r($transaction->toArray());
    }
}
