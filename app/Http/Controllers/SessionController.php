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
use App\Tag;
use App\Discount;
use DateTime;
use DateInterval;
use DatePeriod;
use App\TransactionSession;
use DB;
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
            $hp_tag = Tag::where('name','Học phí')->first()->id;
            $dc_tag = Tag::where('name', 'Điều chỉnh')->first()->id;
            $mg_tag = Tag::where('name','Miễn giảm')->first()->id;
                       
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
                        $t['content'] = 'Học phí lớp ' .($class ? $class->code : ''). ' tháng '. $key ;
                        
                        $month_session = date('m', strtotime($t['time']));
                        $year_session = date('Y', strtotime($t['time']));     
                        //Check transaction of class for that month existed?
                        $t_hp = Transaction::where('student_id', $s->id)->where('class_id', $class_id)
                            ->whereMonth('time', $month_session )->whereYear('time', $year_session )
                            ->whereHas('tags', function($query) use($hp_tag) {
                                $query->where('tags.id', $hp_tag);
                            })->first();
                        if($t_hp){
                            $t_hp->amount += $fee['amount'];
                            $t_hp->sessions()->attach($fee['session_id']);
                            $t_hp->save();
                        }else{
                            $created_transaction = Transaction::create($t);
                            $created_transaction->tags()->syncWithoutDetaching([7]);   
                            $created_transaction->sessions()->syncWithoutDetaching($fee['session_id']);                        
                        }
                        
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
                            $adj = [];
                            foreach($adjust['session_ids'] as $akey => $amo){
                                $adj[$akey] = ['amount' => abs($amo['amount'])];
                            }
                            
                            $t_dc = Transaction::where('student_id', $s->id)->where('class_id', $class_id)
                                ->whereMonth('time', $month_session )->whereYear('time', $year_session )
                                ->whereHas('tags', function($query) use($dc_tag) {
                                    $query->where('tags.id', $dc_tag);
                                })->first();
                            if($t_dc){
                                $t_dc->amount += $fee['amount'];
                                $t_dc->sessions()->attach($adj);
                                $t_dc->save();
                            }else{
                                $created_transaction = Transaction::create($ta);
                                $created_transaction->tags()->syncWithoutDetaching([8]);
                                $created_transaction->sessions()->syncWithoutDetaching($adj);               
                            }
                            
                        }
                        //Check Discount of student
                        $discounts = Discount::where('student_class_id', $sc->id)
                                            ->where('status', 'active')
                                            ->where('max_use','>',0)
                                            ->where('active_at', '<=', $t['time'])
                                            ->where('expired_at', '>=', $t['time'])->get()->toArray();

                        foreach($discounts as $d){
                            //Check discount available
                            $dt['credit'] = Account::Where('level_2', '131')->first()->id;
                            $dt['debit'] = Account::Where('level_2', '511')->first()->id;
                            $dt['time'] = Date('Y-m-t', strtotime('1-'.$key));
                            $dt['student_id'] = $s->id;
                            $dt['class_id'] = $class_id;
                            $dt['user'] = auth()->user()->id;   
                            $dt['discount_id'] = $d['percentage'];                                        
                            if($d['percentage']){
                                $dt['amount'] = ($fee['amount'] + $total_adjust) / 100 * intval($d['percentage']);
                                $dt['content'] = 'Miễn giảm học phí '.$d['percentage'].'%'  . ' '.$key;
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
                                $t_dc = Transaction::where('student_id', $s->id)->where('class_id', $class_id)
                                    ->whereMonth('time', $month_session )->whereYear('time', $year_session )
                                    ->whereHas('tags', function($query) use($mg_tag) {
                                        $query->where('tags.id', $mg_tag);
                                    })->first();
                                if($t_dc){
                                    $t_dc->amount += $fee['amount'];
                                    $t_dc->sessions()->attach($sids);
                                    $t_dc->save();
                                }else{
                                    $created_transaction = Transaction::create($dt);
                                    $created_transaction->tags()->syncWithoutDetaching([9]);
                                    $created_transaction->sessions()->syncWithoutDetaching($sids);    
                                }
                                
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
        $t3 = Transaction::where('content','like', '%Học phí thừa kì trước%')->forceDelete();
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
        $result = [];
        $class = Classes::find($request->class_id);
        if($request->from_date == '-1' && $request->to_date == '-1'){
            $sessions = Session::where('class_id', $request->class_id)->
                select('sessions.id as id','sessions.class_id as cid','sessions.teacher_id as tid','sessions.room_id as rid','sessions.center_id as ctid','sessions.fee as fee',
                    'sessions.ss_number','sessions.present_number','sessions.from','sessions.to','sessions.date','center.name as ctname','room.name as rname','teacher.name as tname','teacher.phone','teacher.email',
                    'sessions.percentage','sessions.classes','sessions.stats','sessions.document','sessions.type','sessions.exercice','sessions.note','sessions.status','sessions.content','sessions.btvn_content')->
                leftJoin('teacher','sessions.teacher_id','teacher.id')->
                leftJoin('center','sessions.center_id','center.id')->
                leftJoin('room','sessions.room_id','room.id')->orderBy('sessions.date', 'ASC')->
                get();
        }
        else{
            $from = date('Y-m-d', strtotime($request->from_date));
            $to = date('Y-m-d', strtotime($request->to_date));
            $sessions = Session::where('class_id', $request->class_id)->whereBetween('sessions.date',[$from, $to])->
                select('sessions.id as id','sessions.class_id as cid','sessions.teacher_id as tid','sessions.room_id as rid','sessions.center_id as ctid','sessions.fee as fee',
                    'sessions.ss_number','sessions.present_number','sessions.from','sessions.to','sessions.date','center.name as ctname','room.name as rname','teacher.name as tname','teacher.phone','teacher.email',
                    'sessions.percentage','sessions.classes','sessions.stats','sessions.document','sessions.type','sessions.exercice','sessions.note','sessions.status','sessions.content','sessions.btvn_content')->
                leftJoin('teacher','sessions.teacher_id','teacher.id')->
                leftJoin('center','sessions.center_id','center.id')->
                leftJoin('room','sessions.room_id','room.id')->orderBy('sessions.date', 'ASC')->
                get();
        }
        
        foreach($sessions as $key => $value){
            $result[$key] = $value->toArray();
            if($class->type == 'class'){
                $result[$key]['students'] = $value->students()->select('students.fullname as label', 'students.id as value', DB::raw('DATE_FORMAT(dob, "%d/%m/%Y") AS dob'),'students.school')->get()->toArray();

            }
        }
        return response()->json($result);
    }
    protected function getStudentOfProduct(Request $request){
        $rules = ['session_id' => 'required'];
        $this->validate($request, $rules);
        
        $session = Session::find($request->session_id);
        if($session){
            $event = Classes::find($session->class_id);
            $students = $session->students()->where('attendance', 'present')->select('students.fullname as label', 'students.id as value', DB::raw('DATE_FORMAT(dob, "%d/%m/%Y") AS dob'),'students.school')->get();
            foreach($students as $key => $s){
                $students[$key]['sbd'] = $event->code . "" . StudentClass::where('class_id', $event->id)->where('student_id', $s->value)->first()->id;
                $student = Student::find($s->value);
                $active_class = $student->activeClasses;
                if(!count($active_class) == 0){
                    $c = Classes::find($active_class[0]->id);
                    switch ($c->center_id) {
                        case 2:                           
                        case 4:
                            # code...
                            $students[$key]['center'] = 'TDH-DQ';
                            break;
                        case 3:
                            # code...
                            $students[$key]['center'] = 'PTT';
                            break;
                        case 5:
                        case 1:
                            $students[$key]['center'] = 'TY';
                            # code...
                            break;
                        default:
                            # code...
                            break;
                    }
                }else{
                    $students[$key]['center'] = '';
                }
                
            }
            return response()->json($students);
        }
    }
    protected function generateFee(Session $session){
        $discount = Discount::where('class_id', $session->class_id)->whereNull('student_class_id')->where('status', 'expired')
                    ->where('active_at','<=',$session->date)->where('expired_at', '>=', $session->date)->get();
        $hp_tag = Tag::where('name','Học phí')->first()->id;
        $dc_tag = Tag::where('name', 'Điều chỉnh')->first()->id;
        $mg_tag = Tag::where('name','Miễn giảm')->first()->id;
        $students = $session->students;
        $month_session = date('m', strtotime($session->date));
        $year_session = date('Y', strtotime($session->date));
        foreach($students as $s){
            $t_hp = Transaction::where('student_id', $s->id)->where('class_id', $session->class_id)
                ->whereMonth('time', $month_session )->whereYear('time', $year_session )
                ->whereHas('tags', function($query) {
                    $query->find($hp_tag);
                })->first();
            $t_dc = Transaction::where('student_id', $s->id)->where('class_id', $session->class_id)
                ->whereMonth('time', $month_session )->whereYear('time', $year_session )
                ->whereHas('tags', function($query) {
                    $query->find($dc_tag);
                })->first();
            $t_mg = Transaction::where('student_id', $s->id)->where('class_id', $session->class_id)
                ->whereMonth('time', $month_session )->whereYear('time', $year_session )
                ->whereHas('tags', function($query) {
                    $query->find($mg_tag);
                })->first();
            
        }
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
            $class = Classes::find($session->class_id);
            $session->teacher_id = $request->teacher_id;
            $session->center_id = $request->center_id;
            $session->room_id = ($request->room_id != 'null')? $request->room_id : NULL;
            $session->date = date('Y-m-d', $request->from_date);
            $session->from = date('Y-m-d H:i:01', $request->from_date);
            $session->to = date('Y-m-d H:i:00', $request->to_date);
            $session->note = $request->note;

            $document = $request->old_document;
            //Upload document
            $new_dir = public_path().'/docs/'.$class->code.'/'.$session->date.'_'.$session->id;
            if (!is_dir($new_dir)) {
                mkdir($new_dir.'/documents', 0775, true);
                mkdir($new_dir.'/exercices', 0775, true);
            }
            //Xoá file
            $old_documents = $session->document;
            if($old_documents != $document){
                $old_documents = str_replace($document, '', $old_documents);
                $old_documents = explode(',', $old_documents);
                foreach($old_documents as $od){
                    if($od != ""){
                        unlink(base_path().$od);
                    }
                }
            }
            //Thêm mới upload files
            for($i = 0 ; $i < $request->document_count; $i++){
                if($request->has('document'.$i)){
                    $ans = $request->file('document'.$i);                    
                    $name = $ans->getClientOriginalName();
                    $ans->move($new_dir.'/documents/',$name);
                    $path = "/public/docs/".$class->code.'/'.$session->date.'_'.$session->id.'/documents/'.$name;
                    if($i == 0 && $document == ''){
                        $document = str_replace(',','',$path);
                    }else{
                        if (strpos($document, str_replace(',','',$path)) !== false) {
                            
                        }else{
                            $document = $document.",".str_replace(',','',$path);
                        }
                        
                    } 
                }
            }
            $exercice = $request->old_exercice;
            //Xoá file
            $old_exercices = $session->exercice;
            if($old_exercices != $exercice){
                $old_exercices = str_replace($exercice, '', $old_exercices);
                $old_exercices = explode(',', $old_exercices);
                foreach($old_exercices as $od){
                    if($od != ""){
                        unlink(base_path().$od);
                    }
                }
            }
            //Thêm mới upload files
            for($i = 0 ; $i < $request->exercice_count; $i++){
                if($request->has('exercice'.$i)){
                    $ans = $request->file('exercice'.$i);                    
                    $name = $ans->getClientOriginalName();
                    $ans->move($new_dir.'/exercices/',$name);
                    $path = "/public/docs/".$class->code.'/'.$session->date.'_'.$session->id.'/exercices/'.$name;
                    if($i == 0 && $exercice == ''){
                        $exercice = str_replace(',','',$path);
                    }else{
                        if (strpos($exercice, str_replace(',','',$path)) !== false) {
                            
                        }else{
                            $exercice = $exercice.",".str_replace(',','',$path);
                        }
                        
                    } 
                }
            }

            $session->document = $document;
            $session->exercice = $exercice;
            $session->btvn_content = $request->btvn_content;
            $session->content = $request->content;
            $session->type = $request->type;
            if($session->fee != $request->fee){
                $this->editSessionFee($session, $request->fee);
                $session->fee = $request->fee;
            }
            //CHeck student
            $new_students = array_column(json_decode($request->students), 'value');
            $old_students = array_column($session->students->toArray(), 'id');
            // Các học sinh được thêm mới
            $arr_1 = array_diff($new_students, $old_students);

            //Các học sinh bị loại bỏ
            $arr_2 = array_diff($old_students, $new_students);

            foreach($arr_1 as $a1){
                // Tìm transaction 
                $debit = Account::where('level_2', '131')->first();
                $credit = Account::where('level_2', '3387')->first();
                $credit_tutor = Account::where('level_2', '5113')->first();
                $transaction['debit'] = $debit->id;
                $transaction['credit'] = $credit->id;
                $transaction['amount'] = intval($session->fee);
                $transaction['time'] = $session->from;
                $transaction['student_id'] = $a1;
                $transaction['class_id'] = $session->class_id;
                $transaction['session_id'] = $session->id;
                $transaction['user'] = auth()->user()->id;              
                switch ($session->type) {
                    case 'exam':
                    case 'main':
                        # code...
                        $tag = Tag::where('name', 'Học phí')->first(); 
                        $trans = $tag->transactions()->where('student_id', $a1)
                            ->where('class_id', $session->class_id)->whereMonth('time', date('m', strtotime($session->date)))
                            ->whereYear('time', date('Y', strtotime($session->date)))->first();
                        if($trans){  
                            $trans->amount += $session->fee;
                            $trans->save();
                            $trans->sessions()->attach([$session->id => ['amount'=> $session->fee]]);
                        }
                        else{
                            $student = Student::find($a1);
                            $this->generateFeeMainSession($student, $session);
                        break;
                        }
                        
                        //Dieu chinh
                        $amount = $session->fee;
                        $tag = Tag::where('name', 'Điều chỉnh')->first();
                        print_r($tag->toArray());
                        $trans = $tag->transactions()->where('student_id', $a1)
                            ->where('class_id', $session->class_id)->whereMonth('time', date('m', strtotime($session->date)))
                            ->whereYear('time', date('Y', strtotime($session->date)))->first();
                        if($trans){
                            echo $trans->discount_id;
                            $discount = Discount::find($trans->discount_id);
                            if($discount){
                                if($discount->percentage){
                                    $trans->amount = $trans->amount + abs($session->fee/100*$discount->percentage);
                                    $trans->save();
                                    $trans->sessions()->attach([$session->id => ['amount'=> abs($session->fee/100*$discount->percentage)]]);
                                    $amount = $session->fee + $session->fee/100*$discount->percentage;
                                }
                            }
                        }
                        //Mien giam
                        $tag = Tag::where('name', 'Miễn giảm')->first();
                        $trans = $tag->transactions()->where('student_id', $a1)
                            ->where('class_id', $session->class_id)->whereMonth('time', date('m', strtotime($session->date)))
                            ->whereYear('time', date('Y', strtotime($session->date)))->first();
                        if($trans){
                            $discount = Discount::find($trans->discount_id);
                            if($discount){
                                if($discount->percentage){
                                    $trans->amount = $trans->amount + $amount/100*$discount->percentage;
                                    $trans->save();
                                    $trans->sessions()->attach([$session->id => ['amount'=> abs($amount/100*$discount->percentage)]]);
                                }
                            }
                        }
                        break;
                    case 'tutor_online':
                    case 'tutor':
                        # code...
                        $transaction['content'] = 'Học phí phụ đạo '. date('d-m', strtotime($session->date));
                        $transaction['credit'] = $credit_tutor->id;
                        $trans = Transaction::create($transaction);
                        $trans->sessions()->attach([$session->id => ['amount'=> $session->fee]]);
                        $trans->tags()->attach(10);
                        break;
                   
                    default:
                        # code...
                        break;
                }
                // Add attendance
                $session->students()->attach([$a1]);
            }
            foreach($arr_2 as $a2){
                // Bo khoi diem danh
                $session->students()->detach([$a2]);
                //Bo hoc phi
                $transactions = $session->transactions()->where('student_id', $a2)->get();
                foreach($transactions as $transaction){
                    $ts = TransactionSession::where('transaction_id', $transaction->id)->where('session_id', $session->id)->first();
                    $ts->forceDelete();
                }
                
            }
            $session->save();
            
        }
    }
    protected function generateFeeMainSession($student, $session){
        $debit = Account::where('level_2', '131')->first();
        $credit = Account::where('level_2', '3387')->first();
        $transaction['debit'] = $debit->id;
        $transaction['credit'] = $credit->id;
        $transaction['amount'] = intval($session->fee);
        $transaction['time'] = $session->from;
        $transaction['student_id'] = $student->id;
        $transaction['class_id'] = $session->class_id;
        $transaction['session_id'] = $session->id;
        $transaction['user'] = auth()->user()->id;
        //Main fee
        $transaction['content'] = 'Học phí tháng '. date('m-Y', strtotime($session->date));
        $trans = Transaction::create($transaction);
        
        $trans->tags()->attach(7);
        $trans->sessions()->attach([$session->id => ['amount' => $session->fee]]);
        //Adjust
        $discount = Discount::where('class_id', $session->class_id)->where('active_at', '<=', $session->date)->where('expired_at', '>=', $session->date)
            ->where('status', 'expired')->first();
        if($discount){
            if($discount->percentage){
                $transaction['debit'] = ($discount->percentage < 0) ? $credit->id : $debit->id;
                $transaction['credit'] = ($discount->percentage < 0) ? $debit->id : $credit->id;
                $transaction['amount'] = abs($session->fee/100 * $discount->percentage);                
            }
            if($discount->amount){
                $transaction['debit'] = ($discount->amount < 0) ? $credit->id : $debit->id;
                $transaction['credit'] = ($discount->amount < 0) ? $debit->id : $credit->id;
                $transaction['amount'] = abs($discount->amount);
            }
            $transaction['discount_id'] = $discount->id;
            $transaction['content'] = $discount->content;
            $trans = Transaction::create($transaction);        

            $trans->tags()->attach(8);
            $trans->sessions()->attach([$session->id => ['amount' => $transaction['amount']]]);
        }
        //Discount
        $sc = StudentClass::where('class_id', $session->class_id)->where('student_id', $student->id)->first();
        $discount = Discount::where('student_class_id', $sc->id)->where('active_at', '<=', $session->date)->where('expired_at', '>=', $session->date)
            ->where('status', 'active')->first();
        print_r($sc->id);
        if($discount){
            $acc_511 = Account::where('level_2', '511')->first();
            $transaction['debit'] = $acc_511->id;
            $transaction['credit'] = $debit->id;
            if($discount->percentage){               
                $transaction['amount'] = abs($session->fee/100 * $discount->percentage);
            }
            $transaction['discount_id'] = $discount->id;
            $transaction['content'] = 'Miễn giảm học phí.';
            $trans = Transaction::create($transaction);        

            $trans->tags()->attach(9);
            $trans->sessions()->attach([$session->id => ['amount' => $transaction['amount']]]);
        }
        
    }
    protected function editSessionFee(Session $session, $new_fee){        
        
        $ts = TransactionSession::where('session_id', $session->id)->get();
        foreach($ts as $value){
            $transaction = Transaction::find($value->transaction_id);
            if($transaction){
                $trans_hp = $transaction->tags()->where('tags.name', 'Học phí')->first();
                if($trans_hp){
                    $value->amount = $new_fee;          
                }
                $trans_mg = $transaction->tags()->where('tags.name', 'Miễn giảm')->first();
                $trans_dc = $transaction->tags()->where('tags.name', 'Điều chỉnh')->first();
                if( $trans_mg || $trans_dc ){
                    $discount = Discount::find($transaction->discount_id);
                    if($discount){
                        if($discount->student_class_id && $discount->percentage){
                            $value->amount = $new_fee/100* $discount->percentage;
                        }
                        if($discount->class_id && $discount->percentage){
                            $value->amount = $new_fee/100 * abs($discount->percentage);
                        }
                    }
                }
            }
            $value->save();
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
            'center_id' => 'required',
            'from_date' => 'required',
            'to_date' => 'required',
            'fee' => 'required',
            'students' => 'required'
        ];
        $this->validate($request, $rules);
        $class_id = $request->class_id;
        $class = Classes::find($class_id);
        $input['class_id'] = $request->class_id;
        $input['teacher_id'] = $request->teacher_id;
        $input['center_id'] = $request->center_id;
        $input['room_id'] = $request->room_id;
        $input['status'] = 1;
        $input['date'] = date('Y-m-d', ($request->from_date));
        $input['from'] = date('Y-m-d H:i:00', ($request->from_date));
        $input['to'] = date('Y-m-d H:i:00', ($request->to_date));
        $input['ss_number'] = 0;
        $input['note'] = $request->note;
        $input['fee'] = $request->fee;
        //Create new session
        $session = Session::create($input);

        $document = '';
        $new_dir = public_path().'/docs/'.$class->code.'/'.$session->date.'_'.$session->id;
        mkdir($new_dir.'/documents', 0775, true);
        
        //Thêm mới upload files
        for($i = 0 ; $i < $request->document_count; $i++){
            if($request->has('document'.$i)){
                $ans = $request->file('document'.$i);                    
                $name = $ans->getClientOriginalName();
                $ans->move($new_dir.'/documents/',$name);
                $path = "/public/docs/".$class->code.'/'.$session->date.'_'.$session->id.'/documents/'.$name;
                if($i == 0){
                    $document = $path;
                }else{
                    $document = $document.",".$path;
                } 
            }
        }
        
        $exercice = '';
        mkdir($new_dir.'/exercices', 0775, true);
        for($i = 0 ; $i < $request->exercice_count; $i++){
            if($request->has('exercice'.$i)){
                $ans = $request->file('exercice'.$i);                    
                $name = $ans->getClientOriginalName();
                $ans->move($new_dir.'/exercices/',$name);
                $path = "/public/docs/".$class->code.'/'.$session->date.'_'.$session->id.'/exercices/'.$name;
                if($i == 0){
                    $exercice = $path;
                }else{
                    $exercice = $exercice.",".$path;
                } 
            }
        }
        $session->document = $document;
        $session->exercice = $exercice;
        $session->btvn_content = $request->btvn_content;
        $session->content = $request->content;
        $session->type = $request->type;

        $session->save();
        //Add student to session
        $students = json_decode($request->students);
        // print_r($students);
        foreach($students as $student){
            $session->students()->attach($student->value);
            $debit = Account::where('level_2', '131')->first();
            $credit = Account::where('level_2', '3387')->first();
            $transaction['debit'] = $debit->id;
            $transaction['credit'] = $credit->id;
            $transaction['amount'] = intval($request->fee);
            $transaction['time'] = $session->from;
            $transaction['student_id'] = $student->value;
            $transaction['class_id'] = $class_id;
            $transaction['session_id'] = $session->id;
            $transaction['user'] = auth()->user()->id;
            if($session->type == 'main'){
                $a1 = $student->value;
                $tag = Tag::where('name', 'Học phí')->first(); 
                $trans = $tag->transactions()->where('student_id', $a1)
                    ->where('class_id', $session->class_id)->whereMonth('time', date('m', strtotime($session->date)))
                    ->whereYear('time', date('Y', strtotime($session->date)))->first();
                if($trans){  
                    $trans->amount += $session->fee;
                    $trans->save();
                    $trans->sessions()->attach([$session->id => ['amount'=> $session->fee]]);
                }
                else{
                    $student = Student::find($a1);
                    $this->generateFeeMainSession($student, $session);
                }
                
                //Dieu chinh
                $amount = $session->fee;
                $tag = Tag::where('name', 'Điều chỉnh')->first();
                $trans = $tag->transactions()->where('student_id', $a1)
                    ->where('class_id', $session->class_id)->whereMonth('time', date('m', strtotime($session->date)))
                    ->whereYear('time', date('Y', strtotime($session->date)))->first();
                if($trans){
                    $discount = Discount::find($trans->discount_id);
                    if($discount){
                        if($discount->percentage){
                            $trans->amount = $trans->amount + abs($session->fee/100*$discount->percentage);
                            $trans->save();
                            $trans->sessions()->attach([$session->id => ['amount'=> abs($session->fee/100*$discount->percentage)]]);
                            $amount = $session->fee + $session->fee/100*$discount->percentage;
                        }
                    }
                }
                //Mien giam
                $tag = Tag::where('name', 'Miễn giảm')->first();
                $trans = $tag->transactions()->where('student_id', $a1)
                    ->where('class_id', $session->class_id)->whereMonth('time', date('m', strtotime($session->date)))
                    ->whereYear('time', date('Y', strtotime($session->date)))->first();
                if($trans){
                    $discount = Discount::find($trans->discount_id);
                    if($discount){
                        if($discount->percentage){
                            $trans->amount = $trans->amount + $amount/100*$discount->percentage;
                            $trans->save();
                            $trans->sessions()->attach([$session->id => ['amount'=> abs($amount/100*$discount->percentage)]]);
                        }
                    }
                }
            }else if($session->type == 'tutor' || $session->type == 'tutor_online'){
                $transaction['content'] = 'Học phí phụ đạo '. date('d-m', strtotime($session->date));
                $new_trans = Transaction::create($transaction);
                $new_trans->sessions()->attach([$session->id => ['amount' => $new_trans->amount]]);
                $new_trans->tags()->attach(10);
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
                $tr['discount_id'] = $discount->id;
                $tr = Transaction::create($trans);
             
                $tr->sessions()->syncWithoutDetaching($session_ids[$sid]);
                $tr->tags()->syncWithoutDetaching([8]);
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
    protected function deleteTransactionSession(){
        // $t1 = TransactionSession::leftJoin('transactions','transaction_session.transaction_id','transactions.id')->whereNULL('transactions.id')->forceDelete();
        // $t2 = TransactionSession::leftJoin('sessions','transaction_session.session_id','sessions.id')->leftJoin('transactions','transaction_session.transaction_id','transactions.id')->whereNULL('sessions.id')->get();
        // echo "<pre>";
        // print_r($t2->toArray());
    }
    protected function sessionCount(){
        $sessions = Session::all();
        foreach($sessions as $s){
            // $students = $s->students()->count();
            $s->ss_number = $s->students()->count();
            $s->present_number = $s->students()->where('attendance', 'present')->count();
            $s->absent_number = $s->students()->where('attendance', 'n_absence' )->count();
            $s->save();
        }
    }


    //Event 
    protected function addProduct(Request $request){
        $rules = ['class_id' => 'required', 
            'center_id' => 'required',
            'from_date' => 'required',
            'to_date' => 'required',
            'fee' => 'required',
        ];
        $this->validate($request, $rules);
        $class_id = $request->class_id;
        $input['class_id'] = $request->class_id;
        $input['center_id'] = $request->center_id;
        $input['room_id'] = $request->room_id;
        $input['status'] = 1;
        $input['teacher_id'] = -1;
        $input['date'] = date('Y-m-d', ($request->from_date));
        $input['from'] = date('Y-m-d H:i:01', ($request->from_date));
        $input['to'] = date('Y-m-d H:i:00', ($request->to_date));
        $input['ss_number'] = 0;
        $input['note'] = $request->note;
        $input['fee'] = $request->fee;
        //Create new session
        $session = Session::create($input);

        $document = '';
        //Upload document
        for($i = 0 ; $i < $request->document_count; $i++){
            if($request->has('document'.$i)){
                $ans = $request->file('document'.$i);
                $file_name = explode('.', $ans->getClientOriginalName())[0];
                $name = $session->id."_". $file_name ."_".time();
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
                $file_name = explode('.', $ans->getClientOriginalName())[0];
                $name = $session->id."_". $file_name ."_".time();
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
        $session->classes = $request->classes;
        $session->content = $request->content;
        $session->percentage = $request->percentage;
        $session->type = 'exam';

        $session->save();        
    }
    protected function editProduct(Request $request){
        $rules = [
            'ss_id' => 'required', 
            'from_date' => 'required',
            'to_date' => 'required',
            'fee' => 'required',
        ];
        $this->validate($request, $rules);

        $session = Session::find($request->ss_id);
        
        if($session){
            $class = Classes::find($session->class_id);
            // $session->teacher_id = $request->teacher_id;
            $session->center_id = $request->center_id;
            $session->room_id = ($request->room_id != 'null')? $request->room_id : NULL;
            $session->date = date('Y-m-d', $request->from_date);
            $session->from = date('Y-m-d H:i:01', $request->from_date);
            $session->to = date('Y-m-d H:i:00', $request->to_date);
            $session->note = $request->note;
            $session->percentage = $request->percentage;
            $session->classes = $request->classes;
            $session->type = 'exam';
            $session->fee = $request->fee;
            $document = $request->old_document;
            //Upload document
            for($i = 0 ; $i < $request->document_count; $i++){
                if($request->has('document'.$i)){
                    $ans = $request->file('document'.$i);
                    $file_name = explode('.', $ans->getClientOriginalName())[0];
                    $name = $session->id."_". $file_name ."_".time();
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
                    $file_name = explode('.', $ans->getClientOriginalName())[0];
                    $name = $session->id."_". $file_name ."_".time();
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
    protected function getProductInfo(Request $request){
        $rules = ['event_id' => 'required'];
        $this->validate($request, $rules);

        $sessions = Session::where('class_id', $request->event_id)->where('room_id', $request->location_id)->get();
        return response()->json($sessions->toArray());
    }
    protected function getProductTable($event_code){
        $week = ['Chủ nhật','Thứ 2', 'Thứ 3' ,'Thứ 4', 'Thứ 5','Thứ 6', 'Thứ 7'];
        $event = Classes::where('code', $event_code)->first();
        if($event){
            $sessions = Session::where('class_id', $event->id)->distinct('content')->orderBy('from')->get();
            $result = [];
            foreach($sessions as $s){
                $from_0 = date('Y-m-d H:i:0',  strtotime($s->from));
                $to_0 = date('Y-m-d H:i:0',  strtotime($s->to));

                $from = date('h:i', strtotime($s->from));
                $to = date('h:i', strtotime($s->to));
                $date = $week[date('w', strtotime($s->from))] .", " . date('d/m/Y', strtotime($s->from));
                $duration = (strtotime($to_0) - strtotime($from_0))/60;
                $name = $s->content. " (".$duration."')";

                if(array_key_exists($date, $result)){
                    $result[$date][] = ['time' => str_replace(':', 'h', $from.'-'.$to), 'name' => $name, 'note'=>$s->note];
                }else{
                    $result[$date][0] = ['time' => str_replace(':', 'h', $from.'-'.$to), 'name' => $name, 'note'=>$s->note];
                }
            }
            return view('events/event-table', compact('result'));
        }
    }
    protected function getStudentOfSession(Request $request){
        $rules = ['session_id' => 'required'];
        $this->validate($request, $rules);
        
        $session = Session::find($request->session_id);
        if($session){
            $students = $session->students;
            return response()->json($students);
        }
    }
    protected function uploadEventScore(Request $request){
        $rules = ['file' => 'required', 'session_id' => 'required', 'event_id' => 'required'];
        $this->validate($request, $rules);

        $data = $request->file; 
            foreach($data as $key => $val){
                if($key == 0 || sizeof($val) < 3) continue;
                $studentClass = StudentClass::find(str_replace($request->event_id, '', $val[1]));
                // print_r(str_replace($request->event_id, '', $val[1])."/");
                if($studentClass){
                    $student = Student::find($studentClass->student_id);
                    if($student){
                        $student_id = $student->id;
                        if(count($val) >=7){
                            $ss = StudentSession::where('student_id', $student_id)->where('session_id', $request->session_id)->first();
                            if(!$ss){
                                continue;
                            }
                        }
                        if(count($val) == 7){                    
                            $ss->btvn_comment = $val[6];
                            $ss->save();
                            $result[] = ['sbd' => $val[1], 'fullname' => $val[2], 'dob' => $val[4], 'school' => $val[3], 'room' => $val[6]];
                        }
                        if(count($val) == 8){
                            $ss->btvn_comment = $val[6];
                            $ss->score = $val[7];
                            $ss->save();
                            $result[] = ['sbd' => $val[1], 'fullname' => $val[2], 'dob' => $val[4], 'school' => $val[3], 'room' => $val[65], 'score' => $val[7]];
                        }
                        if(count($val) == 9){
                            $ss->btvn_comment = $val[6];
                            $ss->score = $val[7];
                            $ss->max_score = $val[8];
                            $ss->save();
                            $result[] = ['sbd' => $val[1], 'fullname' => $val[2], 'dob' => $val[4], 'school' => $val[3], 'room' => $val[6], 'score' => $val[7], 'max_score' => $val[8]];
                        }                
                        if(count($val) == 10){
                            $ss->btvn_comment = $val[6];
                            $ss->score = $val[7];
                            $ss->max_score = $val[8];
                            $ss->comment = $val[9];
                            $ss->save();
                            $result[] = ['sbd' => $val[1], 'fullname' => $val[2], 'dob' => $val[4], 'school' => $val[3], 'room' => $val[6], 'score' => $val[7], 'max_score' => $val[8], 'comment' => $val[9]];
                        }  
                    }
                }
            }
            return response()->json($result);
        

    }
    public function countEvent(){
        $events = Classes::where('type','event')->get();
        foreach($events as $event){
            $event->student_number = $event->activeStudents()->count();
            $event->waiting_number = $event->waitingStudents()->count();
            $event->save();

            $students = $event->activeStudents;
            $sessions = $event->sessions;

            foreach($students as $student){
                foreach($sessions as $s){
                    $ss  = StudentSession::where('student_id', $student->id)->where('session_id', $s->id)->first();
                    if($ss){
                        $ss->attendance = 'present';
                        $ss->save();
                    }
                }
            }
            foreach($sessions as $s){
                $s->ss_number = $s->students()->where('attendance', 'holding')->count();
                $s->present_number = $s->students()->where('attendance', 'present')->count();
                $s->save();
            }

        }
    }
    public function deleteNullStudent(){
        // $session = $s->
    }
    public function redirectFile($filename){
        echo $filename;
    }
    public function moveFiles(){
        $sessions = Session::Where('document', '!=', '')->orWhere('exercice', '!=', '')->offset(2000)->limit(2000)->get();
        foreach($sessions as $key => $session){
            echo $key."-SESSION: ". $session->id;
            $class = Classes::find($session->class_id);
            if($class){
                // $ans->move(public_path(). "/document/",$name.".".$ans->getClientOriginalExtension());
                $new_dir = public_path().'/docs/'.$class->code.'/'.$session->date.'_'.$session->id;
                if (!is_dir($new_dir)) {
                    mkdir($new_dir.'/documents', 0775, true);
                    mkdir($new_dir.'/exercices', 0775, true);
                }
                $docs = explode(',', $session->document);
                $exercice = explode(',', $session->exercice);
                $new_documents_dir = [];
                foreach($docs as $key=>$doc){
                    $doc = base_path().$doc;
                    $dir = explode('/', $doc);
                    $dir = $dir[count($dir)-1];
                    $new_documents_dir[] = 'public/docs/'.$class->code.'/'.$session->date.'_'.$session->id.'/documents/'.$dir;
                    try{
                        copy($doc, $new_dir.'/documents/'.$dir);
                        echo "Đã di chuyển\n";
                    }
                    catch(\Exception $e){
                        echo " Không tìm thấy file \n";
                        continue;
                    }
                }
                $session->document = implode(',', $new_documents_dir);
                $new_exercices_dir = [];
                foreach($exercice as $key=>$doc){
                    $doc = base_path().$doc;
                    $dir = explode('/', $doc);
                    $dir = $dir[count($dir)-1];
                    $new_exercices_dir[] = 'public/docs/'.$class->code.'/'.$session->date.'_'.$session->id.'/exercices/'.$dir;
                    try{
                        copy($doc, $new_dir.'/exercices/'.$dir);
                        echo "Đã di chuyển";
                        echo "<br/>";
                    }
                    catch(\Exception $e){
                        echo " Không tìm thấy file \n";
                        echo "<br/>";
                        continue;
                    }
                }
                $session->exercice = implode(',', $new_exercices_dir);
                $session->save();
            }
            
        }
    }
}
