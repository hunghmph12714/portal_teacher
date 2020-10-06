<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Discount;
use App\StudentClass;
use App\Session;
use App\StudentSession;
use App\Classes;
use App\Account;
use App\Transaction;
use App\Student;
class DiscountController extends Controller
{
    //
    protected $fillable = ['id','student_class_id','active_at','expired_at','percentage','amount','max_use','status'];

    protected function getDiscount(Request $request){
        $discounts = Discount::Select('active_at','expired_at','percentage','amount','max_use','discounts.status','discounts.id as did',
                                'students.id as sid', 'students.fullname as sname', 'students.dob', 
                                'parents.id as pid', 'parents.fullname as pname', 
                                'classes.id as cid', 'classes.code', 'student_class.id as scid')
                            ->whereNull('discounts.class_id')
                            ->leftJoin('student_class', 'discounts.student_class_id', 'student_class.id')
                            ->leftJoin('students', 'student_class.student_id', 'students.id')
                            ->leftJoin('classes', 'student_class.class_id', 'classes.id')
                            ->leftJoin('parents', 'students.parent_id', 'parents.id')
                            ->get()->toArray();
        foreach($discounts as $key => $d){
            $discounts[$key]['student'] = ['label' => $d['sname'], 'value' => $d['sid']];
            $discounts[$key]['class'] = ['label' => $d['code'], 'value'=>$d['cid']];
        }
        return response()->json($discounts);
    }
    protected function createDiscount(Request $request){
        $rules = [
            'sname' => 'required',
            'class' => 'required',
            // 'expired_at' => 'required',
        ];
        $this->validate($request, $rules);

        //Check student in class
        $c = StudentClass::where('student_id', $request->sname['sid'])->where('class_id', $request->class['value'])->first();
        if($c){
            $input['student_class_id'] = $c->id;
            $input['active_at'] = explode('T', $request->active_at)[0];
            $input['expired_at'] = explode('T', $request->expired_at)[0];
            $input['percentage'] = $request->percentage ? $request->percentage : NULL;
            $input['amount'] = $request->amount ? $request->amount : NULL;
            $input['status'] = $request->status;
            $input['max_use'] = $request->max_use;
            // print_r($input);
            $discount = Discount::create($input);
            
            if($discount->status == 'active'){
                $this->applyDiscount($discount->id);
            }
            
        }else{
            return response()->json('Học sinh không học lớp này !', 421);
        }
    }
    protected function editDiscount(Request $request){
        $rules = [
            'did'=>'required',
            'active_at' => 'required',
            'expired_at' => 'required',            
            'max_use' => 'required'
        ];
        $this->validate($request, $rules);
        
        
        $c = StudentClass::where('student_id', $request->student['value'])->where('class_id', $request->class['value'])->first();
        if($c){
            $d = Discount::find($request->did);
            if($d){
                $d->active_at = explode('T', $request->active_at)[0];
                $d->expired_at = explode('T', $request->expired_at)[0];
                $d->percentage = $request->percentage;
                $d->amount = $request->amount;
                $d->max_use = $request->max_use;
                $d->status = $request->status;
                $d->student_class_id = $c->id;
                $d->save();
                return response()->json('ok', 200);
                
            }
        }else{
            return response()->json('Học sinh không học lớp này !', 421);
        }
        
    }
    protected function deleteDiscount(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $discount = Discount::find($request->id);
        if($discount){
            $transaction = Transaction::where('discount_id', $discount->id)->forceDelete();
            $discount->forceDelete();
            return response()->json('ok');
        }

    }
    protected function applyDiscount2($discount, $student_id){
        $session = Session::find($session_id);
        if($session){
            $discount = Discount::where('class_id', $session->class_id)->whereNull('student_class_id')
                ->where('active_at','<=',$session->date)->where('expired_at', '>=', $session->date)->get();
            foreach($discount as $d){
                $t['debit'] = Account::Where('level_2', '511')->first()->id;
                $t['credit'] = Account::Where('level_2', '131')->first()->id;
                $t['amount'] = abs($d->amount);
                $t['time'] = Date('Y-m-d', strtotime($session->date));
                $t['student_id'] = $student_id; 
                $t['class_id'] = $d->class_id;
                $t['user'] = auth()->user()->id;
                $t['content'] = $d->content;
                $t['discount_id'] = $d->id;
                Transaction::create($t);
            }
        }
    }
    protected function applyDiscount($discount_id){
        $discount = Discount::find($discount_id);
        
        if($discount){
            $from = $discount->active_at;
            $to = $discount->expired_at;
            $student_class = StudentClass::find($discount->student_class_id);
            if($student_class){
                $student_id = $student_class->student_id;
                $acc = Account::where('level_2','131')->first();
                $result = [];
                $id = -1;

                $student = Student::find($student_id);
                //->where('sessions.type', 'main')->orWhere('sessions.type', 'exam')
                $sessions = $student->sessions()->where('class_id', $student_class->class_id)->whereBetween('date', [$from, $to])
                    ->where('sessions.type', '!=' ,'tutor')->where('sessions.type', '!=' ,'tutor_online')->where('sessions.type', '!=' ,'compensate')->get();
                print_r($sessions->toArray());
                foreach($sessions as $s){
                    $sum_amount_session = 0;
                    $transactions = $s->transactions()->where('student_id', $student->id)->get();
                    foreach($transactions as $t){
                        // $amount = ($t->debit == $acc->id) ? $t->amount : -$t->amount;
                        $session_amount = ($t->debit == $acc->id) ? $t->pivot['amount'] : -$t->pivot['amount'];
                        $month = Date('m-Y', strtotime($t->time));
                        if(!array_key_exists($month, $result)){
                            // echo $month."<br>";
                            $result[$month]['amount'] = $session_amount;
                            $result[$month]['sessions'][$s->id] = ['amount' => $session_amount];
                        }
                        else{
                            $result[$month]['amount'] = $result[$month]['amount'] + $session_amount;
                            if(!array_key_exists($s->id, $result[$month]['sessions'])){
                                $result[$month]['sessions'][$s->id] = ['amount' => $session_amount];
                            }else{
                                $result[$month]['sessions'][$s->id]['amount'] += $session_amount;
                            }
                        }
                    }
                }
            
                foreach($result as $month => $r){
                    $trans['debit'] = Account::Where('level_2', '511')->first()->id;
                    $trans['credit'] = Account::Where('level_2', '131')->first()->id;
                    $trans['class_id'] = $student_class->class_id;
                    $trans['user'] = auth()->user()->id;
                    $trans['content'] = 'Miễn giảm học phí '. $discount->percentage .'%';
                    $trans['time'] = date('Y-m-t', strtotime('01-'.$month));
                    $trans['student_id'] = $student_id;
                    $trans['amount'] = $r['amount']/100* $discount->percentage;
                    foreach($r['sessions'] as $key => $value){
                        $r['sessions'][$key]['amount'] = $value['amount']/100*$discount->percentage;
                    }
                    $trans['discount_id'] = $discount->id;
                    $tr = Transaction::create($trans);               
                    $tr->sessions()->syncWithoutDetaching($r['sessions']);
                    $tr->tags()->syncWithoutDetaching([9]);
                }
            }
        }
    }
    protected function createAdjustFee(Request $request){
        $rules = ['code' => 'required'];
        $this->validate($request, $rules);
        if($request->amount && $request->percentage){
            return response()->json('Chọn số tiền hoặc phần trăm', 402);
        }
        foreach($request->code as $c){
            if(array_key_exists('value', $c)){
                $input['class_id'] = $c['value'];
            }
            $input['active_at'] = date('Y-m-d', strtotime($request->active_at));
            $input['expired_at'] = date('Y-m-d', strtotime($request->expired_at));
            $input['content'] = $request->content;
            $input['amount'] = $request->amount ? $request->amount : NULL;
            $input['percentage'] = $request->percentage ? $request->percentage : NULL;            
            $input['status'] = 'active';
            $discount = Discount::create($input);

        }       

        return response()->json('ok', 200);
    }
    protected function getAdjustFee(){
        $discounts = Discount::Select('active_at','expired_at','percentage','amount','max_use','discounts.status','discounts.id as did', 'content',
                                'classes.id as cid', 'classes.code')
                            ->whereNull('discounts.student_class_id')
                            ->leftJoin('classes', 'discounts.class_id', 'classes.id')
                            ->get()->toArray();
        foreach($discounts as $key => $d){
            $discounts[$key]['class'] = ['label' => $d['code'], 'value'=>$d['cid']];
        }
        return response()->json($discounts);
    }
   
    protected function editAdjustFee(Request $request){
        $rules = [
            'did'=>'required',
            'active_at' => 'required',
            'expired_at' => 'required',            
        ];
        $this->validate($request, $rules);
        $d = Discount::find($request->did);
        if($d){
            $d->active_at = date('Y-m-d', strtotime($request->active_at));
            $d->expired_at = date('Y-m-d', strtotime($request->expired_at));
            $d->amount = $request->amount;
            $d->percentage = $request->percentage;
            $d->content = $request->content;
            if(!is_string($request->code)){
                $d['class_id'] = $request->code['value'];
            }
            $d->save();
            return response()->json('ok', 200);
            
        }
        
    }
    protected function deleteAdjustFee(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $discount = Discount::find($request->id);
        if($discount){
            $discount->forceDelete();
            return response()->json('ok');
        }

    }
}
